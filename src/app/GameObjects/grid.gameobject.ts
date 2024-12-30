import { AppComponent } from "../app.component";
import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { ePathCellStatus } from "../Utility/pathfinding.service";
import { Attacker } from "./attacker.gameobject";
import { Base } from "./base.gameobject";
import { IGameObject } from "./gameobject.interface";

export class Grid extends Base {
  public override get Value(): number | null {
    return null;
  }

  private gridCellSize = 100;
  public get GridCellSize(): number {
    return this.gridCellSize;
  }

  private gridRect: Rect = new Rect(0, 0, 0, 0);
  public get PlayableArea(): Rect {
    return this.gridRect;
  }

  private startingCells: Vector2[] = [];
  public get StartingCells(): Vector2[] {
    return this.startingCells;
  }
  private endingCells: Vector2[] = [];
  public get EndingCells(): Vector2[] {
    return this.endingCells;
  }

  public override Load() {
    super.Load();

    this.SetUpGrid();
  }

  public override Update(deltaTime: number) {
    if (Game.MOUSE_LOCATION.X > 0 && Game.MOUSE_LOCATION.Y > 0) {
      if ((this.mouseHighlightCell && !this.mouseHighlightCell.isEqual(Game.MOUSE_LOCATION)) ||
        !this.mouseHighlightCell) {
        this.mouseHighlightCell = new Vector2(Math.floor((Game.MOUSE_LOCATION.X - this.remainderX) / this.GridCellSize),
          Math.floor((Game.MOUSE_LOCATION.Y - this.remainderY) / this.GridCellSize));
      }
    }

    if (Game.MOUSE_PRESSED) {
      this.mousePreviousClickCell = new Vector2(Math.floor((Game.MOUSE_PRESS_LOCATION.X - this.remainderX) / this.GridCellSize),
        Math.floor((Game.MOUSE_PRESS_LOCATION.Y - this.remainderY) / this.GridCellSize));
    }
    else if (this.mousePreviousClickCell) {
      let mouseClickCell = new Vector2(Math.floor((Game.MOUSE_PRESS_LOCATION.X - this.remainderX) / this.GridCellSize),
        Math.floor((Game.MOUSE_PRESS_LOCATION.Y - this.remainderY) / this.GridCellSize));

      if (mouseClickCell.isEqual(this.mousePreviousClickCell)) {
        if (this.clickFunction) {
          this.clickFunction();
        }
      }

      this.mousePreviousClickCell = null;
    }
  }

  public override Draw(deltaTime: number) {
    //Draw Grid Columns
    Game.CONTEXT.lineWidth = 1;
    let width = Math.ceil(Game.CANVAS_WIDTH / this.GridCellSize);
    Game.CONTEXT.strokeStyle = `#ff000080`;
    for (let i = 0; i <= width + 1; i++) {
      let x = (this.GridCellSize * i) + this.remainderX;
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(x, 0);
      Game.CONTEXT.lineTo(x, Game.CANVAS_HEIGHT);
      Game.CONTEXT.stroke();
    }

    //Draw Grid Rows
    let height = Math.ceil(Game.CANVAS_HEIGHT / this.GridCellSize);
    for (let i = 0; i <= height; i++) {
      let y = (this.GridCellSize * i) + this.remainderY;
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(0, y);
      Game.CONTEXT.lineTo(Game.CANVAS_WIDTH, y);
      Game.CONTEXT.stroke();
    }

    if (this.mouseHighlightCell) {
      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect((this.mouseHighlightCell.X * this.GridCellSize) + this.remainderX, (this.mouseHighlightCell.Y * this.GridCellSize) + this.remainderY,
        this.GridCellSize, this.GridCellSize);
    }

    for (let i = 0; i < this.startingCells.length; i++) {
      let x = (this.startingCells[i].X * this.GridCellSize) + this.remainderX;
      let y = (this.startingCells[i].Y * this.GridCellSize) + this.remainderY;
      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#00ff00';
      Game.CONTEXT.strokeRect(x, y,
        this.GridCellSize, this.GridCellSize);

      Game.CONTEXT.fillStyle = '#00ff00';
      Game.CONTEXT.font = '24px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.textBaseline = "middle";
      Game.CONTEXT.fillText(`${i + 1}`, x + (this.GridCellSize / 2), y + (this.GridCellSize / 2));
    }

    for (let i = 0; i < this.endingCells.length; i++) {
      let x = (this.endingCells[i].X * this.GridCellSize) + this.remainderX;
      let y = (this.endingCells[i].Y * this.GridCellSize) + this.remainderY;
      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ff0000';
      Game.CONTEXT.strokeRect(x, y,
        this.GridCellSize, this.GridCellSize);

      Game.CONTEXT.fillStyle = '#ff0000';
      Game.CONTEXT.font = '24px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.textBaseline = "middle";
      Game.CONTEXT.fillText(`${i + 1}`, x + (this.GridCellSize / 2), y + (this.GridCellSize / 2));
    }
  }

