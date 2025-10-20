import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { Group, User, MealStatus } from '../types';

// Collection reference
const GROUPS_COLLECTION = 'groups';

/**
 * Create a new group in Firestore
 */
export const createGroup = async (group: Group): Promise<void> => {
  const groupRef = doc(db, GROUPS_COLLECTION, group.id);
  await setDoc(groupRef, group);
};

/**
 * Get a group by ID
 */
export const getGroup = async (groupId: string): Promise<Group | null> => {
  const groupRef = doc(db, GROUPS_COLLECTION, groupId);
  const groupSnap = await getDoc(groupRef);

  if (groupSnap.exists()) {
    return groupSnap.data() as Group;
  }
  return null;
};

/**
 * Update a group
 */
export const updateGroup = async (groupId: string, data: Partial<Group>): Promise<void> => {
  const groupRef = doc(db, GROUPS_COLLECTION, groupId);
  await updateDoc(groupRef, data);
};

/**
 * Add a user to a group
 */
export const addUserToGroup = async (
  groupId: string,
  user: User
): Promise<void> => {
  const group = await getGroup(groupId);
  if (!group) throw new Error('Group not found');

  const updatedUsers = [...group.users, user];
  const updatedMeals = {
    ...group.meals,
    [user.id]: {},
  };

  await updateGroup(groupId, {
    users: updatedUsers,
    meals: updatedMeals,
  });
};

/**
 * Toggle a meal for a user
 */
export const toggleUserMeal = async (
  groupId: string,
  userId: string,
  date: string,
  mealType: 'lunch' | 'dinner'
): Promise<void> => {
  const group = await getGroup(groupId);
  if (!group) throw new Error('Group not found');

  const userMeals = group.meals[userId] || {};
  const currentMealStatus = userMeals[date] || { lunch: false, dinner: false };

  const updatedMealStatus: MealStatus = {
    ...currentMealStatus,
    [mealType]: !currentMealStatus[mealType],
  };

  const updatedMeals = {
    ...group.meals,
    [userId]: {
      ...userMeals,
      [date]: updatedMealStatus,
    },
  };

  await updateGroup(groupId, { meals: updatedMeals });
};

/**
 * Subscribe to real-time updates for a group
 */
export const subscribeToGroup = (
  groupId: string,
  callback: (group: Group | null) => void
): Unsubscribe => {
  const groupRef = doc(db, GROUPS_COLLECTION, groupId);

  return onSnapshot(groupRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as Group);
    } else {
      callback(null);
    }
  });
};
