export function formatDate(date: Date): string {
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];
  const d = date.getDate();
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = date.getFullYear();
  return `It's ${days[date.getDay()].toLowerCase()}, ${d}. ${month}, ${year}`;
}

/** Short date for lists (e.g. "19 Feb 2025"). */
export function formatDateShort(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
