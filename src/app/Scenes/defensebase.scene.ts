import { IGameObject } from "../GameObjects/gameobject.interface";
import { Vector2 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { PathFinder } from "../Utility/pathfinding.service";
import { IScene } from "./scene.interface";



export abstract class DefenseBaseLevel extends IScene {
  protected abstract get GridCellSize(): number;
  protected abstract get TurretCellSize(): number;
  protected abstract get StartingCells(): Vector2[];
  protected abstract get EndingCells(): Vector2[];
  protected abstract get SelectedTurret(): IGameObject;

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

  private thePath: Vector2[] = [];
  Load(): void {
    this.grid = [];
    this.gridColumns = Math.floor(Game.CANVAS_WIDTH / this.GridCellSize);
    this.gridRows = Math.floor(Game.CANVAS_HEIGHT / this.GridCellSize);
    for (let i = 0; i < this.gridColumns; i++) {
      let row = [];
      for (let j = 0; j < this.gridRows; j++) {
        row.push(0);
      }
      this.grid.push(row);
    }

    this.thePath = PathFinder.AStarSearch(this.grid, this.StartingCells[0], this.EndingCells[0]);
  }

  private previousMouse: Vector2 | null = null;
  private mouseCell: Vector2 | null = null;
  private mouseReset: boolean = true;
  override Update(deltaTime: number) {
    if ((!this.previousMouse) ||
      (this.previousMouse.X !== Game.MOUSE_LOCATION.X ||
        this.previousMouse.Y !== Game.MOUSE_LOCATION.Y)) {
      let mouseLocal = Game.MOUSE_LOCATION;
      this.previousMouse = mouseLocal;

      let remainder = Math.floor((Game.CANVAS_HEIGHT % this.GridCellSize) / 2);
      this.mouseCell = new Vector2(Math.floor(mouseLocal.X / this.GridCellSize),
        Math.floor((mouseLocal.Y - remainder) / this.GridCellSize));
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
    Game.CONTEXT!.fillStyle = '#000000';
    Game.CONTEXT!.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

    Game.CONTEXT.lineWidth = 1;
    let width = (Game.CANVAS_WIDTH / this.GridCellSize);
    Game.CONTEXT.strokeStyle = `#ff000080`;
    for (let i = 1; i < width; i++) {
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(this.GridCellSize * i, 0);
      Game.CONTEXT.lineTo(this.GridCellSize * i, Game.CANVAS_HEIGHT);
      Game.CONTEXT.stroke();
    }

    let height = Math.ceil(Game.CANVAS_HEIGHT / this.GridCellSize);
    let remainder = Math.floor((Game.CANVAS_HEIGHT % this.GridCellSize) / 2);
    for (let i = 0; i < height; i++) {
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(0, (this.GridCellSize * i) + remainder);
      Game.CONTEXT.lineTo(Game.CANVAS_WIDTH, (this.GridCellSize * i) + remainder);
      Game.CONTEXT.stroke();
    }

    Game.CONTEXT.lineWidth = 5;

    if (this.thePath.length > 0) {
      Game.CONTEXT.strokeStyle = '#2222ff';
      this.thePath.forEach((path) => {
        Game.CONTEXT.strokeRect((path.X * this.GridCellSize) + 5, ((path.Y * this.GridCellSize) + remainder) + 5,
          this.GridCellSize - 10, this.GridCellSize - 10);
      });
    }

    if (this.obstacles.length > 0) {
      Game.CONTEXT.strokeStyle = '#ffff00';
      this.obstacles.forEach((obstacle) => {
        Game.CONTEXT.strokeRect((obstacle.X * this.GridCellSize) + 5, ((obstacle.Y * this.GridCellSize) + remainder) + 5,
          this.GridCellSize - 10, this.GridCellSize - 10);
      });
    }

    if (this.mouseCell) {
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect(this.mouseCell.X * this.GridCellSize, (this.mouseCell.Y * this.GridCellSize) + remainder,
        this.GridCellSize, this.GridCellSize);
    }

    Game.CONTEXT.lineWidth = 1;
  }

  private obstacles: Vector2[] = [];
  protected AddObstacle(cell: Vector2, obstacle?: IGameObject): boolean {
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
      this.GameObjects.forEach((obj) => {
        obj.UpdatePath(this.grid, this.GridCellSize, this.EndingCells[0])
      });
      this.thePath = tempPath;
      this.obstacles.push(cell);
      return true;
    }
  }
}
