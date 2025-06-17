export function convertDateJS(isoDateString) {
  const date = new Date(isoDateString);
  return date.toISOString(); // returns full ISO string like "2025-06-10T03:37:21.719Z"
}
