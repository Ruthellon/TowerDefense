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

  override color = '#999999';
  private altColor = '#ffffff'
  private text = 'PUSH ME';

  private buttonRect = new Rect(0, 0, 0, 0);

  public Update(deltaTime: number): void {
    this.UpdateClick();
  }

  Draw(deltaTime: number): void {
    Game.CONTEXT.fillStyle = this.color;
    Game.CONTEXT.fillRect(this.Location.X, this.Location.Y,
      this.Size.X, this.Size.Y);

    if (this.pressed || this.selected) {
      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = this.altColor;
      Game.CONTEXT.strokeRect(this.Location.X + 3, this.Location.Y + 3,
        this.Size.X - 6, this.Size.Y - 6);
      Game.CONTEXT.lineWidth = 1;
    }


    Game.CONTEXT.fillStyle = '#000000';
    Game.CONTEXT.font = '24px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.textBaseline = "middle";
    Game.CONTEXT.fillText(this.text, this.location.X + (this.size.X / 2), this.location.Y + (this.size.Y / 2));
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
