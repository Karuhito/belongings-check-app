import React from "react";
import Header from "./components/header";
import AddItemForm from "./components/AddItemForm";
import "./App.css";


type Item = {
  id: string;
  label: string;
  checked: boolean;
};

function App() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    const saved = localStorage.getItem("belongings");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("belongings", JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    if (inputValue.trim() === "") return;
    const newItem = {
      id: Date.now().toString(),
      label: inputValue.trim(),
      checked: false,
    };
    setItems([...items, newItem]);
    setInputValue("");
  };

  const handleToggle = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          持ち物チェックリスト
        </h1>

        {/* 入力フォーム */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="アイテムを入力..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
          >
            追加
          </button>
        </div>

        {/* アイテム一覧 */}
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleToggle(item.id)}
                className="w-4 h-4 accent-blue-500"
              />
              <span
                className={`flex-1 text-sm ${
                  item.checked ? "line-through text-gray-400" : "text-gray-700"
                }`}
              >
                {item.label}
              </span>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-gray-300 hover:text-red-400 text-sm"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* アイテムがないときのメッセージ */}
        {items.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-6">
            アイテムを追加してください
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
