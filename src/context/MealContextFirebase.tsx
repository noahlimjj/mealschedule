import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppData, Group, User, MealStatus } from '../types';
import {
  addUserToGroup as addUserToGroupFirestore,
  toggleUserMeal,
  subscribeToGroup,
} from '../firebase/firestore';

interface MealContextType {
  appData: AppData;
  currentGroup: Group | null;
  currentUser: User | null;
  addUser: (userName: string) => Promise<void>;
  setCurrentUser: (userId: string) => void;
  toggleMeal: (date: string, mealType: 'lunch' | 'dinner') => Promise<void>;
  getUserMealStatus: (userId: string, date: string) => MealStatus;
  getMealCount: (date: string, mealType: 'lunch' | 'dinner') => { count: number; total: number };
  useFirebase: boolean;
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

const DEFAULT_GROUP_ID = 'default_group';

const getInitialData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      // Ensure default group exists
      if (!data.groups[DEFAULT_GROUP_ID]) {
        data.groups[DEFAULT_GROUP_ID] = {
          id: DEFAULT_GROUP_ID,
          name: 'My Group',
          users: [],
          meals: {},
        };
        data.currentGroupId = DEFAULT_GROUP_ID;
      }
      return data;
    } catch {
      // Create default group
      return {
        groups: {
          [DEFAULT_GROUP_ID]: {
            id: DEFAULT_GROUP_ID,
            name: 'My Group',
            users: [],
            meals: {},
          },
        },
        currentGroupId: DEFAULT_GROUP_ID,
        currentUserId: null,
      };
    }
  }
  // Create default group for new users
  return {
    groups: {
      [DEFAULT_GROUP_ID]: {
        id: DEFAULT_GROUP_ID,
        name: 'My Group',
        users: [],
        meals: {},
      },
    },
    currentGroupId: DEFAULT_GROUP_ID,
    currentUserId: null,
  };
};

// Check if Firebase is configured
const isFirebaseConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return apiKey && apiKey !== "YOUR_API_KEY" && apiKey.length > 0;
};

export const MealProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appData, setAppData] = useState<AppData>(getInitialData);
  const [useFirebase] = useState<boolean>(isFirebaseConfigured());

  // Save to localStorage (fallback or when Firebase is not configured)
  useEffect(() => {
    if (!useFirebase) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    }
  }, [appData, useFirebase]);

  // Subscribe to Firebase real-time updates
  useEffect(() => {
    if (!useFirebase || !appData.currentGroupId) return;

    const unsubscribe = subscribeToGroup(appData.currentGroupId, (group) => {
      if (group) {
        setAppData((prev) => ({
          ...prev,
          groups: {
            ...prev.groups,
            [group.id]: group,
          },
        }));
      }
    });

    return () => unsubscribe();
  }, [appData.currentGroupId, useFirebase]);

  const currentGroup = appData.currentGroupId
    ? appData.groups[appData.currentGroupId]
    : null;

  const currentUser = currentGroup && appData.currentUserId
    ? currentGroup.users.find(u => u.id === appData.currentUserId) || null
    : null;

  const addUser = async (userName: string) => {
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

    if (useFirebase) {
      // Save to Firebase
      await addUserToGroupFirestore(currentGroup.id, newUser);
    } else {
      // Update local state
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
    }

    // Auto-select first user if none selected
    if (!appData.currentUserId) {
      setAppData({
        ...appData,
        currentUserId: userId,
      });
    }
  };

  const setCurrentUser = (userId: string) => {
    setAppData({
      ...appData,
      currentUserId: userId,
    });
  };

  const toggleMeal = async (date: string, mealType: 'lunch' | 'dinner') => {
    if (!currentGroup || !currentUser) return;

    if (useFirebase) {
      // Update Firebase
      await toggleUserMeal(currentGroup.id, currentUser.id, date, mealType);
    } else {
      // Update local state
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
    }
  };

  const getUserMealStatus = (userId: string, date: string): MealStatus => {
    if (!currentGroup) return { lunch: false, dinner: false };
    const userMeals = currentGroup.meals[userId] || {};
    return userMeals[date] || { lunch: false, dinner: false };
  };

  const getMealCount = (date: string, mealType: 'lunch' | 'dinner'): { count: number; total: number } => {
    if (!currentGroup) return { count: 0, total: 0 };

    const total = currentGroup.users.length;
    let count = 0;

    currentGroup.users.forEach(user => {
      const mealStatus = getUserMealStatus(user.id, date);
      if (mealStatus[mealType]) {
        count++;
      }
    });

    return { count, total };
  };

  return (
    <MealContext.Provider
      value={{
        appData,
        currentGroup,
        currentUser,
        addUser,
        setCurrentUser,
        toggleMeal,
        getUserMealStatus,
        getMealCount,
        useFirebase,
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
