import React, { useState } from 'react';
import { useMeal } from '../context/MealContextFirebase';

const UserSelector: React.FC = () => {
  const { currentGroup, currentUser, setCurrentUser, addUser } = useMeal();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  if (!currentGroup) return null;

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim()) {
      addUser(newUserName.trim());
      setNewUserName('');
      setIsAddingUser(false);
    }
  };

  // Show add user form prominently if no users exist
  if (currentGroup.users.length === 0) {
    return (
      <div className="mb-6 bg-white rounded-xl shadow-sm border-2 border-gray-300 p-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Get Started</h2>
          <p className="text-gray-600 text-sm">Add your first person to start tracking meals</p>
        </div>
        <form onSubmit={handleAddUser}>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter name"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              autoFocus
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">People ({currentGroup.users.length}/10)</h2>
          {currentGroup.users.length < 10 && (
            <button
              onClick={() => setIsAddingUser(!isAddingUser)}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              {isAddingUser ? 'Cancel' : '+ Add Person'}
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
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                autoFocus
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
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
                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full mb-2 mx-auto shadow-sm"
                style={{ backgroundColor: user.color }}
              />
              <div className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSelector;
