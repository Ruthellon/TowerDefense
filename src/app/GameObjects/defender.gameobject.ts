import { Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { Base } from "./base.gameobject";

export abstract class Defender extends Base {
  public abstract get Cost(): number | null;
  public abstract get CanUpgrade(): boolean;
  public abstract get Level(): number;
  public abstract get Range(): number;
  public abstract get Damage(): number;
  public abstract get ShootingCooldown(): number;
  public abstract get CanShootGround(): boolean;
  public abstract get CanShootAerial(): boolean;
  public abstract get Name(): string;

  public get DPS(): number {
    return this.Damage / this.ShootingCooldown;
  }

  protected enemyInRange: Attacker | null = null;
  protected get EnemyInRange(): Attacker | null {
    return this.enemyInRange;
  }

  public Upgrade(): void {
    return;
  }

  public override Update(deltaTime: number) {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer -= deltaTime;
    }

    if (this.EnemyInRange && this.Range) {
      if (this.cooldownTimer <= 0) {
        this.EnemyInRange.ReduceHealth(this.Damage);

        this.cooldownTimer = this.ShootingCooldown;
      }

      let distance = Math.floor(this.CenterMassLocation.distanceTo(new Vector3(
        Math.max(this.EnemyInRange.Location.X, Math.min(this.CenterMassLocation.X, this.EnemyInRange.Location.X + this.EnemyInRange.Size.X)),
        Math.max(this.EnemyInRange.Location.Y, Math.min(this.CenterMassLocation.Y, this.EnemyInRange.Location.Y + this.EnemyInRange.Size.Y)),
        this.EnemyInRange.Location.Z)));

      if (distance > this.Range || this.EnemyInRange.Health <= 0) {
        this.enemyInRange = null;
      }
    }

    this.UpdateClick();
  }

  public override Draw(deltaTime: number) {
    if (this.Selected) {
      Game.CONTEXT.lineWidth = 4;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect(this.Location.X + 2, this.Location.Y + 2,
        this.Size.X - 4, this.Size.Y - 4);
    }
  }

  public FindTarget(enemies: Attacker[]) {
    if (!this.enemyInRange && this.Range) {
      for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        if ((!this.CanShootGround && !enemy.CanFly) || (!this.CanShootAerial && enemy.CanFly))
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

  protected altColor: string | undefined;
  private cooldownTimer: number = 0;
}
