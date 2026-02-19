export function formatDate(date: Date): string {
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];
  const d = date.getDate();
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = date.getFullYear();
  return `It's ${days[date.getDay()].toLowerCase()}, ${d}. ${month}, ${year}`;
}
