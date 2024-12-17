import { AppComponent } from "../app.component";
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Button } from "../GameObjects/button.gameobject";
import { Defender } from "../GameObjects/defender.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Turret } from "../GameObjects/turret.gameobject";
import { Wall } from "../GameObjects/wall.gameobject";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { DefenseBaseLevel } from "./defensebase.scene";
import { IScene } from "./scene.interface";

export class LevelOneScene extends DefenseBaseLevel {
  protected get TotalEnemies(): number {
    return 50;
  }
  private playerHealth = 10;
  protected get PlayerHealth(): number {
    return this.playerHealth;
  }
  protected override ReduceHealth(reduceBy: number): void {
    this.playerHealth -= reduceBy;
  }
  private startingCells = [new Vector2(0, 4)];
  protected get StartingCells(): Vector2[] {
    return this.startingCells;
  }
  private endingCells = [new Vector2(14, 4)];
  protected override get EndingCells(): Vector2[] {
    return this.endingCells;
  }

  protected get TurretCellSize(): number {
    return 100;
  }
  protected get GridCellSize(): number {
    return 100;
  }

  private selectedObstacle: number = 0;
  protected get SelectedTurret(): Defender {
    let obstacle: any;
    if (this.selectedObstacle === 0) {
      obstacle = new Wall();
      obstacle.SetSize(this.GridCellSize, this.GridCellSize);
    }
    else if (this.selectedObstacle === 1) {
      obstacle = new Turret();
      obstacle.SetSize(this.GridCellSize, this.GridCellSize);
    }
    return obstacle;
  }

  override attackers: Attacker[] = [];
  gameObjects: IGameObject[] = [];
  protected override get GameObjects(): IGameObject[] {
    return this.gameObjects;
  }
  private enemiesSpawned = 0;
  secondsToMonster: number = 0;
  override Update(deltaTime: number): void {
    if (this.IsGameOver) {
      return;
    }

    super.Update(deltaTime);

    if (this.secondsToStart <= 0) {
      this.canBuild = false;
      if (this.secondsToMonster <= 0 && this.enemiesSpawned < this.TotalEnemies) {
        console.log('NEW MONSTER');
        let mon = new Block();
        mon.SetLocation(this.StartingCells[0].X - this.GridCellSize, Game.CANVAS_HEIGHT / 2, 2);
        mon.SetSize(40, 40);
        mon.SetPath(this.ThePath, this.GridCellSize);

        this.LoadGameObject(mon);
        this.attackers.push(mon);
        this.enemiesSpawned++;

        this.secondsToMonster = 1;
      }
      else {
        this.secondsToMonster -= deltaTime;
      }
    }
    else {
      this.secondsToStart -= deltaTime;
    }

    for (let i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i].Location.X > Game.CANVAS_WIDTH) {
        this.DestroyGameObject(this.gameObjects[i]);
        this.ReduceHealth(1);
        this.enemyCount++;
      }
    }

    if (this.wallButton.Pressed) {
      this.selectedObstacle = 0;
    }

    if (this.turretButton.Pressed) {
      this.selectedObstacle = 1;
    }

    if (this.startButton.Pressed) {
      this.secondsToStart = 0;
    }

    if (this.restartButton.Pressed) {
      Game.SetTheScene('levelone');
    }
  }

  override Draw(deltaTime: number): void {
    super.Draw(deltaTime);
  }

  private wallButton: Button = new Button();
  private turretButton: Button = new Button();
  private startButton: Button = new Button();
  private restartButton: Button = new Button();
  override Load(): void {
    super.Load();

    this.wallButton.SetLocation(Game.CANVAS_WIDTH - (this.GridCellSize * 2), this.GridCellSize, 10);
    this.wallButton.SetSize(this.GridCellSize, this.GridCellSize);
    this.wallButton.SetText('Wall');

    this.turretButton.SetLocation(Game.CANVAS_WIDTH - (this.GridCellSize * 1), this.GridCellSize, 10);
    this.turretButton.SetSize(this.GridCellSize, this.GridCellSize);
    this.turretButton.SetText('Turret');

    this.startButton.SetLocation((this.GridCellSize * 3), 0, 10);
    this.startButton.SetSize(this.GridCellSize, this.GridCellSize);
    this.startButton.SetText('Start');

    this.restartButton.SetLocation((this.GridCellSize * 5), 0, 10);
    this.restartButton.SetSize(this.GridCellSize, this.GridCellSize);
    this.restartButton.SetText('Restart');

    this.LoadGameObject(this.wallButton);
    this.LoadGameObject(this.turretButton);
    this.LoadGameObject(this.startButton);
    this.LoadGameObject(this.restartButton);
  }

  protected SetCredits(): void {
    this.credits = 100;
  }

  protected SetSecondsToStart(): void {
    this.secondsToStart = 120;
  }
}
