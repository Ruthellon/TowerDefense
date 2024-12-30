import { Rect, Vector2, Vector3 } from "../../Utility/classes.model";
import { IGameObject } from "../gameobject.interface";
import { Game } from 'Utility/game.model'
import { UtilityBase } from "./utilitybase.gameobject";

export class Label extends UtilityBase {
  private text: string | null = null;
  private textAlign = 'center';
  private textBaseLine = 'middle';
  private font = '24px serif';

  public override Load() {
    super.Load();

    if (!this.color) {
      this.color = '#999999';
    }
  }

  public override Update(deltaTime: number): void {
  }

  public override Draw(deltaTime: number): void {
    if (!this.isHidden) {
      if (this.color) {
        if (this.text) {
          Game.CONTEXT.fillStyle = '#000000';
          Game.CONTEXT.font = this.font;
          Game.CONTEXT.textAlign = this.textAlign as CanvasTextAlign;
          Game.CONTEXT.textBaseline = this.textBaseLine as CanvasTextBaseline;
          Game.CONTEXT.fillText(this.text, this.location.X + (this.size.X / 2), this.location.Y + (this.size.Y / 2));
        }
      }
    }
  }

  public SetText(text: string, font?: string, align?: string, baseline?: string) {
    this.text = text;

    if (font)
      this.font = font;

    if (align)
      this.textAlign = align;

    if (baseline)
      this.textBaseLine = baseline;
  }
}
