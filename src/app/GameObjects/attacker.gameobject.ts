import { Vector2 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Base } from "./base.gameobject";

export abstract class Attacker extends Base {

  protected directionX: number = 0;
  protected directionY: number = 0;

  protected value: number = 0;
  public override get Value(): number | null {
    return this.value;
  }

  private startingHealth: number = 0;
  protected health: number = 0;
  public get Health(): number {
    return this.health;
  }
  protected speed: number = 0;
  public get Speed(): number {
    return this.speed;
  }

  public override Update(deltaTime: number) {
    if (this.path.length === 0)
      return;

    if (this.target === null)
      return;

    let distanceTo = this.target.distanceTo(new Vector2(this.location.X, this.location.Y));

    if (distanceTo <= 1 || distanceTo > 1000) {
      this.pointOnPath++;

      if (this.pointOnPath < this.path.length) {
        this.target = new Vector2(this.path[this.pointOnPath].X + (this.gridSize / 2) - (this.Size.X / 2),
          this.path[this.pointOnPath].Y + (this.gridSize / 2) - (this.Size.Y / 2));

        this.directionX = this.target.X - this.location.X;
        this.directionY = this.target.Y - this.location.Y;
      }
    }

    this.location.X += (this.speed * deltaTime) * this.directionX;
    this.location.Y += (this.speed * deltaTime) * this.directionY;
  }

  public Draw(deltaTime: number): void {
    Game.CONTEXT.fillStyle = '#000000';
    Game.CONTEXT.fillRect(this.location.X, this.location.Y, this.Size.X, this.Size.Y);
    if (this.Color) {
      Game.CONTEXT.strokeStyle = this.Color;
      Game.CONTEXT.fillStyle = this.Color;
    }
    let percentFilled = (this.health / this.startingHealth);

    Game.CONTEXT.strokeRect(this.location.X, this.location.Y, this.Size.X, this.Size.Y);
    Game.CONTEXT.fillRect(this.location.X, (this.location.Y + (this.Size.Y - (this.Size.Y * percentFilled))), this.Size.X, this.Size.Y * percentFilled);
  }

  public SetStartingHealth(health: number): void {
    this.startingHealth = health;
    this.health = health;
  }

  public SetStartingSpeed(speed: number): void {
    this.speed = (speed / 10);
  }

  public SetDamage(damage: number): void {
    this.health -= damage;
  }

  public SetValue(val: number): void {
    this.value = val;
  }

  protected gridSize: number = 0;
  protected pointOnPath: number = 0;
  protected path: Vector2[] = [];
  protected target: Vector2 = new Vector2(0, 0);
  public SetPath(path: Vector2[], gridSize: number) {
    this.path = path;
    this.gridSize = gridSize;

    this.target = new Vector2(this.path[this.pointOnPath].X + (gridSize / 2) - (this.Size.X / 2),
      this.path[this.pointOnPath].Y + (gridSize / 2) - (this.Size.Y / 2));

    this.directionX = this.target.X - this.location.X;
    this.directionY = this.target.Y - this.location.Y;
  }
}
