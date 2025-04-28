import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserSelect from './UserSelect';

const mockUsers = [
  { email: 'user1@example.com', user_id: '1', username: 'User One' },
  { email: 'user2@example.com', user_id: '2', username: 'User Two' },
  { email: 'user3@example.com', user_id: '3', username: 'User Three' },
];

// Properly redefine global.fetch with type casting
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockUsers),
    })
  ) as jest.Mock;
});

describe('UserSelect Component', () => {
  const mockOnUserSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<UserSelect selectedUsers={[]} onUserSelect={mockOnUserSelect} />);
    expect(container).toBeTruthy();
  });

  it('fetches and displays users when typing in the search box', async () => {
    render(<UserSelect selectedUsers={[]} onUserSelect={mockOnUserSelect} />);

    fireEvent.change(screen.getByPlaceholderText('Type email to search users...'), {
      target: { value: 'user' },
    });

    await waitFor(() => {
      expect(screen.getByText('user1@example.com (User One)')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com (User Two)')).toBeInTheDocument();
    });
  });

  it('filters out already selected users from the dropdown', async () => {
    render(<UserSelect selectedUsers={['1']} onUserSelect={mockOnUserSelect} />);

    fireEvent.change(screen.getByPlaceholderText('Type email to search users...'), {
      target: { value: 'user' },
    });

    await waitFor(() => {
      expect(screen.queryByText('user1@example.com (User One)')).not.toBeInTheDocument();
      expect(screen.getByText('user2@example.com (User Two)')).toBeInTheDocument();
    });
  });

  it('allows selecting a user and updates the selected list', async () => {
    render(<UserSelect selectedUsers={[]} onUserSelect={mockOnUserSelect} />);

    fireEvent.change(screen.getByPlaceholderText('Type email to search users...'), {
      target: { value: 'user' },
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('user1@example.com (User One)'));
    });

    expect(mockOnUserSelect).toHaveBeenCalledWith(['1']);
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
  });

  it('allows removing a selected user', async () => {
    render(<UserSelect selectedUsers={['1']} onUserSelect={mockOnUserSelect} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('×'));
    });

    expect(mockOnUserSelect).toHaveBeenCalledWith([]);
    expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
  });

  it('handles no users found gracefully', async () => {
    render(<UserSelect selectedUsers={[]} onUserSelect={mockOnUserSelect} />);

    fireEvent.change(screen.getByPlaceholderText('Type email to search users...'), {
      target: { value: 'nonexistent' },
    });

    await waitFor(() => {
      expect(screen.getByText('No users found')).toBeInTheDocument();
    });
  });

  it('closes the dropdown when clicking outside', async () => {
    render(<UserSelect selectedUsers={[]} onUserSelect={mockOnUserSelect} />);

    fireEvent.change(screen.getByPlaceholderText('Type email to search users...'), {
      target: { value: 'user' },
    });

    await waitFor(() => {
      expect(screen.getByText('user1@example.com (User One)')).toBeInTheDocument();
    });

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('user1@example.com (User One)')).not.toBeInTheDocument();
    });
  });

  // Simpler test for function calls
  it('calls onUserSelect when a user is selected', async () => {
    render(<UserSelect selectedUsers={[]} onUserSelect={mockOnUserSelect} />);

    fireEvent.change(screen.getByPlaceholderText('Type email to search users...'), {
      target: { value: 'user' },
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('user1@example.com (User One)'));
    });

    expect(mockOnUserSelect).toHaveBeenCalledTimes(1);
    expect(mockOnUserSelect).toHaveBeenCalledWith(['1']);
  });
});
