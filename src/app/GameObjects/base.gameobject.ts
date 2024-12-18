import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { IGameObject } from "./gameobject.interface";


export abstract class Base extends IGameObject {
  public abstract get Value(): number | null;

  protected location: Vector3 = new Vector3(0, 0, 0);
  public get Location(): Vector3 {
    return this.location;
  }
  protected size: Vector2 = new Vector2(0, 0);
  public get Size(): Vector2 {
    return this.size;
  }

  protected color: string | null = null;
  protected get Color(): string | null {
    return this.color;
  }
  protected imageLocation: string | null = null;
  protected get ImageLocation(): string | null {
    return this.imageLocation;
  }
  protected collisionBox: Rect | null = null;
  public get CollisionBox(): Rect | null {
    return this.collisionBox;
  }

  public get CenterMassLocation(): Vector3 {
    return new Vector3(this.location.X + (this.size.X / 2), this.location.Y + (this.size.Y / 2), this.location.Z);
  }

  public SetLocation(x: number, y: number, z: number): void {
    this.location = new Vector3(x, y, z);
  }

  public SetColor(hexColor: string): void {
    this.color = hexColor;
  }

  public SetImage(imageLocal: string): void {
    this.imageLocation = imageLocal;
  }

  public SetSize(width: number, height: number): void {
    this.size = new Vector2(width, height);
  }

  public SetCollisionBox(x: number, y: number, width: number, height: number): void {
    this.collisionBox = new Rect(x, y, width, height);
  }
}