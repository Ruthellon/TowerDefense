
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Base } from "../GameObjects/base.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { eDefenderTypes } from "./defensebase.scene";

export class EditStage extends Base {
  public override get Value(): number | null {
    return null;
  }
  protected get LevelUnid(): number {
    return -1;
  }
  protected get CurrentSceneName(): string {
    return 'editstage';
  }
  protected get NextLevelName(): string {
    return '';
  }
  protected get PlayerStartingHealth(): number {
    return 10;
  }
  protected get SecondsBetweenMonsters(): number {
    return 1.25;
  }
  protected get SecondsToStart(): number {
    return 120;
  }
  private availableDefenders = [eDefenderTypes.BasicTurret];
  protected get AvailableDefenders(): eDefenderTypes[] {
    return this.availableDefenders;
  }
  protected get TotalEnemies(): number {
    return 50;
  }
  private startingCells = [new Vector2(1, 7)];
  protected get StartingCells(): Vector2[] {
    return this.startingCells;
  }
  private endingCells = [new Vector2(23, 7)];
  protected get EndingCells(): Vector2[] {
    return this.endingCells;
  }
  protected get TurretCellSize(): number {
    return 100;
  }
  private cellSize = 100;
  protected get GridCellSize(): number {
    return this.cellSize;
  }

  override Update(deltaTime: number): void {
    super.Update(deltaTime);
  }

  override Draw(deltaTime: number): void {
    super.Draw(deltaTime);

    //Draw Grid Columns
    Game.CONTEXT.lineWidth = 1;
    let width = Math.ceil(Game.CANVAS_WIDTH / this.GridCellSize);
    Game.CONTEXT.strokeStyle = `#ff000080`;
    for (let i = 0; i < width + 1; i++) {
      let x = (this.GridCellSize * i) + this.remainderX;
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(x, 0);
      Game.CONTEXT.lineTo(x, Game.CANVAS_HEIGHT);
      Game.CONTEXT.stroke();
    }

    //Draw Grid Rows
    let height = Math.ceil(Game.CANVAS_HEIGHT / this.GridCellSize);
    for (let i = 0; i < height; i++) {
      let y = (this.GridCellSize * i) + this.remainderY;
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(0, y);
      Game.CONTEXT.lineTo(Game.CANVAS_WIDTH, y);
      Game.CONTEXT.stroke();
    }
  }

  override Load(): void {
    super.Load();
  }

  private remainderX: number = 0;
  private remainderY: number = 0;
}
