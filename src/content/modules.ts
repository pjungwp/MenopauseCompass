import type { ReviewModule } from './types';

/**
 * Ten Quick Review modules. Statement-derived content lives in oneMinute/decisionRules/tables;
 * editorial synthesis is kept separately in interpretiveNotes so readers can tell them apart.
 */
export const modules: ReviewModule[] = [
  {
    id: 'm1', slug: 'physiology-straw', number: 1, title: 'Physiology & STRAW+10', category: 'Foundations',
    blurb: 'Staging, endocrine changes, KNDy neurons, POI definitions.',
    oneMinute: [
      'Menopause = FMP confirmed after 12 months of amenorrhea; normal range 40–58 years.',
      'STRAW+10 staging is anchored on menstrual cycle criteria; FSH/AMH are supportive only.',
      'Early transition (−2): persistent ≥7-day difference in consecutive cycle length, recurring within 10 cycles. Late transition (−1, 1–3 y): ≥60 days amenorrhea; FSH >25 IU/L supportive.',
      '−3b: regular cycles but low AMH/AFC. −3a: subtle shortening + early-follicular FSH rise.',
      '+1a and +1b last ~1 year each (rapid FSH/E2 change, VMS most likely); +1c lasts 3–6 years (stabilization); early postmenopause ≈ 5–8 years total.',
      'Perimenopause = −2 through +1a.',
      'VMS mechanism: loss of estrogen feedback → KNDy neuron hyperactivity → neurokinin B at NK3 → narrowed thermoneutral zone.',
      'POI <40 (~1%); early menopause 40–45 (~3%).',
      'Adrenal androgens rise moderately in late transition; no serum androgen level defines female androgen insufficiency.'
    ],
    decisionRules: ['Do not order FSH to diagnose menopause in a symptomatic woman >45 with typical bleeding changes.', 'Amenorrhea <40 → evaluate for POI (FSH ×2, estradiol, TSH, prolactin, hCG; consider karyotype/FMR1).'],
    tables: [
      {
        title: 'STRAW+10 — full staging (Harlow 2012)',
        columns: ['Stage', 'Term / duration', 'Menstrual (principal)', 'Supportive markers', 'Descriptors'],
        rows: [
          ['−5', 'Early reproductive; variable', 'Variable to regular', '—', '—'],
          ['−4', 'Peak reproductive; variable', 'Regular', '—', '—'],
          ['−3b', 'Late reproductive; variable', 'Regular, length unchanged', 'FSH normal; AMH, AFC (± inhibin B) low', 'Fertility declines'],
          ['−3a', 'Late reproductive; variable', 'Subtle flow/length change (shorter cycles)', 'Early-follicular FSH ↑ variable; AMH, AFC, inhibin B low', '—'],
          ['−2', 'Early transition; variable', 'Persistent ≥7-day difference in consecutive cycle length (recurs within 10 cycles)', 'FSH ↑ variable; AMH, AFC low', '—'],
          ['−1', 'Late transition; 1–3 years', 'Amenorrhea ≥60 days', 'FSH >25 IU/L (random draw); alternates with normal FSH + high E2; frequent anovulation', 'VMS likely'],
          ['0', 'Final menstrual period', 'Recognized after 12 months of amenorrhea', '—', '—'],
          ['+1a', 'Early postmenopause; 1 year', 'Ends perimenopause (12 months after FMP)', 'FSH rising, E2 falling', 'VMS most likely'],
          ['+1b', 'Early postmenopause; 1 year', 'Amenorrhea', 'Rapid change continues; ends when FSH/E2 stabilize', 'VMS most likely'],
          ['+1c', 'Early postmenopause; 3–6 years', 'Amenorrhea', 'Stable high FSH, low E2; AMH/AFC very low', '—'],
          ['+2', 'Late postmenopause; rest of life', 'Amenorrhea', 'Limited change; FSH may fall in the very old', 'Urogenital atrophy ↑; somatic aging']
        ]
      },
      {
        title: 'Key spans to memorize',
        columns: ['Term', 'Span'],
        rows: [
          ['Menopause transition', '−2 to −1 (ends at FMP)'],
          ['Perimenopause', '−2 through +1a (12 months after FMP)'],
          ['Early postmenopause', '+1a + +1b + +1c ≈ 5–8 years'],
          ['Hormone stabilization', 'Start of +1c, ~2 years after FMP (lasts 3–6 years)']
        ]
      },
      {
        title: 'When bleeding criteria cannot be used',
        columns: ['Situation', 'How to stage'],
        rows: [
          ['Hysterectomy or endometrial ablation', 'Biomarkers + symptoms; wait ≥3 months after surgery; usually only pre- vs postmenopausal; repeat tests'],
          ['PCOS', 'Menstrual criteria not applicable; supportive criteria + age'],
          ['Chemotherapy / chronic illness', 'Resumed menses ≠ normal function; combine bleeding, biomarkers, age'],
          ['POI', 'May not fit the model; course more variable'],
          ['LNG-IUD or ongoing hormones', 'Bleeding masked; clinical judgment ± labs off hormones'],
          ['Age, BMI, race, smoking', 'STRAW+10 still applies (timing changes, not trajectory)']
        ]
      }
    ],
    traps: [
      'Choosing an FSH threshold as diagnostic of menopause.',
      'Applying WHI data to POI.',
      'Assuming VMS arise peripherally rather than in hypothalamic thermoregulation.',
      'Calling regular cycles with low AMH or FSH 12–15 "perimenopause" (that is −3b/−3a).',
      'Staging a woman with PCOS or after hysterectomy by bleeding pattern.',
      'Confusing +1a/+1b (1 year each) with +1c (3–6 years).'
    ],
    pearls: [
      { text: 'Menstrual history is the principal STRAW criterion.', factId: 'f-straw' },
      { text: 'Fezolinetant (NK3) and elinzanetant (NK1/NK3) target the KNDy pathway.', factId: 'f-kndy' },
      { text: 'Bilateral oophorectomy ≤45 → ↑ dementia and CVD risk.', factId: 'f-poi-def' }
    ],
    interpretiveNotes: ['FSH ≥25 IU/L for the late transition comes from STRAW+10 supportive criteria; treat it as a marker, not a definition.'],
    factIds: ['f-straw', 'f-kndy', 'f-poi-def'],
    references: [{ sourceId: 'straw10', section: 'Figure 1' }, { sourceId: 'az2024', section: 'Staging and physiology' }, { sourceId: 'nh2023', section: 'Neurokinin B' }],
    status: 'draft', lastReviewed: null,
    keywords: ['STRAW', 'FSH', 'KNDy', 'POI', 'physiology', 'staging', 'neurokinin']
  },
  {
    id: 'm2', slug: 'diagnosis-assessment', number: 2, title: 'Diagnosis, assessment & screening', category: 'Foundations',
    blurb: 'When to test, AUB/PMB, contraception, preventive care.',
    oneMinute: [
      'Hormone testing generally not recommended to diagnose the transition or titrate HT.',
      'Test when <40–45 with amenorrhea, fertility concerns, or when bleeding cannot be assessed (hysterectomy, LNG-IUD).',
      'Salivary/urine hormone testing: unreliable, not recommended.',
      'Any postmenopausal bleeding → TVUS and/or endometrial sampling; ~90% of endometrial cancers present with bleeding.',
      'Perimenopausal AUB: classify with PALM-COEIN; LNG-IUS treats heavy bleeding and provides contraception.',
      'CHC only for healthy, lean, nonsmoking perimenopausal women without contraindications.'
    ],
    decisionRules: [
      'Smoker, hypertensive, or VTE history needing contraception → progestin-only method.',
      'Unscheduled bleeding on EPT persisting >6 months after initiation → evaluate.'
    ],
    tables: [{
      title: 'Midlife preventive screening (verify current USPSTF/ACOG)',
      columns: ['Screen', 'Typical start / interval'],
      rows: [
        ['Colorectal', 'Average risk from 45'],
        ['Breast', 'USPSTF biennial 40–74; ACOG every 1–2 y 40–75'],
        ['Bone density (DXA)', '65, earlier with risk factors'],
        ['Lung (LDCT)', 'Eligible current/former smokers per USPSTF'],
        ['Lipids', 'Periodically; more frequently with age/risk']
      ]
    }],
    traps: ['Attributing PMB on vaginal estrogen to the drug without workup.', 'Ordering salivary hormone panels.'],
    pearls: [
      { text: 'Bleeding pattern, not FSH, diagnoses the transition.', factId: 'f-no-hormone-testing' },
      { text: 'PMB = evaluate, every time.', factId: 'f-pmb' }
    ],
    interpretiveNotes: ['Screening intervals change frequently; the table is a teaching scaffold only.'],
    factIds: ['f-no-hormone-testing', 'f-pmb', 'f-peri-aub', 'f-contraception', 'f-preventive'],
    references: [{ sourceId: 'az2024', section: 'Assessment and preventive screening' }, { sourceId: 'gsm2020', section: 'Endometrial safety' }],
    status: 'draft', lastReviewed: null,
    keywords: ['FSH', 'PMB', 'AUB', 'PALM-COEIN', 'contraception', 'screening', 'bleeding']
  },
  {
    id: 'm3', slug: 'vasomotor-symptoms', number: 3, title: 'Vasomotor symptoms', category: 'Treatment',
    blurb: 'Epidemiology, duration, risk factors, treatment hierarchy.',
    oneMinute: [
      'VMS in up to 80%; mean duration 7–9 y (SWAN median 7.4 y); ~1/3 >10 y; ~10% >20 y.',
      'Risk factors: obesity, smoking, anxiety/depression, thyroid disease, diabetes, OSA, chronic pain.',
      'HT is the most effective treatment.',
      'Nonhormone placebo response in trials is high (20–66%); anxiety predicts placebo response.',
      'Prescription nonhormone agents typically work within 2 weeks.'
    ],
    decisionRules: [
      'Bothersome VMS, <60 or <10 y from FMP, no contraindications → HT is reasonable first-line.',
      'Contraindication or preference → evidence-based nonhormone therapy (Module 5).'
    ],
    tables: [],
    traps: ['Counseling that VMS resolve within 1–2 years.', 'Choosing lifestyle measures (exercise, yoga, cooling) as evidence-based VMS treatments.'],
    pearls: [
      { text: 'Earlier onset of VMS predicts longer duration.', factId: 'f-vms-burden' },
      { text: 'Gabapentin at bedtime suits night sweats with sleep disruption.', factId: 'f-gabapentin' }
    ],
    interpretiveNotes: [],
    factIds: ['f-vms-burden', 'f-kndy', 'f-ht-most-effective'],
    references: [{ sourceId: 'nh2023', section: 'Introduction' }, { sourceId: 'az2024', section: 'slides 25–26' }],
    status: 'draft', lastReviewed: null,
    keywords: ['hot flashes', 'VMS', 'SWAN', 'night sweats', 'duration']
  },
  {
    id: 'm4', slug: 'systemic-hormone-therapy', number: 4, title: 'Systemic hormone therapy', category: 'Treatment',
    blurb: 'Timing, regimens, route, contraindications, FDA 2025–26 labeling.',
    oneMinute: [
      'Favorable benefit–risk: <60 y or <10 y from menopause, no contraindications (VMS, bone loss prevention).',
      'Less favorable when initiated >60 or >10 y (CHD, stroke, VTE, dementia); greatest at ≥70 or >20 y.',
      'Intact uterus → progestogen, LNG-IUS (off-label), or CEE/BZA. No uterus → ET alone.',
      'Transdermal estradiol: lower VTE/stroke risk in observational data; preferred with low libido (oral ↑ SHBG).',
      'WHI used only oral CEE 0.625 ± MPA 2.5 in women 50–79; ages 50–59 had reduced all-cause mortality (HR 0.69).',
      'FDA 2025–26: CVD, breast cancer and dementia removed from boxed warning; endometrial cancer boxed warning retained for systemic ET-alone; "lowest dose, shortest duration" removed.',
      'No routine discontinuation at 65; reassess periodically.'
    ],
    decisionRules: [
      'Contraindications: unexplained vaginal bleeding, active liver disease, estrogen-sensitive cancer, CHD/MI/stroke, prior VTE or high inherited thrombotic risk.',
      'VTE history: nonhormone first; if needed, low-dose transdermal with hematology input.',
      'Compounded BHRT and pellets: not recommended (except documented allergy to approved products).'
    ],
    tables: [
      {
        title: 'Progestogen options for endometrial protection',
        columns: ['Option', 'Regimen (examples)', 'Note'],
        rows: [
          ['Micronized progesterone', '200 mg × 12–14 d/mo (cyclic) or 100 mg daily (continuous)', 'Bedtime (sedating); peanut oil; may be less thrombogenic'],
          ['Medroxyprogesterone acetate', '2.5 mg daily (continuous) or 5–10 mg × 12–14 d/mo', 'Most data (WHI)'],
          ['Synthetic progestins', 'NETA, LNG, drospirenone in combination products', 'Combination products improve adherence'],
          ['LNG-IUS 52 mg', 'Intrauterine', 'Off-label endometrial protection; treats AUB'],
          ['CEE + bazedoxifene', 'Daily combination (TSEC)', 'No progestogen needed; VTE risk']
        ]
      },
      {
        title: 'Estrogen dose equivalence',
        columns: ['Formulation', 'Low dose', 'Standard dose'],
        rows: [
          ['Conjugated estrogens (oral)', '0.3–0.45 mg', '0.625 mg'],
          ['Estradiol (oral)', '0.5 mg', '1 mg'],
          ['Estradiol patch', '0.025–0.0375 mg/d', '0.05 mg/d'],
          ['Ultra-low (bone only)', 'Estradiol patch 0.014 mg/d (Menostar)', '—']
        ]
      },
      {
        title: 'Selected FDA-approved systemic products',
        columns: ['Product type', 'Examples', 'Pearl'],
        rows: [
          ['Oral E + P', 'CEE/MPA; E2/NETA; E2/drospirenone; EE/NETA', 'Drospirenone: antimineralocorticoid → K⁺ monitoring'],
          ['Oral E2 + progesterone', 'E2 1 mg/P4 100 mg (Bijuva)', 'Only approved body-identical combination'],
          ['Patch E + P', 'E2/NETA; E2/LNG (weekly)', 'Transdermal option with a uterus'],
          ['Gel / spray', 'E2 gels; forearm spray (Evamist)', 'Secondary exposure: children, pets'],
          ['TSEC', 'CEE 0.45 mg/bazedoxifene 20 mg', 'No progestogen needed'],
          ['Vaginal ring (systemic)', 'Estradiol acetate (Femring)', 'Needs progestogen with a uterus'],
          ['Not FDA approved', 'Estriol, pellets, compounded creams', 'Not recommended routinely']
        ]
      },
      {
        title: 'Oral vs transdermal estrogen (first-pass effects)',
        columns: ['Parameter', 'Oral', 'Transdermal'],
        rows: [
          ['E1:E2 ratio', '↑ (gut/liver conversion)', 'Near physiologic'],
          ['SHBG, TBG, CBG', '↑ (↓ free T; ↑ levothyroxine need)', 'Minimal'],
          ['Triglycerides', '↑', 'Neutral'],
          ['HDL / LDL', 'HDL ↑, LDL ↓', 'Smaller effect'],
          ['CRP, clotting factors, angiotensinogen', '↑', 'Minimal'],
          ['VTE / stroke / gallbladder (observational)', 'Higher', 'Lower'],
          ['CYP3A4 inducers (carbamazepine, rifampin)', '↓ levels', 'Less affected']
        ]
      },
      {
        title: 'WHI absolute risk framing (CEE + MPA)',
        columns: ['Outcome', 'Approximate effect'],
        rows: [
          ['Breast cancer', '<1 additional case / 1,000 women / year'],
          ['Gallbladder disease', '+47 / 10,000 / year (CEE + MPA); +58 (CEE alone)'],
          ['Dementia (initiation ≥65, WHIMS)', '+23 / 10,000 person-years'],
          ['CEE alone, breast cancer', 'Reduced incidence and mortality']
        ]
      }
    ],
    traps: [
      'Requiring HT to stop at 60 or 65.',
      'Using pre-2025 boxed-warning language as current labeling.',
      'Prescribing systemic estrogen alone with an intact uterus.',
      'Calling HT a cardioprotective or dementia-preventive therapy.'
    ],
    pearls: [
      { text: 'Timing hypothesis concerns initiation, not continuation.', factId: 'f-timing' },
      { text: 'Femring is systemic — needs a progestogen with a uterus.', factId: 'f-femring-estring' },
      { text: 'HT is FDA approved for osteoporosis prevention, not treatment.', factId: 'f-ht-bone' }
    ],
    interpretiveNotes: [
      'Exam items written before 2025 may still reference the older boxed warning; answer what the stem asks.',
      'Regimen doses shown are common teaching examples — confirm against the HT 2022 tables.'
    ],
    factIds: ['f-ht-most-effective', 'f-timing', 'f-progestogen', 'f-route', 'f-contraindications', 'f-fda-label', 'f-compounded', 'f-duration', 'f-breast-risk'],
    references: [{ sourceId: 'ht2022' }, { sourceId: 'fda-ht-label-2026' }],
    status: 'draft', lastReviewed: null,
    keywords: ['HRT', 'MHT', 'estrogen', 'progestogen', 'WHI', 'timing', 'transdermal', 'boxed warning', 'bioidentical']
  },
  {
    id: 'm5', slug: 'nonhormone-therapy', number: 5, title: 'Nonhormone therapy for VMS', category: 'Treatment',
    blurb: 'Recommended vs not recommended, dosing, tamoxifen, NK antagonists.',
    oneMinute: [
      'Recommended Level I: CBT, clinical hypnosis, SSRIs/SNRIs, gabapentin, fezolinetant. Levels I–II: oxybutynin. Levels II–III: weight loss, stellate ganglion block.',
      'NOT recommended Level I: paced respiration. Levels I–II: supplements/herbals. Level II: cooling, trigger avoidance, exercise, yoga, mindfulness, relaxation, suvorexant, soy/equol, cannabinoids, acupuncture. Levels I–III: chiropractic, clonidine. Level III: dietary modification, pregabalin.',
      'FDA-approved (as of 2023): paroxetine mesylate 7.5 mg and fezolinetant 45 mg. Elinzanetant approved Oct 2025.',
      'Fezolinetant boxed warning (Dec 2024): hepatic labs baseline, monthly × 3, then months 6 and 9.',
      'Tamoxifen: avoid paroxetine and fluoxetine (CYP2D6).'
    ],
    decisionRules: [
      'On tamoxifen → venlafaxine, desvenlafaxine, escitalopram or citalopram.',
      'Night sweats with insomnia → bedtime gabapentin.',
      'Older adult → avoid long-term oxybutynin (anticholinergic cognitive risk).'
    ],
    tables: [{
      title: 'Suggested dosing (2023 Table 1)',
      columns: ['Agent', 'Dose', 'Start'],
      rows: [
        ['Paroxetine mesylate', '7.5 mg/d', 'Single dose, no titration'],
        ['Paroxetine', '10–25 mg/d', '10 mg/d'],
        ['Citalopram', '10–20 mg/d', '10 mg/d'],
        ['Escitalopram', '10–20 mg/d', '10 mg/d (5 mg if sensitive)'],
        ['Desvenlafaxine', '100–150 mg/d', '25–50 mg/d, titrate'],
        ['Venlafaxine', '37.5–150 mg/d', '37.5 mg/d'],
        ['Gabapentin', '900–2,400 mg/d divided', '100–300 mg at night'],
        ['Fezolinetant', '45 mg/d', 'No titration; hepatic monitoring'],
        ['Elinzanetant', '120 mg at bedtime', '60 mg with moderate CYP3A4 inhibitors'],
        ['Oxybutynin', '2.5–5 mg twice daily (or ER 15 mg)', 'Avoid in older adults']
      ]
    },
    {
      title: 'NK antagonists head to head (US labels)',
      columns: ['Feature', 'Fezolinetant (Veozah)', 'Elinzanetant (Lynkuet)'],
      rows: [
        ['Target', 'NK3', 'NK1 + NK3'],
        ['Dose', '45 mg once daily', '120 mg at bedtime'],
        ['Metabolism', 'CYP1A2 (inhibitors contraindicated)', 'CYP3A4 (avoid strong inhibitors, grapefruit, inducers; 60 mg with moderate inhibitors)'],
        ['Boxed warning', 'Hepatotoxicity (Dec 2024)', 'None'],
        ['Liver tests', 'Baseline; monthly × 3; months 6 and 9', 'Baseline; month 3'],
        ['Liver thresholds', 'Don\'t start ALT/AST or bili ≥2× ULN; stop >5× ULN or >3× with bili >2×', 'Same thresholds'],
        ['Contraindications', 'Cirrhosis; eGFR <30; CYP1A2 inhibitors', 'Pregnancy'],
        ['Other', 'No renal adjustment if eGFR ≥30', 'Somnolence/fatigue; seizure caution; contraception if fertile']
      ]
    },
    {
      title: 'Antidepressants with tamoxifen (CYP2D6)',
      columns: ['Inhibition', 'Agents', 'Use with tamoxifen?'],
      rows: [
        ['Strong', 'Paroxetine, fluoxetine, bupropion', 'Avoid'],
        ['Moderate', 'Sertraline, duloxetine', 'Less preferred'],
        ['Weak / minimal', 'Venlafaxine, desvenlafaxine, escitalopram, citalopram', 'Preferred']
      ]
    }],
    traps: [
      'Paced respiration is Level I NOT recommended — a classic distractor.',
      'Paroxetine is FDA approved for VMS but wrong for tamoxifen users.',
      'Sertraline and fluoxetine are not recommended for VMS.',
      'CBT reduces bother/interference, not necessarily frequency; hypnosis reduces frequency and severity.'
    ],
    pearls: [
      { text: 'Clinical hypnosis reduced hot flash frequency 74% vs 17% in an RCT.', factId: 'f-nh-recommended' },
      { text: 'Only ~35% of North American women make equol from soy.', factId: 'f-nh-not-recommended' }
    ],
    interpretiveNotes: ['Elinzanetant and the fezolinetant hepatic boxed warning postdate the 2023 statement; questions written to the 2023 statement may not include them.'],
    factIds: ['f-nh-recommended', 'f-nh-not-recommended', 'f-ssri-tamoxifen', 'f-gabapentin', 'f-nk-antagonists', 'f-oxybutynin'],
    references: [{ sourceId: 'nh2023' }, { sourceId: 'fda-fezolinetant-2024' }, { sourceId: 'fda-elinzanetant-2025' }],
    status: 'draft', lastReviewed: null,
    keywords: ['nonhormonal', 'SSRI', 'SNRI', 'gabapentin', 'fezolinetant', 'elinzanetant', 'tamoxifen', 'CBT', 'hypnosis', 'oxybutynin']
  },
  {
    id: 'm6', slug: 'genitourinary-syndrome', number: 6, title: 'Genitourinary syndrome of menopause', category: 'Organ systems',
    blurb: 'Diagnosis, treatment ladder, vaginal products, rings, lasers.',
    oneMinute: [
      'GSM affects ~27–84% of postmenopausal women; progressive; underdiagnosed and undertreated.',
      'Diagnosis = bothersome symptoms + consistent exam findings; pH (>5.0) and maturation index not essential.',
      'First-line (Level A): lubricants with activity + regular long-acting moisturizers.',
      'Moderate–severe (all Level A): low-dose vaginal ET, vaginal DHEA 6.5 mg, ospemifene 60 mg, systemic ET when VMS present.',
      'No progestogen with low-dose vaginal ET, DHEA or ospemifene; no routine endometrial surveillance.',
      'Energy-based devices: insufficient evidence; FDA 2018 warning.'
    ],
    decisionRules: [
      'Isolated GSM → local therapy preferred over systemic.',
      'GSM persists on systemic HT → add low-dose vaginal ET.',
      'Recurrent UTI postmenopause → consider vaginal estrogen.'
    ],
    tables: [{
      title: 'Vaginal products (common examples)',
      columns: ['Product', 'Dose / schedule', 'Systemic?'],
      rows: [
        ['Estradiol tablet/insert', '10 µg daily × 2 wk, then twice weekly', 'No (local)'],
        ['Estradiol softgel insert', '4 or 10 µg; daily × 2 wk, then twice weekly', 'No (local); lowest dose'],
        ['Estradiol 2 mg ring (Estring)', '~7.5 µg/d, replace every 90 d', 'No (local)'],
        ['Estradiol acetate ring (Femring)', 'Systemic dose, every 90 d', 'Yes — progestogen needed with uterus'],
        ['Vaginal creams (estradiol 0.01%, CE 0.625 mg/g)', '0.5–1 g 1–3×/week (lower than labeled)', 'Low dose: local'],
        ['Prasterone (DHEA) insert', '6.5 mg nightly', 'No'],
        ['Ospemifene', '60 mg oral daily', 'Oral SERM; hot flashes; VTE/stroke warning; avoid fluconazole, estrogens']
      ]
    }],
    traps: ['Confusing Femring with Estring.', 'Adding a progestogen to low-dose vaginal ET.', 'Choosing laser as recommended therapy.', 'Choosing systemic HT for urinary incontinence.'],
    pearls: [
      { text: 'Unlike VMS, GSM worsens over time.', factId: 'f-gsm-def' },
      { text: 'AIs cause more severe GSM than tamoxifen.', factId: 'f-gsm-def' },
      { text: 'WHO lubricant osmolality <1,200 mOsm/kg.', factId: 'f-gsm-firstline' }
    ],
    interpretiveNotes: ['GSM 2020 uses an A/B/C strength scale, unlike the Level I–III scale in the other statements.', 'Product doses are listed as teaching examples — verify against GSM 2020 tables.'],
    factIds: ['f-gsm-def', 'f-gsm-firstline', 'f-vaginal-estrogen', 'f-gsm-other-rx', 'f-femring-estring', 'f-energy-devices', 'f-urinary'],
    references: [{ sourceId: 'gsm2020' }],
    status: 'draft', lastReviewed: null,
    keywords: ['GSM', 'VVA', 'vaginal estrogen', 'DHEA', 'ospemifene', 'Femring', 'Estring', 'laser', 'UTI']
  },
  {
    id: 'm7', slug: 'sleep-mood-cognition-sexual', number: 7, title: 'Sleep, mood, cognition & sexual function', category: 'Organ systems',
    blurb: 'CBT-I, perimenopausal depression, HT and cognition, HSDD.',
    oneMinute: [
      'CBT-I is first-line for insomnia; no HT is FDA approved for insomnia.',
      'Perimenopause ↑ depressive symptoms, especially with prior MDD; antidepressants/psychotherapy first-line.',
      'Estrogen may have antidepressant effects in perimenopause but is not approved for mood and is ineffective for postmenopausal depression.',
      'HT is not recommended at any age to prevent or treat cognitive decline.',
      'HSDD = clinical diagnosis; testosterone at female physiologic doses modestly helps postmenopausal HSDD; no FDA-approved female product.',
      'Flibanserin and bremelanotide: FDA approved for premenopausal HSDD.'
    ],
    decisionRules: [
      'Low libido on oral estrogen → consider transdermal (oral ↑ SHBG).',
      'Before testosterone: baseline total T to exclude high levels; monitor to avoid supraphysiologic dosing.'
    ],
    tables: [{
      title: 'Drugs for low desire',
      columns: ['Agent', 'Use', 'Key points'],
      rows: [
        ['Flibanserin', '100 mg at bedtime; premenopausal HSDD', '5-HT1A agonist/5-HT2A antagonist; alcohol: wait ≥2 h after 1–2 drinks, skip after ≥3; contraindicated with moderate/strong CYP3A4 inhibitors or liver disease; stop if no benefit at 8 weeks'],
        ['Bremelanotide', '1.75 mg SC ≥45 min before sex; premenopausal HSDD', 'Melanocortin agonist; ≤1 dose/24 h, ≤8/month; nausea, transient BP rise, hyperpigmentation'],
        ['Testosterone (off-label)', 'Postmenopausal HSDD', '~1/10 male transdermal dose; T at baseline and 3–6 weeks; stop if no benefit by 6 months']
      ]
    }],
    traps: ['Diagnosing HSDD from a serum testosterone.', 'HT for dementia prevention.', 'Estrogen as first-line for MDD.'],
    pearls: [
      { text: 'Micronized progesterone 300 mg qHS improved VMS and sleep (off-label).', factId: 'f-sleep' },
      { text: 'WHIMS: initiating CEE + MPA ≥65 ↑ dementia.', factId: 'f-cognition' }
    ],
    interpretiveNotes: [],
    factIds: ['f-sleep', 'f-mood', 'f-cognition', 'f-hsdd'],
    references: [{ sourceId: 'ht2022' }, { sourceId: 'az2024', section: 'Mood, cognition, sleep and sexual function' }],
    status: 'draft', lastReviewed: null,
    keywords: ['insomnia', 'CBT-I', 'depression', 'cognition', 'dementia', 'HSDD', 'testosterone', 'libido']
  },
  {
    id: 'm8', slug: 'complex-comorbidities', number: 8, title: 'Complex comorbidities', category: 'Special populations',
    blurb: 'CVD, VTE, diabetes, obesity, migraine, renal and liver disease.',
    oneMinute: [
      'HT is not FDA approved for primary or secondary CVD prevention.',
      'Higher absolute CHD/VTE/stroke risks when initiated >60 or >10 years from menopause.',
      'Avoid systemic HT with established CVD or high CVD risk.',
      'Prior VTE: oral HT contraindicated; nonhormone first; transdermal with hematology if needed.',
      'Family history of VTE → consider thrombophilia evaluation before systemic HT.',
      'HT reduces new-onset type 2 DM (greater with oral) — not an indication.',
      'Fluctuating estrogen worsens migraine; stable low-dose transdermal may help.'
    ],
    decisionRules: ['Local vaginal ET may be considered with CVD, stroke or VTE history (minimal absorption).'],
    tables: [],
    traps: ['HT to prevent MI.', 'Oral HT after DVT.'],
    pearls: [
      { text: 'KEEPS/ELITE: favorable biomarkers with early initiation, underpowered for events.', factId: 'f-cvd' },
      { text: '3–10% weight loss improves BP, lipids, glucose and fatty liver.', factId: 'f-weight' }
    ],
    interpretiveNotes: ['ESRD: increased risk of early menopause; HT associated with slight increase in AV access thrombosis (A–Z deck).'],
    factIds: ['f-cvd', 'f-vte-history', 'f-diabetes', 'f-weight'],
    references: [{ sourceId: 'ht2022', section: 'Cardiovascular disease' }, { sourceId: 'az2024', section: 'Hormone therapy in complex patients' }],
    status: 'draft', lastReviewed: null,
    keywords: ['CVD', 'VTE', 'diabetes', 'obesity', 'migraine', 'thrombophilia', 'comorbidity']
  },
  {
    id: 'm9', slug: 'osteoporosis-aging', number: 9, title: 'Osteoporosis & healthy aging', category: 'Organ systems',
    blurb: 'Screening, diagnosis, calcium/D, drug classes, holidays, sequencing.',
    oneMinute: [
      'Estrogen deficiency → ↑ RANKL → osteoclast activation; ~2%/y loss across the transition for several years.',
      'DXA at ≥65; earlier with risk factors or when discontinuing estrogen.',
      'Diagnosis: T ≤ −2.5 (LS, FN, TH, or 1/3 radius) OR hip/vertebral fragility fracture OR osteopenia + certain fractures/high FRAX.',
      'Calcium ~1,200 mg/d total (diet preferred); vitamin D 600 IU ≤70, 800 IU >70.',
      'Treat if: hip/vertebral fracture; T ≤ −2.5; osteopenia with FRAX hip ≥3% or major ≥20%.',
      'Bisphosphonate holiday after 3–5 y only if low/moderate risk.',
      'Never stop denosumab without follow-on therapy (rebound vertebral fractures).',
      'Very high risk → anabolic first, then antiresorptive.'
    ],
    decisionRules: [
      'Still high risk after 3–5 y bisphosphonate → continue or switch to denosumab/anabolic.',
      'Stopping denosumab → transition to bisphosphonate.',
      'Romosozumab: avoid with high CV risk.'
    ],
    tables: [
      {
        title: 'Drug classes',
        columns: ['Class', 'Agent (dose)', 'Key point'],
        rows: [
          ['Oral bisphosphonates', 'Alendronate 70 mg/wk; risedronate 35 mg/wk or 150 mg/mo; ibandronate 150 mg/mo', 'Fasting + water + upright 30 min (DR risedronate: after breakfast); ibandronate vertebral only; avoid CrCl <35'],
          ['IV bisphosphonate', 'Zoledronic acid 5 mg yearly (q2y for prevention)', 'Acute-phase reaction after 1st dose; CrCl ≥35; holiday after 3 y if moderate risk'],
          ['RANKL inhibitor', 'Denosumab 60 mg SC q6mo', '↓ vertebral 68%, hip 40%; rebound on stopping; boxed warning: severe hypocalcemia in advanced CKD'],
          ['PTH/PTHrP analogs', 'Teriparatide 20 µg, abaloparatide 80 µg SC daily', 'Anabolic; first doses seated (orthostasis); avoid Paget, prior skeletal radiation, ↑ alk phos; follow with antiresorptive'],
          ['Sclerostin inhibitor', 'Romosozumab 210 mg SC monthly × 12', 'Anabolic + antiresorptive; CV warning'],
          ['EAA (SERM)', 'Raloxifene 60 mg daily', 'Vertebral (not hip) fractures; ↓ invasive ER+ breast cancer; ↑ VTE, hot flashes, leg cramps; stop 72 h before immobilization'],
          ['Calcium', 'Carbonate with meals; citrate any time', 'Citrate with PPIs, achlorhydria, bariatric surgery'],
          ['Estrogen ± progestogen/BZA', 'HT', 'Prevention only (not treatment)']
        ]
      },
      {
        title: 'Diagnostic categories (T-score)',
        columns: ['Category', 'T-score'],
        rows: [['Normal', '≥ −1.0'], ['Low bone mass', 'between −1.0 and −2.5'], ['Osteoporosis', '≤ −2.5']]
      }
    ],
    traps: [
      'Removing the osteoporosis diagnosis after BMD improves.',
      'Drug holiday for a patient still at high risk.',
      'Stopping denosumab abruptly.',
      'Calcium above 1,200 mg for women with osteoporosis.'
    ],
    pearls: [
      { text: 'After stopping estrogen, BMD returns to baseline within ~1–2 years.', factId: 'f-ht-bone' },
      { text: 'FRAX underestimates risk in fallers; does not include falls or diabetes.', factId: 'f-dxa' },
      { text: 'Thigh/groin pain on antiresorptives → image for atypical femoral fracture.', factId: 'f-bisphos' }
    ],
    interpretiveNotes: ['ACOG CPG 1 uses FRAX major osteoporotic fracture ≥8.4% as a trigger for earlier DXA; NAMS lists clinical risk factors.'],
    factIds: ['f-dxa', 'f-tscore', 'f-calcium', 'f-ht-bone', 'f-bisphos', 'f-denosumab', 'f-anabolic'],
    references: [{ sourceId: 'osteo2021' }, { sourceId: 'acog-cpg1' }],
    status: 'draft', lastReviewed: null,
    keywords: ['osteoporosis', 'DXA', 'T-score', 'FRAX', 'bisphosphonate', 'denosumab', 'teriparatide', 'romosozumab', 'calcium', 'vitamin D']
  },
  {
    id: 'm10', slug: 'cancer-special-populations', number: 10, title: 'Cancer & special populations', category: 'Special populations',
    blurb: 'Breast and endometrial survivors, BRCA, POI, surgical menopause.',
    oneMinute: [
      'Breast cancer survivors: nonhormone first; low-dose vaginal ET or DHEA for refractory GSM with oncology; systemic HT only for compelling reasons with oncology.',
      'Aromatase inhibitors → more severe GSM than tamoxifen.',
      'BRCA carriers post-RRBSO without breast cancer: HT appears to retain benefit with minimal/no ↑ breast cancer risk (observational).',
      'POI/early menopause: HT at least until ~52; higher doses may be needed; WHI does not apply.',
      'Low-dose vaginal ET does not increase endometrial cancer risk; avoid HT with high-grade/advanced endometrial cancer, ESS, leiomyosarcoma.',
      'Hyperplasia with atypia: ~28% progression vs <5% without; LNG-IUS has higher regression than oral progestins.'
    ],
    decisionRules: [
      'On tamoxifen + VMS → avoid paroxetine/fluoxetine.',
      'Ospemifene not approved in the US for women with a breast cancer history.'
    ],
    tables: [],
    traps: [
      'Withholding HT from POI because of WHI risks.',
      'Systemic HT as first-line in a breast cancer survivor.',
      'Assuming HT negates the breast cancer reduction from RRBSO.'
    ],
    pearls: [
      { text: 'RRBSO before 45 ↓ breast cancer risk ~50–55%; HT does not negate it.', factId: 'f-brca' },
      { text: 'ACOG supports vaginal estrogen for refractory GSM in breast cancer survivors with oncology input.', factId: 'f-breast-survivor-gsm' }
    ],
    interpretiveNotes: ['Data for HT after breast or endometrial cancer are largely observational; individualize.'],
    factIds: ['f-breast-survivor-gsm', 'f-brca', 'f-poi-ht', 'f-endometrial-survivor', 'f-ssri-tamoxifen'],
    references: [{ sourceId: 'ht2022', section: 'Summary' }, { sourceId: 'gsm2020', section: 'Breast cancer' }, { sourceId: 'acog-co659' }],
    status: 'draft', lastReviewed: null,
    keywords: ['breast cancer', 'BRCA', 'POI', 'endometrial cancer', 'survivor', 'aromatase inhibitor', 'RRBSO', 'surgical menopause']
  }
];

export const moduleById = Object.fromEntries(modules.map((m) => [m.id, m])) as Record<string, typeof modules[number]>;
export const moduleBySlug = Object.fromEntries(modules.map((m) => [m.slug, m])) as Record<string, typeof modules[number]>;
