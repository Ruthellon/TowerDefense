import { Game } from "../Utility/game.model";
import { IGameObject } from "./gameobject.interface";

export class Turret extends IGameObject {
  override color = '#888888';

  Update(deltaTime: number): void {

  }

  Draw(deltaTime: number): void {
    Game.CONTEXT.fillStyle = this.color;
    Game.CONTEXT.fillRect(this.location.X, this.location.Y,
      this.Size.X, this.Size.Y);
  }
}
