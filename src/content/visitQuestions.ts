/** Suggested visit questions per topic (plain language, nonpersonalized). */
export const visitQuestions: Record<string, string[]> = {
  'hot-flashes': [
    'Are my hot flashes or night sweats typical for my stage of menopause?',
    'What are my hormonal and nonhormonal treatment options?',
    'Could any of my medicines or health conditions be making them worse?'
  ],
  'hormone-therapy': [
    'Am I a good candidate for hormone therapy, given my age and health history?',
    'Would a patch, gel or spray be better for me than a pill?',
    'Do I need a progestogen? Which type would you suggest?',
    'How did the 2025–2026 FDA label update change how you think about my risks?',
    'How often should we review whether to continue?'
  ],
  nonhormonal: [
    'Which nonhormonal options would fit my health history?',
    'Do any of these interact with my current medicines?',
    'Would CBT or clinical hypnosis be worth trying?'
  ],
  perimenopause: [
    'Am I in perimenopause? Do I need any tests?',
    'Do I still need birth control, and for how long?',
    'Which changes in my periods should I report?'
  ],
  'vaginal-urinary': [
    'Could my dryness, pain or bladder symptoms be from menopause (GSM)?',
    'Would low-dose vaginal estrogen be safe for me?',
    'Would pelvic floor physical therapy help?'
  ],
  'sleep-mood': [
    'Could my sleep problems be related to night sweats, mood or sleep apnea?',
    'Can you refer me for CBT for insomnia?',
    'I have noticed mood changes — can we screen for depression or anxiety?'
  ],
  bones: [
    'When should I have a bone density (DXA) scan?',
    'Am I getting enough calcium and vitamin D?',
    'What is my fracture risk, and do I need medicine?'
  ],
  'heart-metabolic': [
    'Which heart and diabetes screening tests am I due for?',
    'How does menopause affect my heart risk?',
    'Given my history of clots or heart disease, which treatments are safe for me?'
  ],
  'sexual-health': [
    'What could be causing changes in my desire or comfort with sex?',
    'What treatments are available for painful sex?',
    'Would counseling or sex therapy help?'
  ],
  bleeding: [
    'Does my bleeding pattern need to be checked?',
    'What tests would you recommend for my bleeding?',
    'Would a hormonal IUD help with heavy periods?'
  ],
  'early-menopause': [
    'Why did my menopause happen early, and do I need tests?',
    'Should I take hormone therapy until about age 52?',
    'How can I protect my bones and heart?'
  ]
};

export const generalVisitQuestions = [
  'What is the most likely cause of my symptoms?',
  'What are the benefits and risks of each option for me?',
  'When should I follow up, and what should prompt me to call sooner?'
];
