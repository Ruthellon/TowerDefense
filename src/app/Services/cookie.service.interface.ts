
export abstract class ICookieService {
  abstract SetCookie(name: string, value: string, days: number): void;
  abstract GetCookie(name: string): string | null;
}
