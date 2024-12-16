import { IGameObject } from "../GameObjects/gameobject.interface";
import { Rect, Vector2 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { PathFinder } from "../Utility/pathfinding.service";
import { IScene } from "./scene.interface";



export abstract class DefenseBaseLevel extends IScene {
  protected abstract get GridCellSize(): number;
  protected abstract get TurretCellSize(): number;
  protected abstract get StartingCells(): Vector2[];
  protected abstract get EndingCells(): Vector2[];
  protected abstract get SelectedTurret(): IGameObject;

  private thePath: Vector2[] = [];
  protected get ThePath(): Vector2[] {
    return this.thePath;
  }

  private grid: number[][] = [];
  protected get Grid(): number[][] {
    return this.grid;
  }
  private gridColumns: number = 0;
  protected get GridColumns(): number {
    return this.gridColumns;
  }
  private gridRows: number = 0;
  protected get GridRows(): number {
    return this.gridRows;
  }
  private gridRect = new Rect(100, 100, Game.CANVAS_WIDTH - 300, Game.CANVAS_HEIGHT - 200);
  protected get GRID_RECT(): Rect {
    return this.gridRect;
  }

  private remainder: number = 0;

  Load(): void {
    this.remainder = Math.floor((this.GRID_RECT.Height % this.GridCellSize) / 2);

    this.grid = [];
    this.gridColumns = Math.floor(this.GRID_RECT.Width / this.GridCellSize);
    this.gridRows = Math.floor(this.GRID_RECT.Height / this.GridCellSize);
    for (let i = 0; i < this.gridColumns; i++) {
      let row = [];
      for (let j = 0; j < this.gridRows; j++) {
        row.push(0);
      }
      this.grid.push(row);
    }

    let tempPath = PathFinder.AStarSearch(this.grid, this.StartingCells[0], this.EndingCells[0]);

    if (tempPath.length > 0) {
      this.thePath = [];
      for (let i = tempPath.length - 1; i >= 0; i--) {
        let worldPoint = new Vector2((tempPath[i].X * this.GridCellSize) + this.GRID_RECT.X,
          (tempPath[i].Y * this.GridCellSize) + this.remainder + this.GRID_RECT.Y);

        this.thePath.push(worldPoint);
      }
    }
  }

  private previousMouse: Vector2 | null = null;
  private mouseCell: Vector2 | null = null;
  private mouseReset: boolean = true;
  override Update(deltaTime: number) {
    super.Update(deltaTime);

    if (!this.previousMouse || !this.previousMouse.isEqual(Game.MOUSE_LOCATION)) {
      this.previousMouse = Game.MOUSE_LOCATION;

      if (this.GRID_RECT.ContainsPoint(Game.MOUSE_LOCATION)) {
        this.mouseCell = new Vector2(Math.floor((Game.MOUSE_LOCATION.X - this.GRID_RECT.X) / this.GridCellSize),
          Math.floor(((Game.MOUSE_LOCATION.Y - this.GRID_RECT.Y) - this.remainder) / this.GridCellSize));
      }
      else {
        this.mouseCell = null;
      }
    }

    if (Game.MOUSE_CLICKED && this.mouseCell && this.mouseReset) {
      this.mouseReset = false;
      this.AddObstacle(this.mouseCell);
    }
    else if (!this.mouseReset && !Game.MOUSE_CLICKED) {
      this.mouseReset = true;
    }
  }

  override Draw(deltaTime: number) {
    Game.CONTEXT!.fillStyle = '#111111';
    Game.CONTEXT!.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

    Game.CONTEXT.lineWidth = 1;
    let width = Math.ceil(this.GRID_RECT.Width / this.GridCellSize);
    Game.CONTEXT.strokeStyle = `#ff000080`;
    for (let i = 0; i < width + 1; i++) {
      let x = this.GRID_RECT.X + (this.GridCellSize * i);
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(x, this.GRID_RECT.Y);
      Game.CONTEXT.lineTo(x, this.GRID_RECT.Y + this.GRID_RECT.Height);
      Game.CONTEXT.stroke();
    }

    let height = Math.ceil(Game.CANVAS_HEIGHT / this.GridCellSize);
    for (let i = 0; i < height; i++) {
      let y = this.GRID_RECT.Y + (this.GridCellSize * i) + this.remainder;
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(this.GRID_RECT.X, y);
      Game.CONTEXT.lineTo(this.GRID_RECT.X + this.GRID_RECT.Width, y);
      Game.CONTEXT.stroke();
    }

    Game.CONTEXT.lineWidth = 5;

    if (this.thePath.length > 0) {
      Game.CONTEXT.strokeStyle = '#2222ff22';
      this.thePath.forEach((path) => {
        Game.CONTEXT.strokeRect(path.X + 5, path.Y + 5,
          this.GridCellSize - 10, this.GridCellSize - 10);
      });
    }

    if (this.mouseCell) {
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect((this.mouseCell.X * this.GridCellSize) + this.GRID_RECT.X, (this.mouseCell.Y * this.GridCellSize) + this.remainder + this.GRID_RECT.Y,
        this.GridCellSize, this.GridCellSize);
    }

    Game.CONTEXT.lineWidth = 1;

    super.Draw(deltaTime);
  }

  protected AddObstacle(cell: Vector2): boolean {
    if (!this.grid)
      return false;

    if (this.grid[cell.X][cell.Y] === 1)
      return false;

    this.grid[cell.X][cell.Y] = 1;
    let tempPath = PathFinder.AStarSearch(this.grid, this.StartingCells[0], this.EndingCells[0]);

    if (tempPath.length === 0) {
      this.grid[cell.X][cell.Y] = 0;
      return false;
    }
    else {
      //let allGood = true;
      //this.GameObjects.forEach((obj) => {
      //  allGood = allGood && obj.UpdatePath(this.grid, this.GridCellSize, this.EndingCells[0])
      //});
      this.thePath = [];
      for (let i = tempPath.length - 1; i >= 0; i--) {
        let worldPoint = new Vector2((tempPath[i].X * this.GridCellSize) + this.GRID_RECT.X,
          (tempPath[i].Y * this.GridCellSize) + this.remainder + this.GRID_RECT.Y);

        this.thePath.push(worldPoint);
      }

      let newObstacle = this.SelectedTurret;
      newObstacle.SetLocation((cell.X * this.GridCellSize) + this.GRID_RECT.X,
        ((cell.Y * this.GridCellSize) + this.remainder + this.GRID_RECT.Y), 5);

      this.LoadGameObject(newObstacle);

      return true;
    }
  }
}
