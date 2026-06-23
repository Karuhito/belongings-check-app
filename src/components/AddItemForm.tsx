import React from "react";
import { ITEM_LABEL_MAX_LENGTH } from "../constants";

type Props = {
    onAdd : (label: string) => void
}

function AddItemForm({ onAdd }: Props) {
    const [inputValue, setInputValue] = React.useState('');

    const handleSubmit = () => {
        if (inputValue.trim() === '') return
        onAdd(inputValue.trim())
        setInputValue('')
    }

    return (
        <div className="mb-6">
            <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="アイテムを入力..."
                  maxLength={ITEM_LABEL_MAX_LENGTH}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
                >
                    追加
                </button>
            </div>
            <p
              className={`text-xs mt-1 text-right ${
                inputValue.length >= ITEM_LABEL_MAX_LENGTH
                  ? 'text-orange-500'
                  : 'text-gray-400'
              }`}
            >
                {inputValue.length}/{ITEM_LABEL_MAX_LENGTH}
            </p>
        </div>
    )
}

export default AddItemForm