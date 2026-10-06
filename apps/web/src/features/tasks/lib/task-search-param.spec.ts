import { describe, expect, it } from 'vitest';
import { getPage } from './task-search-param';

describe('getPage', () => {
  it('returns parsed positive page', () => {
    expect(getPage('3')).toBe(3);
  });

  it('falls back to page 1', () => {
    expect(getPage(null)).toBe(1);
    expect(getPage('0')).toBe(1);
    expect(getPage('-1')).toBe(1);
    expect(getPage('abc')).toBe(1);
  });
});
