
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Button } from "../GameObjects/Utilities/button.gameobject";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { DefenseBaseLevel, eDefenderTypes } from "./defensebase.scene";

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
  protected get PlayerStartingHealth(): number {
    return 10;
  }
  protected override get SecondsBetweenMonsters(): number {
    return 1.5;
  }
  protected override get SecondsToStart(): number {
    return 120;
  }
  private availableDefenders = [eDefenderTypes.BasicTurret];
  protected get AvailableDefenders(): eDefenderTypes[] {
    return this.availableDefenders;
  }
  private enemyRounds = [5, 10, 15, 25];
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
  protected get TurretCellSize(): number {
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
      Game.CONTEXT.fillText('Level One', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT - 50);
    }
  }

  override Load(): void {
    super.Load();
    Game.SetStartingCredits(100);
  }

  protected CreateNewAttacker(attackerCount: number): Attacker {
    let newAttacker = new Block();
    newAttacker.SetStartingSpeed(10);
    newAttacker.SetStartingHealth(42);
    newAttacker.SetDamage(1);
    newAttacker.SetSize(40, 40);
    newAttacker.SetColor('#00ff00');
    newAttacker.SetValue(2);
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
