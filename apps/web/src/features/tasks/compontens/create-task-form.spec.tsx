import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { CreateTaskForm } from './create-task-form';

const mutateAsync = vi.fn();

vi.mock('../hooks/use-create-task', () => ({
  useCreateTask: () => ({
    mutateAsync,
    isPending: false,
    isError: false,
  }),
}));

describe('CreateTaskForm', () => {
  beforeEach(() => {
    mutateAsync.mockReset();
  });

  it('shows validation error when title is empty', async () => {
    const user = userEvent.setup();

    render(<CreateTaskForm />);

    await user.click(
      screen.getByRole('button', {
        name: /create task/i,
      }),
    );

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();

    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('submits valid task data', async () => {
    const user = userEvent.setup();

    mutateAsync.mockResolvedValue({});

    render(<CreateTaskForm />);

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Buy engine oil');

    await user.selectOptions(screen.getByRole('combobox'), 'high');

    await user.click(
      screen.getByRole('button', {
        name: /create task/i,
      }),
    );

    expect(mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Buy engine oil',
        priority: 'high',
      }),
    );
  });
});
