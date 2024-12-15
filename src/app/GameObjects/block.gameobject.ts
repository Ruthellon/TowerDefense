import { AppComponent } from "../app.component";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { IGameObject } from "./gameobject.interface";

export class Block extends IGameObject {

  speedX: number = 1;
  speedY: number = 1;

  override OnCollision(collision: IGameObject) {
  }

  constructor() {
    super();
  }

  private pointOnPath: number = -1;
  private directionX: number = 0;
  private directionY: number = 0;
  Update(deltaTime: number): void {
    if (this.path.length > 0) {
      let localX = (this.path[this.pointOnPath].X * 64) - this.location.X;
      let localY = (this.path[this.pointOnPath].Y * 64) - this.location.Y;
      if (Math.abs(localX) < 5 && Math.abs(localY) < 5 && this.pointOnPath >= 0) {

        this.pointOnPath--;
        this.directionX = (this.path[this.pointOnPath].X * 64) - this.location.X;
        this.directionY = (this.path[this.pointOnPath].Y * 64) - this.location.Y;
      }

      this.location.X += (this.speedX * deltaTime) * this.directionX;
      this.location.Y += (this.speedY * deltaTime) * this.directionY;

      
    }
  }

  Draw(deltaTime: number): void {
    if (this.Color)
      Game.CONTEXT.fillStyle = this.Color;

    Game.CONTEXT.fillRect(this.location.X, this.location.Y, this.Size.X, this.Size.Y);
  }

  private path: Vector2[] = [];
  public SetPath(path: Vector2[]) {
    if (path.length === 0)
      return;

    if (path.length === this.path.length) {
      let same: boolean = true;
      for (let i = 0; i < path.length; i++) {
        same = same && path[i].isEqual(this.path[i]);
      }

      if (same)
        return;
    }

    this.path = path;

    if (this.pointOnPath === -1)
      this.pointOnPath = path.length - 1;


    this.directionX = (this.path[this.pointOnPath].X * 64) - this.location.X;
    this.directionY = (this.path[this.pointOnPath].Y * 64) - this.location.Y;
  }
}
