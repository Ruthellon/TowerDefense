import { AppComponent } from "../app.component";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { IGameObject } from "./gameobject.interface";

export class Block extends IGameObject {

  speedX: number = 1;
  speedY: number = 1;

  override color: string = '#00ff00';

  override OnCollision(collision: IGameObject) {
  }

  constructor() {
    super();
  }

  private gridSize: number = 0;
  private pointOnPath: number = 0;
  private directionX: number = 0;
  private directionY: number = 0;
  private target: Vector2 | null = null;
  Update(deltaTime: number): void {
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
    if (this.Color)
      Game.CONTEXT.fillStyle = this.Color;

    Game.CONTEXT.fillRect(this.location.X, this.location.Y, this.Size.X, this.Size.Y);
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
