// Runtime configuration. Override via VITE_FORM_ENDPOINT (see .env.example).
// Falls back to the legacy Google Apps Script endpoint until a Formspree form is set up.
const LEGACY_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbzbHE-TzBnty5jgnyCJm21iYOZsHt8a-43m76suO_tzCpeBtlFLihLUr6zTvqRMKWlU/exec';

export const FORM_ENDPOINT = import.meta.env?.VITE_FORM_ENDPOINT || LEGACY_ENDPOINT;
export const TYPEWRITER_WORDS = [
  'Software Development Engineer',
  'Competitive Programmer',
  'Full-Stack Developer',
  'AI/ML Enthusiast',
];
