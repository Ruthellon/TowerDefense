import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Base } from "./base.gameobject";
import { IGameObject } from "./gameobject.interface";


export class Button extends Base {
  public override OnCollision(collision: IGameObject): void {
  }
  public override get Value(): number | null {
    return null;
  }
  private id = -1;
  public get Id(): number {
    return this.id;
  }

  private altColor = '#ffffff'

  private text: string | null = null;

  private buttonRect = new Rect(0, 0, 0, 0);

  public override Load() {
    super.Load();

    if (!this.imageLocation && !this.color)
      this.color = '#999999';
  }

  public override Update(deltaTime: number): void {
    this.UpdateClick();
  }

  public override Draw(deltaTime: number): void {
    if (this.color) {
      Game.CONTEXT.fillStyle = this.color;
      Game.CONTEXT.fillRect(this.Location.X, this.Location.Y,
        this.Size.X, this.Size.Y);

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

    if (this.pressed || this.selected) {
      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = this.altColor;
      Game.CONTEXT.strokeRect(this.Location.X + 3, this.Location.Y + 3,
        this.Size.X - 6, this.Size.Y - 6);
      Game.CONTEXT.lineWidth = 1;
    }
  }

  public SetText(text: string) {
    this.text = text;
  }

  public SetId(id: number) {
    this.id = id;
  }

  public SetAltColor(color: string) {
    this.altColor = color;
  }
}
