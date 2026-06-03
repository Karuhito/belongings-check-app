# カテゴリ機能 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 場面ごとの持ち物を管理できるカテゴリ機能を追加する。タブ切り替えUI・カテゴリのCRUD・既存データの自動マイグレーションを実装する。

**Architecture:** `App.tsx` に `categories`・`items`（`categoryId` 追加）・`activeTab` の state を集約し、新規 `CategoryTabs` コンポーネントにタブUIを委譲する。`ItemCard`・`ItemList` の `onDelete` をオプション化して「全て」タブでは削除ボタンを非表示にする。

**Tech Stack:** React 19、TypeScript、Tailwind CSS v4、Vite

---

## ファイル構成

| 操作 | ファイル | 変更内容 |
|---|---|---|
| 作成 | `src/components/CategoryTabs.tsx` | タブバー・カテゴリ追加フォーム・削除ボタン |
| 変更 | `src/App.tsx` | categories/activeTab state追加・migration・handlers・rendering更新 |
| 変更 | `src/components/ItemCard.tsx` | `onDelete` をオプション化、条件付き削除ボタン表示 |
| 変更 | `src/components/ItemList.tsx` | `onDelete` をオプション化 |

---

### Task 1: ItemCard の onDelete オプション化

**Files:**
- Modify: `src/components/ItemCard.tsx`

---

- [ ] **Step 1: `onDelete` を省略可能にして条件付きレンダリングに変更する**

`src/components/ItemCard.tsx` を以下の内容に書き換える:

```tsx
type Item = {
  id: string;
  label: string;
  checked: boolean;
};

type Props = {
  item: Item;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
};

function ItemCard({ item, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        role="switch"
        aria-checked={item.checked}
        aria-label={item.label}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 flex-shrink-0 ${
          item.checked ? 'bg-green-500' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            item.checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span
        className={`flex-1 text-sm ${
          item.checked ? "line-through text-gray-400" : "text-gray-700"
        }`}
      >
        {item.label}
      </span>
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-gray-300 hover:text-red-400 text-sm"
        >
          x
        </button>
      )}
    </li>
  );
}

export default ItemCard;
```

---

- [ ] **Step 2: ビルドエラーがないか確認する**

```bash
npm run build 2>&1 | tail -20
```

期待される出力: `✓ built in` で終わること（エラーなし）

---

- [ ] **Step 3: コミットする**

```bash
git add src/components/ItemCard.tsx
git commit -m "ItemCardのonDeleteをオプション化 #4"
```

---

### Task 2: ItemList の onDelete オプション化

**Files:**
- Modify: `src/components/ItemList.tsx`

---

- [ ] **Step 1: `onDelete` を省略可能に変更する**

`src/components/ItemList.tsx` を以下の内容に書き換える:

```tsx
import ItemCard from "./ItemCard";

type Item = {
  id: string;
  label: string;
  checked: boolean;
};

type Props = {
  items: Item[];
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
};

function ItemList({ items, onToggle, onDelete }: Props) {
  return (
    <>
      <ul className="space-y-2">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
      {items.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-6">
          アイテムを追加してください
        </p>
      )}
    </>
  );
}

export default ItemList;
```

---

- [ ] **Step 2: ビルドエラーがないか確認する**

```bash
npm run build 2>&1 | tail -20
```

期待される出力: `✓ built in` で終わること（エラーなし）

---

- [ ] **Step 3: コミットする**

```bash
git add src/components/ItemList.tsx
git commit -m "ItemListのonDeleteをオプション化 #4"
```

---

### Task 3: CategoryTabs コンポーネントの作成

**Files:**
- Create: `src/components/CategoryTabs.tsx`

---

- [ ] **Step 1: `CategoryTabs.tsx` を作成する**

`src/components/CategoryTabs.tsx` を以下の内容で作成する:

```tsx
import React from "react";

export type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
};

function CategoryTabs({
  categories,
  activeTab,
  onTabChange,
  onAddCategory,
  onDeleteCategory,
}: Props) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');

  const handleAdd = () => {
    if (newCategoryName.trim() === '') return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setNewCategoryName('');
    setShowAddForm(false);
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onTabChange('all')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-500 text-white font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全て
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onTabChange(category.id)}
            className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
              activeTab === category.id
                ? 'bg-blue-500 text-white font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.name}
            {activeTab === category.id && (
              <span
                role="button"
                aria-label={`${category.name}を削除`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(category.id);
                }}
                className="ml-1 cursor-pointer hover:text-red-200"
              >
                🗑
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          ＋
        </button>
      </div>
      {showAddForm && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') handleCancel();
            }}
            placeholder="カテゴリ名を入力..."
            autoFocus
            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg"
          >
            追加
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-3 py-1.5 rounded-lg"
          >
            キャンセル
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryTabs;
```

---

- [ ] **Step 2: ビルドエラーがないか確認する**

