import { AppComponent } from "../app.component";
import { eLayerTypes } from "../Scenes/scene.interface";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { Base } from "./base.gameobject";
import { IGameObject } from "./gameobject.interface";
import { Button } from "./Utilities/button.gameobject";

export class EditRound extends Base {
  public override get Value(): number | null {
    return null;
  }

  public override Load() {
    super.Load();

    this.closeButton.SetLocation(this.ObjectRect.Center.X - 50, this.ObjectRect.Center.Y + 200, eLayerTypes.UI + 1);
    this.closeButton.SetSize(100, 50);
    this.closeButton.SetText('Close');
    this.closeButton.SetClickFunction(() => {
      this.isHidden = true;
    });
    this.closeButton.Load();
    this.gameObjects.push(this.closeButton);
  }

  public override Update(deltaTime: number) {
    if (!this.isHidden && this.isEnabled) {
      this.GameObjects.forEach((obj) => {
        if (!obj.IsHidden && obj.IsEnabled)
          obj.Update(deltaTime);
      });
    }
  }

  public override Draw(deltaTime: number) {
    if (!this.isHidden) {
      Game.CONTEXT!.fillStyle = '#555555';
      Game.CONTEXT!.fillRect(this.Location.X, this.Location.Y, this.Size.X, this.Size.Y);

      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect(this.Location.X, this.Location.Y, this.Size.X, this.Size.Y);

      this.GameObjects.forEach((obj) => {
        if (!obj.IsHidden)
          obj.Draw(deltaTime);
      });
    }
  }


  private closeButton: Button = new Button();
}
