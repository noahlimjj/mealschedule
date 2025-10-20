import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Group, User, MealStatus } from '../types';

interface MealContextType {
  appData: AppData;
  currentGroup: Group | null;
  currentUser: User | null;
  createGroup: (name: string, userName: string) => void;
  addUserToGroup: (userName: string) => void;
  setCurrentUser: (userId: string) => void;
  toggleMeal: (date: string, mealType: 'lunch' | 'dinner') => void;
  getUserMealStatus: (userId: string, date: string) => MealStatus;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

const STORAGE_KEY = 'meal_schedule_app_data';

const USER_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
  '#6366F1', // indigo
  '#14B8A6', // teal
];

const getInitialData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { groups: {}, currentGroupId: null, currentUserId: null };
    }
  }
  return { groups: {}, currentGroupId: null, currentUserId: null };
};

export const MealProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appData, setAppData] = useState<AppData>(getInitialData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  }, [appData]);

  const currentGroup = appData.currentGroupId
    ? appData.groups[appData.currentGroupId]
    : null;

  const currentUser = currentGroup && appData.currentUserId
    ? currentGroup.users.find(u => u.id === appData.currentUserId) || null
    : null;

  const createGroup = (name: string, userName: string) => {
    const groupId = `group_${Date.now()}`;
    const userId = `user_${Date.now()}`;

    const newUser: User = {
      id: userId,
      name: userName,
      color: USER_COLORS[0],
    };

    const newGroup: Group = {
      id: groupId,
      name,
      users: [newUser],
      meals: {
        [userId]: {},
      },
    };

    setAppData({
      groups: {
        ...appData.groups,
        [groupId]: newGroup,
      },
      currentGroupId: groupId,
      currentUserId: userId,
    });
  };

  const addUserToGroup = (userName: string) => {
    if (!currentGroup) return;
    if (currentGroup.users.length >= 10) {
      alert('Maximum 10 users per group reached');
      return;
    }

    const userId = `user_${Date.now()}`;
    const colorIndex = currentGroup.users.length % USER_COLORS.length;

    const newUser: User = {
      id: userId,
      name: userName,
      color: USER_COLORS[colorIndex],
    };

    const updatedGroup: Group = {
      ...currentGroup,
      users: [...currentGroup.users, newUser],
      meals: {
        ...currentGroup.meals,
        [userId]: {},
      },
    };

    setAppData({
      ...appData,
      groups: {
        ...appData.groups,
        [currentGroup.id]: updatedGroup,
      },
    });
  };

  const setCurrentUser = (userId: string) => {
    setAppData({
      ...appData,
      currentUserId: userId,
    });
  };

  const toggleMeal = (date: string, mealType: 'lunch' | 'dinner') => {
    if (!currentGroup || !currentUser) return;

    const userMeals = currentGroup.meals[currentUser.id] || {};
    const currentMealStatus = userMeals[date] || { lunch: false, dinner: false };

    const updatedMealStatus: MealStatus = {
      ...currentMealStatus,
      [mealType]: !currentMealStatus[mealType],
    };

    const updatedGroup: Group = {
      ...currentGroup,
      meals: {
        ...currentGroup.meals,
        [currentUser.id]: {
          ...userMeals,
          [date]: updatedMealStatus,
        },
      },
    };

    setAppData({
      ...appData,
      groups: {
        ...appData.groups,
        [currentGroup.id]: updatedGroup,
      },
    });
  };

  const getUserMealStatus = (userId: string, date: string): MealStatus => {
    if (!currentGroup) return { lunch: false, dinner: false };
    const userMeals = currentGroup.meals[userId] || {};
    return userMeals[date] || { lunch: false, dinner: false };
  };

  return (
    <MealContext.Provider
      value={{
        appData,
        currentGroup,
        currentUser,
        createGroup,
        addUserToGroup,
        setCurrentUser,
        toggleMeal,
        getUserMealStatus,
      }}
    >
      {children}
    </MealContext.Provider>
  );
};

export const useMeal = () => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMeal must be used within MealProvider');
  }
  return context;
};
