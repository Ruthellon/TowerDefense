import { DefenseBaseLevel } from "./defensebase.scene";

export class LevelFourScene extends DefenseBaseLevel {
  protected get LevelJSON(): string {
    return '';
  }
  protected get LevelUnid(): number {
    return 4;
  }
  protected get CurrentSceneName(): string {
    return 'levelfour';
  }
  protected get NextLevelName(): string {
    return 'levelfive';
  }
  protected get CurrentSceneDisplayName(): string {
    return 'Level Four';
  }
  protected override get SecondsToStart(): number {
    return 120;
  }
}
