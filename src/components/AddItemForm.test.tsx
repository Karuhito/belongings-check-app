import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddItemForm from './AddItemForm';
import { ITEM_LABEL_MAX_LENGTH } from '../constants';

describe('AddItemForm', () => {
  it('入力して追加ボタンを押すとtrim後の値でonAddが呼ばれ、入力がクリアされる', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddItemForm onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('アイテムを入力...');
    await user.type(input, '  歯ブラシ  ');
    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(onAdd).toHaveBeenCalledExactlyOnceWith('歯ブラシ');
    expect(input).toHaveValue('');
  });

  it('空白のみの入力ではonAddが呼ばれない', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddItemForm onAdd={onAdd} />);

    await user.type(screen.getByPlaceholderText('アイテムを入力...'), '   ');
    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('Enterキーで送信できる', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddItemForm onAdd={onAdd} />);

    await user.type(screen.getByPlaceholderText('アイテムを入力...'), 'タオル{Enter}');

    expect(onAdd).toHaveBeenCalledExactlyOnceWith('タオル');
  });

  it('文字数が上限に達するとカウンターがオレンジ色になる', async () => {
    const user = userEvent.setup();
    render(<AddItemForm onAdd={vi.fn()} />);

    const input = screen.getByPlaceholderText('アイテムを入力...');
    await user.type(input, 'あ'.repeat(ITEM_LABEL_MAX_LENGTH));

    const counter = screen.getByText(`${ITEM_LABEL_MAX_LENGTH}/${ITEM_LABEL_MAX_LENGTH}`);
    expect(counter).toHaveClass('text-orange-500');
  });
});