  public AddStartPoint(): boolean {
    if (this.mousePreviousClickCell) {
      let cell = this.mousePreviousClickCell;
      if (this.grid[cell.X][cell.Y] === ePathCellStatus.OutOfBounds) {
        if (this.checkNeighboringCells(cell)) {
          this.grid[cell.X][cell.Y] = ePathCellStatus.StartingPoint;
          this.startingCells.push(cell);
        }
      }
      else if (this.grid[cell.X][cell.Y] === ePathCellStatus.EndingPoint) {
        this.grid[cell.X][cell.Y] = ePathCellStatus.StartingPoint;
        this.startingCells.push(cell);
        this.endingCells.splice(this.endingCells.findIndex((end) => cell.isEqual(end)), 1);
      }
      else if (this.grid[cell.X][cell.Y] === ePathCellStatus.StartingPoint) {
        this.grid[cell.X][cell.Y] = ePathCellStatus.OutOfBounds;
        this.startingCells.splice(this.startingCells.findIndex((start) => cell.isEqual(start)), 1);
      }
      return true;
    }
    return false;
  }

  public AddEndPoint(cell?: Vector2): boolean {
    if (this.mousePreviousClickCell) {
      let cell = this.mousePreviousClickCell;
      if (this.grid[cell.X][cell.Y] === ePathCellStatus.OutOfBounds) {
        if (this.checkNeighboringCells(cell)) {
          this.grid[cell.X][cell.Y] = ePathCellStatus.EndingPoint;
          this.endingCells.push(cell);
        }
      }
      else if (this.grid[cell.X][cell.Y] === ePathCellStatus.StartingPoint) {
        this.grid[cell.X][cell.Y] = ePathCellStatus.EndingPoint;
        this.endingCells.push(cell);
        this.startingCells.splice(this.startingCells.findIndex((start) => cell.isEqual(start)), 1);
      }
      else if (this.grid[cell.X][cell.Y] === ePathCellStatus.EndingPoint) {
        this.grid[cell.X][cell.Y] = ePathCellStatus.OutOfBounds;
        this.endingCells.splice(this.endingCells.findIndex((end) => cell.isEqual(end)), 1);
      }
      return true;
    }
    return false;
  }

  public AddObstacle(): boolean {
    return false;
  }

  public SetGridCellSize(cellSize: number) {
    if (cellSize < 1) {
      this.gridCellSize = 1;
      return;
    }

    if (cellSize > 900) {
      this.gridCellSize = 900;
      return;
    }

    this.gridCellSize = cellSize;
  }

  public SetUICellSize(cellSize: number) {
    this.uiCellSize = cellSize;
  }

  public SetUpGrid(): void {
    this.remainderX = Math.floor((this.Size.X % this.GridCellSize) / 2);
    this.remainderY = Math.floor((this.Size.Y % this.GridCellSize) / 2);

    this.grid = [];
    this.gridColumns = Math.floor(this.Size.X / this.GridCellSize);
    this.gridRows = Math.floor(this.Size.Y / this.GridCellSize);

    this.startingCells = [];
    this.endingCells = [];

    let startX = 0;
    let endX = 0;
    for (let i = 0; i < this.gridColumns; i++) {
      let foo = (i * this.GridCellSize) + this.remainderX;
      if (startX === 0 && foo >= this.uiCellSize)
        startX += foo;

      if (foo > (this.Size.X - (this.uiCellSize * 2)))
        break;

      endX = foo;
    }

    let startY = 0;
    let endY = 0;
    for (let j = 0; j < this.gridRows; j++) {
      let foo = (j * this.GridCellSize) + this.remainderY;
      if (startY === 0 && foo >= this.uiCellSize)
        startY += foo;

      if (foo > (this.Size.Y - this.uiCellSize))
        break;

      endY = foo;
    }

    this.gridRect = new Rect(startX, startY, endX - startX, endY - startY);

    for (let x = 0; x < this.gridColumns; x++) {
      let row = [];
      for (let y = 0; y < this.gridRows; y++) {
        let coordX = (x * this.GridCellSize) + this.remainderX;
        let coordY = (y * this.GridCellSize) + this.remainderY;
        if (coordX < this.gridRect.X || (coordX + this.GridCellSize) > this.gridRect.TopRight.X ||
          coordY < this.gridRect.Y || (coordY + this.GridCellSize) > this.gridRect.BottomRight.Y)
          row.push(ePathCellStatus.OutOfBounds);
        else
          row.push(ePathCellStatus.Open);
      }
      this.grid.push(row);
    }




    //this.grid[this.StartingCells[0].X][this.StartingCells[0].Y] = 0;
    //this.grid[this.EndingCells[0].X][this.EndingCells[0].Y] = 0;

    //this.calculatePath();

    //this.lastCoordinate = new Vector3((this.EndingCells[0].X * this.GridCellSize) + (this.GridCellSize / 2), (this.EndingCells[0].Y * this.GridCellSize) + (this.GridCellSize / 2), 0);
  }

  private checkNeighboringCells(cell: Vector2): boolean {
    //Check north
    if (this.grid[cell.X][Math.max(0, cell.Y - 1)] === ePathCellStatus.Open)
      return true;

    //Check east
    if (this.grid[Math.min(this.grid.length - 1, cell.X + 1)][cell.Y] === ePathCellStatus.Open)
      return true;

    //Check south
    if (this.grid[cell.X][Math.min(this.grid[cell.X].length - 1, cell.Y + 1)] === ePathCellStatus.Open)
      return true;

    //Check west
    if (this.grid[Math.max(0, cell.X - 1)][cell.Y] === ePathCellStatus.Open)
      return true;

    return false;
  }

  private remainderX: number = 0;
  private remainderY: number = 0;

  private grid: number[][] = [];
  private gridColumns: number = 0;
  private gridRows: number = 0;
  private uiCellSize: number = 100;

  private mousePreviousClickCell: Vector2 | null = null;
  private mouseHighlightCell: Vector2 | null = null;
}
