// App entry: wires every behaviour module. Styles are loaded from index.html (src/styles/main.css).
import { FORM_ENDPOINT, TYPEWRITER_WORDS } from './scripts/config.js';
import { initContactForm } from './scripts/contact-form.js';
import { initFlow } from './scripts/flow.js';
import { initGallery } from './scripts/gallery.js';
import { initNav } from './scripts/nav.js';
import { initReveal } from './scripts/reveal.js';
import { initSpotlight } from './scripts/spotlight.js';
import { initTabs } from './scripts/tabs.js';
import { initTheme } from './scripts/theme.js';
import { initTypewriter } from './scripts/typewriter.js';

initTypewriter(document.getElementById('typed'), TYPEWRITER_WORDS);
initNav();
initReveal();
initTabs();
initTheme();
initSpotlight();
initFlow();
initGallery();
initContactForm(FORM_ENDPOINT);
document.getElementById('year').textContent = new Date().getFullYear();
