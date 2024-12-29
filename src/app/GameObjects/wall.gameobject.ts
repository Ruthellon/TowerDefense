import { Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { Base } from "./base.gameobject";
import { Defender } from "./defender.gameobject";
import { IGameObject } from "./gameobject.interface";


export class Wall extends Defender {
  protected override location = new Vector3(0, 0, 1);
  public get UpgradeCost(): number {
    return 0;
  }
  public get CanUpgrade(): boolean {
    return false;
  }
  public get Level(): number {
    return 0;
  }
  public override get Cost(): number | null {
    return 1;
  }
  public override get ShootingCooldown(): number {
    return 0;
  }
  public override get Damage(): number {
    return 0;
  }
  public override get Value(): number | null {
    return 1;
  }
  public override Load(): void {
    super.Load();
  }

  public override OnCollision(collision: IGameObject): void {
  }
  override color = '#ff0000';

  public override Update(deltaTime: number): void {
    this.UpdateClick();
  }

  public override Draw(deltaTime: number): void {
    Game.CONTEXT.fillStyle = this.color;
    Game.CONTEXT.fillRect(this.Location.X, this.Location.Y,
      this.Size.X, this.Size.Y);
  }

  public FindTarget(enemies: Attacker[]) {
    return;
  }
}
