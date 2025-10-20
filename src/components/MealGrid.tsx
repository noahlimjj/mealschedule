import React from 'react';
import { useMeal } from '../context/MealContext';
import { getWeekDates, formatDate, formatDisplayDate, isToday } from '../utils/dateUtils';

const MealGrid: React.FC = () => {
  const { currentGroup, currentUser, toggleMeal, getUserMealStatus } = useMeal();

  if (!currentGroup || !currentUser) {
    return (
      <div className="text-center py-12 text-gray-500">
        Please select a user to view and edit meal schedule
      </div>
    );
  }

  const weekDates = getWeekDates();

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Header Row */}
        <div className="grid grid-cols-[200px_repeat(8,_1fr)] gap-3 mb-3">
          <div className="font-medium text-gray-700">User</div>
          {weekDates.map((date) => (
            <div
              key={formatDate(date)}
              className={`text-center py-2 rounded-lg ${
                isToday(date) ? 'bg-blue-50 font-medium text-blue-900' : 'text-gray-700'
              }`}
            >
              <div className="text-sm">{formatDisplayDate(date)}</div>
            </div>
          ))}
        </div>

        {/* User Rows */}
        {currentGroup.users.map((user) => (
          <div key={user.id} className="mb-6">
            <div className="grid grid-cols-[200px_repeat(8,_1fr)] gap-3 items-start">
              {/* User Info */}
              <div className="flex items-center gap-2 py-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: user.color }}
                />
                <span className="font-medium text-gray-900 truncate">
                  {user.name}
                  {user.id === currentUser.id && (
                    <span className="text-xs text-gray-500 ml-1">(You)</span>
                  )}
                </span>
              </div>

              {/* Meal Checkboxes for Each Day */}
              {weekDates.map((date) => {
                const dateStr = formatDate(date);
                const mealStatus = getUserMealStatus(user.id, dateStr);
                const isCurrentUser = user.id === currentUser.id;

                return (
                  <div
                    key={dateStr}
                    className={`border rounded-lg p-3 ${
                      isToday(date) ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Lunch */}
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={mealStatus.lunch}
                          onChange={() => isCurrentUser && toggleMeal(dateStr, 'lunch')}
                          disabled={!isCurrentUser}
                          className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                            !isCurrentUser ? 'cursor-not-allowed opacity-60' : ''
                          }`}
                        />
                        <span className="text-sm text-gray-700">Lunch</span>
                      </label>

                      {/* Dinner */}
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={mealStatus.dinner}
                          onChange={() => isCurrentUser && toggleMeal(dateStr, 'dinner')}
                          disabled={!isCurrentUser}
                          className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                            !isCurrentUser ? 'cursor-not-allowed opacity-60' : ''
                          }`}
                        />
                        <span className="text-sm text-gray-700">Dinner</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealGrid;
