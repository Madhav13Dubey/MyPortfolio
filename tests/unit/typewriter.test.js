import { describe, expect, it } from 'vitest';
import { frame } from '../../src/scripts/typewriter.js';

const words = ['ab', 'cd'];

describe('typewriter frame', () => {
  it('types one character at a time', () => {
    const { text, next } = frame({ w: 0, c: 1, erasing: false }, words);
    expect(text).toBe('a');
    expect(next).toEqual({ w: 0, c: 2, erasing: false });
  });

  it('pauses then starts erasing when the word is complete', () => {
    const { next, delay } = frame({ w: 0, c: 2, erasing: false }, words);
    expect(next.erasing).toBe(true);
    expect(delay).toBe(1400);
  });

  it('moves to the next word (wrapping) once erased', () => {
    expect(frame({ w: 0, c: 0, erasing: true }, words).next).toEqual({
      w: 1,
      c: 0,
      erasing: false,
    });
    expect(frame({ w: 1, c: 0, erasing: true }, words).next.w).toBe(0);
  });
});
