import { Rect, Vector2 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { PathFinder } from "../Utility/pathfinding.service";
import { Block } from "./block.gameobject";
import { IGameObject } from "./gameobject.interface";

export class FloorGrid extends IGameObject {
  private gridSize: number = 0;
  private shouldHighlight: boolean = false;
  private grid: number[][] = [];
  private gridColumns: number = 0;
  private gridRows: number = 0;

  constructor() {
    super();

    this.SetGridSize(64);
  }

  public SetGridSize(grid: number) {
    this.gridSize = grid;
    this.createGrid();
  }

  public SetShouldHighlight(should: boolean) {
    this.shouldHighlight = should;
  }

  public AddObstacle(obstacle: IGameObject): void {
    if (this.topLeft && this.bottomRight) {
      let isOpen: boolean = true;
      let newSquare = new Rect(this.topLeft.X, this.topLeft.Y,
        (this.bottomRight.X - this.topLeft.X),
        (this.bottomRight.Y - this.topLeft.Y));
      this.savedSquares.forEach((square) => {
        isOpen = !Rect.IsOverlapping(newSquare, square) && isOpen;
      });

      if (isOpen) {
        let x = Math.floor((this.bottomRight.X - (this.gridSize / 2)) / this.gridSize);
        let y = Math.floor((this.bottomRight.Y - (this.gridSize / 2)) / this.gridSize);

        this.grid[x][y] = 1;
        this.grid[Math.max(0, x - 1)][y] = 1;
        this.grid[Math.max(0, x - 1)][Math.max(0, y - 1)] = 1;
        this.grid[x][Math.max(0, y - 1)] = 1;
        
        if (!this.CalculatePath()) {
          this.grid[x][y] = 0;
          this.grid[Math.max(0, x - 1)][y] = 0;
          this.grid[Math.max(0, x - 1)][Math.max(0, y - 1)] = 0;
          this.grid[x][Math.max(0, y - 1)] = 0;
        }
        else {
          this.savedSquares.push(newSquare);
        }
      }
    }
  }

  private path: any[] = [];
  public CalculatePath(): boolean {
    let tempPath = PathFinder.AStarSearch(this.grid, this.gridRows, this.gridColumns, new Vector2(0, 5), new Vector2(this.gridColumns - 1, 5));
    
    if (tempPath.length > 0) {
      this.path = tempPath;
      return true;
    }
    else
      return false;
  }

  private savedSquares: Rect[] = [];

  private topLeft: Vector2 | null = null;
  private bottomRight: Vector2 | null = null;
  private previousMouse: Vector2 | null = null;
  Update(deltaTime: number): void {
    if (this.shouldHighlight) {
      if ((!this.previousMouse) ||
        (this.previousMouse.X !== Game.MOUSE_LOCATION.X &&
        this.previousMouse.Y !== Game.MOUSE_LOCATION.Y)) {
        let mouseLocal = Game.MOUSE_LOCATION;
        this.previousMouse = mouseLocal;

        this.bottomRight = new Vector2(Math.ceil(mouseLocal.X / this.gridSize) * this.gridSize,
          Math.ceil(mouseLocal.Y / this.gridSize) * this.gridSize);

        this.topLeft = new Vector2(Math.max(0, this.bottomRight.X - (this.gridSize * 2)),
          Math.max(0, this.bottomRight.Y - (this.gridSize * 2)));

        if (this.topLeft.X === 0)
          this.bottomRight.X = 2 * this.gridSize;

        if (this.topLeft.Y === 0)
          this.bottomRight.Y = 2 * this.gridSize;

        if (this.bottomRight.X > Game.CANVAS_WIDTH)
          this.topLeft.X = Game.CANVAS_WIDTH - (2 * this.gridSize);

        if (this.bottomRight.Y > Game.CANVAS_HEIGHT)
          this.topLeft.Y = Game.CANVAS_HEIGHT - (2 * this.gridSize);
      }
    }

    if (Game.MOUSE_CLICKED) {
      this.AddObstacle(new Block());
    }
  }

  Draw(deltaTime: number): void {
    Game.CONTEXT.lineWidth = 1;
    let width = (Game.CANVAS_WIDTH / this.gridSize);
    let height = (Game.CANVAS_HEIGHT / this.gridSize);
    Game.CONTEXT.strokeStyle = this.Color!;
    for (let i = 1; i < width; i++) {
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(this.gridSize * i, 0);
      Game.CONTEXT.lineTo(this.gridSize * i, Game.CANVAS_HEIGHT);
      Game.CONTEXT.stroke();
    }
    for (let i = 1; i < height; i++) {
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(0, this.gridSize * i);
      Game.CONTEXT.lineTo(Game.CANVAS_WIDTH, this.gridSize * i);
      Game.CONTEXT.stroke();
    }

    Game.CONTEXT.lineWidth = 2;

    if (this.path.length > 0) {
      Game.CONTEXT.strokeStyle = '#0000ff';
      this.path.forEach((p) => {
        Game.CONTEXT.beginPath();
        Game.CONTEXT.moveTo(p[1] * this.gridSize, p[0] * this.gridSize);
        Game.CONTEXT.lineTo((p[1] + 1) * this.gridSize, p[0] * this.gridSize);
        Game.CONTEXT.lineTo((p[1] + 1) * this.gridSize, (p[0] + 1) * this.gridSize);
        Game.CONTEXT.lineTo(p[1] * this.gridSize, (p[0] + 1) * this.gridSize);
        Game.CONTEXT.lineTo(p[1] * this.gridSize, p[0] * this.gridSize);
        Game.CONTEXT.stroke();
      });
    }

    if (this.savedSquares.length > 0) {
      Game.CONTEXT.strokeStyle = '#ffff00';
      this.savedSquares.forEach((savedSquare) => {
        Game.CONTEXT.beginPath();
        Game.CONTEXT.moveTo(savedSquare.X, savedSquare.Y);
        Game.CONTEXT.lineTo(savedSquare.X + savedSquare.Width, savedSquare.Y);
        Game.CONTEXT.lineTo(savedSquare.X + savedSquare.Width, savedSquare.Y + savedSquare.Height);
        Game.CONTEXT.lineTo(savedSquare.X, (savedSquare.Y + savedSquare.Height));
        Game.CONTEXT.lineTo(savedSquare.X, savedSquare.Y);
        Game.CONTEXT.stroke();
      });
    }

    if (this.topLeft && this.bottomRight) {
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(this.topLeft.X, this.topLeft.Y);
      Game.CONTEXT.lineTo(this.bottomRight.X, this.topLeft.Y);
      Game.CONTEXT.lineTo(this.bottomRight.X, this.bottomRight.Y);
      Game.CONTEXT.lineTo(this.topLeft.X, this.bottomRight.Y);
      Game.CONTEXT.lineTo(this.topLeft.X, this.topLeft.Y);
      Game.CONTEXT.stroke();
    }

    Game.CONTEXT.lineWidth = 1;
  }

  private createGrid() {
    this.grid = [];
    this.gridColumns = Math.floor(Game.CANVAS_WIDTH / this.gridSize);
    this.gridRows = Math.floor(Game.CANVAS_HEIGHT / this.gridSize);
    for (let i = 0; i < this.gridColumns; i++) {
      let row = [];
      for (let j = 0; j < this.gridRows; j++) {
        row.push(0);
      }
      this.grid.push(row);
    }
  }
}
