import type { CertificationRecord } from './types';

/**
 * Certification data — maintained manually. Never present these as timeless.
 * If `validThrough` has passed, the UI hides exact values and shows "Check official site".
 * Verified against menopause.org and the 2027 Candidate Handbook on 2026-10-28.
 */
export const certification: CertificationRecord = {
  sourceUrl: 'https://menopause.org/for-professionals/mscp-certification',
  candidateHandbookUrl: 'https://menopause.org/wp-content/uploads/2026/10/2027-Candidate-Handbook-FINAL.pdf',
  applicationUrl: 'https://assessments.meazurelearning.com/Connect/nams/Account/Login',
  renewalUrl: 'https://menopause.org/for-professionals/mscp-maintenance',
  eligibilitySummary:
    'Licensed healthcare professionals (for example nurses, nurse midwives, nurse practitioners, pharmacists, physicians and physician assistants) with a current license.',
  format: [
    '100 multiple-choice questions, 3 answer options each (A–C)',
    '2-hour time limit, no breaks',
    'Live remote proctoring; test-center option for an added fee',
    'English only'
  ],
  contentOutline: [
    { domain: 'Physiology / pathophysiology of the menopause transition', weight: '19%' },
    { domain: 'Symptoms and concerns', weight: '20%' },
    { domain: 'Health disorders in midlife', weight: '21%' },
    { domain: 'Treatment options for common menopause symptoms', weight: '21%' },
    { domain: 'Preventive care and counseling', weight: '19%' }
  ],
  testingWindows: [
    { label: 'March 2027', opens: '2027-03-01', closes: '2027-03-31', applicationDeadline: '2027-02-01' },
    { label: 'June 2027', opens: '2027-06-01', closes: '2027-06-30', applicationDeadline: '2027-05-01' },
    { label: 'September 2027', opens: '2027-09-01', closes: '2027-09-30', applicationDeadline: '2027-08-01' },
    { label: 'November 2027', opens: '2027-11-01', closes: '2027-11-30', applicationDeadline: '2027-10-01' }
  ],
  fees: [
    { label: 'Society members', amount: '$400' },
    { label: 'Nonmembers', amount: '$725' },
    { label: 'In-person test center', amount: '+$20' }
  ],
  renewal: [
    'Credential valid for 3 years (renews December 31 of the third year).',
    'Renew by 45 CME hours (≥15 from The Menopause Society) or by reexamination before expiration.'
  ],
  retake: 'Unlimited attempts, one per testing window; each attempt needs a new application and fee.',
  lastVerified: '2026-10-28',
  validThrough: '2027-11-30',
  verificationStatus: 'verified',
  editorApproval: null
};

export function isCertificationStale(now = new Date()): boolean {
  return now > new Date(certification.validThrough + 'T23:59:59');
}
