
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Button } from "../GameObjects/Utilities/button.gameobject";
import { BlankSceneInfo, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { DefenseBaseLevel, eDefenderTypes } from "./defensebase.scene";
import { eLayerTypes } from "./scene.interface";

export class LevelOneScene extends DefenseBaseLevel {
  protected get LevelUnid(): number {
    return 1;
  }
  protected get CurrentSceneName(): string {
    return 'levelone';
  }
  protected get NextLevelName(): string {
    return 'leveltwo';
  }
  private startingHealth = 0;
  protected get PlayerStartingHealth(): number {
    return this.startingHealth;
  }
  private secondsBetweenMonsters: number = 1;
  protected override get SecondsBetweenMonsters(): number {
    return 1;
  }
  private startSeconds: number = 120;
  protected override get SecondsToStart(): number {
    return this.startSeconds;
  }
  private enemyRounds = [5, 5, 5, 10, 10, 15];
  protected get EnemyRounds(): number[] {
    return this.enemyRounds;
  }
  protected override ReduceHealth(reduceBy: number): void {
    this.playerHealth -= reduceBy;
  }
  private startingCells = [new Vector2(0, 4)];
  protected get StartingCells(): Vector2[] {
    return this.startingCells;
  }
  private endingCells = [new Vector2(14, 4)];
  protected override get EndingCells(): Vector2[] {
    return this.endingCells;
  }
  private defenderSize = 0;
  protected get DefenderSize(): number {
    return this.defenderSize;
  }
  private gridCellSize: number = 0;
  protected get GridCellSize(): number {
    return this.gridCellSize;
  }

  constructor() {
    super();
    let sceneInfo: BlankSceneInfo = JSON.parse(LevelOneScene.levelJSON);

    if (sceneInfo) {
      this.gridCellSize = sceneInfo.GridSize;
      this.defenderSize = sceneInfo.GridSize * sceneInfo.DefSizeMulti;
      this.startingCells = sceneInfo.StartingCells;
      this.endingCells = sceneInfo.EndingCells;
      this.credits = sceneInfo.Credits;
      this.startingHealth = sceneInfo.Health;
      //this.SetRounds(sceneInfo.Rounds);
      //this.SetObstacles(sceneInfo.ObstacleCells);
    }
  }

  override Update(deltaTime: number): void {
    super.Update(deltaTime);
  }

  override Draw(deltaTime: number): void {
    super.Draw(deltaTime);

    if (!this.IsGameOver) {
      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '22px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.fillText(`Level One - Round ${this.CurrentRound + 1} / ${this.EnemyRounds.length}`, Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT - 50);
    }
  }

  override Load(): void {
    super.Load();
    Game.AddCredits(this.credits);
  }

  protected CreateNewAttacker(attackerCount: number): Attacker {
    let newAttacker = new Block();
    newAttacker.SetDamage(1);
    newAttacker.SetColor('#22BB22');

    if (this.CurrentRound === 0) {
      this.startSeconds = 60;
      newAttacker.SetSize(20, 20);
      newAttacker.SetStartingSpeed(7);
      newAttacker.SetStartingHealth(15);
      newAttacker.SetValue(3);
    }
    else if (this.CurrentRound === 1) {
      newAttacker.SetSize(20, 20);
      newAttacker.SetStartingSpeed(7);
      newAttacker.SetStartingHealth(10);
      newAttacker.SetValue(3);
      newAttacker.SetShieldValue(6);
    }
    else if (this.CurrentRound === 2) {
      newAttacker.SetSize(30, 30);
      newAttacker.SetStartingSpeed(8);
      newAttacker.SetStartingHealth(18);
      newAttacker.SetValue(3);
    }
    else if (this.CurrentRound === 3) {
      newAttacker.SetSize(30, 30);
      newAttacker.SetStartingSpeed(8);
      newAttacker.SetStartingHealth(15);
      newAttacker.SetValue(3);
      newAttacker.SetShieldValue(10);
    }
    else if (this.CurrentRound === 4) {
      this.secondsBetweenMonsters = .75;

      if (attackerCount % 2 === 0) {
        newAttacker.SetSize(20, 20);
        newAttacker.SetStartingSpeed(10);
        newAttacker.SetStartingHealth(18);
        newAttacker.SetValue(3);
      }
      else {
        newAttacker.SetSize(40, 40);
        newAttacker.SetStartingSpeed(7);
        newAttacker.SetStartingHealth(24);
        newAttacker.SetValue(3);
      }
    }
    else if (this.CurrentRound === 5) {
      this.secondsBetweenMonsters = .75;

      if (attackerCount % 2 === 0) {
        newAttacker.SetSize(20, 20);
        newAttacker.SetStartingSpeed(10);
        newAttacker.SetStartingHealth(12);
        newAttacker.SetValue(3);
        newAttacker.SetShieldValue(10);
      }
      else {
        newAttacker.SetSize(40, 40);
        newAttacker.SetStartingSpeed(7);
        newAttacker.SetStartingHealth(17);
        newAttacker.SetValue(3);
        newAttacker.SetShieldValue(10);
      }
    }
    newAttacker.SetLocation(this.StartingCells[0].X * this.GridCellSize,
      this.StartingCells[0].Y * this.GridCellSize,
      eLayerTypes.Object);
    newAttacker.SetPath(this.GetPath(0), this.GridCellSize);

    return newAttacker;
  }

  private firstWonCall = true;
  protected PlayerWonScreen(): void {
    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '32px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText('You Won!', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 75);
  }

  private credits: number = 0;
  protected static levelJSON = '{"SceneName":"Level 1","GridSize":60,"DefSizeMulti":2,"StartingCells":[{"X":1,"Y":10},{"X":1,"Y":9},{"X":1,"Y":8},{"X":1,"Y":7},{"X":1,"Y":6},{"X":1,"Y":5},{"X":1,"Y":4}],"EndingCells":[{"X":23,"Y":10},{"X":23,"Y":9},{"X":23,"Y":8},{"X":23,"Y":7},{"X":23,"Y":6},{"X":23,"Y":5},{"X":23,"Y":4}],"ObstacleCells":[],"Credits":50,"Health":15,"Rounds":[{"EnemyBatches":[{"EnemyCountStart":10,"TimeBetweenStart":1,"BatchDelayTime":0,"EnemySpeed":8,"EnemyHealth":18,"EnemyValue":1,"EnemySize":30,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0}]},{"EnemyBatches":[{"EnemyCountStart":10,"TimeBetweenStart":1,"BatchDelayTime":0,"EnemySpeed":8,"EnemyHealth":18,"EnemyValue":1,"EnemySize":30,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":5,"TimeBetweenStart":1.5,"BatchDelayTime":0,"EnemySpeed":8,"EnemyHealth":27,"EnemyValue":3,"EnemySize":60,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0}]},{"EnemyBatches":[{"EnemyCountStart":10,"TimeBetweenStart":1,"BatchDelayTime":0,"EnemySpeed":10,"EnemyHealth":18,"EnemyValue":1,"EnemySize":30,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":10,"TimeBetweenStart":1.5,"BatchDelayTime":0,"EnemySpeed":8,"EnemyHealth":30,"EnemyValue":3,"EnemySize":60,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":5,"TimeBetweenStart":1.5,"BatchDelayTime":15,"EnemySpeed":10,"EnemyHealth":10,"EnemyValue":1,"EnemySize":30,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":10,"TimeBetweenCurrent":0,"EnemyCountCurrent":0}]},{"EnemyBatches":[{"EnemyCountStart":10,"TimeBetweenStart":1,"BatchDelayTime":0,"EnemySpeed":12,"EnemyHealth":21,"EnemyValue":1,"EnemySize":30,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":10,"TimeBetweenStart":1.5,"BatchDelayTime":0,"EnemySpeed":10,"EnemyHealth":30,"EnemyValue":3,"EnemySize":60,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":5,"TimeBetweenStart":1,"BatchDelayTime":15,"EnemySpeed":12,"EnemyHealth":15,"EnemyValue":1,"EnemySize":30,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":10,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":5,"TimeBetweenStart":1.5,"BatchDelayTime":0,"EnemySpeed":10,"EnemyHealth":20,"EnemyValue":3,"EnemySize":60,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":10,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":1,"TimeBetweenStart":0.5,"BatchDelayTime":20,"EnemySpeed":5,"EnemyHealth":300,"EnemyValue":15,"EnemySize":60,"EnemyDamage":5,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0}]},{"EnemyBatches":[{"EnemyCountStart":20,"TimeBetweenStart":1,"BatchDelayTime":0,"EnemySpeed":12,"EnemyHealth":20,"EnemyValue":1,"EnemySize":30,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":1,"TimeBetweenStart":1,"BatchDelayTime":25,"EnemySpeed":10,"EnemyHealth":60,"EnemyValue":3,"EnemySize":60,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":true,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0}]},{"EnemyBatches":[{"EnemyCountStart":15,"TimeBetweenStart":1,"BatchDelayTime":0,"EnemySpeed":12,"EnemyHealth":20,"EnemyValue":1,"EnemySize":30,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":15,"TimeBetweenStart":1,"BatchDelayTime":0,"EnemySpeed":10,"EnemyHealth":15,"EnemyValue":1,"EnemySize":30,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":10,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":10,"TimeBetweenStart":1.5,"BatchDelayTime":0,"EnemySpeed":10,"EnemyHealth":30,"EnemyValue":3,"EnemySize":60,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":10,"TimeBetweenStart":1.5,"BatchDelayTime":0,"EnemySpeed":10,"EnemyHealth":20,"EnemyValue":3,"EnemySize":60,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":15,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":5,"TimeBetweenStart":1,"BatchDelayTime":25,"EnemySpeed":10,"EnemyHealth":60,"EnemyValue":3,"EnemySize":60,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":true,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0}]},{"EnemyBatches":[{"EnemyCountStart":15,"TimeBetweenStart":1,"BatchDelayTime":0,"EnemySpeed":14,"EnemyHealth":25,"EnemyValue":1,"EnemySize":30,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":15,"TimeBetweenStart":1,"BatchDelayTime":0,"EnemySpeed":12,"EnemyHealth":15,"EnemyValue":1,"EnemySize":30,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":15,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":10,"TimeBetweenStart":1.25,"BatchDelayTime":0,"EnemySpeed":10,"EnemyHealth":40,"EnemyValue":3,"EnemySize":60,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":10,"TimeBetweenStart":1.25,"BatchDelayTime":0,"EnemySpeed":10,"EnemyHealth":25,"EnemyValue":3,"EnemySize":60,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":false,"ShieldValue":60,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":5,"TimeBetweenStart":2,"BatchDelayTime":10,"EnemySpeed":10,"EnemyHealth":75,"EnemyValue":5,"EnemySize":60,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":true,"ShieldValue":0,"TimeBetweenCurrent":0,"EnemyCountCurrent":0},{"EnemyCountStart":5,"TimeBetweenStart":2,"BatchDelayTime":15,"EnemySpeed":10,"EnemyHealth":50,"EnemyValue":5,"EnemySize":60,"EnemyDamage":1,"EnemyStartCells":[0,1,2,3,4,5,6],"EnemyCanFly":true,"ShieldValue":50,"TimeBetweenCurrent":0,"EnemyCountCurrent":0}]},{"EnemyBatches":[{"EnemyCountStart":1,"TimeBetweenStart":0.5,"BatchDelayTime":0,"EnemySpeed":8,"EnemyHealth":600,"EnemyValue":50,"EnemySize":60,"EnemyDamage":5,"EnemyStartCells":[3],"EnemyCanFly":false,"ShieldValue":300,"TimeBetweenCurrent":0,"EnemyCountCurrent":0}]}]}';
}
