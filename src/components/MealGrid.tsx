import React, { useState } from 'react';
import { useMeal } from '../context/MealContextFirebase';
import { getWeekDates, getWeekRange, formatDate, formatDisplayDate, isToday } from '../utils/dateUtils';

const MealGrid: React.FC = () => {
  const { currentGroup, currentUser, toggleMeal, getUserMealStatus, getMealCount } = useMeal();
  const [weekOffset, setWeekOffset] = useState(0);

  if (!currentGroup) return null;

  const weekDates = getWeekDates(weekOffset);
  const weekRange = getWeekRange(weekOffset);

  if (currentGroup.users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-12">
        <div className="text-center text-gray-500">
          <p className="text-lg">Add people to start tracking meals</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-12">
        <div className="text-center text-gray-500">
          <p className="text-lg">Select a person above to view and edit their meal schedule</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300">
      {/* Week Navigation Header */}
      <div className="border-b-2 border-gray-300 px-6 py-4">
        <div className="flex items-center justify-center gap-6 max-w-2xl mx-auto">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 transition shadow-sm"
          >
            ← Prev Week
          </button>
          <div className="text-center min-w-[200px]">
            <h2 className="text-xl font-bold text-gray-900">{weekRange}</h2>
            {weekOffset === 0 && <p className="text-sm text-gray-500">Current Week</p>}
          </div>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 transition shadow-sm"
          >
            Next Week →
          </button>
        </div>
      </div>

      <div className="p-6 overflow-x-auto">
        <div className="min-w-max">
          {/* Header Row with Day Names */}
          <div className="grid grid-cols-[140px_repeat(8,_minmax(140px,_1fr))] gap-3 mb-4">
            <div className="font-semibold text-gray-700 text-sm">Person</div>
            {weekDates.map((date) => (
              <div
                key={formatDate(date)}
                className={`text-center py-3 rounded-lg border-2 font-semibold ${
                  isToday(date)
                    ? 'bg-blue-100 border-blue-400 text-blue-900'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-sm">{formatDisplayDate(date)}</div>
              </div>
            ))}
          </div>

          {/* User Rows */}
          {currentGroup.users.map((user) => (
            <div key={user.id} className="mb-3">
              <div className="grid grid-cols-[140px_repeat(8,_minmax(140px,_1fr))] gap-3 items-stretch">
                {/* User Info */}
                <div className="flex items-center gap-2 py-2">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm border-2 border-white"
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="font-medium text-gray-900 text-sm truncate">
                    {user.name}
                    {user.id === currentUser.id && (
                      <span className="text-xs text-blue-600 ml-1">(You)</span>
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
                      className={`border-2 rounded-lg p-3 ${
                        isToday(date)
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-300 bg-white'
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
                            className={`w-4 h-4 rounded border-2 border-gray-400 text-blue-600 focus:ring-2 focus:ring-blue-500 ${
                              !isCurrentUser ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                          />
                          <span className="text-sm font-medium text-gray-700">Lunch</span>
                        </label>

                        {/* Dinner */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={mealStatus.dinner}
                            onChange={() => isCurrentUser && toggleMeal(dateStr, 'dinner')}
                            disabled={!isCurrentUser}
                            className={`w-4 h-4 rounded border-2 border-gray-400 text-blue-600 focus:ring-2 focus:ring-blue-500 ${
                              !isCurrentUser ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                          />
                          <span className="text-sm font-medium text-gray-700">Dinner</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Totals Row */}
          <div className="mt-6 pt-4 border-t-2 border-gray-300">
            <div className="grid grid-cols-[140px_repeat(8,_minmax(140px,_1fr))] gap-3">
              <div className="font-bold text-gray-900 text-sm py-2">Totals</div>
              {weekDates.map((date) => {
                const dateStr = formatDate(date);
                const lunchCount = getMealCount(dateStr, 'lunch');
                const dinnerCount = getMealCount(dateStr, 'dinner');

                return (
                  <div
                    key={dateStr}
                    className={`border-2 rounded-lg p-3 ${
                      isToday(date)
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">Lunch:</span>
                        <span className="font-bold text-gray-900">
                          {lunchCount.count}/{lunchCount.total}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">Dinner:</span>
                        <span className="font-bold text-gray-900">
                          {dinnerCount.count}/{dinnerCount.total}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealGrid;
