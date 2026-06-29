import { describe, it, expect } from 'vitest';
import { isDuplicateCategoryName, isDuplicateItemLabel } from './duplicateCheck';
import type { Category, Item } from '../types';

const categories: Category[] = [
  { id: 'c1', name: '旅行' },
  { id: 'c2', name: 'ABC' },
];

const items: Item[] = [
  { id: 'i1', label: '財布', checked: false, categoryId: 'c1' },
  { id: 'i2', label: 'バッグ', checked: false, categoryId: 'c1' },
  { id: 'i3', label: '財布', checked: false, categoryId: 'c2' },
];

describe('isDuplicateCategoryName', () => {
  it('同名カテゴリが存在すればtrueを返す', () => {
    expect(isDuplicateCategoryName(categories, '旅行')).toBe(true);
  });

  it('前後空白はtrimして判定する', () => {
    expect(isDuplicateCategoryName(categories, '  旅行  ')).toBe(true);
  });

  it('存在しない名前はfalseを返す', () => {
    expect(isDuplicateCategoryName(categories, '仕事')).toBe(false);
  });

  it('大文字小文字の違いは別物として扱う', () => {
    expect(isDuplicateCategoryName(categories, 'abc')).toBe(false);
  });
});

describe('isDuplicateItemLabel', () => {
  it('同一カテゴリ内に同名アイテムがあればtrueを返す', () => {
    expect(isDuplicateItemLabel(items, 'c1', '財布')).toBe(true);
  });

  it('前後空白はtrimして判定する', () => {
    expect(isDuplicateItemLabel(items, 'c1', '  財布  ')).toBe(true);
  });

  it('異なるカテゴリの同名アイテムは重複とみなさない', () => {
    expect(isDuplicateItemLabel(items, 'c2', 'バッグ')).toBe(false);
  });

  it('同一カテゴリ内に存在しない名前はfalseを返す', () => {
    expect(isDuplicateItemLabel(items, 'c1', '時計')).toBe(false);
  });
});