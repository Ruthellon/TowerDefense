
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Button } from "../GameObjects/button.gameobject";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { DefenseBaseLevel, eDefenderTypes } from "./defensebase.scene";

export class LevelOneScene extends DefenseBaseLevel {
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
  protected get CurrentSceneName(): string {
    return 'levelone';
  }
  protected get TotalEnemies(): number {
    return 50;
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
    if (this.IsGameOver) {
      if (this.nextLevelButton.Pressed) {
        Game.SetTheScene('leveltwo');
        return;
      }
    }
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
    this.nextLevelButton.SetLocation((Game.CANVAS_WIDTH / 2) - 100, (Game.CANVAS_HEIGHT / 2) + 200, 50);
    this.nextLevelButton.SetSize(200, 100);
    this.nextLevelButton.SetText('Start Level 2');
  }

  protected CreateNewAttacker(attackerCount: number): Attacker {
    let newAttacker = new Block();
    newAttacker.SetStartingSpeed(10);
    newAttacker.SetStartingHealth(48);
    newAttacker.SetSize(40, 40);
    newAttacker.SetColor('#00ff00');
    newAttacker.SetValue(2);
    return newAttacker;
  }
  private firstWonCall = true;
  private nextLevelButton = new Button();
  protected PlayerWonScreen(): void {
    if (this.firstWonCall) {
      this.nextLevelButton.Load();
      this.firstWonCall = false;
    }

    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '32px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText('You Won!', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 75);
    this.nextLevelButton.Update(0);
    this.nextLevelButton.Draw(0);
  }
}
