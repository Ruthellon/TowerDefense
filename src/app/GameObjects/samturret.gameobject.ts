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
  private value: number = 25;
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
  protected override damage: number = 35;
  public get IsPlasmaWeapon(): boolean {
    return false;
  }
  private numMissiles: number = 1;

  public override get DPS(): number {
    return (this.Damage * this.numMissiles) / this.ShootingCooldown;
  }

  public override Load(): void {
    super.Load();

    this.range = this.Size.X * 3.0;
    this.color = '#aa55aa';
    this.altColor = '#888888';
    this.cost! += 5;
  }

  public override Upgrade(levelStarted: boolean) {
    super.Upgrade(levelStarted);
    if (this.level === 1) {
      this.level = 2;
      this.altColor = '#22dd22';
      this.damage += 10;
      this.shootingCooldown = 9.0;
      this.cost = 35;
      this.value += 30;
    }
    else if (this.level === 2) {
      this.level = 3;
      this.altColor = '#2222dd';
      this.damage += 20;
      this.shootingCooldown = 8;
      this.cost = 40;
      this.value += 35;
    }
    else if (this.level === 3) {
      this.level = 4;
      this.altColor = '#dd22dd';
      this.damage += 30;
      this.shootingCooldown = 7.0;
      this.cost = 100;
      this.value += 40;
    }
    else if (this.level === 4) {
      this.level = 5;
      this.canUpgrade = false;
      this.altColor = '#dddd22';
      this.range! *= 2.0;
      this.numMissiles = 2;
      this.shootingCooldown = 5.0;
      this.cost = null;
      this.value += 100;
    }
  }

  public override FireWeapon(enemy: Attacker): boolean {
    for (let i = 0; i < this.numMissiles; i++) {
      let missile = new Missile();
      missile.SetLocation(this.CenterMassLocation.X, this.CenterMassLocation.Y, this.Location.Z);
      missile.SetTarget(enemy);
      missile.SetSize(this.Size.X / 4, this.Size.Y / 4);
      missile.SetDamage(this.damage);
      Game.TheScene.LoadGameObject(missile);
    }
    return false;
  }
}
