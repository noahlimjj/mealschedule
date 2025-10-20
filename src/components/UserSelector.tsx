import React, { useState } from 'react';
import { useMeal } from '../context/MealContextFirebase';

const UserSelector: React.FC = () => {
  const { currentGroup, currentUser, setCurrentUser, addUserToGroup } = useMeal();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  if (!currentGroup) return null;

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim()) {
      addUserToGroup(newUserName.trim());
      setNewUserName('');
      setIsAddingUser(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Select User</h2>
        {currentGroup.users.length < 10 && (
          <button
            onClick={() => setIsAddingUser(!isAddingUser)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {isAddingUser ? 'Cancel' : '+ Add User'}
          </button>
        )}
      </div>

      {isAddingUser && (
        <form onSubmit={handleAddUser} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
            >
              Add
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {currentGroup.users.map((user) => (
          <button
            key={user.id}
            onClick={() => setCurrentUser(user.id)}
            className={`p-3 rounded-lg border-2 transition ${
              currentUser?.id === user.id
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full mb-2 mx-auto"
              style={{ backgroundColor: user.color }}
            />
            <div className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserSelector;
