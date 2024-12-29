import { Attacker } from "../GameObjects/attacker.gameobject";
import { Boundary } from "../GameObjects/boundary.gameobject";
import { Button } from "../GameObjects/Utilities/button.gameobject";
import { Defender } from "../GameObjects/defender.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Turret } from "../GameObjects/turret.gameobject";
import { Wall } from "../GameObjects/wall.gameobject";
import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { ePathCellStatus, PathFinder } from "../Utility/pathfinding.service";
import { BaseLevel } from "./base.scene";
import { eLayerTypes } from "./scene.interface";
import { Base } from "../GameObjects/base.gameobject";
import { Sprite } from "../GameObjects/Utilities/sprite.gameobject";

export enum eDefenderTypes {
  Wall,
  BasicTurret,
  SAMTurret
}

export abstract class DefenseBaseLevel extends BaseLevel {
  protected abstract get GridCellSize(): number;
  protected abstract get TurretCellSize(): number;
  protected abstract get StartingCells(): Vector2[];
  protected abstract get EndingCells(): Vector2[];
  protected abstract get PlayerStartingHealth(): number;
  protected abstract get EnemyRounds(): number[];
  protected abstract get AvailableDefenders(): eDefenderTypes[];
  protected abstract get CurrentSceneName(): string;
  protected abstract get NextLevelName(): string;
  protected abstract get SecondsBetweenMonsters(): number;
  protected abstract get SecondsToStart(): number;
  protected abstract get LevelUnid(): number;

  protected abstract CreateNewAttacker(attackerCount: number): Attacker;
  protected abstract PlayerWonScreen(): void;

  protected get UICellSize(): number {
    return 100;
  }
  private totalEnemies: number = 0;
  protected get TotalEnemies(): number {
    return this.totalEnemies;
  }
  private currentRound = -1;
  protected get CurrentRound(): number {
    return this.currentRound;
  }

