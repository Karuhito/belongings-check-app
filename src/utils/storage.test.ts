import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveToStorage } from './storage';

describe('saveToStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('値をJSON文字列化してlocalStorageに保存し、trueを返す', () => {
    const result = saveToStorage('key', { a: 1, b: 'x' });

    expect(result).toBe(true);
    expect(localStorage.getItem('key')).toBe(JSON.stringify({ a: 1, b: 'x' }));
  });

  it('setItemが例外を投げた場合はfalseを返す', () => {
    // QuotaExceededError などで setItem が失敗するケースを再現する
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota exceeded', 'QuotaExceededError');
    });
    // エラーログ出力でテスト出力が汚れないよう抑制する
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = saveToStorage('key', { a: 1 });

    expect(result).toBe(false);
  });
});