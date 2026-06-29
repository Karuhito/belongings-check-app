import type { Category, Item } from "../types";

// カテゴリ名がグローバルに重複しているか判定する（trim後の完全一致）
export function isDuplicateCategoryName(
  categories: Category[],
  name: string
): boolean {
  const trimmed = name.trim();
  return categories.some((category) => category.name === trimmed);
}

// 同一カテゴリ内でアイテム名が重複しているか判定する（trim後の完全一致）
export function isDuplicateItemLabel(
  items: Item[],
  categoryId: string,
  label: string
): boolean {
  const trimmed = label.trim();
  return items.some(
    (item) => item.categoryId === categoryId && item.label === trimmed
  );
}