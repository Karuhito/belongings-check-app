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