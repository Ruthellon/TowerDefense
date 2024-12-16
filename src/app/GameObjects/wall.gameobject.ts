import { Game } from "../Utility/game.model";
import { IGameObject } from "./gameobject.interface";


export class Wall extends IGameObject {
  override color = '#ff0000';

  Update(deltaTime: number): void {

  }

  Draw(deltaTime: number): void {
    Game.CONTEXT.fillStyle = this.color;
    Game.CONTEXT.fillRect(this.location.X, this.location.Y,
      this.Size.X, this.Size.Y);
  }
}
