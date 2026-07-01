import React from "react";
import { ITEM_LABEL_MAX_LENGTH } from "../constants";

type Props = {
    onAdd : (label: string) => boolean
}

function AddItemForm({ onAdd }: Props) {
    const [inputValue, setInputValue] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = () => {
        if (inputValue.trim() === '') return
        const added = onAdd(inputValue.trim())
        if (!added) {
            setError(`「${inputValue.trim()}」はこのカテゴリに既に登録されています`)
            return
        }
        setError('')
        setInputValue('')
    }

    return (
        <div className="mb-6">
            <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value.slice(0, ITEM_LABEL_MAX_LENGTH))
                    if (error) setError('')
                  }}
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
            {error && (
                <p className="text-xs mt-1 text-red-500">{error}</p>
            )}
        </div>
    )
}

export default AddItemForm