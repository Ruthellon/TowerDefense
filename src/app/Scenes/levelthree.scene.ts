
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { DefenseBaseLevel, eDefenderTypes } from "./defensebase.scene";
import { eLayerTypes } from "./scene.interface";

export class LevelThreeScene extends DefenseBaseLevel {
  protected get LevelUnid(): number {
    return 3;
  }
  protected get CurrentSceneName(): string {
    return 'levelthree';
  }
  protected get NextLevelName(): string {
    return 'levelfour';
  }
  protected get PlayerStartingHealth(): number {
    return 10;
  }
  protected override get SecondsBetweenMonsters(): number {
    return 1;
  }
  protected override get SecondsToStart(): number {
    return 120;
  }
  private availableDefenders = [eDefenderTypes.BasicTurret];
  protected get AvailableDefenders(): eDefenderTypes[] {
    return this.availableDefenders;
  }
  private enemyRounds = [5, 5, 1];
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
    Game.CONTEXT.fillText(`Level Three - Round ${this.CurrentRound + 1} / ${this.EnemyRounds.length}`, Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT - 50);
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
    if (this.CurrentRound === 0 || this.CurrentRound === 1) {
      newAttacker.SetStartingSpeed(10);
      newAttacker.SetStartingHealth(50);
      newAttacker.SetSize(40, 40);
      newAttacker.SetDamage(1);
      newAttacker.SetColor('#22BB22');
      newAttacker.SetValue(3);
    }
    else {
      newAttacker.SetStartingSpeed(2);
      newAttacker.SetStartingHealth(700);
      newAttacker.SetSize(60, 60);
      newAttacker.SetDamage(10);
      newAttacker.SetColor('#22BB22');
      newAttacker.SetValue(50);
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

    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '32px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText('Refresh To Play Again', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 150);
  }
}
