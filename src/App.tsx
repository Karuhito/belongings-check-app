import React from "react";
import Header from "./components/Header";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import CategoryTabs from "./components/CategoryTabs";
import type { Item } from "./types";
import type { Category } from "./types";
import ConfirmModal from "./components/ConfirmModal";
import { saveToStorage } from "./utils/storage";
import { isDuplicateCategoryName, isDuplicateItemLabel } from "./utils/duplicateCheck";
import "./App.css";

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
  // 保存対象ごとに失敗状態を保持し、どちらかが失敗していればバナーを表示する
  const [itemsSaveFailed, setItemsSaveFailed] = React.useState<boolean>(false);
  const [categoriesSaveFailed, setCategoriesSaveFailed] = React.useState<boolean>(false);
  const saveError = itemsSaveFailed || categoriesSaveFailed;

  // state更新と同時にlocalStorageへ保存し、失敗時はバナー表示用フラグを更新する
  const persistItems = (next: Item[]) => {
    setItems(next);
    setItemsSaveFailed(!saveToStorage('belongings', next));
  };

  const persistCategories = (next: Category[]) => {
    setCategories(next);
    setCategoriesSaveFailed(!saveToStorage('categories', next));
  };

  const handleAddCategory = (name: string): boolean => {
    if (isDuplicateCategoryName(categories, name)) return false;
    const newCategory: Category = { id: crypto.randomUUID(), name: name.trim() };
    persistCategories([...categories, newCategory]);
    setActiveTab(newCategory.id);
    return true;
  };

  const handleDeleteCategory = (id: string) => {
    setPendingDeleteCategoryId(id);
  };

  const confirmDeleteCategory = () => {
    if (pendingDeleteCategoryId === null) return;
    persistCategories(categories.filter((c) => c.id !== pendingDeleteCategoryId));
    persistItems(items.filter((item) => item.categoryId !== pendingDeleteCategoryId));
    setActiveTab('all');
    setPendingDeleteCategoryId(null);
  };

  const handleAdd = (label: string): boolean => {
    if (activeTab === 'all') return false;
    if (isDuplicateItemLabel(items, activeTab, label)) return false;
    const newItem: Item = {
      id: crypto.randomUUID(),
      label: label.trim(),
      checked: false,
      categoryId: activeTab,
    };
    persistItems([...items, newItem]);
    return true;
  };

  const handleToggle = (id: string) => {
    persistItems(items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleDelete = (id: string) => {
    persistItems(items.filter((item) => item.id !== id));
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
    persistItems(items.map(item =>
      displayedIds.has(item.id) ? { ...item, checked: !allChecked } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <Header />
        {saveError && (
          <div
            role="alert"
            className="text-sm text-red-700 bg-red-50 border border-red-300 rounded-lg px-3 py-2 mb-4"
          >
            データの保存に失敗しました。ブラウザの保存容量が不足しているか、プライベートブラウジングが有効になっている可能性があります。変更内容は保存されていないため、容量を空けるか通常モードで開き直してください。
          </div>
        )}
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
