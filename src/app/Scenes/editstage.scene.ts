
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Boundary } from "../GameObjects/boundary.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Button } from "../GameObjects/Utilities/button.gameobject";
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
  private startingCells: Vector2[] = [];
  protected get StartingCells(): Vector2[] {
    return this.startingCells;
  }
  private endingCells: Vector2[] = [];
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
    return 100;
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
    this.slider.SetValueRange(20, 175);
    this.slider.SetValue(this.cellSize);
    this.LoadGameObject(this.slider);

    this.selectStartButton.SetLocation(Game.CANVAS_WIDTH - (this.UICellSize * 1), this.UICellSize * 1, eLayerTypes.UI);
    this.selectStartButton.SetSize(this.UICellSize, this.UICellSize);
    this.selectStartButton.SetText(`Start`);
    this.selectStartButton.SetSelected(true);
    this.selectStartButton.SetClickFunction(() => {
      this.selectEndButton.SetSelected(false);
      this.selectStartButton.SetSelected(true);
    });
    this.LoadGameObject(this.selectStartButton);

    this.selectEndButton.SetLocation(Game.CANVAS_WIDTH - (this.UICellSize * 1), this.UICellSize * 2, eLayerTypes.UI);
    this.selectEndButton.SetSize(this.UICellSize, this.UICellSize);
    this.selectEndButton.SetText(`End`);
    this.selectEndButton.SetClickFunction(() => {
      this.selectStartButton.SetSelected(false);
      this.selectEndButton.SetSelected(true);
    });
    this.LoadGameObject(this.selectEndButton);

    this.settingsButton.SetLocation(Game.CANVAS_WIDTH - 75, 25, eLayerTypes.UI);
    this.settingsButton.SetSize(50, 50);
    this.settingsButton.SetImage('/assets/images/cog.png');
    this.settingsButton.SetClickFunction(() => {
      if (this.settingsOpen)
        this.settingsOpen = false;
      else
        this.settingsOpen = true;
    });
    this.LoadGameObject(this.settingsButton);

    this.homeButton.SetLocation((Game.CANVAS_WIDTH / 2) - 125, Game.CANVAS_HEIGHT / 2, eLayerTypes.UI);
    this.homeButton.SetSize(100, 50);
    this.homeButton.SetText('Home');
    this.homeButton.SetClickFunction(() => Game.SetTheScene('instructions'));
    this.homeButton.Load();

    this.resetButton.SetLocation((Game.CANVAS_WIDTH / 2) + 25, Game.CANVAS_HEIGHT / 2, eLayerTypes.UI);
    this.resetButton.SetSize(100, 50);
    this.resetButton.SetText('Reset');
    this.resetButton.SetClickFunction(() => Game.SetTheScene('editstage'));
    this.resetButton.Load();

    this.resumeButton.SetLocation((Game.CANVAS_WIDTH / 2) + 25, (Game.CANVAS_HEIGHT / 2) + 100, eLayerTypes.UI);
    this.resumeButton.SetSize(100, 50);
    this.resumeButton.SetText('Close');
    this.resumeButton.SetClickFunction(() => {
      this.settingsOpen = false;
    });
    this.resumeButton.Load();

    this.saveButton.SetLocation((Game.CANVAS_WIDTH / 2) - 125, (Game.CANVAS_HEIGHT / 2) + 100, eLayerTypes.UI);
    this.saveButton.SetSize(100, 50);
    this.saveButton.SetText('Save');
    this.saveButton.SetClickFunction(() => {
      if (this.startingCells.length !== this.endingCells.length) {
        alert('Start count must match End count');
        return;
      }
    });
    this.saveButton.Load();
  }

  override Update(deltaTime: number): void {
    super.Update(deltaTime);

    if (this.cellSize !== this.slider.Value) {
      this.updateGrid = true;
      this.cellSize = this.slider.Value;
    }
    else if (this.updateGrid && !this.slider.Pressed) {
      this.updateGrid = false;
      this.remainderX = Math.floor((Game.CANVAS_WIDTH % this.GridCellSize) / 2);
      this.remainderY = Math.floor((Game.CANVAS_HEIGHT % this.GridCellSize) / 2);

      this.setUpGrid();
      this.setUpBoundaries();
    }

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
        if (this.selectStartButton.Selected)
          this.addStartPoint(mouseClickCell);
        else if (this.selectEndButton.Selected)
          this.addEndPoint(mouseClickCell);
      }

      this.mousePreviousClickCell = null;
    }

    if (this.settingsOpen) {
      this.resumeButton.Update(deltaTime);
      this.homeButton.Update(deltaTime);
      this.resetButton.Update(deltaTime);
      this.saveButton.Update(deltaTime);
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
      Game.CONTEXT.fillText(`${i+1}`, x + (this.GridCellSize / 2), y + (this.GridCellSize / 2));
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

    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[x].length; y++) {
        if (this.grid[x][y] === ePathCellStatus.StartingPoint) {
          
        }
        else if (this.grid[x][y] === ePathCellStatus.EndingPoint) {
          Game.CONTEXT.lineWidth = 5;
          Game.CONTEXT.strokeStyle = '#ff0000';
          Game.CONTEXT.strokeRect((x * this.GridCellSize) + this.remainderX, (y * this.GridCellSize) + this.remainderY,
            this.GridCellSize, this.GridCellSize);
        }
        else if (this.grid[x][y] === ePathCellStatus.Blocked) {
          Game.CONTEXT.lineWidth = 5;
          Game.CONTEXT.strokeStyle = '#333333';
          Game.CONTEXT.strokeRect((x * this.GridCellSize) + this.remainderX, (y * this.GridCellSize) + this.remainderY,
            this.GridCellSize, this.GridCellSize);
        }
      }
    }

    if (this.settingsOpen) {
      Game.CONTEXT!.fillStyle = '#555555';
      Game.CONTEXT!.fillRect((Game.CANVAS_WIDTH / 2) - 250, 50, 500, Game.CANVAS_HEIGHT - 250);

      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect((Game.CANVAS_WIDTH / 2) - 250, 50, 500, Game.CANVAS_HEIGHT - 250);

      this.resumeButton.Draw(deltaTime);
      this.homeButton.Draw(deltaTime);
      this.resetButton.Draw(deltaTime);
      this.saveButton.Draw(deltaTime);
    }

    super.Draw(deltaTime);
  }


  private setUpGrid(): void {
    this.grid = [];
    this.gridColumns = Math.floor(Game.CANVAS_WIDTH / this.GridCellSize);
    this.gridRows = Math.floor(Game.CANVAS_HEIGHT / this.GridCellSize);

    this.startingCells = [];
    this.endingCells = [];

    let startX = 0;
    let endX = 0;
    for (let i = 0; i < this.gridColumns; i++) {
      let foo = (i * this.GridCellSize) + this.remainderX;
      if (startX === 0 && foo >= this.UICellSize)
        startX += foo;

      if (foo > (Game.CANVAS_WIDTH - (this.UICellSize * 2)))
        break;

      endX = foo;
    }

    let startY = 0;
    let endY = 0;
    for (let j = 0; j < this.gridRows; j++) {
      let foo = (j * this.GridCellSize) + this.remainderY;
      if (startY === 0 && foo >= this.UICellSize)
        startY += foo;

      if (foo > (Game.CANVAS_HEIGHT - this.UICellSize))
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

  private addStartPoint(cell: Vector2): void {
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
  }

  private addEndPoint(cell: Vector2): void {
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

  private settingsOpen = false;

  private remainderX: number = 0;
  private remainderY: number = 0;
  private gridRect: Rect = new Rect(0, 0, 0, 0);

  private updateGrid = false;
  private grid: number[][] = [];
  private gridColumns: number = 0;
  private gridRows: number = 0;

  private slider: Slider = new Slider();
  private topBoundary: Boundary = new Boundary();
  private bottomBoundary: Boundary = new Boundary();
  private rightBoundary: Boundary = new Boundary();
  private leftBoundary: Boundary = new Boundary();

  private selectStartButton: Button = new Button();
  private selectEndButton: Button = new Button();
  private settingsButton: Button = new Button();
  private resumeButton: Button = new Button();
  private homeButton: Button = new Button();
  private resetButton: Button = new Button();
  private saveButton: Button = new Button();

  private mousePreviousClickCell: Vector2 | null = null;
  private mouseHighlightCell: Vector2 | null = null;
}
