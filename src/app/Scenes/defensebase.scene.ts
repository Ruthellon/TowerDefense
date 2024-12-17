import { Attacker } from "../GameObjects/attacker.gameobject";
import { Defender } from "../GameObjects/defender.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Rect, Vector2 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { PathFinder } from "../Utility/pathfinding.service";
import { BaseLevel } from "./base.scene";
import { IScene } from "./scene.interface";



export abstract class DefenseBaseLevel extends BaseLevel {
  protected abstract get GridCellSize(): number;
  protected abstract get TurretCellSize(): number;
  protected abstract get StartingCells(): Vector2[];
  protected abstract get EndingCells(): Vector2[];
  protected abstract get SelectedTurret(): Defender;
  protected abstract get PlayerHealth(): number;
  protected abstract get TotalEnemies(): number;

  protected abstract SetCredits(): void;
  protected abstract SetSecondsToStart(): void;
  protected abstract ReduceHealth(reduceBy: number): void;

  protected enemyCount: number = 0;
  protected get EnemyCount(): number {
    return this.enemyCount;
  }

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
  protected credits: number = 0;
  protected get Credits(): number {
    return this.credits;
  }
  protected secondsToStart: number = 0;
  protected get SecondsToStart(): number {
    return this.secondsToStart;
  }
  protected canBuild: boolean = true;
  protected get CanBuild(): boolean {
    return this.canBuild;
  }
  protected isGameOver: boolean = false;
  public get IsGameOver(): boolean {
    return this.isGameOver;
  }

  private remainder: number = 0;
  protected attackers: Attacker[] = [];
  protected defenders: Defender[] = [];
  Load(): void {
    this.SetCredits();
    this.SetSecondsToStart();

    this.remainder = Math.floor((Game.CANVAS_HEIGHT % this.GridCellSize) / 2);

    this.grid = [];
    this.gridColumns = Math.floor(Game.CANVAS_WIDTH / this.GridCellSize);
    this.gridRows = Math.floor(Game.CANVAS_HEIGHT / this.GridCellSize);
    for (let i = 0; i < this.gridColumns; i++) {
      let row = [];
      for (let j = 0; j < this.gridRows; j++) {
        if (j === 0 || j === this.gridRows - 1 ||
          i === 0 || i === this.gridColumns - 1 || i === this.gridColumns - 2)
          row.push(1);
        else
          row.push(0);
      }
      this.grid.push(row);
    }

    this.grid[this.StartingCells[0].X][this.StartingCells[0].Y] = 0;
    this.grid[this.EndingCells[0].X][this.EndingCells[0].Y] = 0;

    let tempPath = PathFinder.AStarSearch(this.grid, this.StartingCells[0], this.EndingCells[0]);

    if (tempPath.length > 0) {
      this.thePath = [];
      for (let i = tempPath.length - 1; i >= 0; i--) {
        let worldPoint = new Vector2((tempPath[i].X * this.GridCellSize),
          (tempPath[i].Y * this.GridCellSize) + this.remainder);

        this.thePath.push(worldPoint);
      }
    }
  }

  private previousMouse: Vector2 | null = null;
  private mouseCell: Vector2 | null = null;
  private mouseReset: boolean = true;
  override Update(deltaTime: number) {
    if (this.PlayerHealth <= 0) {
      this.isGameOver = true;
      return;
    }

    if (this.enemyCount >= this.TotalEnemies) {
      this.isGameOver = true;
      return;
    }

    super.Update(deltaTime);

    this.attackers.forEach((obj) => {
      if (obj.Health <= 0) {
        if (obj.Value)
          this.credits += obj.Value;

        this.enemyCount++;
        this.DestroyGameObject(obj);
      }
    });
    
    if (this.attackers.length > 0 && this.defenders.length > 0) {
      this.defenders.forEach((turret) => {
        turret.FindTarget(this.attackers);
      });
    }

    if (!this.previousMouse || !this.previousMouse.isEqual(Game.MOUSE_LOCATION)) {
      this.previousMouse = Game.MOUSE_LOCATION;

      if (this.GRID_RECT.ContainsPoint(Game.MOUSE_LOCATION)) {
        this.mouseCell = new Vector2(Math.floor((Game.MOUSE_LOCATION.X) / this.GridCellSize),
          Math.floor(((Game.MOUSE_LOCATION.Y) - this.remainder) / this.GridCellSize));
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

    if (this.isGameOver) {
      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '64px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.fillText('GAME OVER', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2);

      if (this.PlayerHealth <= 0) {
        Game.CONTEXT.fillStyle = '#ffffff';
        Game.CONTEXT.font = '32px serif';
        Game.CONTEXT.textAlign = "center";
        Game.CONTEXT.fillText('You Lost!', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 75);
      }
      else {
        Game.CONTEXT.fillStyle = '#ffffff';
        Game.CONTEXT.font = '32px serif';
        Game.CONTEXT.textAlign = "center";
        Game.CONTEXT.fillText('You Won!', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 75);
      }

      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '32px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.fillText('Refresh To Play Again', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 150);
      return;
    }

    if (this.secondsToStart > 0) {
      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '16px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.fillText(`Start: ${this.secondsToStart.toFixed(2)}`, this.GridCellSize * 2.5, this.GridCellSize / 2);
    }

    if (this.PlayerHealth > 0) {
      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '16px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.fillText(`Health: ${this.PlayerHealth}`, Game.CANVAS_WIDTH / 2, this.GridCellSize / 2);
    }

    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '16px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText(`Credits: ${this.credits.toFixed(0)}`, Game.CANVAS_WIDTH - this.GridCellSize * 2.5, this.GridCellSize / 2);

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
      Game.CONTEXT.strokeStyle = '#2222ff88';
      this.thePath.forEach((path) => {
        Game.CONTEXT.strokeRect(path.X + 5, path.Y + 5,
          this.GridCellSize - 10, this.GridCellSize - 10);
      });
    }

    if (this.mouseCell) {
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect((this.mouseCell.X * this.GridCellSize), (this.mouseCell.Y * this.GridCellSize) + this.remainder,
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

    if (this.SelectedTurret.Cost && this.Credits < this.SelectedTurret.Cost)
      return false;

    if (!this.canBuild) {
      if (this.grid[cell.X][cell.Y] === 2)
        return false;

      this.grid[cell.X][cell.Y] = 1;
      let newObstacle = this.SelectedTurret;
      newObstacle.SetLocation((cell.X * this.GridCellSize),
        ((cell.Y * this.GridCellSize) + this.remainder), 5);

      if (newObstacle.Cost)
        this.credits -= newObstacle.Cost;

      this.LoadGameObject(newObstacle);
      this.defenders.push(newObstacle);
      return true;
    }

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
      for (let x = 0; x < this.grid.length; x++) {
        for (let y = 0; y < this.grid[x].length; y++) {
          if (this.grid[x][y] === 2)
            this.grid[x][y] = 0;
        }
      }

      for (let i = tempPath.length - 1; i >= 0; i--) {
        this.grid[tempPath[i].X][tempPath[i].Y] = 2;
        let worldPoint = new Vector2((tempPath[i].X * this.GridCellSize),
          (tempPath[i].Y * this.GridCellSize) + this.remainder);

        this.thePath.push(worldPoint);
      }

      let newObstacle = this.SelectedTurret;
      newObstacle.SetLocation((cell.X * this.GridCellSize),
        ((cell.Y * this.GridCellSize) + this.remainder), 5);

      if (newObstacle.Cost)
        this.credits -= newObstacle.Cost;

      this.defenders.push(newObstacle);
      this.LoadGameObject(newObstacle);

      return true;
    }
  }
}
