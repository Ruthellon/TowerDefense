import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Button } from "../GameObjects/button.gameobject";
import { Defender } from "../GameObjects/defender.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Turret } from "../GameObjects/turret.gameobject";
import { Wall } from "../GameObjects/wall.gameobject";
import { IAngryElfAPIService } from "../Services/angryelfapi.service.interface";
import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { PathFinder } from "../Utility/pathfinding.service";
import { BaseLevel } from "./base.scene";
import { IScene } from "./scene.interface";

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
  protected abstract get TotalEnemies(): number;
  protected abstract get AvailableDefenders(): eDefenderTypes[];
  protected abstract get CurrentSceneName(): string;
  protected abstract get SecondsBetweenMonsters(): number;
  protected abstract get SecondsToStart(): number;

  protected abstract CreateNewAttacker(attackerCount: number): Attacker;
  protected abstract PlayerWonScreen(): void;

  protected gameObjects: IGameObject[] = [];
  protected get GameObjects(): IGameObject[] {
    return this.gameObjects;
  }
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
  protected canBuild: boolean = true;
  protected get CanBuild(): boolean {
    return this.canBuild;
  }
  protected isGameOver: boolean = false;
  public get IsGameOver(): boolean {
    return this.isGameOver;
  }
  private newDefender: eDefenderTypes = eDefenderTypes.Wall;
  protected get NewDefender(): Defender {
    let defender: Defender;
    if (this.newDefender === eDefenderTypes.BasicTurret) {
      defender = new Turret();
    }
    else {
      defender = new Wall();
    }
    defender.SetSize(this.GridCellSize, this.GridCellSize);
    return defender;
  }
  protected get SelectedDefenderColor(): string {
    if (this.newDefender === eDefenderTypes.BasicTurret) {
      return '#888888';
    }
    else {
      return '#ff0000';
    }
  }
  protected playerHealth: number = 0;
  protected ReduceHealth(reduceBy: number): void {
    this.playerHealth -= reduceBy;
  }

  private gridRect = new Rect(100, 100, Game.CANVAS_WIDTH - 300, Game.CANVAS_HEIGHT - 200);
  private get GRID_RECT(): Rect {
    return this.gridRect;
  }

  private remainder: number = 0;
  protected attackers: Attacker[] = [];
  protected defenders: Defender[] = [];
  Load(): void {
    this.SetButtons();
    this.playerHealth = this.PlayerStartingHealth;
    this.secondsToStart = this.SecondsToStart;
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

    this.calculatePath();

    this.lastCoordinate = new Vector3((this.EndingCells[0].X * this.GridCellSize) + (this.GridCellSize / 2), (this.EndingCells[0].Y * this.GridCellSize) + (this.GridCellSize / 2), 0);
  }

  private secondsToStart = 0;
  private enemiesSpawned = 0;
  private secondsSinceLastMonster = 0;
  private previousMouse: Vector2 | null = null;
  private mouseCell: Vector2 | null = null;
  private mouseReset: boolean = true;
  private lastCoordinate = new Vector3(0, 0, 0);
  private selectedDefender: Defender | null = null;
  private sentAPIMessage: boolean = false;
  override Update(deltaTime: number) {
    if (this.playerHealth <= 0) {
      this.isGameOver = true;
      return;
    }

    if (this.enemyCount >= this.TotalEnemies) {
      this.isGameOver = true;

      if (!this.sentAPIMessage) {
        this.sentAPIMessage = true;
        let level = 0;
        if (this.CurrentSceneName === 'levelone')
          level = 1;
        else if (this.CurrentSceneName === 'leveltwo')
          level = 2;
        else if (this.CurrentSceneName === 'levelthree')
          level = 3;
        Game.TheAPI.SendWinInfo(level, this.playerHealth, 1, this.gatherGridInfo());
      }

      return;
    }

    super.Update(deltaTime);

    if (this.secondsToStart <= 0) {
      this.canBuild = false;
      if (this.secondsSinceLastMonster <= 0 && this.enemiesSpawned < this.TotalEnemies) {
        console.log('NEW MONSTER');
        let mon = this.CreateNewAttacker(this.enemiesSpawned);
        mon.SetLocation(this.StartingCells[0].X - this.GridCellSize, Game.CANVAS_HEIGHT / 2, 2);
        mon.SetPath(this.ThePath, this.GridCellSize);

        this.LoadGameObject(mon);
        this.attackers.push(mon);
        this.enemiesSpawned++;

        this.secondsSinceLastMonster = this.SecondsBetweenMonsters;
      }
      else {
        this.secondsSinceLastMonster -= deltaTime;
      }
    }
    else {
      this.secondsToStart -= deltaTime;
    }

    for (let i = 0; i < this.attackers.length; i++) {
      let attacker = this.attackers[i];
      let attackerDied = false;
      if (attacker.CenterMassLocation.distanceTo(this.lastCoordinate) <= 25) {
        this.ReduceHealth(1);

        attackerDied = true;
      }
      else if (attacker.Health <= 0) {
        if (attacker.Value)
          Game.AddCredits(attacker.Value);

        attackerDied = true;
      }

      if (attackerDied) {
        this.enemyCount++;
        this.DestroyGameObject(attacker);
        this.attackers.splice(i, 1);
        i--;
      }
    }

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

    this.defenderButtons.forEach((butt) => {
      if (butt.Pressed) {
        this.newDefender = butt.Id;
        this.selectedDefender = null;
      }
    });

    this.defenders.forEach((defender) => {
      if (defender.Pressed) {
        this.selectedDefender = defender;
        this.upgradeButton.SetText(`Upgarde (${this.selectedDefender.UpgradeCost}cr)`);
      }
    });

    if (this.selectedDefender) {
      if (this.selectedDefender.CanUpgrade) {
        this.upgradeButton.Update(deltaTime);
      }
      this.deleteButton.Update(deltaTime);
      if (this.deleteButton.Pressed) {
        if (this.selectedDefender.Cost) {
          if (this.canBuild)
            Game.AddCredits(this.selectedDefender.Cost);
          else if (this.selectedDefender.Cost > 1)
            Game.AddCredits(1);
        }

        let gridX = Math.floor(this.selectedDefender.CenterMassLocation.X / this.GridCellSize);
        let gridY = Math.floor(this.selectedDefender.CenterMassLocation.Y / this.GridCellSize);

        this.grid[gridX][gridY] = 0;

        this.calculatePath();

        this.DestroyGameObject(this.selectedDefender);
        let i = this.defenders.findIndex((def) => def === this.selectedDefender);
        this.attackers.splice(i, 1);
        this.selectedDefender = null;
      }
      else if (this.selectedDefender.CanUpgrade && this.upgradeButton.Pressed) {
        if (Game.Credits >= this.selectedDefender.UpgradeCost) {
          Game.SubtractCredits(this.selectedDefender.UpgradeCost);
          this.selectedDefender.Upgrade();

          this.upgradeButton.SetText(`Upgarde (${this.selectedDefender.UpgradeCost}cr)`);
        }
      }
    }

    if (this.startButton.Pressed) {
      this.secondsToStart = 0;
    }

    if (this.restartButton.Pressed) {
      Game.SetTheScene(this.CurrentSceneName);
    }
  }

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
        Game.CONTEXT.fillText('Refresh To Play Again', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 150);
      }
      else {
        this.PlayerWonScreen();
      }

      return;
    }

    if (this.secondsToStart > 0) {
      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '24px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.fillText(`Start: ${this.secondsToStart.toFixed(2)}`, this.GridCellSize * 2, this.GridCellSize / 2);
    }

    if (this.playerHealth > 0) {
      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '24px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.fillText(`Health: ${this.playerHealth}`, Game.CANVAS_WIDTH / 2, this.GridCellSize / 2);
    }

    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '24px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText(`Credits: ${Game.Credits.toFixed(0)}`, Game.CANVAS_WIDTH - this.GridCellSize * 2.5, this.GridCellSize / 2);

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
      Game.CONTEXT.strokeStyle = this.SelectedDefenderColor;
      Game.CONTEXT.strokeRect((this.mouseCell.X * this.GridCellSize), (this.mouseCell.Y * this.GridCellSize) + this.remainder,
        this.GridCellSize, this.GridCellSize);
    }

    if (this.selectedDefender) {
      if (this.selectedDefender.CanUpgrade) {
        this.upgradeButton.Draw(deltaTime);
      }
      this.deleteButton.Draw(deltaTime);
    }

    Game.CONTEXT.lineWidth = 1;

    super.Draw(deltaTime);
  }

  private defenderButtons: Button[] = [];

  private upgradeButton: Button = new Button();
  private deleteButton: Button = new Button();

  private startButton: Button = new Button();
  private restartButton: Button = new Button();
  protected SetButtons(): void {

    let wallButton = new Button();
    wallButton.SetLocation(Game.CANVAS_WIDTH - (this.GridCellSize * 2), this.GridCellSize, 10);
    wallButton.SetSize(this.GridCellSize, this.GridCellSize);
    wallButton.SetText('Wall');
    wallButton.SetId(eDefenderTypes.Wall)
    wallButton.SetAltColor('#ff0000');
    this.defenderButtons.push(wallButton);
    this.LoadGameObject(wallButton);

    if (this.AvailableDefenders.find((defender) => defender === eDefenderTypes.BasicTurret)) {
      let turretButton = new Button();
      turretButton.SetLocation(Game.CANVAS_WIDTH - (this.GridCellSize * 1), this.GridCellSize, 10);
      turretButton.SetSize(this.GridCellSize, this.GridCellSize);
      turretButton.SetText('Turret');
      turretButton.SetId(eDefenderTypes.BasicTurret);
      turretButton.SetAltColor('#888888');
      this.defenderButtons.push(turretButton);
      this.LoadGameObject(turretButton);
    }

    if (this.AvailableDefenders.find((defender) => defender === eDefenderTypes.SAMTurret)) {
      let samButton = new Button();
      samButton.SetLocation(Game.CANVAS_WIDTH - (this.GridCellSize * 2), this.GridCellSize * 2, 10);
      samButton.SetSize(this.GridCellSize, this.GridCellSize);
      samButton.SetText('S.A.M.');
      samButton.SetId(eDefenderTypes.SAMTurret);
      this.defenderButtons.push(samButton);
      this.LoadGameObject(samButton);
    }

    this.startButton.SetLocation((this.GridCellSize * 3), 0, 10);
    this.startButton.SetSize(this.GridCellSize, this.GridCellSize);
    this.startButton.SetText('Start');

    this.restartButton.SetLocation((this.GridCellSize * 5), 0, 10);
    this.restartButton.SetSize(this.GridCellSize, this.GridCellSize);
    this.restartButton.SetText('Restart');

    this.LoadGameObject(this.startButton);
    this.LoadGameObject(this.restartButton);


    this.upgradeButton.SetLocation(Game.CANVAS_WIDTH - (this.GridCellSize * 2), this.GridCellSize * 6, 10);
    this.upgradeButton.SetSize(this.GridCellSize * 2, this.GridCellSize);
    this.upgradeButton.SetText(`Upgrade`);
    this.upgradeButton.Load();

    this.deleteButton.SetLocation(Game.CANVAS_WIDTH - (this.GridCellSize * 2), this.GridCellSize * 5, 10);
    this.deleteButton.SetSize(this.GridCellSize * 2, this.GridCellSize);
    this.deleteButton.SetText('Delete');
    this.deleteButton.Load();
  }

  protected AddObstacle(cell: Vector2): boolean {
    if (!this.grid)
      return false;

    if (this.grid[cell.X][cell.Y] === 1)
      return false;

    let newDefender = this.NewDefender;
    if (newDefender.Cost && Game.Credits < newDefender.Cost)
      return false;

    if (!this.canBuild) {
      if (this.grid[cell.X][cell.Y] === 2)
        return false;

      this.grid[cell.X][cell.Y] = 1;
      let newObstacle = newDefender;
      newObstacle.SetLocation((cell.X * this.GridCellSize),
        ((cell.Y * this.GridCellSize) + this.remainder), 5);

      if (newObstacle.Cost)
        Game.SubtractCredits(newObstacle.Cost);

      this.LoadGameObject(newObstacle);
      this.defenders.push(newObstacle);
      return true;
    }

    this.grid[cell.X][cell.Y] = 1;

    if (this.calculatePath()) {
      let newObstacle = newDefender;
      newObstacle.SetLocation((cell.X * this.GridCellSize),
        ((cell.Y * this.GridCellSize) + this.remainder), 5);

      if (newObstacle.Cost)
        Game.SubtractCredits(newObstacle.Cost);

      this.defenders.push(newObstacle);
      this.LoadGameObject(newObstacle);

      return true;
    }
    else {
      this.grid[cell.X][cell.Y] = 0;
      return false;
    }
  }

  private calculatePath(): boolean {
    let tempPath = PathFinder.AStarSearch(this.grid, this.StartingCells[0], this.EndingCells[0]);

    if (tempPath.length === 0)
      return false;

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

    return true;
  }

  private gatherGridInfo(): any {
    let rows = [];
    for (let y = 0; y < this.grid[0].length; y++) {
      let cells = [];
      for (let x = 0; x < this.grid.length; x++) {
        if (this.grid[x][y] === 1) {
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
        else if (this.grid[x][y] === 2) {
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
}
