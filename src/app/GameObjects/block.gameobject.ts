import { AppComponent } from "../app.component";
import { Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { IGameObject } from "./gameobject.interface";

export class Block extends IGameObject {

  speedX: number = 10;
  speedY: number = 10;
  directionX: number;
  directionY: number;

  override OnCollision(collision: IGameObject) {
    this.directionX *= -1;
    this.directionY *= -1;
  }

  constructor() {
    super();
    this.directionX = Math.random() * 10;
    this.directionY = Math.random() * 10;
  }

  Update(deltaTime: number): void {
    this.location.X += (this.speedX * deltaTime) * this.directionX;
    this.location.Y += (this.speedY * deltaTime) * this.directionY;

    if (this.location.X > (Game.CANVAS_WIDTH - this.size.X)) {
      this.directionX = -(Math.random() * 10);
      this.location.X = (Game.CANVAS_WIDTH - this.size.X);
    }
    else if (this.location.X < 0) {
      this.directionX = (Math.random() * 10);
      this.location.X = 0;
    }

    if (this.location.Y > (Game.CANVAS_HEIGHT - this.size.Y)) {
      this.directionY = -(Math.random() * 10);
      this.location.Y = (Game.CANVAS_HEIGHT - this.size.Y);
    }
    else if (this.location.Y < 0) {
      this.directionY = (Math.random() * 10);
      this.location.Y = 0;
    }
  }

  Draw(deltaTime: number): void {
    if (this.Color)
      Game.CONTEXT.fillStyle = this.Color;

    Game.CONTEXT.fillRect(this.location.X, this.location.Y, this.Size.X, this.Size.Y);
  }
}
