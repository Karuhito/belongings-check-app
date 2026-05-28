# 持ち物チェックリストアプリ 設計書

作成日: 2026-05-28

---

## アプリ概要

学校などの外出前に持ち物を確認するためのチェックリストアプリ。
アイテムを登録しておき、出発前にチェックしながら忘れ物を防ぐ。

---

## 技術スタック

| 項目 | 選択 |
|------|------|
| フレームワーク | React 19 + TypeScript |
| スタイリング | Tailwind CSS v4 |
| 状態管理 | useState |
| 永続化 | LocalStorage |
| ビルドツール | Vite |
| サーバー/DB | なし（フロントのみ） |

---

## 機能要件

### MVP（v1）

- アイテムの追加
- アイテムの削除
- チェックのON/OFF切り替え
- LocalStorageによるデータ永続化（リロードしても保持）

### 拡張候補（v2）

- 複数リスト対応（「学校」「部活」「旅行」など）
- リスト単位で「全チェック解除」ボタン
- チェック済みアイテムをまとめて削除

---

## データ設計（LocalStorage）

v2拡張を見越した構造で保存する。MVPでは `lists[0]` 固定で使用。

```json
{
  "lists": [
    {
      "id": "list_1",
      "name": "学校",
      "items": [
        { "id": "item_1", "label": "教科書", "checked": false },
        { "id": "item_2", "label": "水筒", "checked": true }
      ]
    }
  ]
}
```

### 型定義（TypeScript）

```ts
type Item = {
  id: string
  label: string
  checked: boolean
}

type CheckList = {
  id: string
  name: string
  items: Item[]
}
```

### 設計上の判断メモ

- **サーバーレス**: 認証・共有機能が不要なため LocalStorage で完結
- **拡張を見越したデータ構造**: 最初から `lists` 配列で持ち、v2移行時のコード変更を最小限にする
- **ID生成**: `Date.now().toString()` でシンプルに一意性を担保（ライブラリ不要）

---

## 実装アプローチ

### フェーズ1 — App.tsx に全部書く（学習ステップ）

まず `App.tsx` 1ファイルにすべてのロジックとUIを書く。
動く状態を確認してから、コンポーネントに分割する。

**理由**: 「なぜファイルを分けるのか」を体感してから学べるため。

### フェーズ2 — コンポーネントに分割

```
src/
├── App.tsx                ← state と LocalStorage のみ
├── components/
│   ├── Header.tsx
│   ├── AddItemForm.tsx
│   ├── ItemList.tsx
│   └── ItemCard.tsx
```

---

## 画面仕様（MVP）

| エリア | 内容 |
|--------|------|
| ヘッダー | アプリ名表示 |
| 入力フォーム | テキスト入力欄 + 「追加」ボタン（横並び） |
| リスト | チェックボックス + アイテム名 + 削除ボタンの一覧 |

### UIスタイル

- シンプル・ミニマル（白ベース）
- 最大幅 480px、中央配置
- チェック済みアイテムは文字に取り消し線

---

## 今後の実装ステップ

1. ✅ プロジェクト作成（Vite + React + TypeScript + Tailwind CSS）
2. `App.tsx` に state と LocalStorage 連携を実装
3. `App.tsx` に UI（フォーム・リスト）を追加
4. 動作確認後、コンポーネントに分割
5. スタイリング調整
6. デプロイ（Vercel / GitHub Pages）

---

## 学習のポイント

各ステップで以下のReact概念を学ぶ:

| ステップ | 学ぶ概念 |
|----------|----------|
| 2 | useState、useEffect、LocalStorage連携 |
| 3 | イベントハンドラ、フォーム制御、条件付きスタイル |
| 4 | props、コンポーネント分割の考え方 |
| 5 | Tailwind CSS によるスタイリング |
