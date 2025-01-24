
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Button } from "../GameObjects/Utilities/button.gameobject";
import { Wall } from "../GameObjects/wall.gameobject";
import { BlankSceneInfo, EnemyRound, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { DefenseBaseLevel, eDefenderTypes } from "./defensebase.scene";
import { eLayerTypes, IScene } from "./scene.interface";

export class BlankLevelScene extends DefenseBaseLevel {
  private levelJson = '';
  protected get LevelJSON(): string {
    return this.levelJson;
  }
  protected get LevelUnid(): number {
    return 0;
  }
  private sceneName = '';
  protected get CurrentSceneName(): string {
    return this.sceneName;
  }
  protected get NextLevelName(): string {
    return 'instructions';
  }
  protected get CurrentSceneDisplayName(): string {
    return this.sceneName;
  }
  protected override get SecondsToStart(): number {
    return 120;
  }

  protected override RestartFunction() {
    let blankScene = new BlankLevelScene(this.LevelJSON);
    Game.SetTheScene('blank', blankScene);
  }

  constructor(json: string) {
    super();
    this.levelJson = json;
  }
}
