import { AppComponent } from "../app.component";
import { Block } from "../GameObjects/block.gameobject";
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
  protected get SelectedTurret(): IGameObject {
    return new Block();
  }
  gameObjects: IGameObject[] = [];
  protected override get GameObjects(): IGameObject[] {
    return this.gameObjects;
  }

  override Update(deltaTime: number): void {
    super.Update(deltaTime);
  }

  override Draw(deltaTime: number): void {
    super.Draw(deltaTime);
  }

  override Load(): void {
    super.Load();

    let block = new Block();
    block.SetLocation(0, Game.CANVAS_HEIGHT / 2, 2);
  }
}
