
export abstract class IAngryElfAPIService {
  abstract Login(username: string, password: string): Promise<boolean>;
  abstract SendWinInfo(level: number, health: number, version: string, grid: any): void;
}
