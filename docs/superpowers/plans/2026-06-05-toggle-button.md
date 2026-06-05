# カテゴリ全アイテムトグルボタン 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** カテゴリ（「すべて」タブ含む）の表示中アイテムをまとめてON/OFFできるトグルボタンをAddItemFormとItemListの間に追加する。

**Architecture:** `App.tsx`のみ変更。`handleToggleAll`関数で`displayedItems`の全チェック状態を判定し、一括更新する。新規コンポーネントなし。

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vite

---

### Task 1: フィーチャーブランチを作成

**Files:**
- なし（gitコマンドのみ）

- [ ] **Step 1: ブランチを作成する**

```bash
git checkout -b feature/toggle-all-button
```

Expected: `Switched to a new branch 'feature/toggle-all-button'`

---

### Task 2: `handleToggleAll`関数を`App.tsx`に追加

**Files:**
- Modify: `src/App.tsx`

現在の`displayedItems`定義（105行目付近）の直後・`return`の前に追加する。

- [ ] **Step 1: `handleToggleAll`を追加する**

[src/App.tsx](src/App.tsx) の`const displayedItems = ...` の後、`return (` の前に以下を追加：

```typescript
const handleToggleAll = () => {
  const allChecked = displayedItems.length > 0 && displayedItems.every(item => item.checked);
  const displayedIds = new Set(displayedItems.map(item => item.id));
  setItems(items.map(item =>
    displayedIds.has(item.id) ? { ...item, checked: !allChecked } : item
  ));
};

- [ ] **Step 2: lintエラーがないか確認する**

```bash
npm run lint
```

Expected: エラーなし（警告のみ許容）

---

### Task 3: トグルボタンのJSXを追加

**Files:**
- Modify: `src/App.tsx`

`<ItemList .../>` の直前にボタンを配置する。

- [ ] **Step 1: ボタンJSXを追加する**

[src/App.tsx](src/App.tsx) の`<ItemList`の直前に以下を追加：

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

- [ ] **Step 2: ビルドが通るか確認する**

```bash
npm run build
```

Expected: `✓ built in ...ms` （エラーなし）

---

### Task 4: 動作確認

- [ ] **Step 1: 開発サーバーを起動する**

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

- [ ] **Step 2: 以下の動作を確認する**

| 状況 | 期待動作 |
|---|---|
| アイテムが0件のカテゴリタブを開く | ボタンが表示されない |
| アイテムが1件以上あるカテゴリタブを開く | グレーの「すべてON」ボタンが表示される |
| 「すべてON」をクリック | 全アイテムがONになり、ボタンが緑の「すべてOFF」に変わる |
| 「すべてOFF」をクリック | 全アイテムがOFFになり、ボタンがグレーの「すべてON」に戻る |
| 「すべて」タブを開く（複数カテゴリのアイテムがある） | ボタンが表示され、全カテゴリのアイテムをまとめてトグルできる |
| ページをリロード | トグル状態がlocalStorageから復元される |

---

### Task 5: コミットとPR作成

**Files:**
- なし（gitコマンドのみ）

- [ ] **Step 1: 変更をステージしてコミットする**

```bash
git add src/App.tsx
git commit -m "feat: カテゴリ全アイテムのトグルボタンを追加 (#9)"
```

- [ ] **Step 2: PRを作成する**

```bash
git push origin feature/toggle-all-button
gh pr create \
  --title "feat: カテゴリ全アイテムのトグルボタンを追加" \
  --body "$(cat <<'EOF'
## 概要
issue #9 の対応。カテゴリ（「すべて」タブ含む）の表示中アイテムをまとめてON/OFFできるトグルボタンを追加。

## 変更内容
- `App.tsx` に `handleToggleAll` 関数を追加
- AddItemForm と ItemList の間にトグルボタンを配置
- アイテムが0件のときはボタンを非表示
- すべてON状態のとき緑の「すべてOFF」ボタン、それ以外はグレーの「すべてON」ボタンを表示

Closes #9
EOF
)"
```