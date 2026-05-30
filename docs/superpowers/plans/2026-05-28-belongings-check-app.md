# 持ち物チェックリストアプリ 実装計画

> **注意:** このプランはあなた自身がコーディングを行うための学習ガイドです。Claudeはコーチ役として各ステップをサポートします。

**Goal:** 持ち物を登録・チェック・削除できるシンプルなチェックリストアプリを作る

**Architecture:** フェーズ1でApp.tsx1ファイルに全機能を実装し、フェーズ2でコンポーネントに分割する。状態管理はuseState、永続化はLocalStorage。

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vite

---

## ファイル構成（最終形）

```
src/
├── App.tsx                ← state と LocalStorage のみ（最終形）
├── index.css              ← Tailwind の設定（変更なし）
├── main.tsx               ← エントリポイント（変更なし）
└── components/
    ├── Header.tsx
    ├── AddItemForm.tsx
    ├── ItemList.tsx
    └── ItemCard.tsx
```

---

## フェーズ1 — App.tsx に全部書く

### Task 1: App.tsx をクリーンアップする

**学ぶこと:** Reactプロジェクトのデフォルトコードを削除し、白紙から始める

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [x] **Step 1: App.css の中身をすべて削除する**

`src/App.css` を開いて、中身をすべて削除して空ファイルにする。

- [x] **Step 2: App.tsx を最小構成に書き直す**

`src/App.tsx` の中身をすべて消して、以下を入力する:

```tsx
function App() {
  return (
    <div>
      <h1>持ち物チェックリスト</h1>
    </div>
  )
}

export default App
```

- [ ] **Step 3: ブラウザで確認する**

ターミナルで `npm run dev` を実行し、`http://localhost:5173` を開く。
「持ち物チェックリスト」という文字が表示されれば OK。

---

### Task 2: 型定義と useState を追加する

**学ぶこと:** TypeScriptの型定義、ReactのuseState（状態管理の基本）

**Files:**
- Modify: `src/App.tsx`

- [x] **Step 1: Item 型を定義する**

`App.tsx` の先頭（`function App()` の前）に以下を追加する:

```tsx
type Item = {
  id: string
  label: string
  checked: boolean
}
```

**解説:** `type` はTypeScriptで「このデータの形」を定義するもの。アイテムはID・ラベル・チェック状態の3つを持つと決めている。

- [x] **Step 2: useState でアイテムリストを管理する**

`function App()` の中（`return` の前）に以下を追加する:

```tsx
const [items, setItems] = React.useState<Item[]>([])
```

`React.useState` を使うには `import React from 'react'` が必要。ファイル先頭に追加する:

```tsx
import React from 'react'
```

**解説:** `useState` は「変わりうる値」を管理するReactの機能。`items` が現在の値、`setItems` が値を変える関数。`<Item[]>` は「Item型の配列」という型指定。

- [x] **Step 3: ブラウザでエラーがないか確認する**

ブラウザを開いてエラーが出ていないか確認。エラーがなければ OK。

---

### Task 3: LocalStorage 連携を実装する

**学ぶこと:** useEffect（副作用の管理）、LocalStorage への読み書き

**Files:**
- Modify: `src/App.tsx`

- [x] **Step 1: アプリ起動時に LocalStorage からデータを読み込む**

`useState` の行の下に以下を追加する:

```tsx
React.useEffect(() => {
  const saved = localStorage.getItem('belongings')
  if (saved) {
    setItems(JSON.parse(saved))
  }
}, [])
```

**解説:** `useEffect` は「画面が表示されたとき」や「値が変わったとき」に実行される処理。`[]` を渡すと「初回表示のときだけ」実行される。LocalStorageはテキストしか保存できないので `JSON.parse` で変換している。

- [x] **Step 2: items が変わるたびに LocalStorage に保存する**

上のuseEffectの直後に以下を追加する:

```tsx
React.useEffect(() => {
  localStorage.setItem('belongings', JSON.stringify(items))
}, [items])
```

**解説:** `[items]` を渡すと「items が変わるたびに」実行される。`JSON.stringify` でオブジェクトをテキストに変換して保存している。

- [x] **Step 3: 動作確認する**

ブラウザのDevTools（F12）→「Application」→「Local Storage」を開く。
まだアイテムがないので `[]` が保存されているはず。

---

### Task 4: アイテムを追加する機能を実装する

**学ぶこと:** フォーム入力の管理、配列に要素を追加するパターン

**Files:**
- Modify: `src/App.tsx`

- [x] **Step 1: 入力欄の値を管理する state を追加する**

