export const formatTimestamp = (rawDate: any): string => {
  let date: Date;

  if (!rawDate) return "Invalid Date";

  // Handle Unix timestamp (seconds or milliseconds)
  if (typeof rawDate === 'number') {
    // Check if it's seconds (10 digits) or milliseconds (13 digits)
    const timestampLength = Math.floor(Math.log10(rawDate)) + 1;
    date = timestampLength <= 10 
      ? new Date(rawDate * 1000)  // Convert seconds to milliseconds
      : new Date(rawDate);        // Already in milliseconds
  }
  // Rest of your existing cases
  else if (Array.isArray(rawDate)) {
    try {
      const [year, month, day, hour, minute, second, nanoseconds] = rawDate;
      date = new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        second,
        nanoseconds ? Math.floor(nanoseconds / 1_000_000) : 0
      );
    } catch (e) {
      return "Invalid Date";
    }
  } else if (typeof rawDate === "string") {
    date = new Date(rawDate);
  } else if (rawDate instanceof Date) {
    date = rawDate;
  } else {
    return "Invalid Date";
  }

  if (isNaN(date.getTime())) return "Invalid Date";

  // Formatting remains the same
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return `${formattedDate}, ${formattedTime}`;
};

export const formatTimeAgo = (rawDate: any): string => {
  let date: Date;

  // Handle different input types (same as formatTimestamp)
  if (!rawDate) return "Invalid Date";

  if (typeof rawDate === 'number') {
    const timestampLength = Math.floor(Math.log10(rawDate)) + 1;
    date = timestampLength <= 10 
      ? new Date(rawDate * 1000)
      : new Date(rawDate);
  }
  else if (Array.isArray(rawDate)) {
    try {
      const [year, month, day, hour, minute, second, nanoseconds] = rawDate;
      date = new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        second,
        nanoseconds ? Math.floor(nanoseconds / 1_000_000) : 0
      );
    } catch (e) {
      return "Invalid Date";
    }
  } else if (typeof rawDate === "string") {
    date = new Date(rawDate);
  } else if (rawDate instanceof Date) {
    date = rawDate;
  } else {
    return "Invalid Date";
  }

  if (isNaN(date.getTime())) return "Invalid Date";

  // Calculate time difference
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  // Time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  // Find the largest interval
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return "Just now";
};