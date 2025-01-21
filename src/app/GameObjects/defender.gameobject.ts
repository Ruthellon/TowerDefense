import { Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { Base } from "./base.gameobject";

export abstract class Defender extends Base {
  public abstract get Cost(): number | null;
  public abstract get CanUpgrade(): boolean;
  public abstract get Level(): number;
  public abstract get Range(): number;
  public abstract get ShootingCooldown(): number;
  public abstract get CanShootGround(): boolean;
  public abstract get CanShootAerial(): boolean;
  public abstract get Name(): string;
  public abstract get Description(): string;
  public abstract get UpgradeDescription(): string;
  public abstract get IsPlasmaWeapon(): boolean;

  protected abstract get TimeToUpgrade(): number;

  protected damage: number = 0;
  public get Damage(): number {
    return this.damage;
  }

  public get DPS(): number {
    return this.Damage / this.ShootingCooldown;
  }

  protected enemyInRange: Attacker | null = null;
  protected get EnemyInRange(): Attacker | null {
    return this.enemyInRange;
  }

  private kills: number = 0;
  public get Kills(): number {
    return this.kills;
  }

  private previousFillColor = '';
  private upgradeCoundownStart = 0;
  private upgradeCountdown = 0;
  private isUpgrading = false;
  public Upgrade(levelStarted: boolean): void {
    this.isUpgrading = true;

    if (levelStarted) {
      this.upgradeCoundownStart = this.TimeToUpgrade;
      this.upgradeCountdown = this.TimeToUpgrade;
      this.previousFillColor = this.altColor!;
    }

    return;
  }

  public override Update(deltaTime: number) {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer -= deltaTime;
    }

    if (this.isUpgrading) {
      this.upgradeCountdown -= deltaTime;

      if (this.upgradeCountdown <= 0) {
        this.enemyInRange = null;
        this.isUpgrading = false;
      }
    }
    else if (this.EnemyInRange != null) {
      if (this.cooldownTimer <= 0) {
        if (this.FireWeapon(this.EnemyInRange)) {
          this.kills++;
          this.enemyInRange = null;
        }

        this.cooldownTimer = this.ShootingCooldown;
      }

      if (this.EnemyInRange != null) {
        if (this.IsPlasmaWeapon && !this.EnemyInRange.HasShield)
          this.enemyInRange = null;
        else {
          let distance = Math.floor(this.CenterMassLocation.distanceTo(new Vector3(
            Math.max(this.EnemyInRange.Location.X, Math.min(this.CenterMassLocation.X, this.EnemyInRange.Location.X + this.EnemyInRange.Size.X)),
            Math.max(this.EnemyInRange.Location.Y, Math.min(this.CenterMassLocation.Y, this.EnemyInRange.Location.Y + this.EnemyInRange.Size.Y)),
            this.EnemyInRange.Location.Z)));

          if (distance > this.Range || this.EnemyInRange.Health <= 0) {
            this.enemyInRange = null;
          }
        }
      }
    }

    this.UpdateClick();
  }

  public override Draw(deltaTime: number) {
    Game.CONTEXT.fillStyle = '#000000';
    Game.CONTEXT.fillRect(this.location.X, this.location.Y,
      this.Size.X, this.Size.Y);

    Game.CONTEXT.fillStyle = this.Color!;

    let percentFilled = (1.0 - (this.cooldownTimer / this.ShootingCooldown));
    Game.CONTEXT.fillRect(this.location.X, (this.location.Y + (this.Size.Y - (this.Size.Y * percentFilled))), this.Size.X, this.Size.Y * percentFilled);
    
    const centerX = this.CenterMassLocation.X;
    const centerY = this.CenterMassLocation.Y;
    let radius = this.size.X / 3;

    if (this.isUpgrading) {
      Game.CONTEXT.beginPath();
      Game.CONTEXT.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      Game.CONTEXT.fillStyle = this.previousFillColor!;
      Game.CONTEXT.fill();

      let startAngle = Math.PI;
      let endAngle = 2 * Math.PI;
      let progress = 1 - (this.upgradeCountdown / this.upgradeCoundownStart);

      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(centerX, centerY); // Move to the center
      const currentEndAngle = startAngle + (progress * endAngle);
      Game.CONTEXT.arc(centerX, centerY, radius, startAngle, currentEndAngle);
      Game.CONTEXT.closePath();
      Game.CONTEXT.fillStyle = this.altColor!;
      Game.CONTEXT.fill();
    }
    else {
      Game.CONTEXT.beginPath();
      Game.CONTEXT.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      Game.CONTEXT.fillStyle = this.altColor!;
      Game.CONTEXT.fill();
    }

    if (this.Selected) {
      if (this.Range > 0) {
        radius = this.Range;

        // Draw the circle
        Game.CONTEXT.beginPath();
        Game.CONTEXT.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        Game.CONTEXT.strokeStyle = '#00ff00';
        Game.CONTEXT.lineWidth = 2;
        Game.CONTEXT.stroke();
      }

      Game.CONTEXT.lineWidth = 4;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect(this.Location.X + 2, this.Location.Y + 2,
        this.Size.X - 4, this.Size.Y - 4);
    }
  }

  public FindTarget(enemies: Attacker[]) {
    if (this.EnemyInRange === null && this.Range && enemies.length > 0) {
      let bestChoice: Attacker | undefined;
      for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        if ((!this.CanShootGround && !enemy.CanFly) || (!this.CanShootAerial && enemy.CanFly))
          continue;

        let distance = Math.floor(this.CenterMassLocation.distanceTo(new Vector3(
          Math.max(enemy.Location.X, Math.min(this.CenterMassLocation.X, enemy.Location.X + enemy.Size.X)),
          Math.max(enemy.Location.Y, Math.min(this.CenterMassLocation.Y, enemy.Location.Y + enemy.Size.Y)),
          enemy.Location.Z)));

        if (distance <= this.Range) {
          if (this.IsPlasmaWeapon && enemy.HasShield) {
            bestChoice = enemy;
            break;
          }

          if (!this.IsPlasmaWeapon && !enemy.HasShield) {
            bestChoice = enemy;
            break;
          }

          if (!bestChoice)
            bestChoice = enemy;
        }
      }

      if (bestChoice)
        this.enemyInRange = bestChoice;
    }
  }

  public SetDamage(damage: number) {
    this.damage = damage;
  }

  protected FireWeapon(enemy: Attacker): boolean {
    return enemy.ReduceHealth(this.Damage, this.IsPlasmaWeapon);
  }

  protected altColor: string | undefined;
  private cooldownTimer: number = 0;
}
