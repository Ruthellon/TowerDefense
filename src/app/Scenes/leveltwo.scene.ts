
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Button } from "../GameObjects/Utilities/button.gameobject";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { DefenseBaseLevel, eDefenderTypes } from "./defensebase.scene";
import { eLayerTypes } from "./scene.interface";

export class LevelTwoScene extends DefenseBaseLevel {
  protected get LevelUnid(): number {
    return 2;
  }
  protected get CurrentSceneName(): string {
    return 'leveltwo';
  }
  protected get NextLevelName(): string {
    return 'levelthree';
  }
  protected get PlayerStartingHealth(): number {
    return 10;
  }
  private secondsBetweenMonsters = 1;
  protected override get SecondsBetweenMonsters(): number {
    return this.secondsBetweenMonsters;
  }
  private startSeconds = 120;
  protected override get SecondsToStart(): number {
    return this.startSeconds;
  }
  private enemyRounds = [5, 10, 10, 15, 1];
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
    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '22px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText(`Level Two - Round ${this.CurrentRound + 1} / ${this.EnemyRounds.length}`, Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT - 50);
  }

  override Load(): void {
    super.Load();

    if (Game.Credits === 0)
      Game.SetStartingCredits(50);
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
      newAttacker.SetSize(20, 20);
      newAttacker.SetStartingSpeed(7);
      newAttacker.SetStartingHealth(15);
      newAttacker.SetValue(3);
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
      newAttacker.SetStartingHealth(24);
      newAttacker.SetValue(3);
    }
    else if (this.CurrentRound === 4) {
      newAttacker.SetSize(50, 50);
      newAttacker.SetStartingSpeed(5);
      newAttacker.SetStartingHealth(660);
      newAttacker.SetValue(30);
      newAttacker.SetDamage(5);
    }

    newAttacker.SetLocation(this.StartingCells[0].X * this.GridCellSize,
      this.StartingCells[0].Y * this.GridCellSize,
      eLayerTypes.Object);
    newAttacker.SetPath(this.GetPath(0), this.GridCellSize);

    return newAttacker;
  }

  protected PlayerWonScreen(): void {
    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '32px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText('You Won!', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 75);
  }
}
