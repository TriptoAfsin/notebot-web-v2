import { APP_CONFIG } from "@/constants/app-config";
import Cookies from "js-cookie";

export const getCookie = (key: string) => {
  const cookie = Cookies.get(key);

  if (!cookie) {
    return null;
  }
  return JSON.parse(cookie);
};

export const setCookie = (key: string, value: any) =>
  Cookies.set(key, JSON.stringify(value), { expires: 365 });

export const removeCookie = (key: string) => Cookies.remove(key);

interface DailyMessageLimit {
  count: number;
  date: string;
}

export const MESSAGE_LIMIT_KEY = "daily_message_limit";
const MAX_MESSAGES_PER_DAY = APP_CONFIG.limit.texGpt;

export const checkAndUpdateMessageLimit = (): {
  canSendMessage: boolean;
  remainingMessages: number;
} => {
  const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
  const currentLimit = getCookie(MESSAGE_LIMIT_KEY) as DailyMessageLimit | null;

  // If no limit exists or it's a new day, reset the counter
  if (!currentLimit || currentLimit.date !== today) {
    const newLimit: DailyMessageLimit = {
      count: 1, // Count this message
      date: today,
    };
    setCookie(MESSAGE_LIMIT_KEY, newLimit);
    return {
      canSendMessage: true,
      remainingMessages: MAX_MESSAGES_PER_DAY - 1,
    };
  }

  // If we still have messages left for today
  if (currentLimit.count < MAX_MESSAGES_PER_DAY) {
    const newCount = currentLimit.count + 1;
    setCookie(MESSAGE_LIMIT_KEY, {
      count: newCount,
      date: today,
    });
    return {
      canSendMessage: true,
      remainingMessages: MAX_MESSAGES_PER_DAY - newCount,
    };
  }

  // If we've reached the limit
  return { canSendMessage: false, remainingMessages: 0 };
};
