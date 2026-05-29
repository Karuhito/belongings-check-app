import React from "react";
import Header from "./components/Header";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import "./App.css";

type Item = {
  id: string;
  label: string;
  checked: boolean;
};


function App() {
  const [items, setItems] = React.useState<Item[]>(() => {
    const saved = localStorage.getItem('belongings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem('belongings');
      }
    }
    return [];
  });

  React.useEffect(() => {
    localStorage.setItem('belongings', JSON.stringify(items))
  }, [items])

  const handleAdd = (label: string) => {
    const newItem: Item = {
      id: Date.now().toString(),
      label,
      checked: false,
    }
    setItems([...items, newItem])
  }

  const handleToggle = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <Header />
        <AddItemForm onAdd={handleAdd} />
        <ItemList items={items} onToggle={handleToggle} onDelete={handleDelete} />
      </div>
    </div>
  )
}

export default App;
