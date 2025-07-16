function timeAgo(dateStr: string): string {
  const now = new Date();
  const past = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const thresholds = [
    { limit: 60, unit: "second" }, // < 60 seconds
    { limit: 3600, unit: "minute", divisor: 60 }, // < 60 minutes
    { limit: 86400, unit: "hour", divisor: 3600 }, // < 24 hours
    { limit: 2592000, unit: "day", divisor: 86400 }, // < 30 days
    { limit: 31536000, unit: "month", divisor: 2592000 }, // < 12 months
    { limit: Infinity, unit: "year", divisor: 31536000 }, // >= 1 year
  ];

  for (const t of thresholds) {
    if (seconds < t.limit) {
      const value = t.divisor ? Math.floor(seconds / t.divisor) : seconds;
      return value <= 0
        ? "just now"
        : `${value} ${t.unit}${value !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export default timeAgo;
