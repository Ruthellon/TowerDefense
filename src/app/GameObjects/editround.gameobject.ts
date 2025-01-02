import { AppComponent } from "../app.component";
import { eLayerTypes } from "../Scenes/scene.interface";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { Base } from "./base.gameobject";
import { IGameObject } from "./gameobject.interface";
import { Button } from "./Utilities/button.gameobject";
import { Label } from "./Utilities/label.gameobject";
import { TextBox } from "./Utilities/textbox.gameobject";

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

    this.enemyCountPrompt.SetLocation(this.ObjectRect.Center.X - 75, this.Location.Y + 50, eLayerTypes.UI + 1);
    this.enemyCountPrompt.SetSize(150, 50);
    this.enemyCountPrompt.SetText('10');
    this.enemyCountPrompt.SetPrompt('Set Enemy Count (1 - 1000)');
    this.enemyCountPrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        let textAsNumber = Number(text);

        if (isNaN(textAsNumber)) {
          alert('Enter a valid number');
          return '10';
        }

        if (textAsNumber < 1)
          return '1';

        if (textAsNumber > 1000)
          return '1000';

        return textAsNumber.toFixed(0);
      }

      return '10';
    });
    this.enemyCountPrompt.Load();
    this.gameObjects.push(this.enemyCountPrompt);

    this.enemyCountLabel.SetLocation(this.ObjectRect.Center.X - 175, this.Location.Y + 50, eLayerTypes.UI + 1);
    this.enemyCountLabel.SetSize(150, 50);
    this.enemyCountLabel.SetText('Enemies this Round:', undefined, 'right');
    this.enemyCountLabel.Load();
    this.gameObjects.push(this.enemyCountLabel);
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

  private enemyCountPrompt: TextBox = new TextBox();

  private enemyCountLabel: Label = new Label();

  private closeButton: Button = new Button();
}
