import type { FAQ } from './types';

type FAQInput = Omit<FAQ, 'locale' | 'synonyms' | 'relatedFaqIds' | 'nextSteps'> &
  Partial<Pick<FAQ, 'synonyms' | 'relatedFaqIds' | 'nextSteps'>>;
const q = (x: FAQInput): FAQ => ({ locale: 'en', synonyms: [], relatedFaqIds: [], nextSteps: [], ...x });

const URGENT_BLEED = 'Any bleeding after menopause needs evaluation. If bleeding is heavy or you feel faint, seek urgent care.';

export const faqs: FAQ[] = [
  q({
    id: 'q-is-ht-safe', slug: 'is-hormone-therapy-safe', popular: true,
    question: 'Is hormone therapy safe?',
    conciseAnswer:
      'For most healthy people under 60, or within 10 years of their last period, the benefits of hormone therapy for bothersome symptoms outweigh the risks. Risks depend on your age, health history, the type of hormone and how you take it.',
    detailsBlocks: [
      { heading: 'What the evidence shows', body: 'The added risks of blood clots, stroke and breast cancer with hormone therapy are rare in people who start it early in menopause — fewer than 10 extra events per 10,000 people per year. Estrogen through the skin may carry less clot risk than pills.' },
      { heading: 'The 2025–2026 label change', body: 'The FDA removed warnings about heart disease, breast cancer and dementia from the "black box" on hormone therapy labels. A boxed warning about uterine cancer remains for estrogen-only products in people who still have a uterus.' },
      { heading: 'When hormone therapy is usually avoided', body: 'Unexplained vaginal bleeding, a history of breast or other estrogen-sensitive cancer, heart attack, stroke, blood clots, or active liver disease.' }
    ],
    nextSteps: ['List your symptoms and health history before your visit', 'Ask about pills versus patches, gels or sprays', 'Ask about nonhormonal options if hormones are not right for you'],
    relatedFaqIds: ['q-black-box', 'q-breast-cancer-risk', 'q-how-long-ht'],
    topicIds: ['hormone-therapy'],
    sourceFactIds: ['f-ht-most-effective', 'f-timing', 'f-contraindications', 'f-fda-label'],
    synonyms: ['HRT safe', 'are hormones dangerous', 'MHT risks']
  }),
  q({
    id: 'q-black-box', slug: 'what-changed-black-box-warning', popular: true,
    question: 'What changed with the "black box" warning on hormone therapy?',
    conciseAnswer:
      'In 2025–2026 the FDA removed statements about heart disease, breast cancer and probable dementia from the boxed warning on hormone therapy labels. A boxed warning about uterine cancer stays for estrogen-only products used by people who still have a uterus.',
    detailsBlocks: [
      { body: 'The FDA also removed the advice to use "the lowest dose for the shortest time." Information about heart disease and breast cancer is still in the label, just not in the boxed warning. The change reflects evidence that risks were overstated for many people starting therapy around menopause.' },
      { body: 'Labels are being updated product by product. Your clinician can review the current label for your specific medicine.' }
    ],
    nextSteps: ['Ask your clinician how the update applies to you'],
    relatedFaqIds: ['q-is-ht-safe', 'q-how-long-ht'],
    topicIds: ['hormone-therapy'],
    sourceFactIds: ['f-fda-label'],
    synonyms: ['boxed warning', 'FDA warning removed', 'label change 2025']
  }),
  q({
    id: 'q-how-long-hot-flashes', slug: 'how-long-do-hot-flashes-last', popular: true,
    question: 'How long do hot flashes last?',
    conciseAnswer:
      'Hot flashes often last 7 years or more. About 1 in 3 people have them for more than 10 years, and some longer. If they bother you, treatment can help at any point.',
    detailsBlocks: [{ body: 'Hot flashes that begin earlier in the transition tend to last longer. They come from changes in the brain\'s temperature control center as estrogen falls.' }],
    nextSteps: ['Track how often they happen and how much they bother you', 'Ask about hormonal and nonhormonal treatments'],
    relatedFaqIds: ['q-best-hot-flash-treatment', 'q-nonhormonal'],
    topicIds: ['hot-flashes'],
    sourceFactIds: ['f-vms-burden', 'f-kndy'],
    synonyms: ['when will hot flashes stop', 'night sweats duration']
  }),
  q({
    id: 'q-best-hot-flash-treatment', slug: 'what-is-the-best-treatment-for-hot-flashes',
    question: 'What is the most effective treatment for hot flashes?',
    conciseAnswer:
      'Hormone therapy is the most effective treatment. Effective nonhormonal options include certain antidepressants (SSRIs/SNRIs), gabapentin, oxybutynin, newer brain-targeted medicines (fezolinetant and elinzanetant), CBT and clinical hypnosis.',
    detailsBlocks: [{ body: 'The best choice for you depends on your health history, other symptoms (like sleep or mood), and your preferences.' }],
    nextSteps: ['Bring a list of your medicines — some interact with hot flash treatments'],
    relatedFaqIds: ['q-is-ht-safe', 'q-nonhormonal', 'q-supplements'],
    topicIds: ['hot-flashes', 'hormone-therapy', 'nonhormonal'],
    sourceFactIds: ['f-ht-most-effective', 'f-nh-recommended']
  }),
  q({
    id: 'q-nonhormonal', slug: 'nonhormonal-options-for-hot-flashes', popular: true,
    question: 'What can I take for hot flashes if I can\'t use hormones?',
    conciseAnswer:
      'Proven nonhormonal options include low-dose paroxetine and other SSRIs/SNRIs, gabapentin, oxybutynin, fezolinetant or elinzanetant, cognitive behavioral therapy and clinical hypnosis. Weight loss may also help.',
    detailsBlocks: [
      { heading: 'If you take tamoxifen', body: 'Paroxetine and fluoxetine can make tamoxifen less effective. Venlafaxine, desvenlafaxine, escitalopram or citalopram are safer choices.' },
      { heading: 'Fezolinetant liver monitoring', body: 'Fezolinetant requires liver blood tests before starting, monthly for the first 3 months, and again at 6 and 9 months.' }
    ],
    nextSteps: ['Tell your clinician about any cancer history and current medicines'],
    relatedFaqIds: ['q-supplements', 'q-best-hot-flash-treatment'],
    topicIds: ['nonhormonal', 'hot-flashes'],
    sourceFactIds: ['f-nh-recommended', 'f-ssri-tamoxifen', 'f-nk-antagonists', 'f-gabapentin'],
    synonyms: ['non hormonal', 'alternatives to HRT', 'Veozah', 'without estrogen']
  }),
  q({
    id: 'q-supplements', slug: 'do-supplements-help-hot-flashes',
    question: 'Do black cohosh, soy or other supplements help hot flashes?',
    conciseAnswer:
      'Good-quality studies have not shown that supplements or herbs reliably reduce hot flashes. Supplements are not regulated for purity or dose, and some (like black cohosh) can affect the liver.',
    detailsBlocks: [{ body: 'Other approaches not shown to reduce hot flashes include paced breathing, cooling products, acupuncture, yoga and avoiding triggers. Exercise and yoga are still excellent for overall health.' }],
    nextSteps: ['Tell your clinician about any supplements you take'],
    relatedFaqIds: ['q-nonhormonal'],
    topicIds: ['nonhormonal', 'hot-flashes'],
    sourceFactIds: ['f-nh-not-recommended'],
    synonyms: ['natural remedies', 'herbs', 'evening primrose', 'acupuncture']
  }),
  q({
    id: 'q-breast-cancer-risk', slug: 'does-hormone-therapy-cause-breast-cancer', popular: true,
    question: 'Does hormone therapy cause breast cancer?',
    conciseAnswer:
      'Combined estrogen-plus-progestogen therapy may slightly increase breast cancer risk — fewer than 1 extra case per 1,000 people per year. Estrogen alone (for people without a uterus) did not increase breast cancer in the largest trial.',
    detailsBlocks: [{ body: 'This added risk is similar in size to other common factors, like drinking two alcoholic drinks a day, obesity or inactivity. Your personal and family history matter, so discuss them with your clinician.' }],
    nextSteps: ['Keep up with breast cancer screening', 'Share your family history of cancer'],
    relatedFaqIds: ['q-is-ht-safe', 'q-breast-survivor-dryness'],
    topicIds: ['hormone-therapy'],
    sourceFactIds: ['f-breast-risk']
  }),
  q({
    id: 'q-how-long-ht', slug: 'how-long-can-i-take-hormone-therapy',
    question: 'How long can I stay on hormone therapy?',
    conciseAnswer:
      'There is no set age at which you must stop. Many people continue as long as benefits outweigh risks, reviewing the decision with their clinician at least yearly.',
    detailsBlocks: [{ body: 'If you stop, hot flashes may return and bone loss restarts. Some people taper slowly. Low-dose vaginal estrogen can be used as long as you need it.' }],
    nextSteps: ['Review your treatment goals each year'],
    relatedFaqIds: ['q-is-ht-safe', 'q-bone-scan'],
    topicIds: ['hormone-therapy'],
    sourceFactIds: ['f-duration', 'f-ht-bone'],
    synonyms: ['stop HRT', 'age 65 hormones', 'coming off hormones']
  }),
  q({
    id: 'q-bioidentical', slug: 'are-bioidentical-hormones-safer',
    question: 'Are "bioidentical" or compounded hormones safer?',
    conciseAnswer:
      '"Bioidentical" is a marketing term. FDA-approved options like estradiol patches and micronized progesterone are chemically identical to your own hormones and are tested for dose and purity. Custom-compounded hormones and pellets are not proven safer and are not recommended for routine use.',
    detailsBlocks: [{ body: 'Saliva tests used to "customize" compounded hormones are not reliable.' }],
    relatedFaqIds: ['q-is-ht-safe', 'q-blood-test'],
    topicIds: ['hormone-therapy'],
    sourceFactIds: ['f-compounded', 'f-no-hormone-testing'],
    synonyms: ['BHRT', 'pellets', 'natural hormones', 'compounded']
  }),
  q({
    id: 'q-patch-vs-pill', slug: 'patch-or-pill',
    question: 'Is a patch, gel or spray better than a pill?',
    conciseAnswer:
      'Both work equally well for hot flashes. Estrogen through the skin skips the liver and may carry less risk of blood clots and stroke than pills, which matters for some people.',
    detailsBlocks: [{ body: 'Your clinician may recommend a skin product if you have risk factors such as higher weight, migraines, high triglycerides, or low sex drive.' }],
    relatedFaqIds: ['q-is-ht-safe'],
    topicIds: ['hormone-therapy'],
    sourceFactIds: ['f-route'],
    synonyms: ['transdermal', 'estradiol patch', 'oral estrogen']
  }),
  q({
    id: 'q-need-progesterone', slug: 'do-i-need-progesterone',
    question: 'Why do I need a progestogen with estrogen?',
    conciseAnswer:
      'If you still have a uterus, estrogen pills, patches, gels or sprays can thicken the uterine lining and raise the risk of uterine cancer. A progestogen (or a combination product) protects against that. You do not need one with low-dose vaginal estrogen.',
    detailsBlocks: [{ body: 'Options include micronized progesterone capsules, combination pills or patches, or a hormonal IUD (used off-label for this purpose).' }],
    relatedFaqIds: ['q-vaginal-estrogen-safe'],
    topicIds: ['hormone-therapy'],
    sourceFactIds: ['f-progestogen'],
    synonyms: ['progesterone', 'progestin', 'uterus protection']
  }),
  q({
    id: 'q-vaginal-dryness', slug: 'what-helps-vaginal-dryness', popular: true,
    question: 'What helps vaginal dryness and painful sex?',
    conciseAnswer:
      'Start with a vaginal moisturizer 2–3 times a week and a lubricant during sex. If that is not enough, low-dose vaginal estrogen, a vaginal DHEA insert or an oral medicine called ospemifene work well.',
    detailsBlocks: [
      { body: 'These symptoms usually get worse over time without treatment, so it is worth bringing up. Pelvic floor physical therapy and dilators help if muscles are tight.' },
      { body: 'Vaginal laser treatments are not FDA approved for this and lack good evidence.' }
    ],
    nextSteps: ['Try a moisturizer and lubricant for a few weeks', 'Ask about vaginal estrogen if symptoms continue'],
    relatedFaqIds: ['q-vaginal-estrogen-safe', 'q-breast-survivor-dryness', 'q-utis'],
    topicIds: ['vaginal-urinary', 'sexual-health'],
    sourceFactIds: ['f-gsm-def', 'f-gsm-firstline', 'f-gsm-other-rx', 'f-energy-devices'],
    synonyms: ['vaginal atrophy', 'dyspareunia', 'GSM', 'dry vagina', 'pain during sex']
  }),
  q({
    id: 'q-vaginal-estrogen-safe', slug: 'is-vaginal-estrogen-safe',
    question: 'Is low-dose vaginal estrogen safe?',
    conciseAnswer:
      'Yes, for most people. Very little enters the bloodstream. You do not need a progestogen, routine uterine biopsies are not needed, and it can be used long term. It may also reduce repeated bladder infections.',
    detailsBlocks: [{ body: 'Report any vaginal bleeding to your clinician. If you have had breast or uterine cancer, decide together with your oncologist.' }],
    relatedFaqIds: ['q-vaginal-dryness', 'q-breast-survivor-dryness'],
    topicIds: ['vaginal-urinary'],
    sourceFactIds: ['f-vaginal-estrogen', 'f-urinary'],
    synonyms: ['estrogen cream', 'Vagifem', 'Estring', 'vaginal tablet']
  }),
  q({
    id: 'q-breast-survivor-dryness', slug: 'vaginal-dryness-after-breast-cancer',
    question: 'I had breast cancer. What can I use for vaginal dryness?',
    conciseAnswer:
      'Start with moisturizers and lubricants. If those are not enough, low-dose vaginal estrogen or vaginal DHEA may be possible — decide together with your oncologist, especially if you take an aromatase inhibitor.',
    detailsBlocks: [{ body: 'Pelvic floor physical therapy and dilators can also help. Systemic hormone therapy is generally not recommended after breast cancer.' }],
    relatedFaqIds: ['q-vaginal-dryness', 'q-nonhormonal'],
    topicIds: ['vaginal-urinary'],
    sourceFactIds: ['f-breast-survivor-gsm'],
    synonyms: ['cancer survivor', 'aromatase inhibitor', 'tamoxifen dryness']
  }),
  q({
    id: 'q-utis', slug: 'repeated-bladder-infections-after-menopause',
    question: 'Why do I keep getting bladder infections after menopause?',
    conciseAnswer:
      'Lower estrogen changes the vaginal and urinary tissues and their healthy bacteria, which can lead to repeated infections. Low-dose vaginal estrogen can lower that risk.',
    detailsBlocks: [{ body: 'Estrogen pills or patches do not treat urine leakage and may make stress leakage worse. Pelvic floor exercises help leakage.' }],
    relatedFaqIds: ['q-vaginal-estrogen-safe'],
    topicIds: ['vaginal-urinary'],
    sourceFactIds: ['f-urinary', 'f-gsm-def'],
    clinicalEscalationNotice: 'Burning with urination plus fever, chills, back pain or vomiting needs prompt care.',
    synonyms: ['UTI', 'recurrent UTI', 'urinary infection', 'leaking urine']
  }),
  q({
    id: 'q-bleeding-after-menopause', slug: 'bleeding-after-menopause', popular: true,
    question: 'I had spotting after menopause. Should I worry?',
    conciseAnswer:
      'Any bleeding after menopause — even a small amount, even once — should be checked by a clinician. Most causes are not serious, but early checks catch uterine cancer when it is most treatable.',
    detailsBlocks: [{ body: 'Evaluation usually involves an ultrasound and/or a small sample of the uterine lining. This applies whether or not you take hormones.' }],
    nextSteps: ['Call your clinician to schedule an evaluation'],
    relatedFaqIds: ['q-heavy-periods'],
    topicIds: ['bleeding'],
    sourceFactIds: ['f-pmb'],
    clinicalEscalationNotice: URGENT_BLEED,
    synonyms: ['postmenopausal bleeding', 'PMB', 'spotting', 'bleeding after menopause']
  }),
  q({
    id: 'q-heavy-periods', slug: 'heavy-irregular-periods-perimenopause',
    question: 'My periods are heavy and irregular. Is that normal in perimenopause?',
    conciseAnswer:
      'Irregular periods are common in perimenopause. Very heavy or prolonged bleeding, bleeding between periods, or bleeding after sex should be evaluated, and treatment can help.',
    detailsBlocks: [{ body: 'A hormonal (levonorgestrel) IUD can reduce heavy bleeding and also provides contraception.' }],
    relatedFaqIds: ['q-bleeding-after-menopause', 'q-pregnancy-perimenopause'],
    topicIds: ['bleeding', 'perimenopause'],
    sourceFactIds: ['f-peri-aub'],
    clinicalEscalationNotice: 'Soaking a pad or tampon every hour for several hours, or feeling dizzy or faint, needs urgent care.',
    synonyms: ['AUB', 'heavy bleeding', 'irregular cycles']
  }),
  q({
    id: 'q-blood-test', slug: 'do-i-need-a-blood-test-for-menopause',
    question: 'Do I need a blood test to know if I am in menopause?',
    conciseAnswer:
      'Usually not. Hormone levels change from day to day during perimenopause, so your age, period pattern and symptoms are the best guide. Tests may help if you are under 40–45, or if you cannot track periods because of a hysterectomy or hormonal IUD.',
    detailsBlocks: [{ body: 'Saliva and urine hormone tests are not reliable for diagnosing menopause or adjusting treatment.' }],
    relatedFaqIds: ['q-what-is-perimenopause', 'q-bioidentical'],
    topicIds: ['perimenopause'],
    sourceFactIds: ['f-no-hormone-testing'],
    synonyms: ['FSH', 'hormone levels', 'menopause test']
  }),
  q({
    id: 'q-what-is-perimenopause', slug: 'what-is-perimenopause', popular: true,
    question: 'What is perimenopause, and when does menopause happen?',
    conciseAnswer:
      'Perimenopause is the transition before your last period, when periods become irregular and symptoms may start. Menopause is confirmed after 12 months without a period, usually between 45 and 55.',
    detailsBlocks: [{ body: 'Perimenopause can last several years. If periods stop before 40, talk with a clinician.' }],
    relatedFaqIds: ['q-blood-test', 'q-pregnancy-perimenopause', 'q-early-menopause'],
    topicIds: ['perimenopause'],
    sourceFactIds: ['f-straw'],
    synonyms: ['the change', 'menopause age', 'when does menopause start']
  }),
  q({
    id: 'q-pregnancy-perimenopause', slug: 'can-i-get-pregnant-in-perimenopause',
    question: 'Can I still get pregnant during perimenopause?',
    conciseAnswer:
      'Yes. Pregnancy is still possible until menopause is confirmed. Keep using contraception if you do not want to become pregnant.',
    detailsBlocks: [{ body: 'Some birth control methods, like a hormonal IUD, also help with heavy or irregular bleeding.' }],
    relatedFaqIds: ['q-what-is-perimenopause', 'q-heavy-periods'],
    topicIds: ['perimenopause'],
    sourceFactIds: ['f-contraception'],
    synonyms: ['birth control', 'contraception', 'pregnant at 45']
  }),
  q({
    id: 'q-sleep', slug: 'trouble-sleeping-menopause',
    question: 'Why can\'t I sleep, and what helps?',
    conciseAnswer:
      'Night sweats, stress, mood and sleep apnea can all disturb sleep in midlife. Cognitive behavioral therapy for insomnia (CBT-I) is the most effective long-term treatment. Treating night sweats helps too.',
    detailsBlocks: [{ body: 'Loud snoring, gasping at night or daytime sleepiness can be signs of sleep apnea, which becomes more common after menopause.' }],
    relatedFaqIds: ['q-mood', 'q-brain-fog'],
    topicIds: ['sleep-mood'],
    sourceFactIds: ['f-sleep'],
    synonyms: ['insomnia', 'night waking', 'CBT-I']
  }),
  q({
    id: 'q-mood', slug: 'mood-changes-perimenopause',
    question: 'Is perimenopause making me anxious or depressed?',
    conciseAnswer:
      'It can. The risk of depression is higher during perimenopause, especially if you have had depression before. Talk therapy and antidepressants work; some antidepressants also reduce hot flashes.',
    detailsBlocks: [{ body: 'Estrogen is not approved to treat depression. Hot flashes and poor sleep can worsen mood, so treating them may help.' }],
    relatedFaqIds: ['q-sleep'],
    topicIds: ['sleep-mood'],
    sourceFactIds: ['f-mood'],
    clinicalEscalationNotice: 'If you are thinking about harming yourself, call or text 988 (US) or go to the nearest emergency department.',
    synonyms: ['anxiety', 'depression', 'irritability', 'mood swings']
  }),
  q({
    id: 'q-brain-fog', slug: 'brain-fog-menopause',
    question: 'Will hormone therapy prevent dementia or brain fog?',
    conciseAnswer:
      'Hormone therapy is not recommended to prevent dementia. Brain fog in perimenopause is common and usually temporary. Good sleep, physical activity, social connection and managing blood pressure and blood sugar protect brain health.',
    detailsBlocks: [{ body: 'Memory problems that get worse over time or worry your family should be evaluated.' }],
    relatedFaqIds: ['q-sleep'],
    topicIds: ['sleep-mood'],
    sourceFactIds: ['f-cognition'],
    synonyms: ['memory', 'Alzheimer', 'forgetful', 'concentration']
  }),
  q({
    id: 'q-bone-scan', slug: 'when-do-i-need-a-bone-density-scan',
    question: 'When do I need a bone density scan?',
    conciseAnswer:
      'At 65 for most people, or sooner if you have broken a bone from a minor fall, have low body weight, smoke, take steroids, have certain medical conditions, or are stopping estrogen.',
    detailsBlocks: [{ body: 'A T-score of −2.5 or lower means osteoporosis. A hip or spine fracture from a minor fall also counts as osteoporosis.' }],
    relatedFaqIds: ['q-calcium', 'q-denosumab'],
    topicIds: ['bones'],
    sourceFactIds: ['f-dxa', 'f-tscore'],
    synonyms: ['DXA', 'DEXA', 'osteoporosis test', 'bone density']
  }),
  q({
    id: 'q-calcium', slug: 'how-much-calcium-and-vitamin-d',
    question: 'How much calcium and vitamin D do I need?',
    conciseAnswer:
      'About 1,200 mg of calcium a day in total, mostly from food, and 600–800 IU of vitamin D. More calcium from supplements does not help bones and raises kidney stone risk.',
    detailsBlocks: [{ body: 'Weight-bearing and balance exercise, not smoking, limiting alcohol and preventing falls are just as important.' }],
    relatedFaqIds: ['q-bone-scan'],
    topicIds: ['bones'],
    sourceFactIds: ['f-calcium'],
    synonyms: ['calcium supplement', 'vitamin D dose', 'diet for bones']
  }),
  q({
    id: 'q-denosumab', slug: 'can-i-stop-denosumab',
    question: 'Can I stop my bone injection (denosumab)?',
    conciseAnswer:
      'Not without a plan. Stopping or delaying denosumab can cause rapid bone loss and spine fractures. Your clinician will usually switch you to another bone medicine first.',
    detailsBlocks: [{ body: 'Bisphosphonate pills are different — some people at lower risk can take a supervised break after 3–5 years.' }],
    relatedFaqIds: ['q-bone-scan'],
    topicIds: ['bones'],
    sourceFactIds: ['f-denosumab', 'f-bisphos'],
    clinicalEscalationNotice: 'If your injection is overdue, contact your clinician soon.',
    synonyms: ['Prolia', 'bone shot', 'drug holiday']
  }),
  q({
    id: 'q-heart', slug: 'does-hormone-therapy-protect-the-heart',
    question: 'Does hormone therapy protect my heart?',
    conciseAnswer:
      'Hormone therapy is not used to prevent heart disease. When started before 60 or within 10 years of menopause, it does not appear to increase heart risk in healthy people. Starting later carries more risk.',
    detailsBlocks: [{ body: 'Blood pressure, cholesterol, blood sugar, not smoking and staying active are the most important ways to protect your heart.' }],
    relatedFaqIds: ['q-is-ht-safe', 'q-clot-history'],
    topicIds: ['heart-metabolic'],
    sourceFactIds: ['f-cvd'],
    synonyms: ['heart disease', 'cardiovascular', 'stroke']
  }),
  q({
    id: 'q-clot-history', slug: 'hormone-therapy-after-blood-clot',
    question: 'I had a blood clot. Can I use hormone therapy?',
    conciseAnswer:
      'Estrogen pills are not recommended after a blood clot. Nonhormonal treatments are usually tried first. If they do not help, a low-dose patch may be considered after talking with a hematologist. Low-dose vaginal estrogen is often still possible.',
    detailsBlocks: [{ body: 'If close family members have had clots, your clinician may suggest testing before starting hormones.' }],
    relatedFaqIds: ['q-nonhormonal', 'q-patch-vs-pill'],
    topicIds: ['heart-metabolic', 'hormone-therapy'],
    sourceFactIds: ['f-vte-history', 'f-route'],
    synonyms: ['DVT', 'pulmonary embolism', 'VTE', 'factor V Leiden']
  }),
  q({
    id: 'q-weight', slug: 'weight-gain-menopause',
    question: 'Why am I gaining weight around my middle?',
    conciseAnswer:
      'Aging, lower estrogen, poor sleep and stress all shift weight toward the belly in midlife. Hormone therapy does not cause weight gain. Losing even 3–10% of your weight improves blood pressure, cholesterol and blood sugar.',
    detailsBlocks: [{ body: 'Strength training helps preserve muscle, which supports metabolism.' }],
    relatedFaqIds: ['q-heart'],
    topicIds: ['heart-metabolic'],
    sourceFactIds: ['f-weight'],
    synonyms: ['belly fat', 'metabolism', 'weight loss menopause']
  }),
  q({
    id: 'q-libido', slug: 'low-sex-drive-menopause',
    question: 'My sex drive is low. What can help?',
    conciseAnswer:
      'Low desire has many causes, including pain, mood, stress, relationship factors and medicines. Treating dryness and pain often helps. Counseling is effective. For some postmenopausal people, a clinician may consider low-dose testosterone (off-label).',
    detailsBlocks: [{ body: 'A testosterone blood test does not diagnose low desire. Estrogen patches may be preferred over pills when libido is a concern.' }],
    relatedFaqIds: ['q-vaginal-dryness'],
    topicIds: ['sexual-health'],
    sourceFactIds: ['f-hsdd'],
    synonyms: ['libido', 'testosterone', 'HSDD', 'desire']
  }),
  q({
    id: 'q-early-menopause', slug: 'early-menopause-treatment',
    question: 'My menopause came early. Should I take hormones?',
    conciseAnswer:
      'Usually yes. If menopause happens before 40–45 (or after removing both ovaries), hormone therapy is generally recommended at least until about 52 unless there is a reason not to use it. It protects bone, heart and brain health.',
    detailsBlocks: [{ body: 'The risks found in large studies of older women do not apply to early menopause. Doses may need to be higher than usual.' }],
    relatedFaqIds: ['q-what-is-perimenopause', 'q-is-ht-safe'],
    topicIds: ['early-menopause'],
    sourceFactIds: ['f-poi-ht', 'f-poi-def', 'f-brca'],
    synonyms: ['POI', 'premature menopause', 'surgical menopause', 'ovaries removed']
  })
];

export const faqById = Object.fromEntries(faqs.map((x) => [x.id, x])) as Record<string, FAQ>;
export const faqBySlug = Object.fromEntries(faqs.map((x) => [x.slug, x])) as Record<string, FAQ>;
