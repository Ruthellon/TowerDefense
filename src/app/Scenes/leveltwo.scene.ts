import { DefenseBaseLevel } from "./defensebase.scene";

export class LevelTwoScene extends DefenseBaseLevel {
  protected get LevelJSON(): string {
    return '';
  }
  protected get LevelUnid(): number {
    return 2;
  }
  protected get CurrentSceneName(): string {
    return 'leveltwo';
  }
  protected get NextLevelName(): string {
    return 'levelthree';
  }
  protected get CurrentSceneDisplayName(): string {
    return 'Level Two';
  }
  protected override get SecondsToStart(): number {
    return 120;
  }
}
