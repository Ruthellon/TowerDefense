
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { DefenseBaseLevel, eDefenderTypes } from "./defensebase.scene";

export class LevelFourScene extends DefenseBaseLevel {
  protected get LevelUnid(): number {
    return 4;
  }
  protected get CurrentSceneName(): string {
    return 'levelfour';
  }
  protected get NextLevelName(): string {
    return '';
  }
  protected get PlayerStartingHealth(): number {
    return 10;
  }
  protected override get SecondsBetweenMonsters(): number {
    return 1.25;
  }
  protected override get SecondsToStart(): number {
    return 120;
  }
  private availableDefenders = [eDefenderTypes.BasicTurret];
  protected get AvailableDefenders(): eDefenderTypes[] {
    return this.availableDefenders;
  }
  protected get TotalEnemies(): number {
    return 50;
  }
  protected override ReduceHealth(reduceBy: number): void {
    this.playerHealth -= reduceBy;
  }
  private startingCells = [new Vector2(7, 0)];
  protected get StartingCells(): Vector2[] {
    return this.startingCells;
  }
  private endingCells = [new Vector2(7, 8)];
  protected override get EndingCells(): Vector2[] {
    return this.endingCells;
  }
  protected get TurretCellSize(): number {
    return 100;
  }
  protected get GridCellSize(): number {
    return 100;
  }
  protected override showAttackerPath = false;

  override Update(deltaTime: number): void {
    super.Update(deltaTime);
  }

  override Draw(deltaTime: number): void {
    super.Draw(deltaTime);
    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '22px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText('Level Four', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT - 50);


    //Game.CONTEXT!.fillStyle = '#111111';
    //Game.CONTEXT!.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

    //Game.CONTEXT.fillStyle = '#ffffff';
    //Game.CONTEXT.font = '64px serif';
    //Game.CONTEXT.textAlign = "center";
    //Game.CONTEXT.fillText('Coming Soon...', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2);
  }

  override Load(): void {
    super.Load();

    Game.SetStartingCredits(Game.Credits + 50);
  }

  protected CreateNewAttacker(attackerCount: number): Attacker {
    let newAttacker = new Block();
    newAttacker.SetStartingSpeed(10);
    newAttacker.SetStartingHealth(50);
    newAttacker.SetSize(60, 60);
    newAttacker.SetColor('#00ff00');
    newAttacker.SetDamage(1);
    newAttacker.SetValue(2);
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
