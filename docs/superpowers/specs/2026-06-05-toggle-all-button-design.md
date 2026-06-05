---
title: カテゴリごとの全アイテムトグルボタン設計
date: 2026-06-05
issue: https://github.com/Karuhito/belongings-check-app/issues/9
---

## 概要

カテゴリごとに（「すべて」タブを含む）表示中のすべてのアイテムのチェックをON/OFFできるトグルボタンを追加する。

## 要件

- 表示中のすべてのアイテムがON → ボタンクリックですべてOFF
- 表示中のアイテムが1件以上OFFの状態 → ボタンクリックですべてON
- 表示中のアイテムが0件のときはボタンを非表示
- 「すべて」タブ・カテゴリ固有タブの両方で動作
- `AddItemForm`（または「すべて」タブの注意メッセージ）と`ItemList`の間に配置

## アーキテクチャ

### 変更ファイル

| ファイル | 変更内容 |
|---|---|
| `src/App.tsx` | `handleToggleAll`関数追加・ボタンJSX追加 |

### 追加・変更なしのファイル

- `src/components/ItemList.tsx`
- `src/components/ItemCard.tsx`
- `src/components/AddItemForm.tsx`
- `src/components/CategoryTabs.tsx`

## 実装詳細

### `handleToggleAll`関数

```typescript
const handleToggleAll = () => {
  const allChecked = displayedItems.length > 0 && displayedItems.every(item => item.checked);
  const displayedIds = new Set(displayedItems.map(item => item.id));
  setItems(items.map(item =>
    displayedIds.has(item.id) ? { ...item, checked: !allChecked } : item
  ));
};
```

- `displayedItems`（現在表示中）を基に全チェック済みか判定
- `displayedIds`のSetで対象アイテムを効率的に特定
- 「すべて」タブでは`displayedItems === items`と同等のため追加処理不要

### ボタンJSX配置

```tsx
{displayedItems.length > 0 && (
  <div className="flex justify-end mb-3">
    <button
      type="button"
      onClick={handleToggleAll}
      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
        displayedItems.every(item => item.checked)
          ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
          : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
      }`}
    >
      {displayedItems.every(item => item.checked) ? 'すべてOFF' : 'すべてON'}
    </button>
  </div>
)}
```

- `displayedItems.length > 0`のときのみ表示
- すべてチェック済み → 緑色「すべてOFF」
- それ以外 → グレー「すべてON」

## データフロー

```
ボタンクリック
  → handleToggleAll()
    → displayedItemsで全チェック状態を判定
    → setItems()でdisplayedIds内のアイテムのcheckedを一括更新
      → useEffect → localStorage保存
```

## 考慮事項

- `displayedItems.every()`の呼び出しが2回になるため、ボタンのstate判定は1回に最適化してもよいが、件数が少ないため許容範囲
- アイテム0件時はボタン非表示（空リストへの操作を防ぐ）