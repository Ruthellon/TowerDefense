import { Game } from "../Utility/game.model";
import { Defender } from "./defender.gameobject";
import { IGameObject } from "./gameobject.interface";

export class Turret extends Defender {
  private upgradeCost = 5;
  public get UpgradeCost(): number {
    return this.upgradeCost;
  }
  private canUpgrade = true;
  public get CanUpgrade(): boolean {
    return this.canUpgrade;
  }
  private level = 1;
  public get Level(): number {
    return this.level;
  }
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
    super.Load();
    this.SetDamage(3);
  }

  public override OnCollision(collision: IGameObject): void {
  }

  public override Upgrade() {
    if (this.level === 1) {
      this.level = 2;
      this.color = '#22dd22';
      this.range = 175;
      this.damage = 4;
      this.shootingCooldown = .9;
      this.upgradeCost = 10;
    }
    else if (this.level === 2) {
      this.level = 3;
      this.color = '#2222dd';
      this.range = 200;
      this.damage = 5;
      this.shootingCooldown = .8;
      this.upgradeCost = 15;
    }
    else if (this.level === 3) {
      this.level = 4;
      this.color = '#dd22dd';
      this.range = 225;
      this.damage = 6;
      this.shootingCooldown = .7;
      this.upgradeCost = 25;
    }
    else if (this.level === 4) {
      this.level = 5;
      this.canUpgrade = false;
      this.color = '#dddd22';
      this.range = 250;
      this.damage = 10;
      this.shootingCooldown = .4;
    }
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
