type Item = {
  id: string;
  label: string;
  checked: boolean;
};

type Props = {
  item: Item;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function ItemCard({ item, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
      <input
        type="text"
        checked={item.checked}
        onChange={() => onToggle(item.id)}
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
        onClick={() => onDelete(item.id)}
        className="text-gray-300 hover:text-red-400 text-sm"
      >
        x
      </button>
    </li>
  );
}

export default ItemCard;
