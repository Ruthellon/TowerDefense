import { Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { Defender } from "./defender.gameobject";
import { IGameObject } from "./gameobject.interface";

export class Turret extends Defender {
  public get Name(): string {
    return "Basic Turret";
  }
  private description =
    "This is a basic turret. It fires slow, hard hitting rounds against enemies within its range. " +
    "It's less effective against enemies with shields, and more effective against those without.";
  public get Description(): string {
    return this.description;
  }
  protected override location = new Vector3(0, 0, 2);
  private canUpgrade = true;
  public get CanUpgrade(): boolean {
    return this.canUpgrade;
  }
  private level = 1;
  public get Level(): number {
    return this.level;
  }
  private cost: number | null = 5;
  public override get Cost(): number | null {
    return this.cost;
  }
  private shootingCooldown = 1.5;
  public override get ShootingCooldown(): number {
    return this.shootingCooldown;
  }
  private value: number | null = 5;
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
  private damage: number = 5;
  public get Damage(): number {
    return this.damage;
  }

  public override Load(): void {
    super.Load();

    this.range = this.Size.X * 1.5;
    this.color = '#555555';
    this.altColor = '#888888';
  }

  public override Upgrade() {
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
}
