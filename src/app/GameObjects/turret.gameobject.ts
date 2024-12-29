import { Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { Defender } from "./defender.gameobject";
import { IGameObject } from "./gameobject.interface";

export class Turret extends Defender {
  protected override location = new Vector3(0, 0, 2);
  private canUpgrade = true;
  public get CanUpgrade(): boolean {
    return this.canUpgrade;
  }
  private level = 1;
  public get Level(): number {
    return this.level;
  }
  private cost: number | null = 10;
  public override get Cost(): number | null {
    return this.cost;
  }
  private shootingCooldown = 1;
  public override get ShootingCooldown(): number {
    return this.shootingCooldown;
  }
  private value: number | null = 10;
  public override get Value(): number | null {
    return this.value;
  }
  private surfaceToAir: boolean = false;
  public get IsSurfaceToAir(): boolean {
    return this.surfaceToAir;
  }

  public override Load(): void {
    super.Load();
    this.SetDamage(3);

    if (this.range === null)
      this.SetRange(150);
  }

  public override OnCollision(collision: IGameObject): void {
  }

  public override Upgrade() {
    if (this.level === 1) {
      this.level = 2;
      this.color = '#22dd22';
      this.range! *= 1.15;
      this.damage = 4;
      this.shootingCooldown = .9;
      this.cost = 10;
      this.value = 20;
    }
    else if (this.level === 2) {
      this.level = 3;
      this.color = '#2222dd';
      this.range! *= 1.15;
      this.damage = 5;
      this.shootingCooldown = .8;
      this.cost = 10;
      this.value = 30;
    }
    else if (this.level === 3) {
      this.level = 4;
      this.color = '#dd22dd';
      this.range! *= 1.15;
      this.damage = 6;
      this.shootingCooldown = .7;
      this.cost = 20;
      this.value = 40;
    }
    else if (this.level === 4) {
      this.level = 5;
      this.canUpgrade = false;
      this.color = '#dddd22';
      this.range! *= 1.15;
      this.damage = 8;
      this.shootingCooldown = .5;
      this.cost = null;
      this.value = 60;
    }
  }

  override color = '#888888';

  public override Update(deltaTime: number): void {
    super.Update(deltaTime);
  }

  public override Draw(deltaTime: number): void {
    Game.CONTEXT.fillStyle = this.color;
    Game.CONTEXT.fillRect(this.location.X, this.location.Y,
      this.Size.X, this.Size.Y);


    const centerX = this.CenterMassLocation.X;
    const centerY = this.CenterMassLocation.Y;
    const radius = this.range!;
    const strokeColor = '#00ff00';
    const lineWidth = 2;

    // Draw the circle
    Game.CONTEXT.beginPath();
    Game.CONTEXT.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    Game.CONTEXT.strokeStyle = strokeColor;
    Game.CONTEXT.lineWidth = lineWidth;
    Game.CONTEXT.stroke();

    super.Draw(deltaTime);
  }

  public FindTarget(enemies: Attacker[]) {
    if (!this.enemyInRange && this.Range) {
      for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        if ((this.IsSurfaceToAir && !enemy.CanFly) || (!this.IsSurfaceToAir && enemy.CanFly))
          continue;

        let distance = Math.floor(this.CenterMassLocation.distanceTo(new Vector3(
          Math.max(enemy.Location.X, Math.min(this.CenterMassLocation.X, enemy.Location.X + enemy.Size.X)),
          Math.max(enemy.Location.Y, Math.min(this.CenterMassLocation.Y, enemy.Location.Y + enemy.Size.Y)),
          enemy.Location.Z)));

        if (distance <= this.Range) {
          this.enemyInRange = enemies[i];
          break;
        }
      }
    }
  }

  public SetCost(cost: number) {
    this.cost = cost;
  }

  public SetIsSurfaceToAir(sam: boolean) {
    this.surfaceToAir = sam;
  }
}
