import { Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Base } from "./base.gameobject";
import { IGameObject } from "./gameobject.interface";


export class Boundary extends Base {
  public override get Value(): number | null {
    return null;
  }
  protected override location = new Vector3(0, 0, 50);
  public get UpgradeCost(): number {
    return 0;
  }

  public override Load(): void {
    super.Load();
  }

  protected override color = '#333333';

  public override Draw(deltaTime: number): void {
    Game.CONTEXT.fillStyle = this.color;
    Game.CONTEXT.fillRect(this.Location.X, this.Location.Y,
      this.Size.X, this.Size.Y);
  }
}
