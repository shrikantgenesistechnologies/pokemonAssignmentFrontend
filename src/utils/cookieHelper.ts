export const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; Secure; SameSite=Strict; Path=/; Expires=${expires.toUTCString()}`;
};

export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; Max-Age=0`;
};
