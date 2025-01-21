import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { Base } from "./base.gameobject";
import { Defender } from "./defender.gameobject";
import { IGameObject } from "./gameobject.interface";


export class Missile extends Defender {
  public get Name(): string {
    return "Missile";
  }
  public get Description(): string {
    return "FFSSSSHHHHH";
  }
  public get UpgradeDescription(): string {
    return "";
  }
  public get Range(): number {
    return 20;
  }
  public get CanShootGround(): boolean {
    return false;
  }
  public get CanShootAerial(): boolean {
    return true;
  }
  public get IsPlasmaWeapon(): boolean {
    return false;
  }
  protected override location = new Vector3(0, 0, 1);
  public get UpgradeCost(): number {
    return 0;
  }
  public get CanUpgrade(): boolean {
    return false;
  }
  protected get TimeToUpgrade(): number {
    return 0;
  }
  public get Level(): number {
    return 0;
  }
  public override get Cost(): number | null {
    return 0;
  }
  public override get ShootingCooldown(): number {
    return 0;
  }
  public override get Value(): number | null {
    return 0;
  }

  public get Speed(): number {
    return 200;
  }

  public override Load(): void {
    super.Load();
    this.collisionBox = new Rect(0, 0, this.Size.X, this.Size.Y);
    this.color = '#ff0000';
    this.altColor = '#dddddd';
  }

  private isTrigger = false;
  public override get IsTrigger(): boolean {
    return this.isTrigger;
  }
  public override OnCollision(collision: IGameObject): void {
    if (collision instanceof Attacker && !this.hasExploded) {
      collision.ReduceHealth(Math.floor(this.Damage / 10), false)
    }
  }

  private hasExploded = false;
  private enemy: Attacker | undefined;
  public override Update(deltaTime: number): void {
    if (this.isTrigger) {
      if (this.hasExploded)
        this.DestroyGameObject(this);
      else
        this.hasExploded = true;

      return;
    }

    if (this.enemy) {
      let distanceTo = this.enemy.CenterMassLocation.distanceTo(new Vector3(this.CenterMassLocation.X, this.CenterMassLocation.Y, 1));

      if (distanceTo < this.Range) {
        this.enemy.ReduceHealth(this.Damage, this.IsPlasmaWeapon);
        this.isTrigger = true;
        this.location.X = this.Location.X - (this.Size.X * 3);
        this.location.Y = this.Location.Y - (this.Size.Y * 3);
        this.SetSize(this.Size.X * 6, this.Size.Y * 6);
        this.SetCollisionBox(0, 0, this.Size.X, this.Size.Y);
      }
      else {
        let result = this.MoveTo(this.enemy, deltaTime);

        this.location.X = result.X;
        this.location.Y = result.Y;
      }
    }

    this.UpdateClick();
  }

  public override Draw(deltaTime: number): void {
    if (!this.isTrigger) {
      Game.CONTEXT.fillStyle = this.color!;
      Game.CONTEXT.fillRect(this.Location.X, this.Location.Y,
        this.Size.X, this.Size.Y);
    }
    else {
      Game.CONTEXT.fillStyle = this.color!;
      let centerMass = this.CenterMassLocation;

      var ranNumLoops = Math.ceil(Math.random() * 30) + 20;
      var ranNumX = Math.ceil(Math.random() * (this.Size.X / 2)) * (Math.round(Math.random()) ? 1 : -1);
      var ranNumY = Math.ceil(Math.random() * (this.Size.Y / 2)) * (Math.round(Math.random()) ? 1 : -1);
      var ranNumSize = Math.ceil(Math.random() * (this.Size.Y / 10));

      for (let i = 0; i < ranNumLoops; i++) {
        ranNumX = Math.ceil(Math.random() * (this.Size.X / 2)) * (Math.round(Math.random()) ? 1 : -1);
        ranNumY = Math.ceil(Math.random() * (this.Size.Y / 2)) * (Math.round(Math.random()) ? 1 : -1);
        ranNumSize = Math.ceil(Math.random() * (this.Size.Y / 10));

        Game.CONTEXT.fillRect(centerMass.X + ranNumX, centerMass.Y + ranNumY,
          ranNumSize, ranNumSize);
      }
    }
  }

  public override FindTarget(enemies: Attacker[]) {
    return;
  }

  public SetTarget(enemy: Attacker) {
    this.enemy = enemy;
  }

  protected MoveTo(target: Attacker, deltaTime: number): Vector2 {
    // Calculate the direction vector from current to destination
    const directionX = target.CenterMassLocation.X - this.CenterMassLocation.X;
    const directionY = target.CenterMassLocation.Y - this.CenterMassLocation.Y;

    // Calculate the distance to the destination
    const distance = Math.sqrt(directionX ** 2 + directionY ** 2);

    // If the distance is small enough, snap to the destination
    if (distance < this.Speed * deltaTime) {
      return new Vector2(target.CenterMassLocation.X - (this.Size.X / 2), target.CenterMassLocation.Y - (this.Size.Y / 2));
    }

    // Normalize the direction vector
    const normalizedX = directionX / distance;
    const normalizedY = directionY / distance;

    // Calculate the movement based on speed and deltaTime
    const moveX = normalizedX * this.Speed * deltaTime;
    const moveY = normalizedY * this.Speed * deltaTime;

    // Update the current position
    return new Vector2(this.Location.X + moveX, this.Location.Y + moveY);
  }
}
