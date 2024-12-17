import { Base } from "./base.gameobject";

export abstract class Attacker extends Base {

  protected health: number = 0;
  public get Health(): number {
    return this.health;
  }

  public SetDamage(damage: number): void {
    this.health -= damage;
  }
}