`items` の useState の下に追加:

```tsx
const [inputValue, setInputValue] = React.useState('')
```

- [x] **Step 2: アイテムを追加する関数を書く**

useEffect群の下に追加:

```tsx
const handleAdd = () => {
  if (inputValue.trim() === '') return
  const newItem: Item = {
    id: Date.now().toString(),
    label: inputValue.trim(),
    checked: false,
  }
  setItems([...items, newItem])
  setInputValue('')
}
```

**解説:**
- `inputValue.trim() === ''` で空欄チェック。空なら何もしない。
- `Date.now().toString()` でユニークなIDを生成。
- `[...items, newItem]` は「既存のアイテム全部 + 新しいアイテム」という新しい配列を作る。Reactでは配列を直接変更せず、新しい配列を作って渡す。

- [x] **Step 3: フォームのUIを追加する**

`return` の中の `<h1>` の下に追加:

```tsx
<div>
  <input
    type="text"
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    placeholder="アイテムを入力..."
  />
  <button onClick={handleAdd}>追加</button>
</div>
```

- [x] **Step 4: ブラウザで追加が動くか確認する**

テキストを入力して「追加」ボタンを押す。DevToolsのLocalStorageにデータが追加されればOK（まだ画面には表示されない）。

---

### Task 5: アイテム一覧を画面に表示する

**学ぶこと:** 配列の map でリストを表示するパターン、key の重要性

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: アイテム一覧のUIを追加する**

フォームの `</div>` の下に追加:

```tsx
<ul>
  {items.map((item) => (
    <li key={item.id}>
      <span>{item.label}</span>
    </li>
  ))}
</ul>
```

**解説:**
- `items.map(...)` は配列の各要素に対して処理を行い、新しい配列を返すJavaScriptの機能。
- `key={item.id}` はReactがどの要素が変わったかを識別するための必須の属性。

- [x] **Step 2: ブラウザで追加したアイテムが表示されるか確認する**

アイテムを追加して、画面に一覧表示されればOK。

---

### Task 6: チェックON/OFFと削除機能を実装する

**学ぶこと:** 配列の map/filter を使った状態更新パターン

**Files:**
- Modify: `src/App.tsx`

- [x] **Step 1: チェックを切り替える関数を書く**

`handleAdd` の下に追加:

```tsx
const handleToggle = (id: string) => {
  setItems(
    items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    )
  )
}
```

**解説:** `items.map` で全アイテムをループし、IDが一致するものだけ `checked` を反転させた新しいオブジェクトを返す。`{ ...item, checked: !item.checked }` は「itemの全プロパティをコピーして、checkedだけ上書き」という意味。

- [x] **Step 2: 削除する関数を書く**

`handleToggle` の下に追加:

```tsx
const handleDelete = (id: string) => {
  setItems(items.filter((item) => item.id !== id))
}
```

**解説:** `filter` は条件に合う要素だけを残した新しい配列を返す。「IDが一致しないもの = 削除対象以外」だけを残している。

- [x] **Step 3: リストのUIにチェックボックスと削除ボタンを追加する**

`<li>` の中を書き換える:

```tsx
<li key={item.id}>
  <input
    type="checkbox"
    checked={item.checked}
    onChange={() => handleToggle(item.id)}
  />
  <span style={{ textDecoration: item.checked ? 'line-through' : 'none' }}>
    {item.label}
  </span>
  <button onClick={() => handleDelete(item.id)}>削除</button>
</li>
```

- [x] **Step 4: ブラウザで全機能が動くか確認する**

以下をすべて確認する:
- アイテムを追加できる
- チェックボックスを押すと取り消し線が入る
- 削除ボタンでアイテムが消える
- ページをリロードしてもデータが残っている

---

### Task 7: Tailwind CSS でスタイリングする

**学ぶこと:** Tailwindのユーティリティクラスの使い方

**Files:**
- Modify: `src/App.tsx`

- [x] **Step 1: 全体のレイアウトを整える**

`App.tsx` の `return` の中を以下のように書き換える（ロジック部分はそのまま）:

```tsx
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
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
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
              className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}
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
)
```

- [x] **Step 2: ブラウザでスタイルを確認する**

見た目がシンプル・ミニマルに整っていることを確認する。

---

## フェーズ2 — コンポーネントに分割する

### Task 8: components ディレクトリを作る

- [ ] **Step 1: フォルダを作成する**

`src/` の中に `components/` フォルダを作成する（VSCodeのエクスプローラーから右クリック→「新しいフォルダー」）。

