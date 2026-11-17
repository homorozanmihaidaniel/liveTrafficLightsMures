/**
 * Formatează timpul în secunde în format 'X min Y sec (Zs)' sau 'Xm Ys'
 * Exemplu: 140 -> "2 min 20 sec (140s)"
 * Exemplu scurt: 140 -> "2m 20s"
 */
export function formatMinutesSeconds(totalSeconds, includeTotalSec = true) {
  const total = Math.round(totalSeconds);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  const minStr = `${minutes} min`;
  const secStr = seconds > 0 ? ` ${seconds} sec` : '';

  if (includeTotalSec) {
    return `${minStr}${secStr} (${total}s)`;
  }
  return `${minStr}${secStr}`;
}

export function formatMinSecShort(totalSeconds) {
  const total = Math.round(totalSeconds);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }
  const secPart = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}m ${secPart}s`;
}
