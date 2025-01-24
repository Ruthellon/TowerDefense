import { DefenseBaseLevel } from "./defensebase.scene";

export class LevelEightScene extends DefenseBaseLevel {
  protected get LevelJSON(): string {
    return '';
  }
  protected get LevelUnid(): number {
    return 8;
  }
  protected get CurrentSceneName(): string {
    return 'leveleight';
  }
  protected get NextLevelName(): string {
    return '';
  }
  protected get CurrentSceneDisplayName(): string {
    return 'Level Eight';
  }
  protected override get SecondsToStart(): number {
    return 120;
  }
}
