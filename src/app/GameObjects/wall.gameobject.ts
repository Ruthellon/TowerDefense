import { Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { Base } from "./base.gameobject";
import { Defender } from "./defender.gameobject";
import { IGameObject } from "./gameobject.interface";


export class Wall extends Defender {
  public get Name(): string {
    return "Wall";
  }
  public get Description(): string {
    return "It's a wall, it does wall things.";
  }
  public get UpgradeDescription(): string {
    return "";
  }
  public get Range(): number {
    return 0;
  }
  public get CanShootGround(): boolean {
    return false;
  }
  public get CanShootAerial(): boolean {
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
    this.color = '#662222';
    this.altColor = '#dddddd';
  }

  public override OnCollision(collision: IGameObject): void {
  }

  public override Update(deltaTime: number): void {
    this.UpdateClick();
  }

  public override Draw(deltaTime: number): void {
    Game.CONTEXT.fillStyle = this.color!;
    Game.CONTEXT.fillRect(this.Location.X, this.Location.Y,
      this.Size.X, this.Size.Y);

    let width = this.size.X;
    Game.CONTEXT.strokeStyle = this.altColor!;

    Game.CONTEXT.lineWidth = 1.5;
    //HORIZONTAL LINES
    let x = this.Location.X;
    let y = this.Location.Y;
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(this.objectRect.TopRight.X, y);
    Game.CONTEXT.stroke();

    y = this.objectRect.BottomLeft.Y;
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(this.objectRect.TopRight.X, y);
    Game.CONTEXT.stroke();
    

    Game.CONTEXT.lineWidth = 2;
    y = this.Location.Y + (Math.floor(this.size.Y / 4) * 1);
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(this.objectRect.TopRight.X, y);
    Game.CONTEXT.stroke();

    y = this.Location.Y + (Math.floor(this.size.Y / 4) * 2);
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(this.objectRect.TopRight.X, y);
    Game.CONTEXT.stroke();

    y = this.Location.Y + (Math.floor(this.size.Y / 4) * 3);
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(this.objectRect.TopRight.X, y);
    Game.CONTEXT.stroke();

    Game.CONTEXT.lineWidth = 1.5;
    //VERTICAL LINES
    x = this.Location.X;
    y = this.Location.Y + (Math.floor(this.size.Y / 4) * 1);
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(x, this.Location.Y + (Math.floor(this.size.Y / 4) * 2));
    Game.CONTEXT.stroke();

    x = this.objectRect.TopRight.X;
    y = this.Location.Y + (Math.floor(this.size.Y / 4) * 1);
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(x, this.Location.Y + (Math.floor(this.size.Y / 4) * 2));
    Game.CONTEXT.stroke();

    x = this.Location.X;
    y = this.Location.Y + (Math.floor(this.size.Y / 4) * 3);
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(x, this.ObjectRect.BottomLeft.Y);
    Game.CONTEXT.stroke();

    x = this.objectRect.TopRight.X;
    y = this.Location.Y + (Math.floor(this.size.Y / 4) * 3);
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(x, this.ObjectRect.BottomLeft.Y);
    Game.CONTEXT.stroke();


    Game.CONTEXT.lineWidth = 2;
    x = this.Location.X + (Math.floor(this.Size.X / 4));
    y = this.Location.Y;
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(x, this.Location.Y + (Math.floor(this.size.Y / 4) * 1));
    Game.CONTEXT.stroke();

    x = this.Location.X + (Math.floor(this.Size.X / 4) * 3);
    y = this.Location.Y;
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(x, this.Location.Y + (Math.floor(this.size.Y / 4) * 1));
    Game.CONTEXT.stroke();

    x = this.Location.X + (Math.floor(this.Size.X / 4) * 2);
    y = this.Location.Y + (Math.floor(this.Size.Y / 4) * 1);
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(x, this.Location.Y + (Math.floor(this.size.Y / 4) * 2));
    Game.CONTEXT.stroke();

    x = this.Location.X + (Math.floor(this.Size.X / 4));
    y = this.Location.Y + (Math.floor(this.Size.Y / 4) * 2);
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(x, this.Location.Y + (Math.floor(this.size.Y / 4) * 3));
    Game.CONTEXT.stroke();

    x = this.Location.X + (Math.floor(this.Size.X / 4) * 3);
    y = this.Location.Y + (Math.floor(this.Size.Y / 4) * 2);
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(x, this.Location.Y + (Math.floor(this.size.Y / 4) * 3));
    Game.CONTEXT.stroke();

    x = this.Location.X + (Math.floor(this.Size.X / 4) * 2);
    y = this.Location.Y + (Math.floor(this.Size.Y / 4) * 3);
    Game.CONTEXT.beginPath();
    Game.CONTEXT.moveTo(x, y);
    Game.CONTEXT.lineTo(x, this.Location.Y + (Math.floor(this.size.Y / 4) * 4));
    Game.CONTEXT.stroke();

    if (this.Selected) {
      Game.CONTEXT.lineWidth = 4;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect(this.Location.X + 2, this.Location.Y + 2,
        this.Size.X - 4, this.Size.Y - 4);
    }
    Game.CONTEXT.lineWidth = 1;
  }

  public override FindTarget(enemies: Attacker[]) {
    return;
  }
}
