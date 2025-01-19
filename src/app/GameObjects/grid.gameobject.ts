import { AppComponent } from "../app.component";
import { eLayerTypes } from "../Scenes/scene.interface";
import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { ePathCellStatus, PathFinder } from "../Utility/pathfinding.service";
import { Attacker } from "./attacker.gameobject";
import { Base } from "./base.gameobject";
import { Defender } from "./defender.gameobject";
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
  public get PathsCount(): number {
    return this.thePaths.length;
  }

  private obstacles: IGameObject[] = [];
  public get Obstacles(): IGameObject[] {
    return this.obstacles;
  }

  private selectedObstacle: IGameObject | null = null;
  public get SelectedObstacle(): IGameObject | null {
    return this.selectedObstacle;
  }

  public override Load() {
    super.Load();

    this.SetUpGrid();
  }

  public override Update(deltaTime: number) {
    super.Update(deltaTime);

    this.Obstacles.forEach((def) => {
      if (def instanceof Defender) {
        if (def.Clicked) {
          def.SetSelected(true);
          this.selectedObstacle = def;
        }
        else if (def.Selected && def !== this.selectedObstacle) {
          def.SetSelected(false);
        }
      }
    });

    if (Game.MOUSE_LOCATION.X > 0 && Game.MOUSE_LOCATION.Y > 0) {
      if (this.previousMouse === null || !Game.MOUSE_LOCATION.isEqual(this.previousMouse)) {
        this.previousMouse = Game.MOUSE_LOCATION;
        if (this.PlayableArea.ContainsPoint(Game.MOUSE_LOCATION) && !this.isDevMode) {
          let vectorX = Math.floor(Math.max((Game.MOUSE_LOCATION.X - this.remainderX - ((this.obstacleCellSize - this.gridCellSize) / 2)), this.PlayableArea.X) / this.gridCellSize);
          let vectorY = Math.floor(Math.max((Game.MOUSE_LOCATION.Y - this.remainderY - ((this.obstacleCellSize - this.gridCellSize) / 2)), this.PlayableArea.Y) / this.gridCellSize);
          this.mouseHighlightCell = new Vector2(vectorX, vectorY);
          this.mouseHighlight = new Vector2(Math.min((vectorX * this.gridCellSize) + this.remainderX, (this.PlayableArea.BottomRight.X - this.obstacleCellSize)),
            Math.min((vectorY * this.gridCellSize) + this.remainderY, (this.PlayableArea.BottomRight.Y - this.obstacleCellSize)));
        }
        else if (this.isDevMode) {
          let vectorX = Math.floor((Game.MOUSE_LOCATION.X - this.remainderX) / this.gridCellSize);
          let vectorY = Math.floor((Game.MOUSE_LOCATION.Y - this.remainderY) / this.gridCellSize);
          this.mouseHighlightCell = new Vector2(vectorX, vectorY);
          this.mouseHighlight = new Vector2((vectorX * this.gridCellSize) + this.remainderX,
            (vectorY * this.gridCellSize) + this.remainderY);
        }
      }
    }

    if (Game.MOUSE_PRESSED) {
      if (this.PlayableArea.ContainsPoint(Game.MOUSE_PRESS_LOCATION) && !this.isDevMode) {
        let vectorX = Math.floor(Math.max((Game.MOUSE_PRESS_LOCATION.X - this.remainderX - ((this.obstacleCellSize - this.gridCellSize) / 2)), this.PlayableArea.X) / this.gridCellSize);
        let vectorY = Math.floor(Math.max((Game.MOUSE_PRESS_LOCATION.Y - this.remainderY - ((this.obstacleCellSize - this.gridCellSize) / 2)), this.PlayableArea.Y) / this.gridCellSize);

        this.mousePreviousClickCell = new Vector2(vectorX, vectorY);
      }
      else if (this.isDevMode) {
        let vectorX = Math.floor((Game.MOUSE_PRESS_LOCATION.X - this.remainderX) / this.gridCellSize);
        let vectorY = Math.floor((Game.MOUSE_PRESS_LOCATION.Y - this.remainderY) / this.gridCellSize);

        this.mousePreviousClickCell = new Vector2(vectorX, vectorY);
      }
    }
    else if (this.mousePreviousClickCell) {
      let mouseClickCell: Vector2 = new Vector2();
      if (this.PlayableArea.ContainsPoint(Game.MOUSE_PRESS_LOCATION) && !this.isDevMode) {
        let vectorX = Math.floor(Math.max((Game.MOUSE_PRESS_LOCATION.X - this.remainderX - ((this.obstacleCellSize - this.gridCellSize) / 2)), this.PlayableArea.X) / this.gridCellSize);
        let vectorY = Math.floor(Math.max((Game.MOUSE_PRESS_LOCATION.Y - this.remainderY - ((this.obstacleCellSize - this.gridCellSize) / 2)), this.PlayableArea.Y) / this.gridCellSize);

        mouseClickCell = new Vector2(vectorX, vectorY);
      }
      else if (this.isDevMode) {
        let vectorX = Math.floor((Game.MOUSE_PRESS_LOCATION.X - this.remainderX) / this.gridCellSize);
        let vectorY = Math.floor((Game.MOUSE_PRESS_LOCATION.Y - this.remainderY) / this.gridCellSize);

        mouseClickCell = new Vector2(vectorX, vectorY);
      }

      if (this.mouseHighlightCell !== null && mouseClickCell.isEqual(this.mouseHighlightCell) && mouseClickCell.isEqual(this.mousePreviousClickCell)) {
        if (this.clickFunction) {
          this.clickFunction();
        }

        this.mouseHighlightCell = null;
        this.mouseHighlight = null;
        this.mousePreviousClickCell = null;
      }
      else if (this.mouseHighlightCell === null) {
        if (this.PlayableArea.ContainsPoint(Game.MOUSE_PRESS_LOCATION) && !this.isDevMode) {
          this.mouseHighlightCell = mouseClickCell;

          this.mouseHighlight = new Vector2(Math.min((this.mouseHighlightCell.X * this.gridCellSize) + this.remainderX, (this.PlayableArea.BottomRight.X - this.obstacleCellSize)),
            Math.min((this.mouseHighlightCell.Y * this.gridCellSize) + this.remainderY, (this.PlayableArea.BottomRight.Y - this.obstacleCellSize)));
        }
        else if (this.isDevMode) {
          this.mouseHighlightCell = mouseClickCell;

          this.mouseHighlight = new Vector2((this.mouseHighlightCell.X * this.gridCellSize) + this.remainderX,
            (this.mouseHighlightCell.Y * this.gridCellSize) + this.remainderY);
        }
        this.mousePreviousClickCell = null;
      }
      else {
        this.mouseHighlightCell = null;
        this.mouseHighlight = null;
        this.mousePreviousClickCell = null;
      }
    }
  }

  public override Draw(deltaTime: number) {
    if (this.showGrid) {
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
    }

    for (let i = 0; i < this.StartingCells.length; i++) {
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

    for (let i = 0; i < this.EndingCells.length; i++) {
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

    if (this.showAttackerPath) {
      //Draw The Path
      Game.CONTEXT.lineWidth = 5;

      for (let path = 0; path < this.thePaths.length; path++) {
        let thePath = this.GetPath(path);
        if (thePath && thePath.length > 0) {
          Game.CONTEXT.strokeStyle = '#2222ff33';
          thePath.forEach((p) => {
            Game.CONTEXT.strokeRect(p.X + 5, p.Y + 5,
              this.GridCellSize - 10, this.GridCellSize - 10);
          });
        }
      }
    }

    super.Draw(deltaTime);

    if (this.mouseHighlight) {
      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ffffff';
      
      if (this.PlayableArea.ContainsPoint(this.mouseHighlight) && !this.isDevMode) {
        Game.CONTEXT.strokeRect(this.mouseHighlight.X, this.mouseHighlight.Y,
          this.obstacleCellSize, this.obstacleCellSize);
      }
      else if (this.isDevMode) {
        Game.CONTEXT.strokeRect(this.mouseHighlight.X, this.mouseHighlight.Y,
          this.gridCellSize, this.gridCellSize);
      }
    }
  }

  public AddStartPoint(cell?: Vector2): boolean {
    if (!this.grid)
      return false;

    if (cell) {
      this.grid[cell.X][cell.Y] = ePathCellStatus.StartingPoint;
      this.startingCells.push(cell);
    }
    else if (this.mousePreviousClickCell) {
      cell = this.mousePreviousClickCell;

      if (cell.X >= this.grid.length || cell.Y >= this.grid[cell.X].length)
        return false;

      if (this.grid[cell.X][cell.Y] === ePathCellStatus.OutOfBounds) {
        if (this.checkNeighboringCells(cell)) {
          this.grid[cell.X][cell.Y] = ePathCellStatus.StartingPoint;
          this.startingCells.push(cell);
        }
      }
      else if (this.grid[cell.X][cell.Y] === ePathCellStatus.EndingPoint) {
        this.grid[cell.X][cell.Y] = ePathCellStatus.StartingPoint;
        this.startingCells.push(cell);
        this.endingCells.splice(this.endingCells.findIndex((end) => cell!.isEqual(end)), 1);
      }
      else if (this.grid[cell.X][cell.Y] === ePathCellStatus.StartingPoint) {
        this.grid[cell.X][cell.Y] = ePathCellStatus.OutOfBounds;
        this.startingCells.splice(this.startingCells.findIndex((start) => cell!.isEqual(start)), 1);
      }
      return true;
    }
    return false;
  }

  public AddEndPoint(cell?: Vector2): boolean {
    if (cell) {
      this.grid[cell.X][cell.Y] = ePathCellStatus.EndingPoint;
      this.endingCells.push(cell);
    }
    else if (this.mousePreviousClickCell) {
      cell = this.mousePreviousClickCell;

      if (cell.X >= this.grid.length || cell.Y >= this.grid[cell.X].length)
        return false;

      if (this.grid[cell.X][cell.Y] === ePathCellStatus.OutOfBounds) {
        if (this.checkNeighboringCells(cell)) {
          this.grid[cell.X][cell.Y] = ePathCellStatus.EndingPoint;
          this.endingCells.push(cell);
        }
      }
      else if (this.grid[cell.X][cell.Y] === ePathCellStatus.StartingPoint) {
        this.grid[cell.X][cell.Y] = ePathCellStatus.EndingPoint;
        this.endingCells.push(cell);
        this.startingCells.splice(this.startingCells.findIndex((start) => cell!.isEqual(start)), 1);
      }
      else if (this.grid[cell.X][cell.Y] === ePathCellStatus.EndingPoint) {
        this.grid[cell.X][cell.Y] = ePathCellStatus.OutOfBounds;
        this.endingCells.splice(this.endingCells.findIndex((end) => cell!.isEqual(end)), 1);
      }
      return true;
    }
    return false;
  }

  public AddObstacle(obstacle: IGameObject, calculatePath: boolean, location?: Vector2, isGridLocation: boolean = true): boolean {
    if (!this.grid)
      return false;

    let cell: Vector2 = new Vector2(0,0);

    if (location) {
      if (isGridLocation)
        cell = location;
      else
        cell = new Vector2(Math.floor((location.X - this.remainderX) / this.GridCellSize),
          Math.floor((location.Y - this.remainderY) / this.GridCellSize));
    }
    else if (this.mousePreviousClickCell)
      cell = this.mousePreviousClickCell;
    else
      return false;

    let defenderCells = Math.floor(obstacle.Size.X / this.GridCellSize);
    let cells: Vector2[] = [];

    for (let i = 0; i < defenderCells; i++) {
      for (let j = 0; j < defenderCells; j++) {
        let newCell = new Vector2(cell.X + i, cell.Y + j);

        if (newCell.X >= this.grid.length || newCell.Y >= this.grid[newCell.X].length)
          return false;

        if (this.grid[newCell.X][newCell.Y] >= ePathCellStatus.OutOfBounds)
          return false;

        if (!calculatePath && this.grid[newCell.X][newCell.Y] === ePathCellStatus.Path)
          return false;

        cells.push(newCell);
      }
    }

    cells.forEach((c) => {
      this.grid[c.X][c.Y] += ePathCellStatus.Blocked;
    });

    if (calculatePath && !this.CalculatePaths()) {
      cells.forEach((c) => {
        this.grid[c.X][c.Y] -= ePathCellStatus.Blocked;
      });
      return false;
    }
    obstacle.SetLocation((cell.X * this.GridCellSize) + this.remainderX, (cell.Y * this.GridCellSize) + this.remainderY, eLayerTypes.Object);
    this.LoadGameObject(obstacle);
    this.selectedObstacle = obstacle;
    this.obstacles.push(obstacle);
    return true;
  }

  public RemoveObstacle(obstacle: IGameObject, calculatePath: boolean): void {
    let x = Math.floor((obstacle.Location.X + this.remainderX) / this.GridCellSize);
    let y = Math.floor((obstacle.Location.Y + this.remainderY) / this.GridCellSize);

    let defenderLoop = Math.floor(obstacle.Size.X / this.GridCellSize);

    for (let i = 0; i < defenderLoop; i++) {
      for (let j = 0; j < defenderLoop; j++) {
        this.grid[x + i][y + j] = ePathCellStatus.Open;
      }
    }

    this.DestroyGameObject(obstacle);

    let i = this.obstacles.findIndex((def) => def === obstacle);
    this.obstacles.splice(i, 1);
    this.selectedObstacle = null;

    if (calculatePath)
      this.CalculatePaths();
  }

  public ClearSelectedObstacle(): void {
    this.selectedObstacle = null;
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

  public SetObstacleCellSize(cellSize: number) {
    this.obstacleCellSize = cellSize;
  }

  public SetUICellSize(cellSize: number) {
    this.uiCellSize = cellSize;
  }

  public SetShowPaths(show: boolean): void {
    this.showAttackerPath = show;
  }

  public SetShowGrid(show: boolean): void {
    this.showGrid = show;
  }

  public SetDevMode(isDevMode: boolean) {
    this.isDevMode = isDevMode;
  }

  public SetUpGrid(): void {
    this.remainderX = Math.floor((this.Size.X % this.GridCellSize) / 2);
    this.remainderY = Math.floor((this.Size.Y % this.GridCellSize) / 2);

    this.grid = [];
    this.gridColumns = Math.floor(this.Size.X / this.GridCellSize);
    this.gridRows = Math.floor(this.Size.Y / this.GridCellSize);

    this.startingCells = [];
    this.endingCells = [];

    this.obstacles.forEach((ob) => {
      this.DestroyGameObject(ob);
    });

    this.obstacles = [];

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

    //this.CalculatePaths();

    //this.lastCoordinate = new Vector3((this.EndingCells[0].X * this.GridCellSize) + (this.GridCellSize / 2), (this.EndingCells[0].Y * this.GridCellSize) + (this.GridCellSize / 2), 0);
  }

  public CalculatePaths(): boolean {
    let tempPaths: Vector2[][] = [];
    if (this.StartingCells.length === 0 || this.EndingCells.length === 0 || this.StartingCells.length !== this.EndingCells.length)
      return false;

    for (let i = 0; i < this.StartingCells.length; i++) {
      let tempPath = PathFinder.AStarSearch(this.grid, this.StartingCells[i], this.EndingCells[i]);

      if (tempPath.length === 0)
        return false;

      tempPaths.push(tempPath);
    }

    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[x].length; y++) {
        if (this.grid[x][y] === ePathCellStatus.Path)
          this.grid[x][y] = ePathCellStatus.Open;
      }
    }

    this.thePaths = [];
    for (let p = 0; p < tempPaths.length; p++) {
      let thePath: Vector2[] = [];
      for (let i = tempPaths[p].length - 1; i >= 0; i--) {
        this.grid[tempPaths[p][i].X][tempPaths[p][i].Y] = ePathCellStatus.Path;
        let worldPoint = new Vector2((tempPaths[p][i].X * this.GridCellSize) + this.remainderX,
          (tempPaths[p][i].Y * this.GridCellSize) + this.remainderY);

        thePath.push(worldPoint);
      }

      this.thePaths.push(thePath);
    }

    for (let i = 0; i < this.StartingCells.length; i++) {
      this.grid[this.StartingCells[i].X][this.StartingCells[i].Y] = ePathCellStatus.StartingPoint;
      this.grid[this.EndingCells[i].X][this.EndingCells[i].Y] = ePathCellStatus.EndingPoint;
    }

    return true;
  }

  public GetPath(path: number): Vector2[] | null {
    if (path < this.thePaths.length)
      return this.thePaths[path];
    else
      return null;
  }

  public GetGridCellCoordinate(x: number, y: number): Vector2 | null {
    let response = new Vector2(x, y);

    if (!this.PlayableArea.ContainsPoint(response))
      return null;

    response.SetX((Math.floor((x - this.remainderX) / this.GridCellSize) * this.GridCellSize) + this.remainderX);
    response.SetY((Math.floor((y - this.remainderY) / this.GridCellSize) * this.GridCellSize) + this.remainderY);

    return response;
  }

  public GetObstacleCells(): Vector2[] {
    let cells: Vector2[] = [];

    this.obstacles.forEach((obstacle) => {
      cells.push(new Vector2(Math.floor((obstacle.Location.X - this.remainderX) / this.GridCellSize),
        Math.floor((obstacle.Location.Y - this.remainderY) / this.GridCellSize)));
    });

    return cells;
  }

  private checkNeighboringCells(cell: Vector2): boolean {
    //Check north
    if (this.grid[cell.X][Math.max(0, cell.Y - 1)] !== ePathCellStatus.OutOfBounds)
      return true;

    //Check east
    if (this.grid[Math.min(this.grid.length - 1, cell.X + 1)][cell.Y] !== ePathCellStatus.OutOfBounds)
      return true;

    //Check south
    if (this.grid[cell.X][Math.min(this.grid[cell.X].length - 1, cell.Y + 1)] !== ePathCellStatus.OutOfBounds)
      return true;

    //Check west
    if (this.grid[Math.max(0, cell.X - 1)][cell.Y] !== ePathCellStatus.OutOfBounds)
      return true;

    return false;
  }

  private remainderX: number = 0;
  private remainderY: number = 0;

  private thePaths: Vector2[][] = [];

  private grid: number[][] = [];
  private gridColumns: number = 0;
  private gridRows: number = 0;
  private uiCellSize: number = 100;
  private obstacleCellSize: number = 100;

  private previousMouse: Vector2 | null = null;
  private mousePreviousClickCell: Vector2 | null = null;
  private mouseHighlightCell: Vector2 | null = null;
  private mouseHighlight: Vector2 | null = null;

  private showAttackerPath: boolean = false;
  private showGrid: boolean = false;
  private isDevMode: boolean = false;
}
