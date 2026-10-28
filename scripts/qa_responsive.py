"""
Responsive + flow QA for Menopause Compass (optional, local).

    npm run build && npx vite preview --port 4173
    python3 scripts/qa_responsive.py http://localhost:4173 screenshots

Checks every route at 320, 390, 768, 1024, 1440 and 1920 px widths for:
  - horizontal overflow (no sideways scrolling)
  - console errors
  - first-viewport budgets (home search, academy primary action)
and runs core flows: search, demo quiz end-to-end, progress, visit prep.
Requires: pip install playwright && playwright install chromium
"""
import asyncio
import json
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4173"
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else "screenshots")
OUT.mkdir(parents=True, exist_ok=True)

VIEWPORTS = [(320, 568), (390, 844), (768, 1024), (1024, 768), (1440, 900), (1920, 1080)]
ROUTES = [
    "/", "/learn", "/learn/search", "/learn/search?q=hot%20flashes", "/learn/search?q=zzzqqq",
    "/learn/topic/hormone-therapy", "/learn/faq/is-hormone-therapy-safe", "/learn/visit-prep",
    "/academy", "/academy/certification", "/academy/review", "/academy/review/osteoporosis-aging",
    "/academy/practice/setup", "/academy/ai-toolkit", "/academy/progress", "/sources", "/about", "/privacy",
]

problems: list[str] = []


def slug(route: str) -> str:
    return route.strip("/").replace("/", "_").replace("?", "_").replace("=", "-").replace("%20", "-") or "home"


async def overflow(page) -> int:
    return await page.evaluate("() => document.documentElement.scrollWidth - window.innerWidth")


async def check_routes(browser):
    for w, h in VIEWPORTS:
        ctx = await browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=1)
        page = await ctx.new_page()
        errors: list[str] = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto(BASE + "/")
        await page.evaluate("() => localStorage.setItem('mc.previewDismissed','false')")
        for r in ROUTES:
            errors.clear()
            await page.goto(BASE + r, wait_until="networkidle")
            await page.wait_for_timeout(150)
            ov = await overflow(page)
            if ov > 0:
                culprits = await page.evaluate(
                    """() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > window.innerWidth + 1)
                      .slice(0, 5).map(e => e.tagName + '.' + (e.className && e.className.baseVal === undefined ? e.className : '').toString().slice(0, 60))"""
                )
                problems.append(f"[overflow {ov}px] {w}x{h} {r} -> {culprits}")
            if errors:
                problems.append(f"[console] {w}x{h} {r}: {errors[:2]}")
            if w in (320, 390, 1440, 1920) and r in ("/", "/academy", "/learn/visit-prep", "/academy/review/osteoporosis-aging", "/learn/faq/is-hormone-therapy-safe", "/academy/practice/setup", "/academy/ai-toolkit"):
                await page.screenshot(path=str(OUT / f"{w}x{h}_{slug(r)}.png"))

        # First-viewport budgets
        if (w, h) == (390, 844):
            await page.goto(BASE + "/", wait_until="networkidle")
            y = await page.evaluate("() => document.querySelector('input[type=search]').getBoundingClientRect().top")
            if y > 170 + 46:  # allow one-line preview banner (~44px)
                problems.append(f"[viewport] home search top at {y:.0f}px on 390x844 (budget ~170)")
            await page.goto(BASE + "/academy", wait_until="networkidle")
            y = await page.evaluate("() => document.querySelector('main a.card-link').getBoundingClientRect().top")
            if y > 240 + 46:
                problems.append(f"[viewport] academy continue card at {y:.0f}px on 390x844 (budget ~240)")
        if (w, h) == (1440, 900):
            await page.goto(BASE + "/academy", wait_until="networkidle")
            y = await page.evaluate("() => document.querySelector('main a.card-link').getBoundingClientRect().top")
            if y > 260:
                problems.append(f"[viewport] academy dashboard content starts at {y:.0f}px on 1440x900 (budget 260)")
        await ctx.close()


