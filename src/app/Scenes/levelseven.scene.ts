import { DefenseBaseLevel } from "./defensebase.scene";

export class LevelSevenScene extends DefenseBaseLevel {
  protected get LevelJSON(): string {
    return '';
  }
  protected get LevelUnid(): number {
    return 7;
  }
  protected get CurrentSceneName(): string {
    return 'levelseven';
  }
  protected get NextLevelName(): string {
    return 'leveleight';
  }
  protected get CurrentSceneDisplayName(): string {
    return 'Level Seven';
  }
  protected override get SecondsToStart(): number {
    return 120;
  }
}
