import React, { useState, useEffect, useRef } from 'react';

interface User {
  email: string;
  user_id: string;
  username: string;
}

interface UserSelectProps {
  selectedUsers: string[];
  onUserSelect: (users: string[]) => void;
}

const UserSelect: React.FC<UserSelectProps> = ({ selectedUsers, onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize selectedEmails based on selectedUsers
  useEffect(() => {
    const fetchSelectedUsers = async () => {
      if (selectedUsers.length > 0) {
        try {
          const response = await fetch('http://127.0.0.1:8000/users');
          if (response.ok) {
            const allUsers = await response.json();
            const selectedUserEmails = allUsers
              .filter((user: User) => selectedUsers.includes(user.user_id))
              .map((user: User) => user.email);
            setSelectedEmails(selectedUserEmails);
          }
        } catch (error) {
          console.error('Error fetching selected users:', error);
        }
      }
    };

    fetchSelectedUsers();
  }, [selectedUsers]);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users...');
        const response = await fetch('http://127.0.0.1:8000/users');
        if (response.ok) {
          const data = await response.json();
          console.log('Users fetched:', data);
          setUsers(data);
        } else {
          console.error('Failed to fetch users:', response.status);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    console.log('Filtering users with search term:', searchTerm);
    console.log('Current users:', users);
    console.log('Current selected emails:', selectedEmails);
    
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedEmails.includes(user.email)
    );
    
    console.log('Filtered users:', filtered);
    setFilteredUsers(filtered);
  }, [searchTerm, users, selectedEmails]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserSelect = (user: User) => {
    console.log('User selected:', user);
    if (!selectedUsers.includes(user.user_id)) {
      const newSelectedUsers = [...selectedUsers, user.user_id];
      const newSelectedEmails = [...selectedEmails, user.email];
      onUserSelect(newSelectedUsers);
      setSelectedEmails(newSelectedEmails);
      setSearchTerm('');
    }
  };

  const handleRemoveUser = (email: string, userId: string) => {
    console.log('Removing user:', email, userId);
    setSelectedEmails(selectedEmails.filter(e => e !== email));
    onUserSelect(selectedUsers.filter(id => id !== userId));
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected users chips */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedEmails.map((email, index) => (
          <div
            key={email}
            className="bg-dcpurple text-white px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{email}</span>
            <button
              onClick={() => handleRemoveUser(email, selectedUsers[index])}
              className="hover:text-red-300"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            console.log('Search term changed:', e.target.value);
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => {
            console.log('Input focused');
            setIsDropdownOpen(true);
          }}
          placeholder="Type email to search users..."
          className="p-2 rounded border border-gray-300 text-black w-full"
        />

        {/* Dropdown */}
        {isDropdownOpen && searchTerm && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-dcpurple rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.user_id}
                  onClick={() => handleUserSelect(user)}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                >
                  {user.email} ({user.username})
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">No users found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSelect; 