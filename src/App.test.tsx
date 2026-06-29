import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// カテゴリを1件追加するヘルパー。追加後はそのカテゴリがアクティブになる
async function addCategory(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.click(screen.getByRole('button', { name: '＋' }));
  await user.type(screen.getByPlaceholderText('カテゴリ名を入力...'), name);
  await user.click(screen.getByRole('button', { name: '追加' }));
}

// アクティブなカテゴリにアイテムを1件追加するヘルパー
async function addItem(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.type(screen.getByPlaceholderText('アイテムを入力...'), label);
  await user.click(screen.getByRole('button', { name: '追加' }));
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初期表示では「全て」タブで、アイテム追加フォームの代わりに案内文が出る', () => {
    render(<App />);

    expect(screen.getByText('カテゴリタブでアイテムを追加・削除できます')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('アイテムを入力...')).not.toBeInTheDocument();
  });

  it('カテゴリを追加するとそのタブがアクティブになり、アイテムを追加できる', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addCategory(user, '旅行');
    // カテゴリ追加後はアイテム追加フォームが表示される
    expect(screen.getByPlaceholderText('アイテムを入力...')).toBeInTheDocument();

    await addItem(user, 'パスポート');
    expect(screen.getByText('パスポート')).toBeInTheDocument();
  });

  it('アイテムのチェックを切り替えるとlocalStorageに保存される', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addCategory(user, '旅行');
    await addItem(user, 'パスポート');

    const toggle = screen.getByRole('switch', { name: 'パスポート' });
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(toggle).toBeChecked();

    const saved = JSON.parse(localStorage.getItem('belongings') ?? '[]');
    expect(saved).toHaveLength(1);
    expect(saved[0].checked).toBe(true);
  });

  it('「すべてON」で表示中の全アイテムにチェックが入り、「すべてOFF」で外れる', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addCategory(user, '旅行');
    await addItem(user, 'パスポート');
    await addItem(user, '財布');

    await user.click(screen.getByRole('button', { name: 'すべてON' }));
    for (const toggle of screen.getAllByRole('switch')) {
      expect(toggle).toBeChecked();
    }

    await user.click(screen.getByRole('button', { name: 'すべてOFF' }));
    for (const toggle of screen.getAllByRole('switch')) {
      expect(toggle).not.toBeChecked();
    }
  });

  it('カテゴリを削除すると確認モーダルが出て、確定でカテゴリとアイテムが消える', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addCategory(user, '旅行');
    await addItem(user, 'パスポート');

    await user.click(screen.getByRole('button', { name: 'カテゴリを削除' }));

    const dialog = screen.getByRole('dialog', { name: 'カテゴリを削除しますか？' });
    expect(within(dialog).getByText(/1件/)).toBeInTheDocument();

    // モーダル内の確定ボタン（デフォルトラベル「削除」）を押す
    await user.click(within(dialog).getByRole('button', { name: '削除' }));

    // 「全て」タブに戻り、アイテムも消えている
    expect(screen.getByText('カテゴリタブでアイテムを追加・削除できます')).toBeInTheDocument();
    expect(screen.queryByText('パスポート')).not.toBeInTheDocument();
  });

  it('同一カテゴリ内に同名アイテムは追加できない', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addCategory(user, '旅行');
    await addItem(user, '財布');
    await addItem(user, '財布');

    // 重複は弾かれ、「財布」は1件のみ
    expect(screen.getAllByText('財布')).toHaveLength(1);
  });

  it('同名カテゴリは追加できない', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addCategory(user, '旅行');

    // 2回目のカテゴリ追加試行
    await user.click(screen.getByRole('button', { name: '＋' }));
    const categoryInput = screen.getByPlaceholderText('カテゴリ名を入力...');
    await user.type(categoryInput, '旅行');

    // カテゴリ追加フォーム内の「追加」ボタンのみを対象にする
    const addButtons = screen.getAllByRole('button', { name: '追加' });
    // カテゴリフォーム内のボタン（通常は最初の方）
    await user.click(addButtons[0]);

    // 重複は弾かれ、「旅行」タブは1つのみ
    expect(screen.getAllByRole('button', { name: '旅行' })).toHaveLength(1);
  });
});