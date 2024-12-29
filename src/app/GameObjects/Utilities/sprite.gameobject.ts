import { Rect, Vector2, Vector3 } from "../../Utility/classes.model";
import { IGameObject } from "../gameobject.interface";
import { Game } from 'Utility/game.model'
import { UtilityBase } from "./utilitybase.gameobject";

export class Sprite extends UtilityBase {

  public override Load() {
    super.Load();
  }

  public override Update(deltaTime: number): void {
  }

  public override Draw(deltaTime: number): void {
    if (this.sprite)
      Game.CONTEXT.drawImage(this.sprite, this.location.X, this.location.Y, this.size.X, this.size.Y);

    if (this.color) {
      Game.CONTEXT.fillStyle = this.color;
      Game.CONTEXT.fillRect(this.Location.X, this.Location.Y,
        this.Size.X, this.Size.Y);
    }
  }
}
