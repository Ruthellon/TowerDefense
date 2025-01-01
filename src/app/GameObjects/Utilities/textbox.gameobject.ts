import { Rect, Vector2, Vector3 } from "../../Utility/classes.model";
import { IGameObject } from "../gameobject.interface";
import { Game } from 'Utility/game.model'
import { UtilityBase } from "./utilitybase.gameobject";

export class TextBox extends UtilityBase {
  private altColor = '#ffffff';
  private text: string | null = null;

  private prompt: string | undefined = undefined;

  private verifyFunction: ((text: string | null) => string | null) | undefined;

  public override Load() {
    super.Load();

    if (!this.imageLocation && !this.color) {
      this.color = '#999999';
      this.altColor = '#dddddd';
    }

    if (!this.clickFunction) {
      this.SetClickFunction(() => {
        let response = prompt(this.prompt);

        if (!this.verifyFunction)
          this.text = response;
        else
          this.text = this.verifyFunction(response);
      });
    }
  }

  public override Update(deltaTime: number): void {
    if (!this.isHidden) {
      this.UpdateClick();
    }
  }

  public override Draw(deltaTime: number): void {
    if (!this.isHidden) {
      if (this.color) {
        Game.CONTEXT.fillStyle = this.color;
        Game.CONTEXT.fillRect(this.Location.X, this.Location.Y,
          this.Size.X, this.Size.Y);

        Game.CONTEXT.lineWidth = 5;
        Game.CONTEXT.strokeStyle = this.altColor;
        Game.CONTEXT.strokeRect(this.Location.X + 3, this.Location.Y + 3,
          this.Size.X - 6, this.Size.Y - 6);
        Game.CONTEXT.lineWidth = 1;

        if (this.text) {
          Game.CONTEXT.fillStyle = '#000000';
          Game.CONTEXT.font = '24px serif';
          Game.CONTEXT.textAlign = "center";
          Game.CONTEXT.textBaseline = "middle";
          Game.CONTEXT.fillText(this.text, this.location.X + (this.size.X / 2), this.location.Y + (this.size.Y / 2));
        }
      }
      else if (this.sprite) {
        Game.CONTEXT.drawImage(this.sprite, this.location.X, this.location.Y, this.size.X, this.size.Y);
      }
    }
  }

  public SetText(text: string) {
    this.text = text;
  }

  public SetAltColor(color: string) {
    this.altColor = color;
  }

  public SetPrompt(prompt: string) {
    this.prompt = prompt;
  }

  public SetVerifyFunction(verify: (text: string | null) => string | null): void {
    this.verifyFunction = verify;
  }
}