export interface MealStatus {
  lunch: boolean;
  dinner: boolean;
}

export interface UserMeals {
  [date: string]: MealStatus; // date format: YYYY-MM-DD
}

export interface Group {
  id: string;
  name: string;
  users: User[];
  meals: {
    [userId: string]: UserMeals;
  };
}

export interface User {
  id: string;
  name: string;
  color: string; // for visual distinction
}

export interface AppData {
  groups: {
    [groupId: string]: Group;
  };
  currentGroupId: string | null;
  currentUserId: string | null;
}
