import ItemCard from "./ItemCard";
import type { Item } from "../types";

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