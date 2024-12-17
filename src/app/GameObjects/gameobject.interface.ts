import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { PathFinder } from "../Utility/pathfinding.service";

export abstract class IGameObject {
  protected cost: number | null = null;
  public get Cost(): number | null {
    return this.cost;
  }
  protected value: number | null = null;
  public get Value(): number | null {
    return this.value;
  }
  protected canShoot: boolean = false;
  public get CanShoot(): boolean {
    return this.canShoot;
  }
  protected shootingCooldown: number = 0;
  protected get ShootingCooldown(): number {
    return this.shootingCooldown;
  }
  protected damage: number = 0;
  public get Damage(): number {
    return this.damage;
  }
  protected range: number = 0;
  public get Range(): number {
    return this.range;
  }
  protected health: number = 0;
  public get Health(): number {
    return this.health;
  }
  protected isEnemy: boolean = false;
  public get IsEnemy(): boolean {
    return this.isEnemy;
  }

  protected enemyInRange: IGameObject | null = null;
  protected get EnemyInRange(): IGameObject | null {
    return this.enemyInRange;
  }

  protected color: string | null = null;
  protected imageLocation: string | null = null;
  protected location: Vector3 = new Vector3(0, 0, 0);
  protected size: Vector2 = new Vector2(0, 0);
  protected collisionBox: Vector2 | null = null;


  get Location(): Vector3 {
    return this.location;
  }
  get CenterMassLocation(): Vector3 {
    return new Vector3(this.location.X + (this.size.X / 2), this.location.Y + (this.size.Y / 2), this.location.Z);
  }
  get Color(): string | null {
    return this.color;
  }
  get Image(): string | null {
    return this.imageLocation;
  }
  get Size(): Vector2 {
    return this.size;
  }
  get CollisionBox(): Rect | null {
    if (this.collisionBox)
      return new Rect(this.location.X, this.location.Y, this.collisionBox.X, this.collisionBox.Y);
    else
      return null;
  }

  OnCollision(collision: IGameObject): void {

  }

  private cooldown: number = 0;
  public Update(deltaTime: number): void {
    if (this.canShoot) {
      if (this.enemyInRange) {
        if (this.cooldown <= 0) {
          this.enemyInRange.SetDamage(this.damage);

          this.cooldown = this.shootingCooldown;
        }
        else if (this.cooldown > 0) {
          this.cooldown -= deltaTime;
        }

        let distance = Math.floor(this.enemyInRange.location.distanceTo(this.CenterMassLocation));

        if (distance > this.range || this.enemyInRange.Health <= 0) {
          this.enemyInRange = null;
        }
      } 
    }
  }
  abstract Draw(deltaTime: number): void;
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

  Load(): void {
    
  }

  public FindTarget(enemies: IGameObject[]) {
    if (!this.enemyInRange) {
      for (let i = 0; i < enemies.length; i++) {
        let distance = Math.floor(enemies[i].CenterMassLocation.distanceTo(this.CenterMassLocation));
        if (distance <= this.range) {
          this.enemyInRange = enemies[i];
          break;
        }
      }
    }
  }

  protected SetDamage(damage: number): void {
    this.health -= damage;
  }

  SetLocation(x: number, y: number, z: number): void {
    this.location = new Vector3(x, y, z);
  }

  SetColor(hexColor: string): void {
    this.color = hexColor;
  }

  SetImage(imageLocal: string): void {
    this.imageLocation = imageLocal;
  }

  SetSize(width: number, height: number): void {
    this.size = new Vector2(width, height);
  }

  SetCollisionBox(width: number, height: number): void {
    this.collisionBox = new Vector2(width, height);
  }
}
