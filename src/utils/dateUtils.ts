export const getWeekDates = (weekOffset: number = 0): Date[] => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calculate the most recent Monday
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // If Sunday, go back 6 days
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday + (weekOffset * 7));
  monday.setHours(0, 0, 0, 0);

  // Generate 8 days (Monday to next Monday)
  const dates: Date[] = [];
  for (let i = 0; i < 8; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }

  return dates;
};

export const getWeekRange = (weekOffset: number = 0): string => {
  const dates = getWeekDates(weekOffset);
  const firstDay = dates[0];
  const lastDay = dates[dates.length - 1];

  const firstMonth = firstDay.toLocaleDateString('en-US', { month: 'short' });
  const lastMonth = lastDay.toLocaleDateString('en-US', { month: 'short' });
  const firstDate = firstDay.getDate();
  const lastDate = lastDay.getDate();

  if (firstMonth === lastMonth) {
    return `${firstMonth} ${firstDate}-${lastDate}`;
  } else {
    return `${firstMonth} ${firstDate} - ${lastMonth} ${lastDate}`;
  }
};

export const formatDate = (date: Date): string => {
  // Format: YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (date: Date): string => {
  // Format: "Mon, Oct 21"
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};