async def flows(browser):
    for w, h in [(390, 844), (1440, 900)]:
        ctx = await browser.new_context(viewport={"width": w, "height": h})
        page = await ctx.new_page()
        errs: list[str] = []
        page.on("pageerror", lambda e: errs.append(str(e)))

        # Search flow with synonym
        await page.goto(BASE + "/")
        await page.fill("input[type=search]", "hrt safe")
        await page.keyboard.press("Enter")
        await page.wait_for_url("**/learn/search?q=*")
        n = await page.locator("main ul li a.card-link").count()
        if n == 0:
            problems.append(f"[flow] search 'hrt safe' returned no results at {w}")

        # Visit prep
        await page.goto(BASE + "/learn/visit-prep")
        await page.get_by_role("button", name="Hot flashes & night sweats").first.click()
        await page.get_by_text("What are my hormonal and nonhormonal treatment options?").first.click()
        stored = await page.evaluate("() => JSON.parse(localStorage.getItem('mc.visitPrep'))")
        if not stored or "hot-flashes" not in stored["topics"] or not stored["questions"]:
            problems.append(f"[flow] visit prep did not persist at {w}: {stored}")

        # Demo quiz end-to-end (5 questions in Module 9)
        await page.goto(BASE + "/academy/practice/setup")
        await page.get_by_text("Demo (unscored)").first.click()
        await page.get_by_role("button", name="9. Osteoporosis & healthy aging").click()
        await page.locator("label[for=count-5]").click()
        await page.get_by_role("button", name="Start session").click()
        await page.wait_for_url("**/practice/session")
        for i in range(5):
            await page.locator("[role=radio]").first.click()
            submit = page.get_by_role("button", name="Submit answer")
            if await submit.is_disabled():
                problems.append(f"[flow] submit disabled after selecting at {w}")
            await submit.click()
            fb = await page.get_by_text("Correct").count() + await page.get_by_text("Incorrect").count()
            if fb == 0:
                problems.append(f"[flow] no feedback shown q{i+1} at {w}")
            if i == 0:
                # selection must survive a resize/rotation
                await page.set_viewport_size({"width": h if w < 800 else w, "height": w if w < 800 else h})
                await page.wait_for_timeout(100)
                await page.set_viewport_size({"width": w, "height": h})
                if await page.get_by_text("Why").count() == 0:
                    problems.append(f"[flow] rationale lost after rotate at {w}")
                await page.screenshot(path=str(OUT / f"{w}x{h}_session_feedback.png"))
            if i < 4:
                await page.get_by_role("button", name="Next").click()
            else:
                await page.get_by_role("button", name="Finish & see results").click()
        await page.wait_for_url("**/practice/results/*")
        await page.wait_for_timeout(300)
        await page.screenshot(path=str(OUT / f"{w}x{h}_results.png"), full_page=False)
        txt = await page.locator("main").inner_text()
        if "/5" not in txt:
            problems.append(f"[flow] results page missing score at {w}")

        await page.goto(BASE + "/academy/progress", wait_until="networkidle")
        await page.wait_for_timeout(300)
        txt = await page.locator("main").inner_text()
        if "No practice yet" in txt:
            problems.append(f"[flow] progress empty after session at {w}")
        await page.screenshot(path=str(OUT / f"{w}x{h}_progress.png"))

        # Keyboard: A-C shortcut in a new session
        await page.goto(BASE + "/academy/practice/setup")
        await page.get_by_text("Demo (unscored)").first.click()
        await page.get_by_role("button", name="Start session").click()
        await page.wait_for_url("**/practice/session")
        await page.wait_for_selector("[role=radio]")
        await page.keyboard.press("b")
        checked = await page.locator("[role=radio][aria-checked=true]").count()
        if checked != 1:
            problems.append(f"[keyboard] letter shortcut did not select at {w}")
        await page.screenshot(path=str(OUT / f"{w}x{h}_session_select.png"))
        if errs:
            problems.append(f"[pageerror] flows at {w}: {errs[:3]}")
        await ctx.close()


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        await check_routes(browser)
        await flows(browser)
        await browser.close()
    print(json.dumps({"problems": problems, "count": len(problems)}, indent=2))
    sys.exit(1 if problems else 0)


asyncio.run(main())
