import React from "react";
import Header from "./components/Header";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import CategoryTabs from "./components/CategoryTabs";
import type { Category } from "./components/CategoryTabs";
import ConfirmModal from "./components/ConfirmModal";
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

// モジュールロード時に1回だけ初期化（StrictModeの二重呼び出し対策）
const _initialState = initializeState();

function App() {
  const [categories, setCategories] = React.useState<Category[]>(_initialState.categories);
  const [items, setItems] = React.useState<Item[]>(_initialState.items);
  const [activeTab, setActiveTab] = React.useState<string>('all');
  const [pendingDeleteCategoryId, setPendingDeleteCategoryId] = React.useState<string | null>(null);

  React.useEffect(() => {
    localStorage.setItem('belongings', JSON.stringify(items));
  }, [items]);

  React.useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = (name: string) => {
    const newCategory: Category = { id: crypto.randomUUID(), name };
    setCategories([...categories, newCategory]);
    setActiveTab(newCategory.id);
  };

  const handleDeleteCategory = (id: string) => {
    setPendingDeleteCategoryId(id);
  };

  const confirmDeleteCategory = () => {
    if (pendingDeleteCategoryId === null) return;
    setCategories(categories.filter((c) => c.id !== pendingDeleteCategoryId));
    setItems(items.filter((item) => item.categoryId !== pendingDeleteCategoryId));
    setActiveTab('all');
    setPendingDeleteCategoryId(null);
  };

  const handleAdd = (label: string) => {
    if (activeTab === 'all') return;
    const newItem: Item = {
      id: crypto.randomUUID(),
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

  const pendingDeleteCategory = pendingDeleteCategoryId === null
    ? null
    : categories.find((c) => c.id === pendingDeleteCategoryId) ?? null;
  const pendingDeleteItemCount = pendingDeleteCategoryId === null
    ? 0
    : items.filter((item) => item.categoryId === pendingDeleteCategoryId).length;

  const handleToggleAll = () => {
    const allChecked = displayedItems.length > 0 && displayedItems.every(item => item.checked);
    const displayedIds = new Set(displayedItems.map(item => item.id));
    setItems(items.map(item =>
      displayedIds.has(item.id) ? { ...item, checked: !allChecked } : item
    ));
  };

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
        <ItemList
          items={displayedItems}
          onToggle={handleToggle}
          onDelete={activeTab !== 'all' ? handleDelete : undefined}
        />
      </div>
      {pendingDeleteCategory && (
        <ConfirmModal
          title="カテゴリを削除しますか？"
          message={
            pendingDeleteItemCount > 0
              ? `「${pendingDeleteCategory.name}」とその中の${pendingDeleteItemCount}件のアイテムが削除されます。この操作は元に戻せません。`
              : `「${pendingDeleteCategory.name}」を削除します。この操作は元に戻せません。`
          }
          onConfirm={confirmDeleteCategory}
          onCancel={() => setPendingDeleteCategoryId(null)}
        />
      )}
    </div>
  );
}

export default App;
