import { Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { Base } from "./base.gameobject";

export abstract class Defender extends Base {
  public abstract get Cost(): number | null;
  public abstract get CanUpgrade(): boolean;
  public abstract get Level(): number;
  public abstract get ShootingCooldown(): number;
  public abstract FindTarget(enemies: Attacker[]): void;


  protected range: number | null = null;
  public get Range(): number | null {
    return this.range;
  }

  public Upgrade(): void {

  }

  protected damage: number = 0;
  public get Damage(): number {
    return this.damage;
  }

  protected enemyInRange: Attacker | null = null;
  protected get EnemyInRange(): Attacker | null {
    return this.enemyInRange;
  }
  protected cooldown: number = 0;

  ///////
  //
  // FOR FUTURE USE
  // When allowing obstacle adding DURING the match
  //
  ///////
  //UpdatePath(grid: number[][], gridSize:number, dest: Vector2): boolean {
  //  let startingCell = new Vector2(this.location.X / gridSize, this.location.Y / gridSize)
  //  let tempPath = PathFinder.AStarSearch(grid, startingCell, dest);

  //  if (tempPath.length > 0)
  //    return true;

  //  return false;
  //}
  public override Update(deltaTime: number) {
    if (this.cooldown > 0) {
      this.cooldown -= deltaTime;
    }

    if (this.EnemyInRange && this.Range) {
      if (this.cooldown <= 0) {
        this.EnemyInRange.ReduceHealth(this.Damage);

        this.cooldown = this.ShootingCooldown;
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
      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect(this.Location.X, this.Location.Y,
        this.Size.X, this.Size.Y);
    }
  }

  //public FindTarget(enemies: Attacker[]) {
  //  if (!this.enemyInRange && this.Range) {
  //    for (let i = 0; i < enemies.length; i++) {
  //      let enemy = enemies[i];
  //      let distance = Math.floor(this.CenterMassLocation.distanceTo(new Vector3(
  //        Math.max(enemy.Location.X, Math.min(this.CenterMassLocation.X, enemy.Location.X + enemy.Size.X)),
  //        Math.max(enemy.Location.Y, Math.min(this.CenterMassLocation.Y, enemy.Location.Y + enemy.Size.Y)),
  //        enemy.Location.Z)));

  //      if (distance <= this.Range) {
  //        this.enemyInRange = enemies[i];
  //        break;
  //      }
  //    }
  //  }
  //}

  public SetDamage(damage: number): void {
    this.damage = damage;
  }

  public SetRange(range: number): void {
    this.range = range;
  }
}
