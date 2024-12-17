import { Game } from "../Utility/game.model";
import { IGameObject } from "./gameobject.interface";

export class Turret extends IGameObject {
  override canShoot = true;
  override damage = 5;
  override range = 150;
  override shootingCooldown = 1;
  override cost = 10;
  override color = '#888888';

  override Update(deltaTime: number): void {
    super.Update(deltaTime);
  }

  Draw(deltaTime: number): void {
    Game.CONTEXT.fillStyle = this.color;
    Game.CONTEXT.fillRect(this.location.X, this.location.Y,
      this.Size.X, this.Size.Y);


    const centerX = this.CenterMassLocation.X;
    const centerY = this.CenterMassLocation.Y;
    const radius = this.range;
    const strokeColor = '#00ff00';
    const lineWidth = 2;

    // Draw the circle
    Game.CONTEXT.beginPath();
    Game.CONTEXT.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    Game.CONTEXT.strokeStyle = strokeColor;
    Game.CONTEXT.lineWidth = lineWidth;
    Game.CONTEXT.stroke();
  }
}
