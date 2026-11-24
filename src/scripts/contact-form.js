// Contact form: posts to FORM_ENDPOINT (Formspree or Google Apps Script), with a honeypot.
export async function sendMessage(form, endpoint, fetchImpl = fetch) {
  const data = new FormData(form);
  if (data.get('_gotcha')) return { ok: true }; // bot filled the hidden field: fake success
  try {
    const res = await fetchImpl(endpoint, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });
    return { ok: res.ok || res.type === 'opaque' };
  } catch {
    return { ok: false };
  }
}

export function initContactForm(endpoint) {
  const form = document.getElementById('form');
  const msg = document.getElementById('msg');
  if (!form || !msg) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) return form.reportValidity();
    const button = form.querySelector('button[type=submit]');
    button.disabled = true;
    msg.className = '';
    msg.textContent = 'Sending…';
    const { ok } = await sendMessage(form, endpoint);
    if (ok) form.reset();
    msg.className = ok ? '' : 'err';
    msg.textContent = ok
      ? 'Message sent successfully. Thank you!'
      : 'Something went wrong. Please email me directly.';
    button.disabled = false;
    setTimeout(() => (msg.textContent = ''), 6000);
  });
}