  protected gameObjects: IGameObject[] = [];
  protected get GameObjects(): IGameObject[] {
    return this.gameObjects;
  }
  protected enemiesRemoved: number = 0;
  protected get EnemiesRemoved(): number {
    return this.enemiesRemoved;
  }
  private thePaths: Vector2[][] = [];
  protected GetPath(path: number) {
    return this.thePaths[path];
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
  protected roundStarted: boolean = false;
  protected get RoundStarted(): boolean {
    return this.roundStarted;
  }
  protected isGameOver: boolean = false;
  public get IsGameOver(): boolean {
    return this.isGameOver;
  }
  private newDefender: eDefenderTypes = eDefenderTypes.Wall;
  protected get CreateNewDefender(): Defender {
    if (this.newDefender === eDefenderTypes.BasicTurret) {
      let defender = new Turret();
      defender.SetRange(this.GridCellSize * 1.5);
      defender.SetSize(this.GridCellSize, this.GridCellSize);
      return defender;
    }
    else if (this.newDefender === eDefenderTypes.SAMTurret) {
      let defender = new Turret();
      defender.SetIsSurfaceToAir(true);
      defender.SetRange(this.GridCellSize * 2.5);
      defender.SetCost(20);
      defender.SetSize(this.GridCellSize, this.GridCellSize);
      return defender;
    }
    else {
      let defender = new Wall();
      defender.SetSize(this.GridCellSize, this.GridCellSize);
      return defender;
    }
  }
  private paused: boolean = false;
  protected get IsPaused(): boolean {
    return this.paused;
  }
  private gameSpeed: number = 1;
  protected get GameSpeed(): number {
    return this.gameSpeed;
  }

  protected showAttackerPath: boolean = true;

  protected playerHealth: number = 0;
  protected ReduceHealth(reduceBy: number): void {
    this.playerHealth -= reduceBy;
  }

  private gridRect = new Rect(100, 100, Game.CANVAS_WIDTH - 300, Game.CANVAS_HEIGHT - 200);
  private get GRID_RECT(): Rect {
    return this.gridRect;
  }

  /*
      L         OOOOO     AAAAA     DDDD  
      L        O     O   A     A    D   D 
      L        O     O   AAAAAAA    D   D 
      L        O     O   A     A    D   D 
      LLLLLL    OOOOO    A     A    DDDD
  */

  Load(): void {
    this.playerHealth = this.PlayerStartingHealth;
    this.secondsToStart = this.SecondsToStart;

    this.EnemyRounds.forEach((round) => {
      this.totalEnemies += round;
    });

    this.remainderX = Math.floor((Game.CANVAS_WIDTH % this.GridCellSize) / 2);
    this.remainderY = Math.floor((Game.CANVAS_HEIGHT % this.GridCellSize) / 2);

    this.floor.SetImage('/assets/images/floor.jpg');
    this.floor.SetColor('#00000055');
    this.floor.SetSize(Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
    this.floor.SetLocation(0, 0, eLayerTypes.Background);
    this.floor.Load();

    this.setButtons();
    this.setUpGrid();

    let startX = 0;
    let endX = 0;
    for (let i = 0; i < this.gridColumns; i++) {
      if (startX === 0 && (i * this.GridCellSize) >= 100)
        startX += (i * this.GridCellSize);

      if ((i * this.GridCellSize) > (Game.CANVAS_WIDTH - 200))
        break;

      endX = (i * this.GridCellSize);
    }

    let startY = 0;
    let endY = 0;
    for (let j = 0; j < this.gridRows; j++) {
      if (startY === 0 && (j * this.GridCellSize) >= 100)
        startY += (j * this.GridCellSize);

      if ((j * this.GridCellSize) > (Game.CANVAS_HEIGHT - 100))
        break;

      endY = (j * this.GridCellSize);
    }

    this.gridRect = new Rect(startX + this.remainderX, startY + this.remainderY, endX - startX, endY - startY);

    //Top Wall
    let boundary = new Boundary();
    boundary.SetLocation(0, 0, eLayerTypes.Boundary);
    boundary.SetSize(Game.CANVAS_WIDTH, this.gridRect.Y);
    this.LoadGameObject(boundary);

    //Left Wall
    boundary = new Boundary();
    boundary.SetLocation(0, 0, eLayerTypes.Boundary);
    boundary.SetSize(this.gridRect.X, Game.CANVAS_HEIGHT);
    this.LoadGameObject(boundary);

    //Right Wall
    boundary = new Boundary();
    boundary.SetLocation(this.gridRect.TopRight.X, 0, eLayerTypes.Boundary);
    boundary.SetSize((Game.CANVAS_WIDTH - this.gridRect.TopRight.X), Game.CANVAS_HEIGHT);
    this.LoadGameObject(boundary);

    //Bottom Wall
    boundary = new Boundary();
    boundary.SetLocation(0, this.gridRect.BottomLeft.Y, eLayerTypes.Boundary);
    boundary.SetSize(Game.CANVAS_WIDTH, (Game.CANVAS_HEIGHT - this.gridRect.BottomLeft.Y));
    this.LoadGameObject(boundary);
  }

  /*
      U     U   PPPPP   DDDD    AAAAA   TTTTTTT  EEEEE  
      U     U   P    P  D   D  A     A     T     E      
      U     U   PPPPP   D   D  AAAAAAA     T     EEEE   
      U     U   P       D   D  A     A     T     E      
       UUUUU    P       DDDD   A     A     T     EEEEE  
  */
  override Update(deltaTime: number) {
    deltaTime *= this.GameSpeed;

    if (this.isGameOver) {
      this.restartButton.Update(deltaTime);
      this.homeButton.Update(deltaTime);

      if (this.playerHealth > 0)
        this.nextLevelButton.Update(deltaTime);
      return;
    }

    if (this.playerHealth <= 0 || this.TotalEnemies <= 0) {
      this.isGameOver = true;

      if (this.playerHealth > 0) {
        if (!this.sentAPIMessage) {
          this.isGameOver = true;
          this.sentAPIMessage = true;
          Game.TheAPI.SendWinInfo(this.LevelUnid, this.playerHealth, Game.Version, this.gatherGridInfo());
        }
      }

      if (this.playerHealth <= 0) {
        this.restartButton.SetLocation((Game.CANVAS_WIDTH / 2) - 140, (Game.CANVAS_HEIGHT / 2) + 200, eLayerTypes.UI);
        this.homeButton.SetLocation((Game.CANVAS_WIDTH / 2) + 50, (Game.CANVAS_HEIGHT / 2) + 200, eLayerTypes.UI);
      }

      return;
    }

    if (this.IsPaused) {
      this.updateSettings(deltaTime);

      return;
    }

    this.updateDefenderStuff(deltaTime);

    if (!this.roundStarted) {
      if (this.secondsToStart <= 0) {
        this.roundStarted = true;
        this.currentRound++;
      }
      else {
        this.secondsToStart -= deltaTime;
      }
    }
    else {
      if (this.secondsSinceLastMonster <= 0 && this.enemiesSpawned < this.EnemyRounds[this.currentRound]) {
        this.spawnAttacker();
        this.secondsSinceLastMonster = this.SecondsBetweenMonsters;
      }
      else {
        this.secondsSinceLastMonster -= deltaTime;
      }

      if (this.enemiesRemoved >= this.EnemyRounds[this.currentRound]) {
        this.enemiesRemoved = 0;
        this.roundStarted = false;
        this.secondsToStart = this.SecondsToStart;
        this.enemiesSpawned = 0;
        this.secondsSinceLastMonster = 0;
      }

      for (let i = 0; i < this.attackers.length; i++) {
        let attacker = this.attackers[i];
        let attackerDied = false;
        if (attacker.ReachedEnd) {
          this.ReduceHealth(attacker.Damage);

          attackerDied = true;
        }
        else if (attacker.Health <= 0) {
          if (attacker.Value)
            Game.AddCredits(attacker.Value);

          attackerDied = true;
        }

        if (attackerDied) {
          this.enemiesRemoved++;
          this.totalEnemies--;
          this.DestroyGameObject(attacker);
          this.attackers.splice(i, 1);
          i--;
        }
      }

    }

    this.updateMouseStuff();

    super.Update(deltaTime);
  }

  /*
      DDDD    RRRRR    AAAAA   W     W  
      D   D   R    R  A     A  W     W  
      D   D   RRRRR   AAAAAAA  W  W  W  
      D   D   R   R   A     A  W W W W  
      DDDD    R    R  A     A   W   W
  */

  override Draw(deltaTime: number) {
    Game.CONTEXT!.fillStyle = '#111111';
    Game.CONTEXT!.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

    if (this.isGameOver) {
      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '64px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.fillText('ROUND OVER', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2);

      if (this.playerHealth <= 0) {
        Game.CONTEXT.fillStyle = '#ffffff';
        Game.CONTEXT.font = '32px serif';
        Game.CONTEXT.textAlign = "center";
        Game.CONTEXT.fillText('You Lost!', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 75);

        Game.CONTEXT.fillStyle = '#ffffff';
        Game.CONTEXT.font = '32px serif';
        Game.CONTEXT.textAlign = "center";
        Game.CONTEXT.fillText('Play Again?', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 150);

        this.restartButton.Draw(deltaTime);
        this.homeButton.Draw(deltaTime);
      }
      else {
        this.PlayerWonScreen();
        this.nextLevelButton.Draw(deltaTime);
      }

      return;
    }

    this.floor.Draw(deltaTime);

    //Draw Grid Columns
    //Game.CONTEXT.lineWidth = 1;
    //let width = Math.ceil(Game.CANVAS_WIDTH / this.GridCellSize);
    //Game.CONTEXT.strokeStyle = `#ff000066`;
    //for (let i = 0; i < width + 1; i++) {
    //  let x = (this.GridCellSize * i) + this.remainderX;
    //  Game.CONTEXT.beginPath();
    //  Game.CONTEXT.moveTo(x, 0);
    //  Game.CONTEXT.lineTo(x, Game.CANVAS_HEIGHT);
    //  Game.CONTEXT.stroke();
    //}

    ////Draw Grid Rows
    //let height = Math.ceil(Game.CANVAS_HEIGHT / this.GridCellSize);
    //for (let i = 0; i < height; i++) {
    //  let y = (this.GridCellSize * i) + this.remainderY;
    //  Game.CONTEXT.beginPath();
    //  Game.CONTEXT.moveTo(0, y);
    //  Game.CONTEXT.lineTo(Game.CANVAS_WIDTH, y);
    //  Game.CONTEXT.stroke();
    //}

    if (this.showAttackerPath) {
      //Draw The Path
      Game.CONTEXT.lineWidth = 5;

      for (let path = 0; path < this.thePaths.length; path++) {
        let thePath = this.thePaths[path];
        if (thePath.length > 0) {
          Game.CONTEXT.strokeStyle = '#2222ff33';
          thePath.forEach((p) => {
            Game.CONTEXT.strokeRect(p.X + 5, p.Y + 5,
              this.GridCellSize - 10, this.GridCellSize - 10);
          });
        }
      }
    }

    if (this.mouseHighlightCell) {
      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect((this.mouseHighlightCell.X * this.GridCellSize) + this.remainderX, (this.mouseHighlightCell.Y * this.GridCellSize) + this.remainderY,
        this.GridCellSize, this.GridCellSize);
    }

    super.Draw(deltaTime);

    

    if (this.secondsToStart > 0) {
      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '24px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.fillText(`Start: ${this.secondsToStart.toFixed(2)}`, this.UICellSize * 2, this.UICellSize / 2);
    }

    if (this.playerHealth > 0) {
      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '24px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.fillText(`Health: ${this.playerHealth}`, Game.CANVAS_WIDTH / 2, this.UICellSize / 2);
    }

    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '24px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText(`Credits: ${Game.Credits.toFixed(0)}`, Game.CANVAS_WIDTH - this.UICellSize * 2.5, this.UICellSize / 2);

    

    if (this.IsPaused) {
      Game.CONTEXT!.fillStyle = '#555555';
      Game.CONTEXT!.fillRect((Game.CANVAS_WIDTH / 2) - 250, 50, 500, Game.CANVAS_HEIGHT - 250);

      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect((Game.CANVAS_WIDTH / 2) - 250, 50, 500, Game.CANVAS_HEIGHT - 250);

      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '24px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.textBaseline = "middle";
      Game.CONTEXT.fillText(`PAUSED`, (Game.CANVAS_WIDTH / 2), (Game.CANVAS_HEIGHT - 250) / 2);

      this.resumeButton.Draw(deltaTime);
    }

    Game.CONTEXT.lineWidth = 1;

  }

  private updateMouseStuff(): void {
    if (Game.MOUSE_LOCATION.X > 0 && Game.MOUSE_LOCATION.Y > 0) {
      if ((this.mouseHighlightCell && !this.mouseHighlightCell.isEqual(Game.MOUSE_LOCATION)) ||
        !this.mouseHighlightCell) {
        if (this.GRID_RECT.ContainsPoint(Game.MOUSE_LOCATION)) {
          this.mouseHighlightCell = new Vector2(Math.floor((Game.MOUSE_LOCATION.X - this.remainderX) / this.GridCellSize),
            Math.floor((Game.MOUSE_LOCATION.Y - this.remainderY) / this.GridCellSize));

          if (this.grid[this.mouseHighlightCell.X][this.mouseHighlightCell.Y] === ePathCellStatus.OutOfBounds)
            this.mouseHighlightCell = null;
        }
        else {
          this.mouseHighlightCell = null;
        }
      }
    }

    if (!this.previousMouse || !this.previousMouse.isEqual(Game.MOUSE_PRESS_LOCATION)) {
      this.previousMouse = Game.MOUSE_PRESS_LOCATION;

      if (this.GRID_RECT.ContainsPoint(Game.MOUSE_PRESS_LOCATION)) {
        this.mouseCell = new Vector2(Math.floor((Game.MOUSE_PRESS_LOCATION.X - this.remainderX) / this.GridCellSize),
          Math.floor((Game.MOUSE_PRESS_LOCATION.Y - this.remainderY) / this.GridCellSize));

        if (this.grid[this.mouseCell.X][this.mouseCell.Y] === ePathCellStatus.OutOfBounds)
          this.mouseCell = null;
      }
      else {
        this.mouseCell = null;
      }
    }

    if (Game.MOUSE_PRESSED && this.mouseCell && !this.cellPressed) {
      this.previousCell = this.mouseCell;
      this.cellPressed = true;
    }
    else if (this.cellPressed && !Game.MOUSE_PRESSED &&
      this.previousCell && this.mouseCell && this.previousCell.isEqual(this.mouseCell)) {
      this.addObstacle(this.mouseCell);

      this.cellPressed = false;
      this.previousMouse = null;
    }
    else if (this.cellPressed && !Game.MOUSE_PRESSED) {
      this.cellPressed = false;
    }
  }

  private updateDefenderStuff(deltaTime: number): void {

    //Check each defender to see if clicked
    this.defenders.forEach((defender) => {
      if (defender.Clicked) {
        this.selectedDefender = defender;
        defender.SetSelected(true);
        this.upgradeButton.SetText(`Upgrade (${this.selectedDefender.Cost}cr)`);
      }
      else if (defender !== this.selectedDefender) {
        defender.SetSelected(false);
      }
    });

    if (this.selectedDefender) {

      if (this.deleteButton.IsHidden)
        this.deleteButton.SetHidden(false);

      if (this.selectedDefender.CanUpgrade) {
        if (this.upgradeButton.IsHidden)
          this.upgradeButton.SetHidden(false);

        this.upgradeButton.Update(deltaTime);
      }
      else if (!this.upgradeButton.IsHidden)
        this.upgradeButton.SetHidden(true);

      this.deleteButton.Update(deltaTime);
      if (this.deleteButton.Clicked) {
        if (this.selectedDefender.Cost) {
          if (!this.RoundStarted && this.selectedDefender.Value)
            Game.AddCredits(this.selectedDefender.Value);
          else if (this.selectedDefender.Value)
            Game.AddCredits(Math.floor(this.selectedDefender.Value / 3));
        }

        let gridX = Math.floor(this.selectedDefender.CenterMassLocation.X / this.GridCellSize);
        let gridY = Math.floor(this.selectedDefender.CenterMassLocation.Y / this.GridCellSize);

        this.grid[gridX][gridY] = 0;

        if (!this.RoundStarted)
          this.calculatePaths();

        this.DestroyGameObject(this.selectedDefender);
        let i = this.defenders.findIndex((def) => def === this.selectedDefender);
        this.defenders.splice(i, 1);
        this.selectedDefender = null;
      }
      else if (this.selectedDefender.CanUpgrade && this.selectedDefender.Cost && this.upgradeButton.Clicked) {
        if (Game.Credits >= this.selectedDefender.Cost) {
          Game.SubtractCredits(this.selectedDefender.Cost);
          this.selectedDefender.Upgrade();

          this.upgradeButton.SetText(`Upgrade (${this.selectedDefender.Cost}cr)`);
        }
      }
    }
    else {
      if (!this.deleteButton.IsHidden)
        this.deleteButton.SetHidden(true);

      if (!this.upgradeButton.IsHidden)
        this.upgradeButton.SetHidden(true);
    }

    if (this.attackers.length > 0 && this.defenders.length > 0) {
      this.defenders.forEach((turret) => {
        turret.FindTarget(this.attackers);
      });
    }
  }

  private addObstacle(cell: Vector2): boolean {
    if (!this.grid)
      return false;

    if (this.grid[cell.X][cell.Y] >= ePathCellStatus.Blocked)
      return false;

    let newDefender = this.CreateNewDefender;
    if (newDefender.Cost && Game.Credits < newDefender.Cost)
      return false;

    if (this.RoundStarted) {
      if (this.grid[cell.X][cell.Y] === ePathCellStatus.Path)
        return false;

      this.grid[cell.X][cell.Y] = ePathCellStatus.Blocked;

      this.createDefender(newDefender, (cell.X * this.GridCellSize) + this.remainderX, ((cell.Y * this.GridCellSize) + this.remainderY), eLayerTypes.Object + newDefender.Location.Z);

      return true;
    }

    this.grid[cell.X][cell.Y] = ePathCellStatus.Blocked;

    if (this.calculatePaths()) {
      this.createDefender(newDefender, (cell.X * this.GridCellSize) + this.remainderX, ((cell.Y * this.GridCellSize) + this.remainderY), eLayerTypes.Object + newDefender.Location.Z);

      return true;
    }
    else {
      this.grid[cell.X][cell.Y] = ePathCellStatus.Open;
      return false;
    }
  }

  private createDefender(defender: Defender, x: number, y: number, z: number): void {
    defender.SetLocation(x,y,z);

    if (defender.Cost)
      Game.SubtractCredits(defender.Cost);
    this.LoadGameObject(defender);
    this.defenders.push(defender);

    this.selectedDefender = defender;
    defender.SetSelected(true);
    this.upgradeButton.SetText(`Upgrade (${this.selectedDefender.Cost}cr)`);
  }

  private setUpGrid(): void {
    this.grid = [];
    this.gridColumns = Math.floor(Game.CANVAS_WIDTH / this.GridCellSize);
    this.gridRows = Math.floor(Game.CANVAS_HEIGHT / this.GridCellSize);
    for (let x = 0; x < this.gridColumns; x++) {
      let row = [];
      for (let y = 0; y < this.gridRows; y++) {
        let coordX = x * this.GridCellSize;
        let coordY = y * this.GridCellSize;
        if (coordX < this.GRID_RECT.X || (coordX + this.GridCellSize) > this.GRID_RECT.TopRight.X ||
          coordY < this.GRID_RECT.Y || (coordY + this.GridCellSize) > this.GRID_RECT.BottomRight.Y)
          row.push(ePathCellStatus.OutOfBounds);
        else
          row.push(ePathCellStatus.Open);
      }
      this.grid.push(row);
    }

    for (let i = 0; i < this.StartingCells.length; i++) {
      this.grid[this.StartingCells[i].X][this.StartingCells[i].Y] = ePathCellStatus.Open;
      this.grid[this.EndingCells[i].X][this.EndingCells[i].Y] = ePathCellStatus.Open;
    }

    this.calculatePaths();
  }

  private setButtons(): void {

    let wallButton = new Button();
    wallButton.SetLocation(Game.CANVAS_WIDTH - (this.UICellSize * 2), this.UICellSize, eLayerTypes.UI);
    wallButton.SetSize(this.UICellSize, this.UICellSize);
    wallButton.SetText('Wall');
    wallButton.SetSelected(true);
    wallButton.SetClickFunction(() => {
      this.defenderButtons.forEach((butt) => {
        butt.SetSelected(false);
      });
      this.newDefender = eDefenderTypes.Wall
      wallButton.SetSelected(true);
      this.selectedDefender = null;
    });
    this.defenderButtons.push(wallButton);
    this.LoadGameObject(wallButton);

    if (this.AvailableDefenders.find((defender) => defender === eDefenderTypes.BasicTurret)) {
      let turretButton = new Button();
      turretButton.SetLocation(Game.CANVAS_WIDTH - (this.UICellSize * 1), this.UICellSize, eLayerTypes.UI);
      turretButton.SetSize(this.UICellSize, this.UICellSize);
      turretButton.SetText('Turret');
      turretButton.SetClickFunction(() => {
        this.defenderButtons.forEach((butt) => {
          butt.SetSelected(false);
        });
        this.newDefender = eDefenderTypes.BasicTurret
        turretButton.SetSelected(true);
        this.selectedDefender = null;
      });
      this.defenderButtons.push(turretButton);
      this.LoadGameObject(turretButton);
    }

    if (this.AvailableDefenders.find((defender) => defender === eDefenderTypes.SAMTurret)) {
      let samButton = new Button();
      samButton.SetLocation(Game.CANVAS_WIDTH - (this.UICellSize * 2), this.UICellSize * 2, eLayerTypes.UI);
      samButton.SetSize(this.UICellSize, this.UICellSize);
      samButton.SetText('S.A.M.');
      samButton.SetClickFunction(() => {
        this.defenderButtons.forEach((butt) => {
          butt.SetSelected(false);
        });
        this.newDefender = eDefenderTypes.SAMTurret
        samButton.SetSelected(true);
        this.selectedDefender = null;
      });
      this.defenderButtons.push(samButton);
      this.LoadGameObject(samButton);
    }

    this.startButton.SetLocation((this.UICellSize * 3) + 5, 5, eLayerTypes.UI);
    this.startButton.SetSize(this.UICellSize - 10, this.UICellSize - 10);
    this.startButton.SetText('Start');
    this.startButton.SetClickFunction(() => {
      this.secondsToStart = 0;
    });

    this.restartButton.SetLocation((this.UICellSize * 4) + 5, 5, eLayerTypes.UI);
    this.restartButton.SetSize(this.UICellSize - 10, this.UICellSize - 10);
    this.restartButton.SetText('Restart');
    this.restartButton.SetClickFunction(() => {
      Game.SetStartingCredits(0);
      Game.SetTheScene(this.CurrentSceneName);
    });

    this.homeButton.SetLocation((this.UICellSize * 5) + 5, 5, eLayerTypes.UI);
    this.homeButton.SetSize(this.UICellSize - 10, this.UICellSize - 10);
    this.homeButton.SetText('Home');
    this.homeButton.SetClickFunction(() => Game.SetTheScene('instructions'));
    
    this.settingsButton.SetLocation(Game.CANVAS_WIDTH - 75, 25, eLayerTypes.UI);
    this.settingsButton.SetSize(50, 50);
    this.settingsButton.SetImage('/assets/images/cog.png');
    this.settingsButton.SetClickFunction(() => {
      if (this.paused) {
        this.paused = false;
      }
      else {
        this.paused = true;
      }
    });

    this.resumeButton.SetLocation((Game.CANVAS_WIDTH / 2) - 50, Game.CANVAS_HEIGHT / 2, eLayerTypes.UI);
    this.resumeButton.SetSize(100, 50);
    this.resumeButton.SetText('Resume');
    this.resumeButton.SetClickFunction(() => {
      this.paused = false;
    });
    this.resumeButton.Load();

    this.speedButton.SetLocation((this.UICellSize * 9) + 5, 5, eLayerTypes.UI);
    this.speedButton.SetSize(this.UICellSize - 10, this.UICellSize - 10);
    this.speedButton.SetText('x1');
    this.speedButton.SetClickFunction(() => {
      if (this.GameSpeed === 1) {
        this.gameSpeed = 2;
        this.speedButton.SetText('x2');
      }
      //else if (this.GameSpeed === 2) {
      //  this.gameSpeed = 4;
      //  this.speedButton.SetText('x1');
      //}
      else {
        this.gameSpeed = 1;
        this.speedButton.SetText('x1');
      }
    });
    

    this.LoadGameObject(this.startButton);
    this.LoadGameObject(this.restartButton);
    this.LoadGameObject(this.homeButton);
    this.LoadGameObject(this.settingsButton);
    this.LoadGameObject(this.speedButton);

    this.upgradeButton.SetLocation(Game.CANVAS_WIDTH - (this.UICellSize * 2) + 10, (this.UICellSize * 6) + 5, eLayerTypes.UI);
    this.upgradeButton.SetSize((this.UICellSize * 2) - 20, (this.UICellSize) - 10);
    this.upgradeButton.SetText(`Upgrade`);
    this.upgradeButton.SetHidden(true);
    this.LoadGameObject(this.upgradeButton);

    this.deleteButton.SetLocation(Game.CANVAS_WIDTH - (this.UICellSize * 2) + 10, (this.UICellSize * 5) + 5, eLayerTypes.UI);
    this.deleteButton.SetSize((this.UICellSize * 2) - 20, (this.UICellSize) - 10);
    this.deleteButton.SetText('Delete');
    this.deleteButton.SetHidden(true);
    this.LoadGameObject(this.deleteButton);

    this.nextLevelButton.SetLocation((Game.CANVAS_WIDTH / 2) - 100, (Game.CANVAS_HEIGHT / 2) + 200, eLayerTypes.UI);
    this.nextLevelButton.SetSize(200, 100);
    this.nextLevelButton.SetText('Go to Next Level');
    this.nextLevelButton.SetClickFunction(() => Game.SetTheScene(this.NextLevelName));
    this.nextLevelButton.Load();
  }

  private calculatePaths(): boolean {
    let tempPaths: Vector2[][] = [];
    for (let i = 0; i < this.StartingCells.length; i++) {
      let tempPath = PathFinder.AStarSearch(this.grid, this.StartingCells[i], this.EndingCells[i]);

      if (tempPath.length === 0)
        return false;

      tempPaths.push(tempPath);
    }

    this.thePaths = [];
    for (let p = 0; p < tempPaths.length; p++) {
      //let allGood = true;
      //this.GameObjects.forEach((obj) => {
      //  allGood = allGood && obj.UpdatePath(this.grid, this.GridCellSize, this.EndingCells[0])
      //});
      for (let x = 0; x < this.grid.length; x++) {
        for (let y = 0; y < this.grid[x].length; y++) {
          if (this.grid[x][y] === ePathCellStatus.Path)
            this.grid[x][y] = ePathCellStatus.Open;
        }
      }

      let thePath: Vector2[] = [];
      for (let i = tempPaths[p].length - 1; i >= 0; i--) {
        this.grid[tempPaths[p][i].X][tempPaths[p][i].Y] = ePathCellStatus.Path;
        let worldPoint = new Vector2((tempPaths[p][i].X * this.GridCellSize) + this.remainderX,
          (tempPaths[p][i].Y * this.GridCellSize) + this.remainderY);

        thePath.push(worldPoint);
      }

      this.thePaths.push(thePath);
    }

    return true;
  }

  private gatherGridInfo(): any {
    let rows = [];
    for (let y = 0; y < this.grid[0].length; y++) {
      let cells = [];
      for (let x = 0; x < this.grid.length; x++) {
        if (this.grid[x][y] === ePathCellStatus.Blocked) {
          let found = false;
          for (let i = 0; i < this.defenders.length; i++) {
            let xx = Math.floor(this.defenders[i].CenterMassLocation.X / this.GridCellSize);
            let yy = Math.floor(this.defenders[i].CenterMassLocation.Y / this.GridCellSize);

            if (x === xx && y === yy) {
              found = true;
              let cell = { defenderType: (this.defenders[i].CanUpgrade ? 3 : 2), defenderLevel: this.defenders[i].Level };
              cells.push(cell);
            }
          }
          if (!found) {
            let cell = { defenderType: 0, defenderLevel: 0 };
            cells.push(cell);
          }
        }
        else if (this.grid[x][y] === ePathCellStatus.Path) {
          let cell = { defenderType: 1, defenderLevel: 0 };
          cells.push(cell);
        }
        else {
          let cell = { defenderType: 0, defenderLevel: 0 };
          cells.push(cell);
        }
      }
      rows.push({ cells: cells });
    }
    return { rows: rows };
  }

  private spawnAttacker(): void {
    let mon = this.CreateNewAttacker(this.enemiesSpawned);

    this.LoadGameObject(mon);
    this.attackers.push(mon);
    this.enemiesSpawned++;
  }

  private updateSettings(deltaTime: number): void {
    this.settingsButton.Update(deltaTime);
    this.resumeButton.Update(deltaTime);
  }

  private defenderButtons: Button[] = [];
  private upgradeButton: Button = new Button();
  private deleteButton: Button = new Button();
  private nextLevelButton = new Button();
  private startButton: Button = new Button();
  private restartButton: Button = new Button();
  private homeButton: Button = new Button();
  private settingsButton: Button = new Button();
  private resumeButton: Button = new Button();
  private speedButton: Button = new Button();
  private remainderX: number = 0;
  private remainderY: number = 0;
  private attackers: Attacker[] = [];
  private defenders: Defender[] = [];
  private secondsToStart = 0;
  private enemiesSpawned = 0;
  private secondsSinceLastMonster = 0;
  private previousMouse: Vector2 | null = null;
  private mouseCell: Vector2 | null = null;
  private mouseHighlightCell: Vector2 | null = null;
  private previousCell: Vector2 | null = null;
  private cellPressed: boolean = false;
  private selectedDefender: Defender | null = null;
  private sentAPIMessage: boolean = false;
  private floor: Sprite = new Sprite();
}
