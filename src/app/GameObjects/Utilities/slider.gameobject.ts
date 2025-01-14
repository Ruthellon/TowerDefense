import { Rect, Vector2, Vector3 } from "Utility/classes.model";
import { Game } from "Utility/game.model";
import { UtilityBase } from "./utilitybase.gameobject";


export class Slider extends UtilityBase {
  public get Value(): number {
    return this.currentValue;
  }

  public override Load() {
    super.Load();

    this.objectRect = new Rect((this.ObjectRect.X - (this.size.Y / 1.5)),
      this.ObjectRect.Y,
      this.ObjectRect.Width + ((this.size.Y * 2) / 1.5),
      this.ObjectRect.Height);
    
    if (!this.imageLocation && !this.color)
      this.color = '#999999';

    this.circleX = this.location.X + (this.size.X * ((this.currentValue - this.minValue) / this.range));
  }

  public override Update(deltaTime: number): void {
    this.UpdateClick();

    if (this.pressed) {
      this.SetValue(Math.floor((Game.MOUSE_LOCATION.X - this.location.X) / this.chunks) + this.minValue);
      this.circleX = this.location.X + (this.size.X * ((this.currentValue - this.minValue) / this.range));

      if (Number.isNaN(this.circleX))
        this.circleX = this.location.X;
    }
  }

  public override Draw(deltaTime: number): void {
    if (this.color) {
      Game.CONTEXT.fillStyle = this.color;
      Game.CONTEXT.fillRect(this.Location.X, this.Location.Y,
        this.Size.X, this.Size.Y);


      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '18px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.textBaseline = "middle";

      if (this.text)
        Game.CONTEXT.fillText(this.text, this.Location.X + (this.Size.X / 2), this.Location.Y + (this.Size.Y / 2));

      Game.CONTEXT.beginPath();
      Game.CONTEXT.arc(this.circleX, this.location.Y + (this.size.Y / 2), this.size.Y / 1.5, 0, 2 * Math.PI);
      Game.CONTEXT.strokeStyle = this.pressed ? '#ffffff' : '#111111';
      Game.CONTEXT.lineWidth = 2;
      Game.CONTEXT.stroke();

      Game.CONTEXT.beginPath();
      Game.CONTEXT.arc(this.circleX, this.location.Y + (this.size.Y / 2), this.size.Y / 1.5, 0, 2 * Math.PI);
      Game.CONTEXT.fillStyle = '#999999'; // Set fill color
      Game.CONTEXT.fill(); // Fill the circle

      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '14px serif';
      Game.CONTEXT.fillText(this.Value.toFixed(0), this.circleX, this.location.Y + (this.size.Y / 2));
    }
    else if (this.sprite) {
      Game.CONTEXT.drawImage(this.sprite, this.location.X, this.location.Y, this.size.X, this.size.Y);
    }

    //if (this.pressed || this.selected) {
    //  Game.CONTEXT.lineWidth = 5;
    //  Game.CONTEXT.strokeStyle = this.altColor;
    //  Game.CONTEXT.strokeRect(this.Location.X + 3, this.Location.Y + 3,
    //    this.Size.X - 6, this.Size.Y - 6);
    //  Game.CONTEXT.lineWidth = 1;
    //}
  }

  public SetValueRange(min: number, max: number) {
    this.minValue = min;
    this.maxValue = max;
    this.range = max - min;
    this.chunks = (this.size.X / this.range);
  }

  public SetValue(val: number) {
    this.currentValue = val;

    if (this.currentValue < this.minValue)
      this.currentValue = this.minValue
    else if (this.currentValue > this.maxValue)
      this.currentValue = this.maxValue;

    this.circleX = this.location.X + (this.size.X * ((this.currentValue - this.minValue) / this.range));

    if (Number.isNaN(this.circleX))
      this.circleX = this.location.X;
  }

  public SetText(text: string) {
    this.text = text;
  }

  private text: string | undefined;
  private buttonRect = new Rect(0, 0, 0, 0);
  private minValue = 0;
  private maxValue = 100;
  private range = 100;
  private chunks = 100;
  private currentValue = 50;
  private circleX = 0;
}
