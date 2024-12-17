import { Game } from "../Utility/game.model";
import { IGameObject } from "./gameobject.interface";


export class Wall extends IGameObject {
  override color = '#ff0000';

  override Update(deltaTime: number): void {
    super.Update(deltaTime);
  }

  Draw(deltaTime: number): void {
    Game.CONTEXT.fillStyle = this.color;
    Game.CONTEXT.fillRect(this.location.X, this.location.Y,
      this.Size.X, this.Size.Y);
  }
}
