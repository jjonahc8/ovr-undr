export default function generateDate(supabaseDate: any): string {
  const nowDate: Date = new Date();
  const postDate: Date = new Date(supabaseDate);
  const timeDifferenceInMilliseconds = nowDate.getTime() - postDate.getTime();

  const seconds = Math.floor(timeDifferenceInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  if (seconds == 0) return `Just now`;
  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 31) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  return `${years} year${years === 1 ? "" : "s"} ago`;
}
