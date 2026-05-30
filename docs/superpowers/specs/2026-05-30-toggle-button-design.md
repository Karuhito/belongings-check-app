# トグルボタン設計ドキュメント

**日付:** 2026-05-30  
**対象issue:** https://github.com/Karuhito/belongings-check-app/issues/2

## 概要

`ItemCard` コンポーネントのチェックボックスをiOSスタイルのトグルスイッチに置き換える。毎日使うアプリとして、より直感的にON/OFFを切り替えられるUIを提供する。

## 決定事項

| 項目 | 内容 |
|------|------|
| デザインスタイル | iOSスタイルのスライドトグル |
| ON時のカラー | `bg-green-500`（#22c55e） |
| OFF時のカラー | `bg-gray-200`（#e5e7eb） |
| アニメーション | CSSトランジション（200ms）— 背景色とサークル移動 |
| 実装方法 | Tailwind CSSのみ（外部ライブラリ不要） |

## 変更スコープ

- **変更ファイル:** `src/components/ItemCard.tsx` のみ
- **変更なし:** `App.tsx`、`ItemList.tsx`、その他すべて
- `onToggle` のロジックは一切変更しない

## コンポーネント設計

### 現在

```tsx
<input
  type="checkbox"
  checked={item.checked}
  onChange={() => onToggle(item.id)}
  className="w-4 h-4 accent-blue-500 border-2 rounded-2xl"
/>
```

### 変更後

```tsx
<button
  onClick={() => onToggle(item.id)}
  className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${
    item.checked ? 'bg-green-500' : 'bg-gray-200'
  }`}
  aria-checked={item.checked}
  role="switch"
>
  <span
    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
      item.checked ? 'translate-x-5' : 'translate-x-0'
    }`}
  />
</button>
```

## アクセシビリティ

- `role="switch"` + `aria-checked` でスクリーンリーダー対応
- `focus-visible:ring-2` でキーボードフォーカスを視覚化

## アニメーション詳細

- **背景色:** `transition-colors duration-200` — OFF(グレー) → ON(グリーン)を200msでフェード
- **サークル移動:** `transition-transform duration-200` — `translate-x-0`（左）→ `translate-x-5`（右）を200msでスライド
- JavaScriptアニメーション不使用

## テキストスタイル（変更なし）

チェック済みアイテムの打ち消し線・グレー文字は現行のまま維持する。
