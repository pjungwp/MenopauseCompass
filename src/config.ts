/**
 * Release configuration.
 * PREVIEW_EDITION: true while content is AI-drafted and awaiting clinical review.
 * When all patient-facing facts are reviewed, set to false to remove the preview banner.
 */
export const PREVIEW_EDITION = true;

/** Name shown as editor/owner on About page. */
export const EDITOR_NAME = 'Weiping Lin, DO, FACOG';

/** Feedback destination for "Report an issue" links. Replace with a monitored address or form. */
export const FEEDBACK_EMAIL = 'feedback@example.org';

/**
 * Practice scoring policy: only status === 'verified' questions are eligible for scored modes.
 * Draft items can be used in clearly labeled, unscored Demo mode.
 */
export const ALLOW_DEMO_MODE = true;