```bash
npm run build 2>&1 | tail -20
```

期待される出力: `✓ built in` で終わること（エラーなし）

---

- [ ] **Step 3: コミットする**

```bash
git add src/components/CategoryTabs.tsx
git commit -m "CategoryTabsコンポーネントを作成 #4"
```

---

### Task 4: App.tsx の更新（state・migration・handlers・rendering）

**Files:**
- Modify: `src/App.tsx`

---

- [ ] **Step 1: `App.tsx` を以下の内容に書き換える**

```tsx
import React from "react";
import Header from "./components/Header";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import CategoryTabs, { Category } from "./components/CategoryTabs";
import "./App.css";

type Item = {
  id: string;
  label: string;
  checked: boolean;
  categoryId: string;
};

type LegacyItem = {
  id: string;
  label: string;
  checked: boolean;
  categoryId?: string;
};

const MIGRATION_CATEGORY_ID = 'migration-general';

function initializeState(): { categories: Category[]; items: Item[] } {
  const savedCategories = localStorage.getItem('categories');
  const savedItems = localStorage.getItem('belongings');

  const parsedCategories: Category[] = (() => {
    if (!savedCategories) return [];
    try { return JSON.parse(savedCategories); } catch { return []; }
  })();

  const parsedItems: LegacyItem[] = (() => {
    if (!savedItems) return [];
    try { return JSON.parse(savedItems); } catch { return []; }
  })();

  const needsMigration = parsedItems.some((item) => !item.categoryId);
  if (!needsMigration) {
    return { categories: parsedCategories, items: parsedItems as Item[] };
  }

  const generalCategory: Category = { id: MIGRATION_CATEGORY_ID, name: '全般' };
  const alreadyExists = parsedCategories.some((c) => c.id === MIGRATION_CATEGORY_ID);

  return {
    categories: alreadyExists ? parsedCategories : [...parsedCategories, generalCategory],
    items: parsedItems.map((item) => ({
      ...item,
      categoryId: item.categoryId ?? MIGRATION_CATEGORY_ID,
    })),
  };
}

function App() {
  const init = React.useRef(initializeState());

  const [categories, setCategories] = React.useState<Category[]>(init.current.categories);
  const [items, setItems] = React.useState<Item[]>(init.current.items);
  const [activeTab, setActiveTab] = React.useState<string>('all');

  React.useEffect(() => {
    localStorage.setItem('belongings', JSON.stringify(items));
  }, [items]);

  React.useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = (name: string) => {
    const newCategory: Category = { id: Date.now().toString(), name };
    setCategories([...categories, newCategory]);
    setActiveTab(newCategory.id);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    setItems(items.filter((item) => item.categoryId !== id));
    setActiveTab('all');
  };

  const handleAdd = (label: string) => {
    if (activeTab === 'all') return;
    const newItem: Item = {
      id: Date.now().toString(),
      label,
      checked: false,
      categoryId: activeTab,
    };
    setItems([...items, newItem]);
  };

  const handleToggle = (id: string) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const displayedItems = activeTab === 'all'
    ? items
    : items.filter((item) => item.categoryId === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <Header />
        <CategoryTabs
          categories={categories}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
        {activeTab !== 'all' && <AddItemForm onAdd={handleAdd} />}
        {activeTab === 'all' && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
            カテゴリタブでアイテムを追加・削除できます
          </p>
        )}
        <ItemList
          items={displayedItems}
          onToggle={handleToggle}
          onDelete={activeTab !== 'all' ? handleDelete : undefined}
        />
      </div>
    </div>
  );
}

export default App;
```

---

- [ ] **Step 2: ビルドエラーがないか確認する**

```bash
npm run build 2>&1 | tail -20
```

期待される出力: `✓ built in` で終わること（エラーなし）

---

- [ ] **Step 3: lint を実行する**

```bash
npm run lint
```

期待される出力: エラーなし

---

- [ ] **Step 4: 開発サーバーで動作確認する**

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開き、以下を確認する:

1. 「全て」タブが初期表示されること
2. インフォバナー（「カテゴリタブでアイテムを追加・削除できます」）が表示されること
3. 「＋」ボタンをクリックするとカテゴリ追加フォームが出現すること
4. カテゴリ名を入力して「追加」するとタブが追加され、そのタブに切り替わること
5. カテゴリタブで AddItemForm が表示されること
6. アイテムを追加するとそのカテゴリのみに表示されること
7. 「全て」タブで全カテゴリのアイテムが一覧表示されること
8. アクティブなカテゴリタブに🗑アイコンが表示されること
9. 🗑をクリックするとカテゴリとアイテムが削除され「全て」タブに戻ること
10. ページリロード後もデータが保持されること（localStorage）

---

- [ ] **Step 5: コミットする**

```bash
git add src/App.tsx
git commit -m "カテゴリ機能をApp.tsxに統合 #4"
```