import { Attacker } from "./attacker.gameobject";
import { Base } from "./base.gameobject";

export abstract class Defender extends Base {
  public abstract get Cost(): number | null;
  public abstract get CanUpgrade(): boolean;
  public abstract get UpgradeCost(): number;
  public abstract get ShootingCooldown(): number;
  public abstract get Range(): number;

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
  public Update(deltaTime: number) {
    if (this.EnemyInRange) {
      if (this.cooldown <= 0) {
        this.EnemyInRange.SetDamage(this.Damage);

        this.cooldown = this.ShootingCooldown;
      }
      else if (this.cooldown > 0) {
        this.cooldown -= deltaTime;
      }

      let distance = Math.floor(this.EnemyInRange.Location.distanceTo(this.CenterMassLocation));

      if (distance > this.Range || this.EnemyInRange.Health <= 0) {
        this.enemyInRange = null;
      }
    }

    this.CheckIfClicked();
  }

  public FindTarget(enemies: Attacker[]) {
    if (!this.enemyInRange) {
      for (let i = 0; i < enemies.length; i++) {
        let distance = Math.floor(enemies[i].CenterMassLocation.distanceTo(this.CenterMassLocation));
        if (distance <= this.Range) {
          this.enemyInRange = enemies[i];
          break;
        }
      }
    }
  }

  public SetDamage(damage: number): void {
    this.damage = damage;
  }
}
