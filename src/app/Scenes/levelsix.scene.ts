import { DefenseBaseLevel } from "./defensebase.scene";

export class LevelSixScene extends DefenseBaseLevel {
  protected get LevelJSON(): string {
    return '';
  }
  protected get LevelUnid(): number {
    return 6;
  }
  protected get CurrentSceneName(): string {
    return 'levelsix';
  }
  protected get NextLevelName(): string {
    return 'levelseven';
  }
  protected get CurrentSceneDisplayName(): string {
    return 'Level Six';
  }
  protected override get SecondsToStart(): number {
    return 120;
  }
}
