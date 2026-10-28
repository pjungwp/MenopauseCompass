import type { Fact, Reference } from './types';

/**
 * Reviewable Facts — the shared evidence layer.
 * Each fact renders differently for patients (shortPatientAnswer) and clinicians
 * (clinicianPearl / expandedExplanation). Language for each audience undergoes
 * separate editorial review.
 *
 * All facts ship as status "draft" with reviewer null until a clinician signs off.
 */

const DRAFTED = '2026-10-28';

type FactInput = Omit<
  Fact,
  'drafted' | 'lastReviewed' | 'reviewer' | 'status' | 'contentVersion' | 'redFlags' | 'examTraps' | 'synonyms' | 'derivation'
> &
  Partial<Pick<Fact, 'redFlags' | 'examTraps' | 'synonyms' | 'derivation' | 'status'>>;

const f = (x: FactInput): Fact => ({
  redFlags: [],
  examTraps: [],
  synonyms: [],
  derivation: 'statement',
  status: 'draft',
  ...x,
  drafted: DRAFTED,
  lastReviewed: null,
  reviewer: null,
  contentVersion: 1
});

const r = (sourceId: string, section?: string): Reference => ({ sourceId, section });

export const facts: Fact[] = [
  // ───────── Module 1 · Physiology / STRAW ─────────
  f({
    id: 'f-straw',
    topicId: 'perimenopause',
    moduleId: 'm1',
    title: 'Defining menopause and the transition (STRAW+10)',
    shortPatientAnswer:
      'Menopause is the point 12 months after your last period. The years of change before that, when periods become irregular, are called perimenopause. Most people reach menopause between about 45 and 55.',
    clinicianPearl:
      'Menopause is a retrospective diagnosis: the final menstrual period (FMP) confirmed after 12 months of amenorrhea. STRAW+10 staging is anchored primarily on menstrual cycle criteria; biomarkers are supportive.',
    expandedExplanation:
      'Natural menopause normally occurs between ages 40 and 58. STRAW (2001) and STRAW+10 (2011) staging divide reproductive aging into reproductive, menopause transition (early and late) and postmenopause stages. The early transition is marked by a persistent ≥7-day difference in consecutive cycle length; the late transition by ≥60 days of amenorrhea. Bleeding pattern, not a lab value, is the principal staging criterion.',
    examTraps: [
      'Choosing an FSH threshold as the defining criterion for menopause — menstrual history is the principal criterion.',
      'Forgetting that the FMP can only be identified retrospectively.'
    ],
    synonyms: ['change of life', 'the change', 'final menstrual period', 'STRAW'],
    references: [r('az2024', 'Staging and physiology, slides 5–11')]
  }),
  f({
    id: 'f-kndy',
    topicId: 'hot-flashes',
    moduleId: 'm1',
    title: 'Why hot flashes happen: the KNDy neuron pathway',
    shortPatientAnswer:
      'Hot flashes start in the brain. As estrogen falls, the part of the brain that controls body temperature becomes oversensitive, so small changes trigger flushing and sweating.',
    clinicianPearl:
      'Estradiol decline → hypertrophy/hyperactivity of hypothalamic KNDy neurons (kisspeptin, neurokinin B, dynorphin) → excess neurokinin B signaling at NK3 receptors in the thermoregulatory center → narrowed thermoneutral zone → VMS. This is the target of NK receptor antagonists.',
    expandedExplanation:
      'KNDy neurons in the infundibular (arcuate) nucleus act as the GnRH pulse generator and project to the median preoptic area, which regulates heat dissipation. Loss of estrogen negative feedback increases neurokinin B signaling, lowering the sweating and vasodilation threshold. Fezolinetant blocks NK3; elinzanetant blocks NK1 and NK3.',
    examTraps: ['Attributing VMS to peripheral vascular estrogen effects rather than central thermoregulation.'],
    synonyms: ['neurokinin B', 'NK3', 'thermoneutral zone', 'KNDy'],
    references: [r('nh2023', 'Prescription therapies — neurokinin B antagonists'), r('prove-concierge', 'Facts 42–43')]
  }),
  f({
    id: 'f-poi-def',
    topicId: 'early-menopause',
    moduleId: 'm1',
    title: 'Primary ovarian insufficiency and early menopause',
    shortPatientAnswer:
      'When periods stop before 40, it is called primary ovarian insufficiency. Between 40 and 45 it is called early menopause. Both deserve a medical evaluation because they affect bone and heart health.',
    clinicianPearl:
      'POI affects ~1% of women <40; menopause between 40 and 45 occurs in ~3%. Unlike natural menopause, laboratory evaluation (FSH, estradiol, TSH, prolactin, ± AMH, karyotype/FMR1 when indicated) is appropriate.',
    expandedExplanation:
      'Etiologies include genetic (e.g., FMR1 premutation, Turner mosaicism), autoimmune, iatrogenic (chemotherapy, radiation, bilateral oophorectomy) and idiopathic. Bilateral oophorectomy at or before 45 is associated with increased risk of dementia and cardiovascular disease.',
    redFlags: ['Periods stopping before age 40 should always be evaluated.'],
    examTraps: ['Applying WHI risk estimates to women with POI — WHI did not enroll this population.'],
    synonyms: ['POI', 'premature ovarian failure', 'premature menopause', 'early menopause'],
    references: [r('az2024', 'slide 7'), r('ht2022', 'Premature and early menopause')]
  }),

  // ───────── Module 2 · Diagnosis / assessment ─────────
  f({
    id: 'f-no-hormone-testing',
    topicId: 'perimenopause',
    moduleId: 'm2',
    title: 'Hormone blood tests are rarely needed to diagnose menopause',
    shortPatientAnswer:
      'Most people do not need a blood test to know they are in perimenopause or menopause. Hormone levels swing a lot from day to day, so your age, periods and symptoms usually tell the story better.',
    clinicianPearl:
      'Serum hormone measurement is generally not recommended to diagnose the transition or guide HT dosing. Consider testing when age <40–45 with amenorrhea, fertility concerns, or when bleeding cannot be assessed (hysterectomy, LNG-IUD). Salivary and urine hormone testing are unreliable and not recommended.',
    expandedExplanation:
      'FSH and estradiol fluctuate widely during the transition and do not stabilize until several years after the FMP. Androgen levels should not be measured to diagnose low libido; no serum androgen concentration defines female androgen insufficiency.',
    examTraps: [
      'Ordering salivary hormone panels to titrate therapy.',
      'Using total testosterone to diagnose HSDD.'
    ],
    synonyms: ['FSH test', 'hormone panel', 'blood test for menopause', 'saliva test'],
    references: [r('az2024', 'Testing and imaging, slide 69'), r('ht2022', 'Compounded hormones / testing')]
  }),
  f({
    id: 'f-pmb',
    topicId: 'bleeding',
    moduleId: 'm2',
    title: 'Postmenopausal bleeding always needs evaluation',
    shortPatientAnswer:
      'Any bleeding or spotting after menopause — even a small amount, even once — should be checked by a clinician. Most causes are not serious, but it can be an early sign of uterine cancer, which is very treatable when found early.',
    clinicianPearl:
      'Any postmenopausal bleeding warrants evaluation with transvaginal ultrasound and/or endometrial sampling. About 90% of endometrial cancers present with abnormal bleeding. On EPT, unscheduled bleeding persisting beyond ~6 months of initiation should be investigated.',
    expandedExplanation:
      'Routine endometrial surveillance is not needed for asymptomatic women on low-dose vaginal estrogen or appropriately opposed systemic therapy; evaluation is triggered by bleeding. Women on HT should be encouraged to report unscheduled bleeding promptly.',
    redFlags: ['Any bleeding or spotting after 12 months without a period.'],
    examTraps: ['Attributing new bleeding on vaginal estrogen to the therapy without evaluation.'],
    synonyms: ['postmenopausal bleeding', 'PMB', 'spotting after menopause', 'bleeding after menopause'],
    references: [r('gsm2020', 'Endometrial safety'), r('az2024', 'slides 63, 132'), r('ht2022', 'Endometrial cancer')]
  }),
  f({
    id: 'f-peri-aub',
    topicId: 'bleeding',
    moduleId: 'm2',
    title: 'Irregular and heavy bleeding in perimenopause',
    shortPatientAnswer:
      'Periods often become irregular in perimenopause. Bleeding that is very heavy, lasts longer than usual, happens between periods or after sex should be checked — and treatment can help.',
    clinicianPearl:
      'Perimenopausal AUB is classified with PALM-COEIN; anovulatory bleeding is common. Persistent, heavy or intermenstrual bleeding warrants evaluation. The LNG-IUS treats heavy bleeding, provides contraception and can serve as endometrial protection for estrogen therapy.',
    expandedExplanation:
      'Even when not heavy, unscheduled bleeding affects quality of life and treatment should be offered. Obesity increases endogenous estrogen via aromatization and raises endometrial risk during long anovulatory transitions.',
    redFlags: ['Soaking a pad or tampon every hour for several hours', 'Bleeding after sex', 'Dizziness or fainting with bleeding'],
    synonyms: ['heavy periods', 'irregular periods', 'AUB', 'abnormal uterine bleeding'],
    references: [r('az2024', 'slides 61–63, 75')]
  }),
  f({
    id: 'f-contraception',
    topicId: 'perimenopause',
    moduleId: 'm2',
    title: 'Contraception is still needed in perimenopause',
    shortPatientAnswer:
      'Pregnancy is still possible during perimenopause. Until your clinician confirms menopause, keep using birth control if you do not want to become pregnant.',
    clinicianPearl:
      'Low-dose combined hormonal contraception is appropriate only for healthy, lean, nonsmoking perimenopausal women without contraindications. Progestin-only methods suit those with estrogen contraindications (smoking, hypertension, VTE history). LNG-IUS also treats AUB.',
    expandedExplanation:
      'Combined hormonal contraception can control cycles and VMS in appropriate candidates. The LNG 52 mg IUS can additionally provide endometrial protection when systemic estrogen is added later.',
    synonyms: ['birth control', 'pregnancy perimenopause', 'IUD'],
    references: [r('az2024', 'Hormone contraception, slide 75')]
  }),
  f({
    id: 'f-preventive',
    topicId: 'heart-metabolic',
    moduleId: 'm2',
    title: 'Midlife preventive screening',
    shortPatientAnswer:
      'Midlife is a good time to catch up on screening: blood pressure, cholesterol, diabetes, breast and colon cancer screening, bone density when due, and vaccines.',
    clinicianPearl:
      'Colorectal screening begins at 45 for average risk. Breast screening: USPSTF biennial 40–74; ACOG every 1–2 years 40–75. DXA at 65, earlier with risk factors. Lung cancer LDCT for eligible current/former smokers per USPSTF.',
    expandedExplanation:
      'Screening recommendations change frequently; confirm current USPSTF and ACOG guidance before counseling.',
    derivation: 'interpretive',
    synonyms: ['mammogram', 'colonoscopy', 'screening tests', 'checkup'],
    references: [r('az2024', 'slides 70–73')]
  }),

  // ───────── Module 3 · VMS ─────────
  f({
    id: 'f-vms-burden',
    topicId: 'hot-flashes',
    moduleId: 'm3',
    title: 'How common and how long hot flashes last',
    shortPatientAnswer:
      'Up to 8 in 10 people have hot flashes or night sweats around menopause. They often last 7 years or more, and about 1 in 3 people have them for more than 10 years — so it is worth treating them if they bother you.',
    clinicianPearl:
      'VMS affect up to 80% of women, with a mean duration of 7–9 years (SWAN median 7.4 y); about one-third experience VMS >10 years and ~10% for >20 years. Earlier onset predicts longer duration.',
    expandedExplanation:
      'Risk factors include obesity, smoking, anxiety/depressive symptoms, and comorbidities such as thyroid disease, diabetes, OSA and chronic pain. Durations and prevalence vary by race and ethnicity in SWAN.',
    examTraps: ['Counseling that VMS reliably resolve within 1–2 years.'],
    synonyms: ['hot flashes', 'hot flushes', 'night sweats', 'VMS', 'vasomotor symptoms', 'sweating'],
    references: [r('nh2023', 'Introduction'), r('az2024', 'slides 25–26')]
  }),

  // ───────── Module 4 · Systemic HT ─────────
  f({
    id: 'f-ht-most-effective',
    topicId: 'hormone-therapy',
    moduleId: 'm4',
    title: 'Hormone therapy is the most effective treatment for hot flashes',
    shortPatientAnswer:
      'Hormone therapy is the most effective treatment for hot flashes and night sweats. It also helps vaginal dryness and protects bones. For many healthy people under 60, or within 10 years of menopause, the benefits outweigh the risks.',
    clinicianPearl:
      'HT remains the most effective therapy for VMS and GSM and prevents bone loss and fracture. Risks vary by type, dose, duration, route, timing of initiation and whether a progestogen is used.',
    expandedExplanation:
      'Benefits may include improved sleep, well-being and quality of life. HT is FDA approved for moderate to severe VMS, GSM (local is preferred when GSM is isolated), prevention of osteoporosis, and hypoestrogenism due to hypogonadism, castration or POI.',
    synonyms: ['HRT', 'MHT', 'hormone replacement', 'estrogen', 'HT', 'menopausal hormone therapy'],
    references: [r('ht2022', 'Abstract; Summary')]
  }),
  f({
    id: 'f-timing',
    topicId: 'hormone-therapy',
    moduleId: 'm4',
    title: 'Timing matters: under 60 or within 10 years of menopause',
    shortPatientAnswer:
      'Starting hormone therapy before age 60 or within 10 years of your last period is generally safer than starting later. If you are older or further from menopause, the decision needs a more careful look at your personal risks.',
    clinicianPearl:
      'Age <60 or <10 years from menopause onset without contraindications: favorable benefit–risk for bothersome VMS and prevention of bone loss. Initiation >60 or >10 years: less favorable due to greater absolute risks of CHD, stroke, VTE and dementia.',
    expandedExplanation:
      'Absolute attributable risks in women aged 50–59 are low. Risks of initiation appear greater for women aged ≥70 or >20 years from menopause onset. In WHI women aged 50–59, all-cause mortality was reduced (HR 0.69). This "timing hypothesis" is about initiation, not about continuation.',
    examTraps: [
      'Confusing initiation criteria with a mandatory stop age — there is no requirement to stop at 60 or 65.'
    ],
    synonyms: ['timing hypothesis', 'window of opportunity', 'age 60', '10 years'],
    references: [r('ht2022', 'Abstract; Summary'), r('fda-ht-label-2026')]
  }),
  f({
    id: 'f-progestogen',
    topicId: 'hormone-therapy',
    moduleId: 'm4',
    title: 'A uterus needs protection: progestogen or bazedoxifene',
    shortPatientAnswer:
      'If you still have your uterus and take estrogen pills, patches, gels or sprays, you also need a progestogen (or a combination product) to protect the lining of the uterus. If you have had a hysterectomy, estrogen alone is usually used.',
    clinicianPearl:
      'Systemic estrogen with an intact uterus requires adequate progestogen (e.g., oral micronized progesterone 200 mg for 12–14 days/month cyclic, or 100 mg daily continuous), the LNG-IUS (off-label), or CEE + bazedoxifene (TSEC). Unopposed systemic estrogen increases hyperplasia and endometrial cancer risk.',
    expandedExplanation:
      'Continuous combined regimens yield the highest amenorrhea rates and lowest hyperplasia rates; cyclic regimens produce withdrawal bleeding. Low-dose vaginal estrogen does not require a progestogen; the systemic-dose estradiol acetate ring (Femring) does.',
    examTraps: [
      'Prescribing Femring without a progestogen in a woman with a uterus.',
      'Adding a progestogen to low-dose vaginal estrogen.'
    ],
    synonyms: ['progesterone', 'progestin', 'endometrial protection', 'combined therapy', 'EPT', 'TSEC'],
    references: [r('ht2022', 'Endometrial safety'), r('az2024', 'slides 85–86, 111')]
  }),
  f({
    id: 'f-route',
    topicId: 'hormone-therapy',
    moduleId: 'm4',
    title: 'Route matters: transdermal estrogen and clot risk',
    shortPatientAnswer:
      'Estrogen through the skin (patch, gel or spray) skips the first pass through the liver. Studies suggest it carries less risk of blood clots than estrogen pills, which can matter for people with certain risk factors.',
    clinicianPearl:
      'Oral and transdermal therapy are similarly effective for VMS. Observational data show lower VTE and stroke risk with transdermal estradiol (no confirmatory RCT). Micronized progesterone may be less thrombogenic than other progestins. Transdermal ET is preferred when low libido is a concern, since oral ET raises SHBG.',
    expandedExplanation:
      'Nonoral routes bypass first-pass hepatic metabolism, avoiding increases in clotting factors, SHBG and triglycerides. Lower doses and transdermal routes may decrease VTE and stroke risk.',
    synonyms: ['patch', 'gel', 'spray', 'transdermal', 'pill', 'oral estrogen', 'blood clots'],
    references: [r('ht2022', 'Route of administration'), r('az2024', 'slides 82, 95, 127')]
  }),
  f({
    id: 'f-contraindications',
    topicId: 'hormone-therapy',
    moduleId: 'm4',
    title: 'Contraindications to systemic hormone therapy',
    shortPatientAnswer:
      'Hormone therapy is usually not recommended if you have unexplained vaginal bleeding, a history of breast or other estrogen-sensitive cancer, heart attack, stroke, blood clots, or active liver disease. Your clinician can suggest effective nonhormonal options.',
    clinicianPearl:
      'Contraindications: unexplained vaginal bleeding, active liver disease, prior estrogen-sensitive cancer (breast, endometrial), CHD, stroke, MI, prior VTE or inherited high thrombotic risk. Low-dose vaginal estrogen is handled differently because of minimal absorption.',
    expandedExplanation:
      'With VTE history, nonhormone therapy is first-line; if ineffective, low-dose transdermal therapy may be considered with hematology consultation. A thrombophilia without prior VTE is a relative contraindication.',
    redFlags: ['New chest pain, leg swelling, sudden shortness of breath or stroke symptoms while on HT — seek emergency care.'],
    synonyms: ['who should not take hormones', 'contraindication', 'blood clot history'],
    references: [r('ht2022', 'Contraindications'), r('az2024', 'slides 94–95, 140')]
  }),
  f({
    id: 'f-fda-label',
    topicId: 'hormone-therapy',
    moduleId: 'm4',
    title: 'FDA labeling update (2025–2026): the "black box" was revised',
    shortPatientAnswer:
      'In 2025–2026 the FDA removed warnings about heart disease, breast cancer and dementia from the boxed ("black box") warning on hormone therapy labels. A boxed warning about uterine cancer remains for estrogen-only pills or patches used by people who still have a uterus. Risks are still discussed in the label, so talk them through with your clinician.',
    clinicianPearl:
      'FDA initiated class labeling changes Nov 2025; first six products approved Feb 12, 2026. Boxed-warning statements on CVD, breast cancer and probable dementia removed; endometrial cancer boxed warning retained for systemic estrogen-alone products; "lowest dose for shortest duration" language removed; CVD and breast cancer information retained elsewhere in labeling.',
    expandedExplanation:
      'Labels were updated product by product as manufacturers submitted revisions. Position statements written before 2025 (including HT 2022 and GSM 2020) reference the older boxed warning. Counsel using individualized absolute risk and shared decision-making; check the current label for any given product.',
    examTraps: [
      'Exam items written before 2025 may reference the older boxed-warning language — read the stem carefully for what is being tested.'
    ],
    synonyms: ['black box warning', 'boxed warning', 'FDA label', 'label change', 'warning removed'],
    references: [r('fda-ht-label-2026')]
  }),
  f({
    id: 'f-compounded',
    topicId: 'hormone-therapy',
    moduleId: 'm4',
    title: '"Bioidentical" and compounded hormones',
    shortPatientAnswer:
      '"Bioidentical" is a marketing term. Several FDA-approved products — like estradiol patches and micronized progesterone — are chemically identical to your own hormones and are tested for purity and dose. Custom-compounded hormones are not proven safer and are not recommended for routine use.',
    clinicianPearl:
      'Compounded bioidentical HT is not recommended (regulation, dosing, purity and sterility concerns; no package insert). Exceptions: documented allergy or intolerance to FDA-approved ingredients. Micronized 17β-estradiol and micronized progesterone are government-approved bioidentical options. Pellets are not recommended.',
    expandedExplanation:
      'Compounding pharmacies often market products as "natural" and "safer" without supporting evidence. Salivary hormone testing used to titrate compounded products is unreliable.',
    synonyms: ['bioidentical', 'compounded', 'pellets', 'natural hormones', 'BHRT'],
    references: [r('ht2022', 'Compounded bioidentical hormones'), r('az2024', 'slides 91–92')]
  }),
  f({
    id: 'f-duration',
    topicId: 'hormone-therapy',
    moduleId: 'm4',
    title: 'How long can hormone therapy be used?',
    shortPatientAnswer:
      'There is no automatic age when you must stop hormone therapy. Many people continue as long as benefits outweigh risks, reviewing the decision with their clinician regularly.',
    clinicianPearl:
      'No data support routine discontinuation at age 65. Longer durations should be for documented indications (e.g., persistent VMS, bone protection) with shared decision-making and periodic reevaluation. Given its more favorable safety profile, ET alone may allow longer use than EPT.',
    expandedExplanation:
      'Observational data suggest a rare increase in breast cancer risk with longer EPT duration. Low-dose vaginal estrogen may be continued as long as genitourinary symptoms persist. BMD declines within 1–2 years after stopping estrogen.',
    examTraps: ['Selecting "stop all HT at age 65" as the correct counseling step.'],
    synonyms: ['stop hormones', 'how long', 'duration', 'age 65', 'taper'],
    references: [r('ht2022', 'Duration of therapy; Summary'), r('fda-ht-label-2026')]
  }),
  f({
    id: 'f-breast-risk',
    topicId: 'hormone-therapy',
    moduleId: 'm4',
    title: 'Breast cancer risk in perspective',
    shortPatientAnswer:
      'For combined estrogen-plus-progestogen therapy, the added breast cancer risk is small — fewer than 1 extra case per 1,000 people per year — similar to other everyday factors like drinking two alcoholic drinks a day or carrying extra weight. Estrogen alone (after hysterectomy) did not increase breast cancer in the major trial.',
    clinicianPearl:
      'WHI CEE + MPA: <1 additional case per 1,000 women per year (~3 per 1,000 over 5 years). CEE alone was associated with reduced breast cancer incidence and mortality. Magnitude is comparable to modifiable risk factors (alcohol, obesity, inactivity).',
    expandedExplanation:
      'WHI tested only oral CEE 0.625 mg ± MPA 2.5 mg in women aged 50–79. Breast cancer risk may differ by progestogen type and duration; observational data suggest a rare increase with longer duration.',
    examTraps: ['Stating that estrogen-alone therapy increased breast cancer in WHI.'],
    synonyms: ['breast cancer risk', 'cancer risk hormones', 'WHI'],
    references: [r('ht2022', 'Breast cancer')]
  }),

  // ───────── Module 5 · Nonhormone ─────────
  f({
    id: 'f-nh-recommended',
    topicId: 'nonhormonal',
    moduleId: 'm5',
    title: 'Nonhormone treatments that work',
    shortPatientAnswer:
      'If you cannot or prefer not to use hormones, several options have good evidence: cognitive behavioral therapy, clinical hypnosis, certain antidepressants (SSRIs/SNRIs), gabapentin, oxybutynin, and newer medicines that target the brain\'s temperature center. Weight loss may also help.',
    clinicianPearl:
      'Recommended (2023): CBT, clinical hypnosis, SSRIs/SNRIs, gabapentin, fezolinetant (Level I); oxybutynin (Levels I–II); weight loss, stellate ganglion block (Levels II–III). Onset of prescription agents typically within 2 weeks.',
    expandedExplanation:
      'CBT primarily reduces VMS bother/interference rather than frequency; hypnosis reduces frequency and severity. SSRIs/SNRIs yield 25–69% reductions in hot flash frequency. Elinzanetant (FDA approved Oct 2025) postdates the statement.',
    synonyms: ['nonhormonal', 'non-hormonal', 'without hormones', 'alternatives to HRT'],
    references: [r('nh2023', 'Abstract; Results'), r('fda-elinzanetant-2025')]
  }),
  f({
    id: 'f-nh-not-recommended',
    topicId: 'nonhormonal',
    moduleId: 'm5',
    title: 'What the evidence does not support for hot flashes',
    shortPatientAnswer:
      'Supplements and herbs (like black cohosh or soy), paced breathing, cooling products, yoga, acupuncture and avoiding "triggers" have not been shown to reliably reduce hot flashes. Exercise and yoga are still great for overall health — they just are not proven hot flash treatments.',
    clinicianPearl:
      'Not recommended: paced respiration (Level I); supplements/herbals (Levels I–II); cooling techniques, trigger avoidance, exercise, yoga, mindfulness, relaxation, suvorexant, soy/equol, cannabinoids, acupuncture, calibration of neural oscillations (Level II); chiropractic, clonidine (Levels I–III); dietary modification, pregabalin (Level III).',
    expandedExplanation:
      'Supplements are not FDA-regulated for purity or dose; black cohosh carries a hepatotoxicity warning. Only ~35% of North American women produce equol from soy daidzein.',
    examTraps: [
      'Choosing paced respiration — it is Level I NOT recommended.',
      'Choosing clonidine — not recommended due to modest efficacy and adverse effects.'
    ],
    synonyms: ['black cohosh', 'soy', 'supplements', 'herbs', 'acupuncture', 'yoga', 'natural remedies'],
    references: [r('nh2023', 'Abstract; Dietary supplements')]
  }),
  f({
    id: 'f-ssri-tamoxifen',
    topicId: 'nonhormonal',
    moduleId: 'm5',
    title: 'SSRIs/SNRIs and tamoxifen: avoid strong CYP2D6 inhibitors',
    shortPatientAnswer:
      'If you take tamoxifen, tell your clinician before starting an antidepressant for hot flashes — a few of them can make tamoxifen less effective, and safer choices are available.',
    clinicianPearl:
      'Paroxetine and fluoxetine strongly inhibit CYP2D6 (converts tamoxifen to endoxifen) — avoid with tamoxifen. Preferred: venlafaxine, desvenlafaxine, escitalopram, citalopram. Paroxetine mesylate 7.5 mg is the only FDA-approved SSRI for VMS.',
    expandedExplanation:
      'Dosing for VMS (2023 Table 1): paroxetine salt 7.5 mg; paroxetine 10–25 mg; citalopram 10–20 mg; escitalopram 10–20 mg; venlafaxine 37.5–150 mg; desvenlafaxine 100–150 mg. Sertraline and fluoxetine are not recommended for VMS (nonsignificant trends).',
    examTraps: ['Choosing paroxetine for a woman on tamoxifen because it is "FDA approved for VMS."'],
    synonyms: ['paroxetine', 'venlafaxine', 'Brisdelle', 'antidepressant hot flashes', 'tamoxifen'],
    references: [r('nh2023', 'SSRIs and SNRIs; Table 1')]
  }),
  f({
    id: 'f-gabapentin',
    topicId: 'nonhormonal',
    moduleId: 'm5',
    title: 'Gabapentin, especially for night sweats',
    shortPatientAnswer:
      'Gabapentin, taken at bedtime, can reduce night sweats and help sleep. Dizziness and drowsiness are common at first and usually improve within a few weeks.',
    clinicianPearl:
      'Gabapentin 900–2,400 mg/day in divided doses (Level I). Start 100–300 mg at bedtime and titrate. Bedtime dosing suits women with sleep-disrupting VMS. Pregabalin is not recommended (Level III; Schedule V).',
    expandedExplanation:
      'At high doses (2,400 mg/day) gabapentin approached CEE 0.625 mg in efficacy but with more adverse effects. Antiepileptics carry a boxed warning for suicidal thoughts or behaviors.',
    synonyms: ['gabapentin', 'Neurontin', 'night sweats medicine'],
    references: [r('nh2023', 'Gabapentinoids; Table 1')]
  }),
  f({
    id: 'f-nk-antagonists',
    topicId: 'nonhormonal',
    moduleId: 'm5',
    title: 'Neurokinin receptor antagonists: fezolinetant and elinzanetant',
    shortPatientAnswer:
      'Newer nonhormonal pills work directly on the brain\'s temperature control center. They require blood tests to check the liver for one of them (fezolinetant). Ask your clinician whether one is right for you.',
    clinicianPearl:
      'Fezolinetant 45 mg daily (NK3 antagonist; Level I in 2023). Boxed warning (Dec 2024) for hepatotoxicity: hepatic labs at baseline, monthly × 3 months, then at 6 and 9 months; do not start if ALT/AST or bilirubin ≥2× ULN. Elinzanetant (NK1/NK3 antagonist) FDA approved Oct 2025 — verify current prescribing information.',
    expandedExplanation:
      'Both target KNDy-neuron neurokinin signaling. Headache is a common adverse effect of fezolinetant. Elinzanetant is not covered by the 2023 nonhormone statement.',
    redFlags: ['On fezolinetant: yellow skin or eyes, dark urine, pale stools, itching, or right upper abdominal pain — stop and contact your clinician.'],
    examTraps: ['Forgetting the hepatic monitoring requirement for fezolinetant.'],
    synonyms: ['fezolinetant', 'Veozah', 'elinzanetant', 'Lynkuet', 'NK3', 'new hot flash pill'],
    references: [r('nh2023', 'Neurokinin B antagonists'), r('fda-fezolinetant-2024'), r('fda-elinzanetant-2025')]
  }),
  f({
    id: 'f-oxybutynin',
    topicId: 'nonhormonal',
    moduleId: 'm5',
    title: 'Oxybutynin',
    shortPatientAnswer:
      'Oxybutynin, a bladder medicine, can also reduce hot flashes. It can cause dry mouth and may affect memory in older adults with long-term use.',
    clinicianPearl:
      'Oxybutynin 2.5–5 mg BID or up to 15 mg ER daily (Levels I–II). Dose-dependent dry mouth and urinary difficulty; long-term anticholinergic use may be associated with cognitive decline, especially in older adults.',
    expandedExplanation: 'Useful for women with coexisting overactive bladder; avoid in older or cognitively vulnerable patients.',
    synonyms: ['oxybutynin', 'Ditropan', 'bladder pill hot flashes'],
    references: [r('nh2023', 'Oxybutynin')]
  }),

  // ───────── Module 6 · GSM ─────────
  f({
    id: 'f-gsm-def',
    topicId: 'vaginal-urinary',
    moduleId: 'm6',
    title: 'Genitourinary syndrome of menopause (GSM)',
    shortPatientAnswer:
      'Lower estrogen can make vaginal and urinary tissue thinner and drier. This causes dryness, burning, painful sex, urgency or repeated bladder infections. Unlike hot flashes, it usually gets worse over time without treatment — and it is very treatable.',
    clinicianPearl:
      'GSM affects ~27–84% of postmenopausal women, is progressive without treatment, and is underdiagnosed. Diagnosis requires bothersome symptoms plus consistent exam findings; vaginal pH and maturation index are not essential.',
    expandedExplanation:
      'Signs include loss of rugae, pale, thin or friable mucosa, petechiae, labial and introital narrowing, and urethral caruncle. Vaginal pH is typically >5.0. Aromatase inhibitors cause more severe GSM than tamoxifen. Symptoms do not always correlate with exam findings.',
    redFlags: ['Bleeding, a new lump or sore, or pain that does not improve with treatment should be examined.'],
    synonyms: ['vaginal dryness', 'vaginal atrophy', 'atrophic vaginitis', 'VVA', 'GSM', 'painful sex', 'dyspareunia', 'urinary urgency'],
    references: [r('gsm2020', 'Abstract; Diagnosis')]
  }),
  f({
    id: 'f-gsm-firstline',
    topicId: 'vaginal-urinary',
    moduleId: 'm6',
    title: 'First-line: moisturizers and lubricants',
    shortPatientAnswer:
      'Start with a vaginal moisturizer used 2–3 times a week, plus a lubricant during sex. Water- or silicone-based lubricants work well; oil-based products can damage condoms. For many people with mild symptoms, this is enough.',
    clinicianPearl:
      'First-line for GSM: nonhormone lubricants with sexual activity and regular long-acting vaginal moisturizers (Level A). Prefer iso-osmolar, silicone-based or propylene-glycol-free products (WHO osmolality <1,200 mOsm/kg). Herbal products are ineffective.',
    expandedExplanation:
      'Moisturizers are used regularly regardless of sexual activity; lubricants reduce friction during activity. Dilators, vibrators and pelvic floor physical therapy help when pelvic floor hypertonus coexists.',
    synonyms: ['lubricant', 'lube', 'moisturizer', 'Replens', 'hyaluronic acid'],
    references: [r('gsm2020', 'Recommendations; Lubricants and moisturizers')]
  }),
  f({
    id: 'f-vaginal-estrogen',
    topicId: 'vaginal-urinary',
    moduleId: 'm6',
    title: 'Low-dose vaginal estrogen',
    shortPatientAnswer:
      'Low-dose vaginal estrogen (cream, tablet/insert or ring) works directly on the tissue with very little absorbed into the bloodstream. You do not need a progestogen with it, and it can be used long term.',
    clinicianPearl:
      'Low-dose vaginal ET is preferred when symptoms are only genitourinary (Level A). All forms have similar efficacy. No progestogen needed; routine endometrial surveillance not recommended. Serum estradiol remains in the postmenopausal range. May reduce recurrent UTIs.',
    expandedExplanation:
      'Pooled 1-year trial data (20 RCTs, ~3,000 women) showed endometrial hyperplasia and cancer rates similar to background. Endometrial safety trials extend only to 1 year; observational data are reassuring. Maximum benefit may take up to 12 weeks. FDA removed most boxed-warning language from local vaginal estrogen labels in 2025–2026.',
    examTraps: ['Requiring a progestogen or annual endometrial biopsy with low-dose vaginal estrogen.'],
    synonyms: ['vaginal estrogen', 'estrogen cream', 'Estring', 'Vagifem', 'Imvexxy', 'Premarin cream', 'Estrace cream'],
    references: [r('gsm2020', 'Vaginal estrogen'), r('ht2022', 'GSM'), r('fda-ht-label-2026')]
  }),
  f({
    id: 'f-gsm-other-rx',
    topicId: 'vaginal-urinary',
    moduleId: 'm6',
    title: 'Other prescription options: vaginal DHEA and ospemifene',
    shortPatientAnswer:
      'If estrogen is not right for you, there are other prescription options: a nightly vaginal DHEA insert (prasterone) or a daily pill called ospemifene.',
    clinicianPearl:
      'Vaginal DHEA (prasterone) 6.5 mg nightly — converted intracellularly to estrogens and androgens; serum levels stay postmenopausal. Ospemifene 60 mg oral daily — estrogen agonist/antagonist; only oral GSM option; VMS most common AE; VTE and stroke warnings. Neither requires a progestogen (Level A).',
    expandedExplanation:
      'Endometrial safety for DHEA and ospemifene has been studied to about 1 year. Ospemifene is not approved in the US for women with a history of breast cancer.',
    synonyms: ['prasterone', 'Intrarosa', 'DHEA', 'ospemifene', 'Osphena'],
    references: [r('gsm2020', 'DHEA; Ospemifene'), r('az2024', 'slides 125–126')]
  }),
  f({
    id: 'f-femring-estring',
    topicId: 'vaginal-urinary',
    moduleId: 'm6',
    title: 'Two vaginal rings, two very different doses',
    shortPatientAnswer:
      'There are two kinds of vaginal estrogen ring. One is a low dose that treats only vaginal symptoms. The other delivers a full-body dose that also treats hot flashes — and needs a progestogen if you have a uterus.',
    clinicianPearl:
      'Estradiol ring 2 mg (Estring) releases ~7.5 µg/day for 90 days — local, GSM only, no progestogen. Estradiol acetate ring (Femring) is systemic-dose — treats VMS + GSM and requires a progestogen with an intact uterus.',
    expandedExplanation:
      'A systemic-dose ring delivers estrogen directly to vaginal tissue while also treating VMS. If GSM persists on systemic therapy, adding local vaginal ET is often effective.',
    examTraps: ['Treating Femring as "local" therapy.'],
    synonyms: ['vaginal ring', 'Estring', 'Femring'],
    references: [r('gsm2020', 'Vaginal estrogen products'), r('prove-concierge', 'Facts 147–149')]
  }),
  f({
    id: 'f-energy-devices',
    topicId: 'vaginal-urinary',
    moduleId: 'm6',
    title: 'Vaginal laser and energy-based devices',
    shortPatientAnswer:
      'Vaginal laser and radiofrequency treatments are not FDA approved for menopause symptoms, and good-quality studies are lacking. The FDA has warned about burns, scarring and pain.',
    clinicianPearl:
      'Insufficient sham-controlled data to recommend energy-based therapies (CO2 laser, radiofrequency) for GSM. FDA warning (2018) on vaginal "rejuvenation" devices.',
    expandedExplanation: 'Further randomized sham-controlled trials are needed before routine use.',
    synonyms: ['laser', 'MonaLisa Touch', 'vaginal rejuvenation', 'radiofrequency'],
    references: [r('gsm2020', 'Energy-based therapies'), r('az2024', 'slide 119')]
  }),
  f({
    id: 'f-urinary',
    topicId: 'vaginal-urinary',
    moduleId: 'm6',
    title: 'Bladder symptoms, UTIs and estrogen',
    shortPatientAnswer:
      'Vaginal estrogen can reduce repeated bladder infections and urgency. Estrogen pills or patches do not treat leaking urine and may make stress leakage worse.',
    clinicianPearl:
      'Low-dose vaginal ET may prevent recurrent UTIs and improve overactive bladder/urge symptoms. Systemic HT does not improve urinary incontinence and may increase stress urinary incontinence. HT has no FDA approval for any urinary indication.',
    expandedExplanation: 'Pelvic floor muscle training remains first-line for stress urinary incontinence.',
    synonyms: ['UTI', 'bladder infection', 'urinary incontinence', 'leaking urine', 'overactive bladder'],
    references: [r('ht2022', 'Urinary health'), r('gsm2020', 'Urinary symptoms')]
  }),

  // ───────── Module 7 · Sleep / mood / cognition / sexual ─────────
  f({
    id: 'f-sleep',
    topicId: 'sleep-mood',
    moduleId: 'm7',
    title: 'Sleep problems: CBT-I is first line',
    shortPatientAnswer:
      'Trouble sleeping is common in midlife. A structured program called cognitive behavioral therapy for insomnia (CBT-I) works well and has lasting benefits. Treating night sweats and screening for sleep apnea also help.',
    clinicianPearl:
      'CBT-I is first-line for insomnia in menopausal women, with durable benefit. No HT product is FDA approved for insomnia, though HT improves sleep disrupted by VMS. Screen for OSA, which increases after menopause.',
    expandedExplanation:
      'In SWAN, 38% of women aged 40–55 reported difficulty sleeping. Micronized progesterone 300 mg at night improved VMS and sleep in a trial (off-label as monotherapy). Gabapentin at bedtime helps VMS-related sleep disruption.',
    synonyms: ['insomnia', 'can\'t sleep', 'sleep problems', 'CBT-I', 'sleep apnea'],
    references: [r('az2024', 'slides 35, 155–156'), r('ht2022', 'Sleep')]
  }),
  f({
    id: 'f-mood',
    topicId: 'sleep-mood',
    moduleId: 'm7',
    title: 'Mood changes and depression in perimenopause',
    shortPatientAnswer:
      'Perimenopause raises the risk of depression and anxiety, especially if you have had depression before. If low mood lasts more than two weeks or affects daily life, reach out — effective treatment is available.',
    clinicianPearl:
      'Risk of depressive symptoms is higher in perimenopause (SWAN, Penn Ovarian Aging, Seattle Midlife), especially with prior MDD. Antidepressants and psychotherapy are first-line for MDD. Estrogen may have antidepressant effects in perimenopause but is not FDA approved for mood and is ineffective for depression in postmenopausal women.',
    expandedExplanation:
      'Clinical trials show no significant mood benefit of estrogen in nondepressed women. VMS, sleep disruption and life stressors interact with mood.',
    redFlags: ['Thoughts of harming yourself — call or text 988 (US) or go to the nearest emergency department.'],
    synonyms: ['depression', 'anxiety', 'mood swings', 'irritability', 'low mood'],
    references: [r('az2024', 'slides 38, 150–152'), r('ht2022', 'Mood')]
  }),
  f({
    id: 'f-cognition',
    topicId: 'sleep-mood',
    moduleId: 'm7',
    title: 'Brain fog and memory',
    shortPatientAnswer:
      'Many people notice forgetfulness or "brain fog" during perimenopause. For most, it is temporary. Hormone therapy is not recommended to prevent dementia, but protecting heart health, sleep, activity and social connection helps the brain.',
    clinicianPearl:
      'HT is not recommended at any age to prevent or treat cognitive decline or dementia. Initiation at ≥65 increased dementia risk in WHIMS (CEE + MPA). Modifiable dementia risk factors (CV risk, diabetes, inactivity, social isolation, hearing loss) are the counseling focus.',
    expandedExplanation:
      'Bilateral oophorectomy at ≤45 is associated with increased dementia risk. Some data suggest early ET may support verbal memory, but evidence does not support HT for cognitive indications.',
    examTraps: ['Recommending HT for dementia prevention under the "timing hypothesis."'],
    synonyms: ['brain fog', 'memory', 'forgetfulness', 'dementia', 'Alzheimer', 'concentration'],
    references: [r('ht2022', 'Cognition'), r('az2024', 'slides 43, 147–149')]
  }),
  f({
    id: 'f-hsdd',
    topicId: 'sexual-health',
    moduleId: 'm7',
    title: 'Low desire and testosterone',
    shortPatientAnswer:
      'Low sexual desire is common and has many causes — relationship, stress, mood, pain and medications all matter. Treating dryness and pain often helps. For some postmenopausal people with distressing low desire, a clinician may consider low-dose testosterone, though no product is FDA approved for women in the US.',
    clinicianPearl:
      'HSDD is a clinical diagnosis — not based on serum testosterone. Transdermal testosterone at female-physiologic doses (≈1/10 male dosing) modestly improves sexual function in postmenopausal HSDD; long-term safety not established; no FDA-approved female product. Check baseline total testosterone to exclude high levels and monitor to avoid supraphysiologic dosing.',
    expandedExplanation:
      'Flibanserin and bremelanotide are FDA approved for premenopausal HSDD. Oral ET raises SHBG and lowers free testosterone; transdermal estrogen may be preferred with low libido. Relationship factors and health matter more than estrogen levels.',
    examTraps: ['Diagnosing HSDD from a low total testosterone value.'],
    synonyms: ['low libido', 'sex drive', 'HSDD', 'testosterone', 'desire'],
    references: [r('az2024', 'slides 57–60, 93, 161–164')]
  }),

  // ───────── Module 8 · Complex comorbidities / cardiometabolic ─────────
  f({
    id: 'f-cvd',
    topicId: 'heart-metabolic',
    moduleId: 'm8',
    title: 'Hormone therapy and heart disease',
    shortPatientAnswer:
      'Hormone therapy is not used to prevent heart disease. When started before 60 or within 10 years of menopause, it does not appear to raise heart risk in healthy people. Starting later can carry more risk.',
    clinicianPearl:
      'HT is not FDA approved for primary or secondary cardioprotection. Higher absolute risks of CHD, VTE and stroke when initiated at age >60 or >10 years from menopause. Avoid systemic HT with established CVD or high CVD risk.',
    expandedExplanation:
      'KEEPS and ELITE suggested favorable CV biomarkers with early initiation but were underpowered for clinical events. Local vaginal ET may be considered in women with CVD, stroke or VTE history because of minimal absorption.',
    examTraps: ['Recommending HT to reduce heart attack risk.'],
    synonyms: ['heart disease', 'heart attack', 'stroke', 'cardiovascular', 'CVD', 'cholesterol'],
    references: [r('ht2022', 'Cardiovascular disease'), r('az2024', 'slides 97, 138–139')]
  }),
  f({
    id: 'f-vte-history',
    topicId: 'heart-metabolic',
    moduleId: 'm8',
    title: 'History of blood clots',
    shortPatientAnswer:
      'If you have had a blood clot, nonhormonal treatments are usually tried first for hot flashes. Low-dose vaginal estrogen for dryness is often still possible.',
    clinicianPearl:
      'Prior VTE: systemic oral HT contraindicated; nonhormone therapy first-line. If ineffective, low-dose transdermal estradiol may be considered after hematology consultation. Family history of VTE → consider thrombophilia evaluation before systemic HT.',
    expandedExplanation:
      'Thrombophilia without prior VTE is a relative contraindication. Bazedoxifene and ospemifene carry VTE risk; raloxifene increases VTE.',
    synonyms: ['blood clot', 'DVT', 'pulmonary embolism', 'VTE', 'thrombophilia', 'factor V Leiden'],
    references: [r('az2024', 'slides 95, 140')]
  }),
  f({
    id: 'f-diabetes',
    topicId: 'heart-metabolic',
    moduleId: 'm8',
    title: 'Diabetes and hormone therapy',
    shortPatientAnswer:
      'Hormone therapy may lower the chance of developing type 2 diabetes, but it is not used for that purpose.',
    clinicianPearl:
      'HT reduces new-onset type 2 diabetes (~30% in some analyses; WHI HR ~0.86), more with oral than transdermal estrogen. Not an FDA-approved indication. Transdermal may be preferred in diabetes with elevated triglycerides or CV risk.',
    expandedExplanation: 'Diabetes increases VMS burden and CV risk; individualize route.',
    synonyms: ['diabetes', 'blood sugar', 'insulin resistance', 'type 2 diabetes'],
    references: [r('ht2022', 'Diabetes'), r('az2024', 'slide 141')]
  }),
  f({
    id: 'f-weight',
    topicId: 'heart-metabolic',
    moduleId: 'm8',
    title: 'Weight and body shape changes',
    shortPatientAnswer:
      'Many people gain weight around the middle in midlife. Aging, sleep, mood and lower estrogen all play a role. Even a 3–10% weight loss improves blood pressure, cholesterol and blood sugar, and may reduce hot flashes.',
    clinicianPearl:
      'Menopause shifts fat distribution centrally. Modest weight loss (3–10%) improves BP, lipids, glucose, fatty liver and CVD risk; weight loss is recommended for VMS (Levels II–III). HT does not cause weight gain.',
    expandedExplanation:
      'Two-thirds of women 45–59 have BMI >25. Obesity in menopause is associated with metabolic syndrome, type 2 diabetes, CVD and breast cancer.',
    synonyms: ['weight gain', 'belly fat', 'metabolism', 'weight loss', 'obesity'],
    references: [r('az2024', 'slides 52, 167–171'), r('nh2023', 'Weight loss')]
  }),

  // ───────── Module 9 · Osteoporosis ─────────
  f({
    id: 'f-dxa',
    topicId: 'bones',
    moduleId: 'm9',
    title: 'Who needs a bone density (DXA) scan',
    shortPatientAnswer:
      'Most people should have a bone density scan at 65. You may need one sooner if you have broken a bone easily, have low body weight, smoke, take steroids, or have conditions that weaken bones.',
    clinicianPearl:
      'DXA for all women ≥65; earlier in postmenopausal women with risk factors (prior low-trauma fracture, low body weight, high-risk medications such as glucocorticoids, rheumatoid arthritis, malabsorption) or when discontinuing estrogen. ACOG: consider when FRAX 10-year major osteoporotic fracture risk ≥8.4%.',
    expandedExplanation:
      'FRAX estimates 10-year fracture probability but does not incorporate falls or diabetes and underestimates risk in fallers.',
    synonyms: ['DXA', 'DEXA', 'bone density', 'bone scan', 'FRAX'],
    references: [r('osteo2021', 'Screening'), r('acog-cpg1'), r('az2024', 'slides 70, 182')]
  }),
  f({
    id: 'f-tscore',
    topicId: 'bones',
    moduleId: 'm9',
    title: 'Diagnosing osteoporosis',
    shortPatientAnswer:
      'Your bone scan gives a T-score. A score of −2.5 or lower means osteoporosis. Breaking your hip or spine from a minor fall also counts as osteoporosis, whatever the scan shows.',
    clinicianPearl:
      'Osteoporosis: T-score ≤ −2.5 at lumbar spine, femoral neck or total hip (or distal 1/3 radius), OR hip/vertebral fragility fracture regardless of BMD, OR low bone mass (−1.0 to −2.5) plus fracture of proximal humerus, pelvis or distal forearm, or elevated FRAX risk.',
    expandedExplanation:
      'The diagnosis persists even if the T-score later improves above −2.5 with treatment. T-scores compare to young adult (White female) reference; Z-scores compare to age-matched peers.',
    examTraps: ['Removing an osteoporosis diagnosis after BMD improves on treatment.'],
    synonyms: ['T-score', 'osteopenia', 'low bone mass', 'osteoporosis diagnosis'],
    references: [r('osteo2021', 'Table 2 — Diagnosis')]
  }),
  f({
    id: 'f-calcium',
    topicId: 'bones',
    moduleId: 'm9',
    title: 'Calcium, vitamin D and lifestyle for bones',
    shortPatientAnswer:
      'Aim for about 1,200 mg of calcium a day, mostly from food. Get enough vitamin D, stay active with weight-bearing and balance exercise, avoid smoking, limit alcohol, and make your home fall-safe.',
    clinicianPearl:
      'Total calcium ~1,200 mg/day, diet preferred; intake above 1,200 mg (mostly supplements) not recommended — WHI supplement arm increased kidney stones (17%). Vitamin D 600 IU/day ≤70 y and 800 IU/day >70 y (IOM). Nonpharmacologic measures do not substantially increase BMD; multicomponent exercise (e.g., tai chi) reduces falls.',
    expandedExplanation:
      'Women with osteoporosis do not require more calcium than those with normal BMD. ACOG notes that calcium/vitamin D supplementation alone has not been shown to reduce fracture. Tapering fall-risk medications reduces falls.',
    synonyms: ['calcium', 'vitamin D', 'supplements for bones', 'falls', 'exercise for bones'],
    references: [r('osteo2021', 'Calcium and vitamin D; Table 6'), r('acog-cpg1')]
  }),
  f({
    id: 'f-ht-bone',
    topicId: 'bones',
    moduleId: 'm9',
    title: 'Hormone therapy and bone',
    shortPatientAnswer:
      'Hormone therapy prevents bone loss and lowers fracture risk while you take it. When it stops, bone loss resumes, so your bone health plan should be reviewed at that time.',
    clinicianPearl:
      'HT is FDA approved for prevention (not treatment) of postmenopausal osteoporosis. WHI: ET/EPT reduced hip fracture by ~30–34%. After discontinuation, BMD declines within 1–2 years (3–6% in year 1) — reassess with DXA and consider transition to another agent.',
    expandedExplanation:
      'Raloxifene is approved for both prevention and treatment and reduces invasive breast cancer; it may worsen VMS and increase VTE. CEE + bazedoxifene prevents bone loss.',
    examTraps: ['Calling HT an FDA-approved treatment for established osteoporosis.'],
    synonyms: ['estrogen bones', 'bone loss prevention', 'raloxifene'],
    references: [r('osteo2021', 'Estrogen; Discontinuing HT'), r('ht2022', 'Bone')]
  }),
  f({
    id: 'f-bisphos',
    topicId: 'bones',
    moduleId: 'm9',
    title: 'Bisphosphonates and the "drug holiday"',
    shortPatientAnswer:
      'Bisphosphonates are common bone-strengthening medicines. After 3–5 years, some people at lower risk can take a supervised break. Rare side effects include jaw bone problems and unusual thigh fractures — report new thigh or groin pain.',
    clinicianPearl:
      'Consider a bisphosphonate holiday after 3–5 years only in low/moderate-risk patients who no longer meet treatment criteria. Remaining high risk (prior hip/spine or multiple fractures, hip BMD still osteoporotic) → continue or switch to denosumab or an anabolic agent. ONJ ~1/10,000–100,000 patient-years; AFF risk rises with duration; thigh/groin pain warrants imaging.',
    expandedExplanation:
      'Fracture risk increases again after ~2 years off oral bisphosphonates; restart with significant BMD decline or new fracture. Use caution in significant renal impairment.',
    redFlags: ['New thigh or groin pain while on a bone medicine.'],
    examTraps: ['Offering a holiday to a patient with prior vertebral fracture who remains high risk.'],
    synonyms: ['alendronate', 'Fosamax', 'zoledronic acid', 'Reclast', 'risedronate', 'drug holiday'],
    references: [r('osteo2021', 'Bisphosphonates; Duration of therapy')]
  }),
  f({
    id: 'f-denosumab',
    topicId: 'bones',
    moduleId: 'm9',
    title: 'Denosumab must not be stopped abruptly',
    shortPatientAnswer:
      'If you take denosumab (an injection every 6 months), do not stop or delay it without a plan from your clinician. Stopping suddenly can cause rapid bone loss and spine fractures.',
    clinicianPearl:
      'Denosumab 60 mg SC every 6 months (RANKL inhibitor) reduced vertebral fractures 68% and hip fractures 40%. Discontinuation causes rebound bone turnover above baseline with rapid BMD loss and multiple vertebral fractures — transition to a bisphosphonate; do not delay doses.',
    expandedExplanation: 'Correct hypocalcemia before starting antiresorptives.',
    redFlags: ['Missing a denosumab dose by more than a few weeks — contact your clinician.'],
    examTraps: ['Stopping denosumab for a "holiday" like a bisphosphonate.'],
    synonyms: ['denosumab', 'Prolia', 'bone shot', 'injection for bones'],
    references: [r('osteo2021', 'Denosumab; Discontinuing denosumab')]
  }),
  f({
    id: 'f-anabolic',
    topicId: 'bones',
    moduleId: 'm9',
    title: 'Anabolic first for very high risk',
    shortPatientAnswer:
      'For people at very high fracture risk, bone-building injections may be used first, followed by another medicine to keep the gains.',
    clinicianPearl:
      'Osteoanabolic agents — teriparatide 20 µg SC daily, abaloparatide 80 µg SC daily, romosozumab 210 mg SC monthly × 12 — build bone faster; use first in very-high-risk patients (recent or multiple fractures, very low T-score), followed by an antiresorptive. Romosozumab carries a CV warning.',
    expandedExplanation: 'Gains from anabolic therapy are lost without antiresorptive follow-on.',
    synonyms: ['teriparatide', 'Forteo', 'abaloparatide', 'Tymlos', 'romosozumab', 'Evenity', 'anabolic'],
    references: [r('osteo2021', 'Osteoanabolic agents; Sequential therapy')]
  }),

  // ───────── Module 10 · Cancer / special populations ─────────
  f({
    id: 'f-breast-survivor-gsm',
    topicId: 'vaginal-urinary',
    moduleId: 'm10',
    title: 'Breast cancer survivors with vaginal symptoms',
    shortPatientAnswer:
      'If you have had breast cancer, start with moisturizers and lubricants. If those do not help, low-dose vaginal estrogen or DHEA may still be possible — decide together with your oncologist.',
    clinicianPearl:
      'Nonhormone therapies first. For refractory GSM, low-dose vaginal ET (or vaginal DHEA) may be considered after shared decision-making with oncology; observational data appear reassuring. Systemic HT generally not advised; consider only for compelling reasons after nonhormone failure, with oncology. AI users have more severe GSM.',
    expandedExplanation:
      'Insufficient data confirm vaginal estrogen safety in breast cancer; women on aromatase inhibitors warrant extra caution. ACOG CO 659 supports vaginal estrogen for refractory symptoms in consultation with oncology.',
    synonyms: ['breast cancer survivor', 'aromatase inhibitor', 'letrozole', 'anastrozole', 'cancer and hormones'],
    references: [r('gsm2020', 'Breast cancer'), r('ht2022', 'Summary'), r('acog-co659')]
  }),
  f({
    id: 'f-brca',
    topicId: 'early-menopause',
    moduleId: 'm10',
    title: 'BRCA carriers after risk-reducing surgery',
    shortPatientAnswer:
      'If you carry a BRCA gene change and have your ovaries removed early to lower cancer risk, hormone therapy until the usual age of menopause appears reasonable and does not seem to cancel the breast cancer protection from surgery.',
    clinicianPearl:
      'BRCA carriers without breast cancer who undergo RRBSO before natural menopause appear to receive HT benefits with minimal to no increase in breast cancer risk (observational). RRBSO before 45 reduces breast cancer risk ~50–55%; HT does not negate this. ET may carry lower risk than EPT.',
    expandedExplanation: 'Data are limited and observational; individualize with genetics and oncology input.',
    synonyms: ['BRCA', 'RRBSO', 'oophorectomy', 'ovaries removed', 'surgical menopause'],
    references: [r('ht2022', 'Summary'), r('az2024', 'slide 100')]
  }),
  f({
    id: 'f-poi-ht',
    topicId: 'early-menopause',
    moduleId: 'm10',
    title: 'Hormone therapy after early menopause or POI',
    shortPatientAnswer:
      'If menopause comes early, hormone therapy is generally recommended at least until the average age of natural menopause (around 52) unless there is a reason not to use it. It protects your bones, heart and brain during years your body would normally make estrogen.',
    clinicianPearl:
      'POI/early menopause without contraindications: HT at least until ~age 52; higher-than-standard doses may be needed, especially <40. WHI risk data do not apply. Untreated estrogen deficiency raises risks of bone loss, CVD, and cognitive/affective disorders.',
    expandedExplanation: 'Combined hormonal contraception is an alternative when contraception is desired.',
    examTraps: ['Withholding HT in a 35-year-old with POI because of WHI risk estimates.'],
    synonyms: ['POI', 'early menopause treatment', 'premature menopause hormones'],
    references: [r('ht2022', 'Premature and early menopause; Summary')]
  }),
  f({
    id: 'f-endometrial-survivor',
    topicId: 'bleeding',
    moduleId: 'm10',
    title: 'Endometrial cancer and hyperplasia',
    shortPatientAnswer:
      'Low-dose vaginal estrogen does not raise the risk of uterine cancer. People who have had certain uterine cancers may still use it for vaginal symptoms after discussion with their cancer specialist.',
    clinicianPearl:
      'Low-dose vaginal ET does not increase endometrial cancer risk. For select endometrial cancer survivors with GSM refractory to nonhormone therapy, low-dose vaginal ET appears safe (observational). HT not advised with high-grade/advanced endometrial cancer, endometrial stromal sarcoma or leiomyosarcoma. Hyperplasia: atypia raises progression risk to ~28% vs <5% without; LNG-IUS has higher regression than oral progestins.',
    expandedExplanation: 'Women on HT should report unscheduled bleeding promptly.',
    synonyms: ['uterine cancer', 'endometrial cancer', 'hyperplasia'],
    references: [r('ht2022', 'Endometrial cancer; Summary'), r('az2024', 'slides 132–133')]
  })
];

export const factById = Object.fromEntries(facts.map((x) => [x.id, x])) as Record<string, Fact>;
