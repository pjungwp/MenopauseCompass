import type { Topic } from './types';

/** Patient topic hubs. Plain language, ~6th–8th grade reading level target. */
export const topics: Topic[] = [
  {
    id: 'hot-flashes',
    slug: 'hot-flashes',
    title: 'Hot flashes & night sweats',
    blurb: 'Why they happen, how long they last, and what helps.',
    icon: 'Flame',
    featured: true,
    shortAnswer:
      'Hot flashes are sudden waves of heat, often with sweating and a racing heart. They start in the brain\'s temperature center as estrogen falls. They can last many years, and there are effective treatments with and without hormones.',
    whatItIs: [
      'A hot flash is a sudden feeling of heat in the face, neck and chest. It may come with sweating, flushing, chills afterward, or a fast heartbeat. At night they are called night sweats.',
      'Up to 8 in 10 people have them around menopause. They often last 7 years or longer, and about 1 in 3 people have them for more than 10 years.'
    ],
    symptoms: ['Sudden warmth in the upper body', 'Sweating or flushing', 'Chills after the heat passes', 'Waking up soaked or hot', 'Racing heartbeat or anxiety during a flash'],
    options: [
      { name: 'Hormone therapy', what: 'Estrogen (with a progestogen if you have a uterus).', goodFor: 'The most effective treatment for moderate to severe hot flashes.', consider: 'Best studied for healthy people under 60 or within 10 years of menopause.' },
      { name: 'Nonhormone prescriptions', what: 'Certain antidepressants, gabapentin, oxybutynin, or newer brain-targeted medicines.', goodFor: 'People who cannot or prefer not to use hormones.', consider: 'Each has its own side effects; some interact with tamoxifen.' },
      { name: 'CBT or clinical hypnosis', what: 'Structured mind–body programs with a trained clinician or app.', goodFor: 'Reducing how much hot flashes bother you (CBT) or how often they happen (hypnosis).', consider: 'No medicine side effects; takes several weeks of practice.' },
      { name: 'Weight loss', what: 'Gradual, sustainable weight loss if you carry extra weight.', goodFor: 'May reduce hot flashes and improves heart health.', consider: 'Evidence is more limited than for medicines.' }
    ],
    myths: [
      { myth: 'Hot flashes only last a year or two.', fact: 'Many people have them for 7–10 years or more.' },
      { myth: 'Herbal supplements like black cohosh are a safe natural cure.', fact: 'Studies have not shown they work better than placebo, and supplements are not checked for purity or dose.' },
      { myth: 'Breathing exercises will stop hot flashes.', fact: 'Paced breathing was not shown to reduce hot flashes, though it may help you feel calmer.' }
    ],
    seeClinician: ['Hot flashes disrupt your sleep, work or relationships', 'You have fever, weight loss or night sweats with other new symptoms', 'Hot flashes begin before age 40'],
    factIds: ['f-vms-burden', 'f-kndy', 'f-ht-most-effective', 'f-nh-recommended', 'f-nh-not-recommended'],
    synonyms: ['VMS', 'vasomotor', 'hot flushes', 'night sweats', 'sweating']
  },
  {
    id: 'hormone-therapy',
    slug: 'hormone-therapy',
    title: 'Hormone therapy',
    blurb: 'Benefits, risks, timing and the 2025–26 FDA label change.',
    icon: 'Pill',
    featured: true,
    shortAnswer:
      'Hormone therapy (HT, sometimes called HRT) is the most effective treatment for hot flashes and also helps vaginal dryness and bone health. For many healthy people under 60 or within 10 years of their last period, benefits outweigh risks. The right choice depends on your health history.',
    whatItIs: [
      'Hormone therapy replaces some of the estrogen your ovaries no longer make. If you still have a uterus, a progestogen is added to protect its lining.',
      'It comes as pills, skin patches, gels, sprays and vaginal rings. Low-dose vaginal products treat only vaginal and bladder symptoms.',
      'In 2025–2026 the FDA updated hormone therapy labels and removed several warnings from the "black box" — a sign that risks were overstated for many people. Individual risks still matter.'
    ],
    symptoms: [],
    options: [
      { name: 'Estrogen + progestogen', what: 'For people who still have a uterus.', goodFor: 'Hot flashes, night sweats, bone protection.', consider: 'The progestogen protects against uterine cancer.' },
      { name: 'Estrogen alone', what: 'For people who have had a hysterectomy.', goodFor: 'Same benefits; did not raise breast cancer risk in the major trial.', consider: 'Not for people with a uterus unless combined with protection.' },
      { name: 'Patch, gel or spray', what: 'Estrogen through the skin.', goodFor: 'May carry less risk of blood clots than pills.', consider: 'Skin irritation; avoid skin-to-skin transfer with gels and sprays.' },
      { name: 'Low-dose vaginal estrogen', what: 'Cream, tablet or ring placed in the vagina.', goodFor: 'Dryness, painful sex, bladder symptoms.', consider: 'Does not treat hot flashes; very little enters the bloodstream.' }
    ],
    myths: [
      { myth: 'Hormone therapy causes breast cancer in most people who use it.', fact: 'Any added risk with combined therapy is small — fewer than 1 extra case per 1,000 people per year. Estrogen alone did not increase it in the major trial.' },
      { myth: 'You must stop at 60 or 65.', fact: 'There is no automatic stop age. Review the decision with your clinician regularly.' },
      { myth: 'Compounded "bioidentical" hormones are safer.', fact: 'FDA-approved products include bioidentical estradiol and progesterone, and they are tested for dose and purity. Compounded products are not proven safer.' }
    ],
    seeClinician: ['Any vaginal bleeding after menopause, on or off hormones', 'Leg swelling, chest pain, sudden shortness of breath or stroke symptoms (emergency)', 'A new breast lump', 'Side effects that do not settle after 2–3 months'],
    factIds: ['f-ht-most-effective', 'f-timing', 'f-progestogen', 'f-route', 'f-contraindications', 'f-fda-label', 'f-breast-risk', 'f-compounded', 'f-duration'],
    synonyms: ['HRT', 'MHT', 'estrogen', 'hormones', 'HT']
  },
  {
    id: 'nonhormonal',
    slug: 'nonhormonal-options',
    title: 'Nonhormonal options',
    blurb: 'Proven alternatives if you cannot or prefer not to use hormones.',
    icon: 'Leaf',
    shortAnswer:
      'Several nonhormonal treatments reduce hot flashes, including certain antidepressants, gabapentin, oxybutynin, newer brain-targeted medicines, CBT and clinical hypnosis. Many popular supplements have not been shown to work.',
    whatItIs: [
      'Nonhormonal options are especially important for people with a history of breast cancer, blood clots, heart disease or stroke — or anyone who simply prefers not to take hormones.',
      'Prescription options usually start working within about 2 weeks.'
    ],
    symptoms: [],
    options: [
      { name: 'Low-dose SSRIs/SNRIs', what: 'Paroxetine 7.5 mg (FDA approved), venlafaxine, escitalopram and others.', goodFor: 'Hot flashes, and mood if needed.', consider: 'Some interact with tamoxifen — tell your clinician.' },
      { name: 'Gabapentin', what: 'Taken at bedtime.', goodFor: 'Night sweats and sleep.', consider: 'Dizziness or drowsiness at first.' },
      { name: 'Fezolinetant or elinzanetant', what: 'Newer pills that act on the brain\'s temperature center.', goodFor: 'Moderate to severe hot flashes.', consider: 'Fezolinetant needs liver blood tests during the first months.' },
      { name: 'Oxybutynin', what: 'A bladder medicine.', goodFor: 'Hot flashes, especially with overactive bladder.', consider: 'Dry mouth; may affect memory in older adults with long-term use.' },
      { name: 'CBT and hypnosis', what: 'Skills-based programs.', goodFor: 'Reducing bother (CBT) or frequency (hypnosis).', consider: 'No drug side effects.' }
    ],
    myths: [
      { myth: 'Black cohosh, soy and evening primrose work as well as medicine.', fact: 'Good studies do not show a reliable benefit. Some supplements can harm the liver.' },
      { myth: 'Acupuncture and yoga cure hot flashes.', fact: 'They have not been shown to reduce hot flashes more than placebo, though yoga and exercise help overall health.' }
    ],
    seeClinician: ['You take tamoxifen and want to start a medicine for hot flashes', 'On fezolinetant: yellow skin or eyes, dark urine or belly pain'],
    factIds: ['f-nh-recommended', 'f-nh-not-recommended', 'f-ssri-tamoxifen', 'f-gabapentin', 'f-nk-antagonists', 'f-oxybutynin'],
    synonyms: ['non-hormonal', 'alternatives', 'natural', 'without hormones']
  },
  {
    id: 'perimenopause',
    slug: 'perimenopause',
    title: 'Perimenopause basics',
    blurb: 'What changes, when, and whether you need tests.',
    icon: 'CalendarClock',
    featured: true,
    shortAnswer:
      'Perimenopause is the transition before your final period, often starting in your 40s. Periods become irregular and symptoms like hot flashes, sleep problems and mood changes may begin. Menopause is confirmed after 12 months without a period.',
    whatItIs: [
      'Menopause usually happens between 45 and 55 — the average is about 51–52. Perimenopause can last several years before that.',
      'Most people do not need a blood test to diagnose it. Hormone levels change day to day; your age, periods and symptoms are the best guide.',
      'You can still get pregnant during perimenopause, so keep using contraception until your clinician says you no longer need it.'
    ],
    symptoms: ['Irregular periods (shorter, longer, heavier or lighter)', 'Hot flashes and night sweats', 'Sleep trouble', 'Mood changes or anxiety', 'Vaginal dryness', 'Brain fog'],
    options: [
      { name: 'Track your cycle and symptoms', what: 'A simple calendar or app.', goodFor: 'Helping your clinician see patterns.', consider: 'Bring it to your visit.' },
      { name: 'Birth control pills or IUD', what: 'Low-dose hormonal contraception or a hormonal IUD.', goodFor: 'Contraception plus control of irregular or heavy bleeding.', consider: 'Combined pills only for healthy nonsmokers without certain conditions.' }
    ],
    myths: [
      { myth: 'A blood test will tell me if I am in perimenopause.', fact: 'Hormone levels swing widely, so tests are usually not helpful after 45.' },
      { myth: 'I can\'t get pregnant once my periods are irregular.', fact: 'Pregnancy is still possible until menopause is confirmed.' }
    ],
    seeClinician: ['Periods stop before age 40', 'Very heavy bleeding, bleeding between periods or after sex', 'Symptoms affecting daily life'],
    factIds: ['f-straw', 'f-no-hormone-testing', 'f-contraception'],
    synonyms: ['perimenopause', 'transition', 'the change', 'irregular periods', 'menopause age']
  },
  {
    id: 'vaginal-urinary',
    slug: 'vaginal-and-urinary-health',
    title: 'Vaginal & urinary health',
    blurb: 'Dryness, painful sex, urgency and repeated UTIs (GSM).',
    icon: 'Droplets',
    featured: true,
    shortAnswer:
      'Lower estrogen can thin vaginal and urinary tissues, causing dryness, burning, painful sex, urgency and repeated bladder infections. This is called genitourinary syndrome of menopause (GSM). It tends to worsen without treatment, and it is very treatable.',
    whatItIs: [
      'GSM affects up to 84% of people after menopause, yet many never mention it. You do not have to just live with it.',
      'Start with moisturizers and lubricants. If symptoms continue, low-dose vaginal estrogen, vaginal DHEA or an oral medicine (ospemifene) are effective. Low-dose vaginal estrogen does not require a progestogen.'
    ],
    symptoms: ['Vaginal dryness, burning or itching', 'Pain with sex', 'Light bleeding after sex', 'Needing to urinate urgently or often', 'Repeated bladder infections'],
    options: [
      { name: 'Vaginal moisturizer', what: 'Used 2–3 times a week, regardless of sex.', goodFor: 'Everyday dryness.', consider: 'Over the counter.' },
      { name: 'Lubricant', what: 'Water- or silicone-based, at the time of sex.', goodFor: 'Reducing friction and pain.', consider: 'Oil-based products can damage condoms.' },
      { name: 'Low-dose vaginal estrogen', what: 'Cream, tablet/insert or low-dose ring.', goodFor: 'Moderate to severe dryness, pain and urinary symptoms.', consider: 'Up to 12 weeks for full effect; can be used long term.' },
      { name: 'Vaginal DHEA or ospemifene', what: 'Nightly insert or daily pill.', goodFor: 'Painful sex due to menopause.', consider: 'Alternatives when estrogen is not preferred.' },
      { name: 'Pelvic floor therapy, dilators', what: 'Physical therapy and gentle stretching tools.', goodFor: 'Tight or painful pelvic floor muscles.', consider: 'Often combined with other treatments.' }
    ],
    myths: [
      { myth: 'Vaginal estrogen is as risky as hormone pills.', fact: 'Very little is absorbed. You do not need a progestogen, and routine uterine biopsies are not needed.' },
      { myth: 'Vaginal laser is a proven fix.', fact: 'Lasers are not FDA approved for this, and good studies are lacking.' }
    ],
    seeClinician: ['Any bleeding after menopause', 'Symptoms not improving after 12 weeks of treatment', 'Burning with urination plus fever or back pain', 'A new lump, sore or skin change on the vulva'],
    factIds: ['f-gsm-def', 'f-gsm-firstline', 'f-vaginal-estrogen', 'f-gsm-other-rx', 'f-femring-estring', 'f-energy-devices', 'f-urinary', 'f-breast-survivor-gsm'],
    synonyms: ['GSM', 'vaginal dryness', 'vaginal atrophy', 'painful sex', 'UTI', 'bladder']
  },
  {
    id: 'sleep-mood',
    slug: 'sleep-mood-and-memory',
    title: 'Sleep, mood & memory',
    blurb: 'Insomnia, anxiety, low mood and brain fog.',
    icon: 'Moon',
    featured: true,
    shortAnswer:
      'Sleep problems, mood changes and brain fog are common in perimenopause. Cognitive behavioral therapy for insomnia (CBT-I) works well for sleep. Depression is more likely in this stage — especially if you have had it before — and it is treatable.',
    whatItIs: [
      'Night sweats, stress, sleep apnea and mood all affect sleep. Treating the cause helps.',
      'Brain fog is usually temporary. Hormone therapy is not recommended to prevent dementia, but heart-healthy habits, good sleep, activity and social connection protect the brain.'
    ],
    symptoms: ['Trouble falling or staying asleep', 'Irritability, anxiety or low mood', 'Forgetfulness or trouble concentrating', 'Loud snoring or daytime sleepiness'],
    options: [
      { name: 'CBT-I', what: 'A short, structured program for insomnia (in person or digital).', goodFor: 'Long-lasting sleep improvement.', consider: 'Works better long term than sleeping pills.' },
      { name: 'Treat night sweats', what: 'Hormonal or nonhormonal options.', goodFor: 'Sleep broken by sweats.', consider: 'Gabapentin at bedtime is one option.' },
      { name: 'Therapy and antidepressants', what: 'Talk therapy and/or medicine.', goodFor: 'Depression and anxiety.', consider: 'Some antidepressants also reduce hot flashes.' }
    ],
    myths: [{ myth: 'Estrogen treats depression after menopause.', fact: 'Estrogen is not approved for depression; antidepressants and therapy are first-line.' }],
    seeClinician: ['Low mood most days for 2 weeks or more', 'Loud snoring, gasping at night or falling asleep during the day', 'Memory problems that are getting worse or worry family members'],
    factIds: ['f-sleep', 'f-mood', 'f-cognition'],
    synonyms: ['insomnia', 'depression', 'anxiety', 'brain fog', 'memory']
  },
  {
    id: 'bones',
    slug: 'bone-health',
    title: 'Bone health',
    blurb: 'Bone density scans, calcium, and fracture prevention.',
    icon: 'Bone',
    featured: true,
    shortAnswer:
      'Bone loss speeds up for several years around menopause. A bone density (DXA) scan is recommended at 65, or sooner with risk factors. Calcium from food, vitamin D, activity and fall prevention help, and effective medicines are available.',
    whatItIs: [
      'One in two women over 50 will break a bone due to osteoporosis in their lifetime.',
      'Osteoporosis often has no symptoms until a bone breaks. That is why screening matters.'
    ],
    symptoms: ['Usually none until a fracture', 'Loss of height or a stooped back', 'A bone broken from a minor fall'],
    options: [
      { name: 'Calcium and vitamin D', what: 'About 1,200 mg calcium/day, mostly from food; vitamin D 600–800 IU.', goodFor: 'Supporting bone health.', consider: 'More is not better; extra supplements raise kidney stone risk.' },
      { name: 'Exercise and fall prevention', what: 'Weight-bearing, strength and balance work (like tai chi); home safety.', goodFor: 'Reducing falls and fractures.', consider: 'Review medicines that cause dizziness.' },
      { name: 'Bone medicines', what: 'Bisphosphonates, denosumab, raloxifene, bone-building injections.', goodFor: 'Lowering fracture risk in osteoporosis.', consider: 'Do not stop denosumab without a plan.' },
      { name: 'Hormone therapy', what: 'Estrogen.', goodFor: 'Prevents bone loss while you take it.', consider: 'Bone loss resumes after stopping.' }
    ],
    myths: [
      { myth: 'More calcium supplements mean stronger bones.', fact: 'Above about 1,200 mg total per day there is no added benefit and more kidney stones.' },
      { myth: 'If my bone scan improves, I no longer have osteoporosis.', fact: 'The diagnosis stays; treatment is working.' }
    ],
    seeClinician: ['You break a bone from a minor fall', 'New thigh or groin pain while on a bone medicine', 'You are due or overdue for a denosumab injection'],
    factIds: ['f-dxa', 'f-tscore', 'f-calcium', 'f-ht-bone', 'f-bisphos', 'f-denosumab', 'f-anabolic'],
    synonyms: ['osteoporosis', 'DXA', 'bone density', 'fracture', 'calcium']
  },
  {
    id: 'heart-metabolic',
    slug: 'heart-and-metabolism',
    title: 'Heart, weight & metabolism',
    blurb: 'Heart risk, blood clots, diabetes and weight changes.',
    icon: 'HeartPulse',
    shortAnswer:
      'Heart disease is the leading cause of death in women, and risk rises after menopause. Hormone therapy is not used to prevent heart disease, but for healthy people who start it before 60 it does not appear to raise heart risk. Blood pressure, cholesterol, blood sugar, activity and weight matter most.',
    whatItIs: [
      'Midlife is a key time to check blood pressure, cholesterol and blood sugar.',
      'Weight often shifts toward the belly. Losing even 3–10% of body weight improves heart and metabolic health.'
    ],
    symptoms: [],
    options: [
      { name: 'Screen and treat risk factors', what: 'Blood pressure, cholesterol, diabetes, smoking.', goodFor: 'Lowering heart and stroke risk.', consider: 'Ask your clinician what is due.' },
      { name: 'Nonhormonal options if you have had a clot', what: 'Several effective medicines for hot flashes.', goodFor: 'People with clot history.', consider: 'Vaginal estrogen is often still possible.' }
    ],
    myths: [{ myth: 'Hormone therapy prevents heart attacks.', fact: 'It is not used for that purpose.' }],
    seeClinician: ['Chest pain, shortness of breath, one-sided weakness or trouble speaking — call 911', 'A personal or family history of blood clots before starting hormones'],
    factIds: ['f-cvd', 'f-vte-history', 'f-diabetes', 'f-weight', 'f-preventive'],
    synonyms: ['heart', 'cholesterol', 'blood clot', 'weight', 'diabetes']
  },
  {
    id: 'sexual-health',
    slug: 'sexual-health',
    title: 'Sexual health',
    blurb: 'Desire, arousal and comfort — what helps.',
    icon: 'Heart',
    shortAnswer:
      'Changes in desire, arousal and comfort are common in midlife. Treating dryness and pain often helps desire, too. Relationship, mood, stress and medicines all play a role, and there are medical options when needed.',
    whatItIs: [
      'Nearly half of women aged 45–64 report low desire at some point. It is only a problem if it bothers you.',
      'Blood testosterone levels do not diagnose low desire. A clinician makes the diagnosis by talking with you.'
    ],
    symptoms: ['Less interest in sex', 'Pain or dryness with sex', 'Difficulty with arousal or orgasm'],
    options: [
      { name: 'Treat dryness and pain first', what: 'Lubricants, moisturizers, vaginal estrogen or DHEA.', goodFor: 'Pain-related loss of desire.', consider: 'Pelvic floor therapy can help too.' },
      { name: 'Sex therapy or counseling', what: 'Individual or couples.', goodFor: 'Desire and relationship factors.', consider: 'Often very effective.' },
      { name: 'Low-dose testosterone (off-label)', what: 'Prescribed by a clinician for selected postmenopausal people.', goodFor: 'Distressing low desire.', consider: 'No FDA-approved product for women; levels are monitored.' }
    ],
    myths: [{ myth: 'A testosterone blood test can show if my libido is low.', fact: 'Low desire is diagnosed by symptoms, not a lab value.' }],
    seeClinician: ['Pain with sex that does not improve', 'Bleeding after sex', 'Changes that cause you distress'],
    factIds: ['f-hsdd', 'f-gsm-firstline', 'f-vaginal-estrogen'],
    synonyms: ['libido', 'sex drive', 'painful sex', 'desire', 'intimacy']
  },
  {
    id: 'bleeding',
    slug: 'bleeding-changes',
    title: 'Bleeding changes',
    blurb: 'What is normal in perimenopause — and when to get checked.',
    icon: 'AlertCircle',
    shortAnswer:
      'Irregular periods are common in perimenopause, but very heavy bleeding or bleeding between periods should be checked. Any bleeding after menopause — even light spotting — always needs evaluation.',
    whatItIs: [
      'After 12 months without a period, any new bleeding is called postmenopausal bleeding. Most causes are not cancer, but about 9 in 10 uterine cancers first show up as bleeding, so early checks matter.',
      'Evaluation is usually an ultrasound and/or a small sample of the uterine lining.'
    ],
    symptoms: ['Spotting or bleeding after menopause', 'Very heavy or long periods', 'Bleeding between periods or after sex'],
    options: [
      { name: 'Evaluation', what: 'Ultrasound and/or endometrial biopsy.', goodFor: 'Finding the cause.', consider: 'Usually done in the office.' },
      { name: 'Hormonal IUD', what: 'Levonorgestrel IUD.', goodFor: 'Heavy perimenopausal bleeding; also contraception.', consider: 'Can protect the uterus if estrogen is added later.' }
    ],
    myths: [{ myth: 'A little spotting after menopause is normal.', fact: 'Any bleeding after menopause should be checked.' }],
    seeClinician: ['Any bleeding after menopause', 'Soaking a pad or tampon every hour for several hours', 'Feeling dizzy or faint with bleeding — seek urgent care'],
    factIds: ['f-pmb', 'f-peri-aub', 'f-endometrial-survivor'],
    synonyms: ['spotting', 'postmenopausal bleeding', 'heavy periods', 'AUB']
  },
  {
    id: 'early-menopause',
    slug: 'early-or-surgical-menopause',
    title: 'Early or surgical menopause',
    blurb: 'POI, ovaries removed, BRCA — and why hormones are often advised.',
    icon: 'Sparkles',
    shortAnswer:
      'Menopause before 40 (primary ovarian insufficiency) or 45 (early menopause), or after surgery to remove both ovaries, brings longer years without estrogen. Hormone therapy is generally recommended at least until about 52 unless there is a reason not to use it.',
    whatItIs: [
      'Early estrogen loss raises long-term risks for bone loss, heart disease and memory problems. Treatment can lower these risks.',
      'Large hormone therapy studies in older women do not apply to people with early menopause.'
    ],
    symptoms: ['Periods stopping before 40–45', 'Sudden, intense hot flashes after ovary removal'],
    options: [
      { name: 'Hormone therapy until ~52', what: 'Estrogen (plus progestogen if you have a uterus); sometimes birth control pills.', goodFor: 'Symptoms and long-term health protection.', consider: 'Doses may need to be higher than in typical menopause.' }
    ],
    myths: [{ myth: 'Hormone therapy is too risky at any age.', fact: 'For early menopause, replacing estrogen until the usual age of menopause is generally recommended.' }],
    seeClinician: ['Periods stop before age 40', 'You are planning risk-reducing surgery for BRCA'],
    factIds: ['f-poi-def', 'f-poi-ht', 'f-brca'],
    synonyms: ['POI', 'premature menopause', 'surgical menopause', 'oophorectomy', 'BRCA']
  }
];

export const topicById = Object.fromEntries(topics.map((t) => [t.id, t])) as Record<string, Topic>;
export const topicBySlug = Object.fromEntries(topics.map((t) => [t.slug, t])) as Record<string, Topic>;
