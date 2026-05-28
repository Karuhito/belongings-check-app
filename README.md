# 持ち物チェックリストアプリ

外出前の持ち物確認に使えるシンプルなチェックリストアプリです。

## 機能

- アイテムの追加（テキスト入力 or Enterキー）
- チェックボックスで持ち物の確認状態をトグル
- アイテムの削除
- データはブラウザの localStorage に自動保存（ページを閉じても消えない）

## 使い方

1. 入力欄にアイテム名を入力し、「追加」ボタンまたは Enter キーを押す
2. 持ち物を確認したらチェックボックスをクリック（取り消し線が入る）
3. 不要なアイテムは「✕」ボタンで削除

## 技術スタック

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 開発環境のセットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:5173` を開くと確認できます。

## ビルド

```bash
npm run build
```
