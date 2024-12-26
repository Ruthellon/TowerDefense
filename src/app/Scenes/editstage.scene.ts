
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Boundary } from "../GameObjects/boundary.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Slider } from "../GameObjects/Utilities/slider.gameobject";
import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { ePathCellStatus } from "../Utility/pathfinding.service";
import { BaseLevel } from "./base.scene";
import { eDefenderTypes } from "./defensebase.scene";
import { eLayerTypes } from "./scene.interface";

export class EditStage extends BaseLevel {

  protected gameObjects: IGameObject[] = [];
  protected override get GameObjects(): IGameObject[] {
    return this.gameObjects;
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
  protected get UICellSize(): number {
    return 75;
  }

  public Load(): void {
    this.remainderX = Math.floor((Game.CANVAS_WIDTH % this.GridCellSize) / 2);
    this.remainderY = Math.floor((Game.CANVAS_HEIGHT % this.GridCellSize) / 2);

    this.setUpGrid();

    this.setUpBoundaries();

    this.LoadGameObject(this.topBoundary);
    this.LoadGameObject(this.bottomBoundary);
    this.LoadGameObject(this.rightBoundary);
    this.LoadGameObject(this.leftBoundary);
    

    this.slider.SetLocation(Game.CANVAS_WIDTH / 2 - 100, 25, 5);
    this.slider.SetSize(200, 25);
    this.slider.SetValueRange(10, 200);
    this.slider.SetValue(this.cellSize);
    this.LoadGameObject(this.slider);
  }

  override Update(deltaTime: number): void {
    super.Update(deltaTime);

    if (this.cellSize !== this.slider.Value) {
      this.cellSize = this.slider.Value;

      this.remainderX = Math.floor((Game.CANVAS_WIDTH % this.GridCellSize) / 2);
      this.remainderY = Math.floor((Game.CANVAS_HEIGHT % this.GridCellSize) / 2);

      this.setUpGrid();
      this.setUpBoundaries();
    }
  }

  override Draw(deltaTime: number): void {
    Game.CONTEXT!.fillStyle = '#111111';
    Game.CONTEXT!.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);


    //Draw Grid Columns
    Game.CONTEXT.lineWidth = 1;
    let width = Math.ceil(Game.CANVAS_WIDTH / this.GridCellSize);
    Game.CONTEXT.strokeStyle = `#ff000080`;
    for (let i = 0; i <= width + 1; i++) {
      let x = (this.GridCellSize * i) - this.remainderX;
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(x, 0);
      Game.CONTEXT.lineTo(x, Game.CANVAS_HEIGHT);
      Game.CONTEXT.stroke();
    }

    //Draw Grid Rows
    let height = Math.ceil(Game.CANVAS_HEIGHT / this.GridCellSize);
    for (let i = 0; i <= height; i++) {
      let y = (this.GridCellSize * i) - this.remainderY;
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(0, y);
      Game.CONTEXT.lineTo(Game.CANVAS_WIDTH, y);
      Game.CONTEXT.stroke();
    }


    super.Draw(deltaTime);
  }


  private setUpGrid(): void {
    this.grid = [];
    this.gridColumns = Math.ceil(Game.CANVAS_WIDTH / this.GridCellSize);
    this.gridRows = Math.ceil(Game.CANVAS_HEIGHT / this.GridCellSize);
    for (let x = 0; x < this.gridColumns; x++) {
      let row = [];
      for (let y = 0; y < this.gridRows; y++) {
        let coordX = x * this.GridCellSize;
        let coordY = y * this.GridCellSize;
        if (coordX < this.gridRect.X || (coordX + this.GridCellSize) > this.gridRect.TopRight.X ||
          coordY < this.gridRect.Y || (coordY + this.GridCellSize) > this.gridRect.BottomRight.Y)
          row.push(ePathCellStatus.OutOfBounds);
        else
          row.push(ePathCellStatus.Open);
      }
      this.grid.push(row);
    }

    let startX = 0;
    let endX = 0;
    for (let i = 0; i < this.gridColumns; i++) {
      let foo = (i * this.GridCellSize) - this.remainderX;
      if (startX === 0 && foo >= this.UICellSize)
        startX += foo;

      if (foo > (Game.CANVAS_WIDTH - (this.UICellSize * 2)))
        break;

      endX = foo;
    }

    let startY = 0;
    let endY = 0;
    for (let j = 0; j < this.gridRows; j++) {
      let foo = (j * this.GridCellSize) - this.remainderY;
      if (startY === 0 && foo >= this.UICellSize)
        startY += foo;

      if (foo > (Game.CANVAS_HEIGHT - this.UICellSize))
        break;

      endY = foo;
    }

    this.gridRect = new Rect(startX, startY, endX - startX, endY - startY);


    //this.grid[this.StartingCells[0].X][this.StartingCells[0].Y] = 0;
    //this.grid[this.EndingCells[0].X][this.EndingCells[0].Y] = 0;

    //this.calculatePath();

    //this.lastCoordinate = new Vector3((this.EndingCells[0].X * this.GridCellSize) + (this.GridCellSize / 2), (this.EndingCells[0].Y * this.GridCellSize) + (this.GridCellSize / 2), 0);
  }

  private setUpBoundaries(): void {
    //Top Wall
    this.topBoundary.SetLocation(0, 0, eLayerTypes.Boundary);
    this.topBoundary.SetSize(this.gridRect.X + this.gridRect.Width, this.gridRect.Y);
    this.topBoundary.SetColor('#44444444');

    //Left Wall
    this.leftBoundary.SetLocation(0, this.gridRect.Y, eLayerTypes.Boundary);
    this.leftBoundary.SetSize(this.gridRect.X, Game.CANVAS_HEIGHT);
    this.leftBoundary.SetColor('#44444444');

    //Right Wall
    this.rightBoundary.SetLocation(this.gridRect.TopRight.X, 0, eLayerTypes.Boundary);
    this.rightBoundary.SetSize((Game.CANVAS_WIDTH - this.gridRect.TopRight.X), this.gridRect.BottomRight.Y);
    this.rightBoundary.SetColor('#44444444');

    //Bottom Wall
    this.bottomBoundary.SetLocation(this.gridRect.X, this.gridRect.BottomLeft.Y, eLayerTypes.Boundary);
    this.bottomBoundary.SetSize(Game.CANVAS_WIDTH, (Game.CANVAS_HEIGHT - this.gridRect.BottomLeft.Y));
    this.bottomBoundary.SetColor('#44444444');
  }

  private remainderX: number = 0;
  private remainderY: number = 0;
  private gridRect: Rect = new Rect(0, 0, 0, 0);

  private grid: number[][] = [];
  private gridColumns: number = 0;
  private gridRows: number = 0;

  private slider: Slider = new Slider();
  private topBoundary: Boundary = new Boundary();
  private bottomBoundary: Boundary = new Boundary();
  private rightBoundary: Boundary = new Boundary();
  private leftBoundary: Boundary = new Boundary();
}
