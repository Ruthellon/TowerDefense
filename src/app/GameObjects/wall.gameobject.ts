import { Game } from "../Utility/game.model";
import { Base } from "./base.gameobject";
import { IGameObject } from "./gameobject.interface";


export class Wall extends Base {
  public override get Value(): number | null {
    return null;
  }
  public override Load(): void {
  }
  public override OnCollision(collision: IGameObject): void {
  }
  override color = '#ff0000';

  override Update(deltaTime: number): void {
  }

  Draw(deltaTime: number): void {
    Game.CONTEXT.fillStyle = this.color;
    Game.CONTEXT.fillRect(this.Location.X, this.Location.Y,
      this.Size.X, this.Size.Y);
  }
}
