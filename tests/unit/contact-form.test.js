import { describe, expect, it, vi } from 'vitest';
import { sendMessage } from '../../src/scripts/contact-form.js';

function makeForm(gotcha = '') {
  document.body.innerHTML = `<form id="f">
    <input name="Name" value="Ada"><input name="_gotcha" value="${gotcha}"></form>`;
  return document.getElementById('f');
}

describe('sendMessage', () => {
  it('posts the form and reports success', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    expect(await sendMessage(makeForm(), 'https://x.test', fetchImpl)).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it('treats an opaque response as success (Google Apps Script)', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, type: 'opaque' });
    expect((await sendMessage(makeForm(), 'https://x.test', fetchImpl)).ok).toBe(true);
  });

  it('reports failure on a network error', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'));
    expect((await sendMessage(makeForm(), 'https://x.test', fetchImpl)).ok).toBe(false);
  });

  it('never calls the network when the honeypot is filled', async () => {
    const fetchImpl = vi.fn();
    expect((await sendMessage(makeForm('spam'), 'https://x.test', fetchImpl)).ok).toBe(true);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
