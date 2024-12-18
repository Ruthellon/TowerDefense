import { Game } from "../Utility/game.model";
import { Defender } from "./defender.gameobject";
import { IGameObject } from "./gameobject.interface";

export class Turret extends Defender {
  private cost = 10;
  public override get Cost(): number | null {
    return this.cost;
  }
  private shootingCooldown = 1;
  public override get ShootingCooldown(): number {
    return this.shootingCooldown;
  }
  private range = 150;
  public override get Range(): number {
    return this.range;
  }
  public override get Value(): number | null {
    return null;
  }
  public override Load(): void {
    this.SetDamage(3);
  }

  public override OnCollision(collision: IGameObject): void {
  }

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
