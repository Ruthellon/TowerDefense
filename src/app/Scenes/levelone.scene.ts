import { AppComponent } from "../app.component";
import { Block } from "../GameObjects/block.gameobject";
import { FloorGrid } from "../GameObjects/floorgrid.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { IScene } from "./scene.interface";

export class LevelOneScene extends IScene {
  gameObjects: IGameObject[] = [];
  protected get GameObjects(): IGameObject[] {
    return this.gameObjects;
  }

  override Update(deltaTime: number): void {
     
    super.Update(deltaTime);
  }

  override Draw(deltaTime: number): void {
    Game.CONTEXT!.fillStyle = '#000000';
    Game.CONTEXT!.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

    super.Draw(deltaTime);
  }

  Load(): void {
    let floorGrid = new FloorGrid();
    floorGrid.SetColor('#ff0000');
    floorGrid.SetShouldHighlight(true);

    this.gameObjects.push(floorGrid);

    //let block = new Block();
    //block.SetColor('#ffffff');
    //block.SetLocation(0, Game.CANVAS_HEIGHT / 2, 2);
    //block.SetSize(32, 32);

    //this.gameObjects.push(block);
    //for (let i = 0; i < 2500; i++) {
    //  let block = new Block();
    //  block.SetColor('#ffffff');
    //  block.SetLocation(Math.min(AppComponent.CANVAS_WIDTH - 15, Math.random() * AppComponent.CANVAS_WIDTH),
    //    Math.min(AppComponent.CANVAS_HEIGHT - 15, Math.random() * AppComponent.CANVAS_HEIGHT), 1);
    //  block.SetSize(10, 10);
    //  block.SetCollisionBox(10, 10);
    //  this.gameObjects.push(block);
    //}
  }
}
