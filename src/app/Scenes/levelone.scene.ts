import { AppComponent } from "../app.component";
import { Block } from "../GameObjects/block.gameobject";
import { Button } from "../GameObjects/button.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Turret } from "../GameObjects/turret.gameobject";
import { Wall } from "../GameObjects/wall.gameobject";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { DefenseBaseLevel } from "./defensebase.scene";
import { IScene } from "./scene.interface";

export class LevelOneScene extends DefenseBaseLevel {
  protected get StartingCells(): Vector2[] {
    return [new Vector2(0,3)];
  }
  protected override get EndingCells(): Vector2[] {
    return [new Vector2(12,3)]
  }
  protected get TurretCellSize(): number {
    return 100;
  }
  protected get GridCellSize(): number {
    return 100;
  }
  private selectedObstacle: IGameObject = new Wall();
  protected get SelectedTurret(): IGameObject {
    return this.selectedObstacle;
  }
  gameObjects: IGameObject[] = [];
  protected override get GameObjects(): IGameObject[] {
    return this.gameObjects;
  }

  secondsToStart: number = 5;
  secondsToMonster: number = 0;
  override Update(deltaTime: number): void {
    super.Update(deltaTime);

    if (this.secondsToStart <= 0) {
      if (this.secondsToMonster <= 0) {
        console.log('NEW MONSTER');
        let mon = new Block();
        mon.SetLocation(this.StartingCells[0].X - this.GridCellSize, Game.CANVAS_HEIGHT / 2, 2);
        mon.SetSize(40, 40);
        mon.SetPath(this.ThePath, this.GridCellSize);

        this.LoadGameObject(mon);

        this.secondsToMonster = 5;
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
        console.log('remove object');
        this.gameObjects.splice(i, 1);
        i--;
      }
    }

    if (this.wallButton.Pressed) {
      this.selectedObstacle = new Wall();
      this.selectedObstacle.SetSize(this.GridCellSize, this.GridCellSize);
    }

    if (this.turretButton.Pressed) {
      this.selectedObstacle = new Turret();
      this.selectedObstacle.SetSize(this.GridCellSize, this.GridCellSize);
    }
  }

  override Draw(deltaTime: number): void {
    super.Draw(deltaTime);
  }

  private wallButton: Button = new Button();
  private turretButton: Button = new Button();
  override Load(): void {
    super.Load();

    this.wallButton.SetLocation(Game.CANVAS_WIDTH - (this.GridCellSize * 2), this.GridCellSize, 10);
    this.wallButton.SetSize(this.GridCellSize, this.GridCellSize);
    this.wallButton.SetText('Wall');

    this.turretButton.SetLocation(Game.CANVAS_WIDTH - (this.GridCellSize * 1), this.GridCellSize, 10);
    this.turretButton.SetSize(this.GridCellSize, this.GridCellSize);
    this.turretButton.SetText('Turret');

    this.LoadGameObject(this.wallButton);
    this.LoadGameObject(this.turretButton);
  }
}
