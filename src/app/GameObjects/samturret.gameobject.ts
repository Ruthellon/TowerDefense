import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { Defender } from "./defender.gameobject";
import { Missile } from "./missile.gameobject";

export class SAMTurret extends Defender {
  public get Name(): string {
    return "(S)urface to (A)ir (M)issile";
  }
  private description =
    "This is a turret that fire slow, but explosive, missiles at flying enemies, dealing damage to nearby enemies as well. " +
    "It cannot hit ground targets directly.";
  public get Description(): string {
    return this.description;
  }
  private upgradeDescription = '';
  public get UpgradeDescription(): string {
    return this.upgradeDescription;
  }
  protected override location = new Vector3(0, 0, 2);
  private canUpgrade = true;
  public get CanUpgrade(): boolean {
    return this.canUpgrade;
  }
  private timeToUpgrade: number = 5;
  protected get TimeToUpgrade(): number {
    return this.timeToUpgrade;
  }
  private level = 1;
  public get Level(): number {
    return this.level;
  }
  private cost: number | null = 25;
  public override get Cost(): number | null {
    return this.cost;
  }
  private shootingCooldown = 10.0;
  public override get ShootingCooldown(): number {
    return this.shootingCooldown;
  }
  private value: number | null = 25;
  public override get Value(): number | null {
    return this.value;
  }
  public get CanShootGround(): boolean {
    return false;
  }
  public get CanShootAerial(): boolean {
    return true;
  }
  private range: number = 300;
  public get Range(): number {
    return this.range;
  }
  private damage: number = 20;
  public get Damage(): number {
    return this.damage;
  }
  public get IsPlasmaWeapon(): boolean {
    return false;
  }

  public override Load(): void {
    super.Load();

    this.range = this.Size.X * 3.0;
    this.color = '#aa55aa';
    this.altColor = '#888888';
  }

  public override Upgrade(levelStarted: boolean) {
    super.Upgrade(levelStarted);
    if (this.level === 1) {
      this.level = 2;
      this.altColor = '#22dd22';
      this.damage = 6;
      this.shootingCooldown = .9;
      this.cost = 10;
      this.value = 10;
    }
    else if (this.level === 2) {
      this.level = 3;
      this.altColor = '#2222dd';
      this.damage = 7;
      this.shootingCooldown = .8;
      this.cost = 10;
      this.value = 20;
    }
    else if (this.level === 3) {
      this.level = 4;
      this.altColor = '#dd22dd';
      this.damage = 8;
      this.shootingCooldown = .7;
      this.cost = 20;
      this.value = 30;
    }
    else if (this.level === 4) {
      this.level = 5;
      this.canUpgrade = false;
      this.altColor = '#dddd22';
      this.range! *= 1.25;
      this.damage = 10;
      this.shootingCooldown = .5;
      this.cost = null;
      this.value = 50;
    }
  }

  public override FireWeapon(enemy: Attacker): boolean {
    let missile = new Missile();
    missile.SetLocation(this.CenterMassLocation.X, this.CenterMassLocation.Y, this.Location.Z);
    missile.SetTarget(enemy);
    missile.SetSize(this.Size.X / 4, this.Size.Y / 4);
    Game.TheScene.LoadGameObject(missile);
    return false;
  }
}
