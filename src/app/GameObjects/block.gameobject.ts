import { AppComponent } from "../app.component";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { IGameObject } from "./gameobject.interface";

export class Block extends Attacker {
  public override get Value(): number | null {
    return 1;
  }
  public OnCollision(collision: IGameObject): void {
  }
  override health = 60;

  speedX: number = 1;
  speedY: number = 1;

  override color: string = '#00ff00';

  private startingHealth = 0;

  private gridSize: number = 0;
  private pointOnPath: number = 0;
  private directionX: number = 0;
  private directionY: number = 0;
  private target: Vector2 | null = null;
  override Update(deltaTime: number): void {
    if (this.path.length === 0)
      return;

    if (this.target === null)
      return;

    let distanceTo = this.target.distanceTo(new Vector2(this.location.X, this.location.Y));

    if (distanceTo <= 1) {
      this.pointOnPath++;

      if (this.pointOnPath < this.path.length) {
        this.target = new Vector2(this.path[this.pointOnPath].X + (this.gridSize / 2) - (this.Size.X / 2),
          this.path[this.pointOnPath].Y + (this.gridSize / 2) - (this.Size.Y / 2));

        this.directionX = this.target.X - this.location.X;
        this.directionY = this.target.Y - this.location.Y;
      }
    }

    this.location.X += (this.speedX * deltaTime) * this.directionX;
    this.location.Y += (this.speedY * deltaTime) * this.directionY;
  }

  Draw(deltaTime: number): void {
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

  override Load(): void {
    this.startingHealth = this.health;
  }

  override SetDamage(damage: number) {
    super.SetDamage(damage);
  }

  private path: Vector2[] = [];
  public SetPath(path: Vector2[], gridSize: number) {
    this.path = path;
    this.gridSize = gridSize;
    this.pointOnPath = 0;

    this.target = new Vector2(this.path[this.pointOnPath].X + (gridSize / 2) - (this.Size.X / 2),
      this.path[this.pointOnPath].Y + (gridSize / 2) - (this.Size.Y / 2));

    this.directionX = this.target.X - this.location.X;
    this.directionY = this.target.Y - this.location.Y;
  }
}
