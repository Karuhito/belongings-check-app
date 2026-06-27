import type { ComponentProps } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryTabs from './CategoryTabs';
import type { Category } from '../types';
import { CATEGORY_NAME_MAX_LENGTH } from '../constants';

const categories: Category[] = [
  { id: 'c1', name: '旅行' },
  { id: 'c2', name: '仕事' },
];

function setup(overrides: Partial<ComponentProps<typeof CategoryTabs>> = {}) {
  const props = {
    categories,
    activeTab: 'all',
    onTabChange: vi.fn(),
    onAddCategory: vi.fn(),
    onDeleteCategory: vi.fn(),
    ...overrides,
  };
  render(<CategoryTabs {...props} />);
  return props;
}

describe('CategoryTabs', () => {
  it('カテゴリタブをクリックするとonTabChangeがそのidで呼ばれる', async () => {
    const user = userEvent.setup();
    const props = setup();

    await user.click(screen.getByRole('button', { name: '旅行' }));

    expect(props.onTabChange).toHaveBeenCalledExactlyOnceWith('c1');
  });

  it('＋ボタンで追加フォームを表示し、入力して追加するとonAddCategoryが呼ばれる', async () => {
    const user = userEvent.setup();
    const props = setup();

    await user.click(screen.getByRole('button', { name: '＋' }));
    const input = screen.getByPlaceholderText('カテゴリ名を入力...');
    await user.type(input, '  買い物  ');
    await user.click(screen.getByRole('button', { name: '追加' }));

    expect(props.onAddCategory).toHaveBeenCalledExactlyOnceWith('買い物');
  });

  it('activeTabがall以外のときカテゴリ削除ボタンが表示され、クリックでonDeleteCategoryが呼ばれる', async () => {
    const user = userEvent.setup();
    const props = setup({ activeTab: 'c1' });

    await user.click(screen.getByRole('button', { name: 'カテゴリを削除' }));

    expect(props.onDeleteCategory).toHaveBeenCalledExactlyOnceWith('c1');
  });

  it('activeTabがallのときはカテゴリ削除ボタンが表示されない', () => {
    setup({ activeTab: 'all' });

    expect(screen.queryByRole('button', { name: 'カテゴリを削除' })).not.toBeInTheDocument();
  });

  it('カテゴリ名が上限に達するとカウンターがオレンジ色になる', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('button', { name: '＋' }));
    await user.type(screen.getByPlaceholderText('カテゴリ名を入力...'), 'あ'.repeat(CATEGORY_NAME_MAX_LENGTH));

    const counter = screen.getByText(`${CATEGORY_NAME_MAX_LENGTH}/${CATEGORY_NAME_MAX_LENGTH}`);
    expect(counter).toHaveClass('text-orange-500');
  });
});