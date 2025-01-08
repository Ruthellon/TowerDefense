
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Button } from "../GameObjects/Utilities/button.gameobject";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { DefenseBaseLevel, eDefenderTypes } from "./defensebase.scene";
import { eLayerTypes } from "./scene.interface";

export class LevelSevenScene extends DefenseBaseLevel {
  protected get LevelUnid(): number {
    return 1;
  }
  protected get CurrentSceneName(): string {
    return 'levelseven';
  }
  protected get NextLevelName(): string {
    return 'leveleight';
  }
  protected get PlayerStartingHealth(): number {
    return 10;
  }
  private secondsBetweenMonsters: number = 1;
  protected override get SecondsBetweenMonsters(): number {
    return 1;
  }
  private startSeconds: number = 120;
  protected override get SecondsToStart(): number {
    return this.startSeconds;
  }
  private availableDefenders = [eDefenderTypes.BasicTurret, eDefenderTypes.SAMTurret];
  protected get AvailableDefenders(): eDefenderTypes[] {
    return this.availableDefenders;
  }
  private enemyRounds = [5, 5, 5, 10, 15];
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
  protected get DefenderSize(): number {
    return 100;
  }
  protected get GridCellSize(): number {
    return 100;
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
      Game.CONTEXT.fillText(`Level Seven - Round ${this.CurrentRound + 1} / ${this.EnemyRounds.length}`, Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT - 50);
    }
  }

  override Load(): void {
    super.Load();

    if (Game.Credits === 0)
      Game.SetStartingCredits(75);
    else
      Game.AddCredits(30);
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
      if (attackerCount === 2) {
        newAttacker.SetSize(50, 50);
        newAttacker.SetStartingSpeed(10);
        newAttacker.SetStartingHealth(15);
        newAttacker.SetValue(3);
        newAttacker.SetCanFly(true);
        newAttacker.SetColor('#BB22BB');
      }
      else {
        newAttacker.SetSize(20, 20);
        newAttacker.SetStartingSpeed(7);
        newAttacker.SetStartingHealth(15);
        newAttacker.SetValue(3);
      }
    }
    else if (this.CurrentRound === 2) {
      if (attackerCount % 2 === 0) {
        newAttacker.SetSize(50, 50);
        newAttacker.SetStartingSpeed(10);
        newAttacker.SetStartingHealth(15);
        newAttacker.SetValue(3);
        newAttacker.SetCanFly(true);
        newAttacker.SetColor('#BB22BB');
      }
      else {
        newAttacker.SetSize(30, 30);
        newAttacker.SetStartingSpeed(8);
        newAttacker.SetStartingHealth(18);
        newAttacker.SetValue(3);
      }
    }
    else if (this.CurrentRound === 3) {
      if (attackerCount % 2 === 0) {
        newAttacker.SetSize(50, 50);
        newAttacker.SetStartingSpeed(10);
        newAttacker.SetStartingHealth(18);
        newAttacker.SetValue(3);
        newAttacker.SetCanFly(true);
        newAttacker.SetColor('#BB22BB');
      }
      else {
        newAttacker.SetSize(30, 30);
        newAttacker.SetStartingSpeed(8);
        newAttacker.SetStartingHealth(24);
        newAttacker.SetValue(3);
      }
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
        newAttacker.SetStartingSpeed(12);
        newAttacker.SetStartingHealth(24);
        newAttacker.SetCanFly(true);
        newAttacker.SetColor('#BB22BB');
        newAttacker.SetValue(3);
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
}
