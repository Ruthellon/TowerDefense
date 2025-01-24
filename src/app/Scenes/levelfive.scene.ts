import { DefenseBaseLevel } from "./defensebase.scene";

export class LevelFiveScene extends DefenseBaseLevel {
  protected get LevelJSON(): string {
    return '';
  }
  protected get LevelUnid(): number {
    return 5;
  }
  protected get CurrentSceneName(): string {
    return 'levelfive';
  }
  protected get NextLevelName(): string {
    return 'levelsix';
  }
  protected get CurrentSceneDisplayName(): string {
    return 'Level Five';
  }
  protected override get SecondsToStart(): number {
    return 120;
  }
}
