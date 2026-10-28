import type { Source } from './types';

/**
 * Source registry. Every Reference.sourceId must resolve here.
 * `lastChecked` = last date an editor confirmed currency. Update when re-verified.
 */
export const sources: Source[] = [
  {
    id: 'ht2022',
    code: 'HT 2022',
    title: 'The 2022 hormone therapy position statement of The North American Menopause Society',
    publisher: 'The North American Menopause Society (now The Menopause Society)',
    year: 2022,
    citation: 'Menopause. 2022;29(7):767–794. doi:10.1097/GME.0000000000002028',
    url: 'https://doi.org/10.1097/GME.0000000000002028',
    type: 'position-statement',
    lastChecked: '2026-10-28',
    currency: 'partly-superseded',
    note:
      'Core benefit–risk framework remains in use. FDA class labeling changed in 2025–2026 (boxed warning revisions, removal of "lowest dose for shortest duration" language); see FDA labeling source.'
  },
  {
    id: 'nh2023',
    code: 'VMS 2023',
    title: 'The 2023 nonhormone therapy position statement of The North American Menopause Society',
    publisher: 'The North American Menopause Society (now The Menopause Society)',
    year: 2023,
    citation: 'Menopause. 2023;30(6):573–590. doi:10.1097/GME.0000000000002200',
    url: 'https://doi.org/10.1097/GME.0000000000002200',
    type: 'position-statement',
    lastChecked: '2026-10-28',
    currency: 'partly-superseded',
    note:
      'Predates the fezolinetant liver-injury boxed warning (Dec 2024) and FDA approval of elinzanetant (Oct 2025).'
  },
  {
    id: 'gsm2020',
    code: 'GSM 2020',
    title: 'The 2020 genitourinary syndrome of menopause position statement of The North American Menopause Society',
    publisher: 'The North American Menopause Society (now The Menopause Society)',
    year: 2020,
    citation: 'Menopause. 2020;27(9):976–992. doi:10.1097/GME.0000000000001609',
    url: 'https://doi.org/10.1097/GME.0000000000001609',
    type: 'position-statement',
    lastChecked: '2026-10-28',
    currency: 'partly-superseded',
    note: 'FDA removed most boxed-warning language from local vaginal estrogen labeling in 2025–2026.'
  },
  {
    id: 'osteo2021',
    code: 'Osteo 2021',
    title: 'Management of osteoporosis in postmenopausal women: the 2021 position statement of The North American Menopause Society',
    publisher: 'The North American Menopause Society (now The Menopause Society)',
    year: 2021,
    citation: 'Menopause. 2021;28(9):973–997. doi:10.1097/GME.0000000000001831',
    url: 'https://doi.org/10.1097/GME.0000000000001831',
    type: 'position-statement',
    lastChecked: '2026-10-28',
    currency: 'current'
  },
  {
    id: 'az2024',
    code: 'A–Z 2024',
    title: 'Menopause A–Z slide set (high-yield study extraction)',
    publisher: 'The Menopause Society',
    year: 2024,
    citation: 'The Menopause Society. Menopause A–Z educational slide set, 2024. Used as an authoring index only.',
    type: 'educational-deck',
    lastChecked: '2026-10-28',
    currency: 'review-needed',
    note: 'Educational deck; cross-check against primary statements and current labeling before use.'
  },
  {
    id: 'fda-ht-label-2026',
    code: 'FDA 2025–26',
    title: 'FDA approves labeling changes to menopausal hormone therapy products',
    publisher: 'US Food and Drug Administration',
    year: 2026,
    citation:
      'FDA news release, Feb 12, 2026 (labeling changes initiated Nov 10, 2025): removal of cardiovascular disease, breast cancer and probable dementia statements from the boxed warning; endometrial cancer boxed warning retained for systemic estrogen-alone products.',
    url: 'https://www.fda.gov/news-events/press-announcements/fda-approves-labeling-changes-menopausal-hormone-therapy-products',
    type: 'regulatory',
    lastChecked: '2026-10-28',
    currency: 'current',
    note: 'Labeling updates were rolling out product by product; check individual product labels.'
  },
  {
    id: 'fda-fezolinetant-2024',
    code: 'FDA 2024',
    title: 'Boxed warning added to fezolinetant (Veozah) for rare but serious liver injury',
    publisher: 'US Food and Drug Administration',
    year: 2024,
    citation:
      'FDA Drug Safety Communication, Dec 16, 2024: boxed warning; hepatic labs at baseline, monthly for the first 3 months, then at 6 and 9 months.',
    url: 'https://www.fda.gov/drugs/drug-safety-and-availability',
    type: 'regulatory',
    lastChecked: '2026-10-28',
    currency: 'current'
  },
  {
    id: 'fda-elinzanetant-2025',
    code: 'FDA 2025',
    title: 'FDA approval of elinzanetant (Lynkuet) for moderate to severe VMS due to menopause',
    publisher: 'US Food and Drug Administration / manufacturer announcement',
    year: 2025,
    citation: 'Approved Oct 24, 2025. Dual neurokinin-1 and neurokinin-3 receptor antagonist.',
    url: 'https://www.bayer.com/media/en-us/bayers-lynkuet-elinzanetant-approved-in-the-us-for-treatment-of-moderate-to-severe-vasomotor-symptoms-due-to-menopause/',
    type: 'regulatory',
    lastChecked: '2026-10-28',
    currency: 'current',
    note: 'Not addressed in the 2023 nonhormone statement. Confirm dosing and warnings against current prescribing information.'
  },
  {
    id: 'acog-cpg1',
    code: 'ACOG CPG 1',
    title: 'Osteoporosis prevention, screening, and diagnosis (Clinical Practice Guideline No. 1)',
    publisher: 'American College of Obstetricians and Gynecologists',
    year: 2021,
    citation: 'Obstet Gynecol. 2021;138(3):494–506. doi:10.1097/AOG.0000000000004514',
    url: 'https://doi.org/10.1097/AOG.0000000000004514',
    type: 'guideline',
    lastChecked: '2026-10-28',
    currency: 'current'
  },
  {
    id: 'acog-co659',
    code: 'ACOG CO 659',
    title: 'The use of vaginal estrogen in women with a history of estrogen-dependent breast cancer',
    publisher: 'American College of Obstetricians and Gynecologists',
    year: 2016,
    citation: 'Committee Opinion No. 659. Obstet Gynecol. 2016;127(3):e93–e96. Confirm current reaffirmation status.',
    url: 'https://doi.org/10.1097/AOG.0000000000001351',
    type: 'guideline',
    lastChecked: '2026-10-28',
    currency: 'review-needed'
  },
  {
    id: 'mscp-handbook-2027',
    code: 'MSCP Handbook',
    title: 'MSCP Candidate Handbook 2027',
    publisher: 'The Menopause Society',
    year: 2027,
    citation: 'The Menopause Society. Candidate Handbook 2027 (retrieved Oct 28, 2026).',
    url: 'https://menopause.org/wp-content/uploads/2026/10/2027-Candidate-Handbook-FINAL.pdf',
    type: 'certification',
    lastChecked: '2026-10-28',
    currency: 'current'
  },
  {
    id: 'prove-concierge',
    code: 'PROVE Concierge',
    title: 'Menopause Board-Exam Concierge (PROVE-structured study prompt)',
    publisher: 'Weiping Lin, DO (author)',
    year: 2026,
    citation: 'User-authored study prompt with 200-item knowledge pack. Study aid; verify against primary sources.',
    type: 'study-tool',
    lastChecked: '2026-10-28',
    currency: 'current'
  }
];

export const sourceById = Object.fromEntries(sources.map((s) => [s.id, s])) as Record<string, Source>;
