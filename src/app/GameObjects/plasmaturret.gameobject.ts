import { Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Defender } from "./defender.gameobject";

export class PlasmaTurret extends Defender {
  public get Name(): string {
    return "Plasma Turret";
  }
  private description =
    "This is a plasma turret. It fires quick, soft hitting super-heated plasma rounds against enemies within its range. " +
    "It's more effective against shields than it is against normal targets.";
  public get Description(): string {
    return this.description;
  }
  protected override location = new Vector3(0, 0, 2);
  private canUpgrade = true;
  public get CanUpgrade(): boolean {
    return this.canUpgrade;
  }
  private timeToUpgrade: number = 2;
  protected get TimeToUpgrade(): number {
    return this.timeToUpgrade;
  }
  private level = 1;
  public get Level(): number {
    return this.level;
  }
  private cost: number | null = 10;
  public override get Cost(): number | null {
    return this.cost;
  }
  private shootingCooldown = .5;
  public override get ShootingCooldown(): number {
    return this.shootingCooldown;
  }
  private value: number | null = 10;
  public override get Value(): number | null {
    return this.value;
  }
  public get CanShootGround(): boolean {
    return true;
  }
  public get CanShootAerial(): boolean {
    return false;
  }
  private range: number = 150;
  public get Range(): number {
    return this.range;
  }
  private damage: number = 1;
  public get Damage(): number {
    return this.damage;
  }

  public override Load(): void {
    super.Load();

    this.range = this.Size.X * 1.5;
    this.color = '#5555aa';
    this.altColor = '#888888';
  }

  public override Upgrade(levelStarted: boolean) {
    super.Upgrade(levelStarted);

    if (this.level === 1) {
      this.level = 2;
      this.altColor = '#22dd22';
      this.damage = 2;
      this.shootingCooldown = .45;
      this.cost = 10;
      this.value = 20;
    }
    else if (this.level === 2) {
      this.level = 3;
      this.altColor = '#2222dd';
      this.damage = 3;
      this.shootingCooldown = .4;
      this.cost = 10;
      this.value = 30;
    }
    else if (this.level === 3) {
      this.level = 4;
      this.altColor = '#dd22dd';
      this.damage = 4;
      this.shootingCooldown = .35;
      this.cost = 20;
      this.value = 40;
    }
    else if (this.level === 4) {
      this.level = 5;
      this.canUpgrade = false;
      this.altColor = '#dddd22';
      this.range! *= 1.25;
      this.damage = 8;
      this.shootingCooldown = .25;
      this.cost = null;
      this.value = 70;
    }
  }
}
