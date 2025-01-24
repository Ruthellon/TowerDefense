import { DefenseBaseLevel } from "./defensebase.scene";

export class LevelThreeScene extends DefenseBaseLevel {
  protected get LevelJSON(): string {
    return '';
  }
  protected get LevelUnid(): number {
    return 3;
  }
  protected get CurrentSceneName(): string {
    return 'levelthree';
  }
  protected get NextLevelName(): string {
    return 'levelfour';
  }
  protected get CurrentSceneDisplayName(): string {
    return 'Level Three';
  }
  protected override get SecondsToStart(): number {
    return 120;
  }
}
