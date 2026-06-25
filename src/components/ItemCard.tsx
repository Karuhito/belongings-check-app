import type { Item } from "../types";

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
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 shrink-0 ${
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
