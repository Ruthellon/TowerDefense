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

  protected damage: number = 0;
  public get Damage(): number {
    return this.damage;
  }

  private startingHealth: number = 0;
  protected health: number = 0;
  public get Health(): number {
    return this.health;
  }
  protected speed: number = 1;
  public get Speed(): number {
    return this.speed;
  }

  private reachedEnd = false;
  public get ReachedEnd(): boolean {
    return this.reachedEnd;
  }

  private canFly = false;
  public get CanFly(): boolean {
    return this.canFly;
  }

  private distanceLeftX = 0;
  private distanceLeftY = 0;
  public override Update(deltaTime: number) {
    if (this.path.length === 0)
      return;

    if (this.target === null)
      return;

    let distanceTo = this.target.distanceTo(new Vector2(this.CenterMassLocation.X, this.CenterMassLocation.Y));

    if (distanceTo <= 5) {
      this.pointOnPath++;

      if (this.pointOnPath < this.path.length) {
        this.target = new Vector2(this.path[this.pointOnPath].X + (this.gridSize / 2),
          this.path[this.pointOnPath].Y + (this.gridSize / 2));
      }
      else {
        this.reachedEnd = true;
      }
    }

    let result = this.MoveTo(deltaTime);
    //console.log(result);

    this.location.X = result.X;
    this.location.Y = result.Y;
  }

  public override Draw(deltaTime: number): void {
    Game.CONTEXT.fillStyle = '#000000';
    Game.CONTEXT.fillRect(this.location.X, this.location.Y, this.Size.X, this.Size.Y);
    if (this.Color) {
      Game.CONTEXT.strokeStyle = '#000000';
      Game.CONTEXT.fillStyle = this.Color;
    }
    let percentFilled = (this.health / this.startingHealth);

    Game.CONTEXT.lineWidth = 4;
    Game.CONTEXT.strokeRect(this.location.X, this.location.Y, this.Size.X, this.Size.Y);
    Game.CONTEXT.fillRect(this.location.X, (this.location.Y + (this.Size.Y - (this.Size.Y * percentFilled))), this.Size.X, this.Size.Y * percentFilled);
    Game.CONTEXT.lineWidth = 1;
  }

  public ReduceHealth(reduceBy: number): void {
    this.health -= reduceBy;
  }

  public SetStartingHealth(health: number): void {
    this.startingHealth = health;
    this.health = health;
  }

  public SetStartingSpeed(speed: number): void {
    this.speed = (speed * 10);
  }

  public SetDamage(damage: number): void {
    this.damage = damage;
  }

  public SetValue(val: number): void {
    this.value = val;
  }

  public SetCanFly(canFly: boolean): void {
    this.canFly = canFly;
  }

  protected gridSize: number = 0;
  protected pointOnPath: number = 0;
  protected path: Vector2[] = [];
  protected target: Vector2 = new Vector2(0, 0);
  public SetPath(path: Vector2[] | null, gridSize: number) {
    if (path) {
      this.path = path;
      this.gridSize = gridSize;

      this.target = new Vector2(this.path[this.pointOnPath].X + (gridSize / 2),
        this.path[this.pointOnPath].Y + (gridSize / 2));

      if (this.CanFly) {
        this.pointOnPath = this.path.length - 2;
      }
    }
    else {
      throw new Error("Error");
    }
  }

  protected MoveTo(deltaTime: number): Vector2 {
    // Calculate the direction vector from current to destination
    const directionX = this.target.X - this.CenterMassLocation.X;
    const directionY = this.target.Y - this.CenterMassLocation.Y;

    // Calculate the distance to the destination
    const distance = Math.sqrt(directionX ** 2 + directionY ** 2);

    // If the distance is small enough, snap to the destination
    if (distance < this.Speed * deltaTime) {
      return new Vector2(this.target.X - (this.Size.X / 2), this.target.Y - (this.Size.Y / 2));
    }

    // Normalize the direction vector
    const normalizedX = directionX / distance;
    const normalizedY = directionY / distance;

    // Calculate the movement based on speed and deltaTime
    const moveX = normalizedX * this.Speed * deltaTime;
    const moveY = normalizedY * this.Speed * deltaTime;

    // Update the current position
    return new Vector2(this.Location.X + moveX, this.Location.Y + moveY);
  }
}