---

### Task 9: Header コンポーネントを切り出す

**学ぶこと:** コンポーネント分割の基本、propsの使い方

**Files:**
- Create: `src/components/Header.tsx`
- Modify: `src/App.tsx`

- [x] **Step 1: Header.tsx を作成する**

`src/components/Header.tsx` を新規作成して以下を入力:

```tsx
function Header() {
  return (
    <h1 className="text-2xl font-bold text-gray-800 mb-6">
      持ち物チェックリスト
    </h1>
  )
}

export default Header
```

- [x] **Step 2: App.tsx で Header を使う**

`App.tsx` の先頭に import を追加:

```tsx
import Header from './components/Header'
```

`return` の中の `<h1>...</h1>` を `<Header />` に置き換える。

- [x] **Step 3: ブラウザで表示が変わっていないか確認する**

見た目が変わっていなければOK（動作は同じはず）。

---

### Task 10: AddItemForm コンポーネントを切り出す

**学ぶこと:** 関数を props として渡すパターン

**Files:**
- Create: `src/components/AddItemForm.tsx`
- Modify: `src/App.tsx`

- [x] **Step 1: AddItemForm.tsx を作成する**

```tsx
import React from 'react'

type Props = {
  onAdd: (label: string) => void
}

function AddItemForm({ onAdd }: Props) {
  const [inputValue, setInputValue] = React.useState('')

  const handleSubmit = () => {
    if (inputValue.trim() === '') return
    onAdd(inputValue.trim())
    setInputValue('')
  }

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="アイテムを入力..."
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
      >
        追加
      </button>
    </div>
  )
}

export default AddItemForm
```

**解説:** `inputValue` の状態はフォーム自身が管理する。親（App）には「追加が確定したラベル」だけを `onAdd` で渡す。

- [x] **Step 2: App.tsx を更新する**

`handleAdd` の引数に `label: string` を追加して書き直す:

```tsx
const handleAdd = (label: string) => {
  const newItem: Item = {
    id: Date.now().toString(),
    label,
    checked: false,
  }
  setItems([...items, newItem])
}
```

`inputValue` の useState と古い `handleAdd` は削除する。

import を追加:

```tsx
import AddItemForm from './components/AddItemForm'
```

`return` の中のフォーム部分を `<AddItemForm onAdd={handleAdd} />` に置き換える。

- [x] **Step 3: ブラウザで動作確認する**

追加機能が以前と同じように動けばOK。

---

### Task 11: ItemCard コンポーネントを切り出す

**Files:**
- Create: `src/components/ItemCard.tsx`

- [x] **Step 1: ItemCard.tsx を作成する**

```tsx
type Item = {
  id: string
  label: string
  checked: boolean
}

type Props = {
  item: Item
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function ItemCard({ item, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => onToggle(item.id)}
        className="w-4 h-4 accent-blue-500"
      />
      <span
        className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}
      >
        {item.label}
      </span>
      <button
        onClick={() => onDelete(item.id)}
        className="text-gray-300 hover:text-red-400 text-sm"
      >
        ✕
      </button>
    </li>
  )
}

export default ItemCard
```

---

### Task 12: ItemList コンポーネントを切り出す

**Files:**
- Create: `src/components/ItemList.tsx`
- Modify: `src/App.tsx`

- [x] **Step 1: ItemList.tsx を作成する**

```tsx
import ItemCard from './ItemCard'

type Item = {
  id: string
  label: string
  checked: boolean
}

type Props = {
  items: Item[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

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
  )
}

export default ItemList
```

- [x] **Step 2: App.tsx を最終形に書き直す**

```tsx
import React from 'react'
import Header from './components/Header'
import AddItemForm from './components/AddItemForm'
import ItemList from './components/ItemList'

type Item = {
  id: string
  label: string
  checked: boolean
}

function App() {
  const [items, setItems] = React.useState<Item[]>([])

  React.useEffect(() => {
    const saved = localStorage.getItem('belongings')
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

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

export default App
```

- [x] **Step 3: 最終動作確認する**

以下をすべて確認する:
- アイテムの追加・チェック・削除が動く
- ページリロードでデータが保持される
- TypeScriptのエラーがない（`npm run build` が通る）

---

## 完了チェックリスト

- [ ] アイテムの追加が動く
- [ ] チェックON/OFFが動く（取り消し線が入る）
- [ ] 削除が動く
- [ ] リロードしてもデータが残る
- [ ] コンポーネントが4つに分割されている
- [ ] `npm run build` がエラーなく通る
