import { CustomLevel } from "./angryelfapi.service";

export abstract class IAngryElfAPIService {
  abstract Login(username: string, password: string): Promise<boolean>;
  abstract SendWinInfo(level: number, health: number, version: string, grid: any): void;

  abstract AddCustomLevel(username: string, levelname: string, leveljson: string): void;
  abstract DeleteCustomLevel(levelUnid: number): void;
  abstract GetCustomLevels(): Promise<CustomLevel[]>;
  abstract GetCustomLevel(levelUnid: number): Promise<string>;
}
