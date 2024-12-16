import { AppComponent } from "../app.component";
import { Block } from "../GameObjects/block.gameobject";
import { FloorGrid } from "../GameObjects/floorgrid.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { DefenseBaseLevel } from "./defensebase.scene";
import { IScene } from "./scene.interface";

export class LevelOneScene extends DefenseBaseLevel {
  protected get StartingCells(): Vector2[] {
    return [new Vector2(0,2)];
  }
  protected override get EndingCells(): Vector2[] {
    return [new Vector2(9,2)]
  }
  protected get TurretCellSize(): number {
    return 160;
  }
  protected get GridCellSize(): number {
    return 160;
  }
  gameObjects: IGameObject[] = [];
  protected override get GameObjects(): IGameObject[] {
    return this.gameObjects;
  }

  private floorGrid: FloorGrid = new FloorGrid();
  override Update(deltaTime: number): void {
    this.gameObjects.forEach((gameObject) => {
      if (gameObject !== this.floorGrid) {
        (gameObject as Block).SetPath(this.floorGrid.Path);
      }
    });
    super.Update(deltaTime);
  }

  override Draw(deltaTime: number): void {
    super.Draw(deltaTime);
  }

  override Load(): void {
    super.Load();
    this.gameObjects.push(this.floorGrid);

    let block = new Block();
    block.SetColor('#ffffff');
    block.SetLocation(0, Game.CANVAS_HEIGHT / 2, 2);
    block.SetSize(64, 64);

    this.gameObjects.push(block);
  }
}
