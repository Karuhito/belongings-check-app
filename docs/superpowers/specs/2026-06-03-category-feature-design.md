# カテゴリ機能 設計ドキュメント

**Issue:** #4 カテゴリ機能を追加
**Date:** 2026-06-03
**Status:** Approved

---

## 概要

持ち物チェックアプリにカテゴリ機能を追加し、場面（学校・ジム・旅行など）ごとに持ち物を管理できるようにする。

---

## データ構造

### 新規型定義

```ts
type Category = {
  id: string
  name: string
}
```

### Item 型の変更

```ts
type Item = {
  id: string
  label: string
  checked: boolean
  categoryId: string  // 追加（必須）
}
```

### localStorage スキーマ

| キー | 内容 |
|---|---|
| `'belongings'` | `Item[]`（既存・スキーマ変更あり） |
| `'categories'` | `Category[]`（新規） |

### 既存データのマイグレーション

アプリ起動時に `categoryId` を持たないアイテムが存在した場合：
1. 「全般」カテゴリを自動作成する
2. 該当アイテム全てに「全般」カテゴリの `id` を付与する
3. マイグレーション後のデータを localStorage に保存する

---

## UI 設計

### タブナビゲーション

- タブバーを Header 直下に配置（pill スタイル、横スクロール対応）
- 「全て」タブ（固定・削除不可）＋ ユーザー作成カテゴリタブ ＋「＋」ボタン
- アクティブなタブは青色でハイライト

### 「全て」タブ

- 全カテゴリのアイテムをフラットリストで表示（カテゴリ名表示なし）
- `AddItemForm` は非表示
- `ItemCard` の削除ボタン（×）は非表示
- インフォバナー表示：「カテゴリタブでアイテムを追加・削除できます」

### カテゴリタブ

- そのカテゴリに属するアイテムのみ表示
- `AddItemForm` を表示（追加したアイテムはそのカテゴリに属する）
- `ItemCard` の削除ボタン（×）を表示
- アクティブなカテゴリタブには🗑アイコンを表示（カテゴリ削除）

### カテゴリ作成フロー

1. 「＋」ボタンをクリック → タブバー下にインライン入力フォームが出現
2. 名前を入力して Enter または「追加」ボタン → カテゴリ作成・新カテゴリタブに自動切り替え
3. 空文字 or Escape → フォームを閉じる（キャンセル）

### カテゴリ削除フロー

1. アクティブなカテゴリタブの🗑アイコンをクリック
2. 即時削除（カテゴリ＋そのカテゴリに属するアイテムをまとめて削除）
3. 削除後は「全て」タブに自動切り替え

---

## コンポーネント設計

### 新規作成

| コンポーネント | 役割 |
|---|---|
| `src/components/CategoryTabs.tsx` | タブバー全体（タブ一覧・「＋」ボタン・インラインカテゴリ追加フォーム）を管理 |

#### CategoryTabs の Props

```ts
type Props = {
  categories: Category[]
  activeTab: string  // 'all' または categoryId
  onTabChange: (tabId: string) => void
  onAddCategory: (name: string) => void
  onDeleteCategory: (id: string) => void
}
```

### 変更

| コンポーネント | 変更内容 |
|---|---|
| `src/App.tsx` | `categories` / `activeTab` state 追加、ハンドラ追加、localStorage マイグレーション処理追加、`activeTab` に応じた `AddItemForm` 表示制御、フィルタ済み items を `ItemList` に渡す |

### 変更（軽微）

| コンポーネント | 変更内容 |
|---|---|
| `src/components/ItemCard.tsx` | `onDelete` を省略可能な props に変更（`onDelete?: (id: string) => void`）。未指定の場合は削除ボタンを非表示にする |
| `src/components/ItemList.tsx` | `onDelete` を省略可能な props に変更し、`ItemCard` にそのまま渡す |

### 変更なし

- `src/components/Header.tsx`
- `src/components/AddItemForm.tsx`

---

## 状態管理（App.tsx）

```ts
const [categories, setCategories] = useState<Category[]>([])
const [items, setItems] = useState<Item[]>([])
const [activeTab, setActiveTab] = useState<string>('all')
```

### ハンドラ一覧

| ハンドラ | 処理 |
|---|---|
| `handleAddCategory(name: string)` | 新カテゴリを追加し、`activeTab` を新カテゴリの id に切り替える |
| `handleDeleteCategory(id: string)` | カテゴリと属するアイテムを削除し、`activeTab` を `'all'` に切り替える |
| `handleAdd(label: string)` | `activeTab` の categoryId を付与してアイテムを追加（カテゴリタブのみ呼び出し可） |
| `handleToggle(id: string)` | 変更なし |
| `handleDelete(id: string)` | 変更なし |

### フィルタリングロジック

```ts
const displayedItems = activeTab === 'all'
  ? items
  : items.filter(item => item.categoryId === activeTab)
```

---

## 非機能要件

- localStorage への保存タイミング：`items` と `categories` の変更時（既存の `useEffect` パターンを踏襲）
- カテゴリ数の上限：設けない（4〜5カテゴリを想定）
- カテゴリ名の重複：許容する（バリデーションなし）
- カテゴリ名の変更：スコープ外（今回は作成・削除のみ）
