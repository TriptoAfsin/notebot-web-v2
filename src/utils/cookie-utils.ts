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
