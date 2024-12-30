import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { PathFinder } from "../Utility/pathfinding.service";

export abstract class IGameObject {
  public abstract get Location(): Vector3;
  public abstract get Size(): Vector2;
  public abstract get CollisionBox(): Rect | null;
  public abstract get IsHidden(): boolean;
  public abstract get IsEnabled(): boolean;

  public abstract OnCollision(collision: IGameObject): void;

  protected abstract get Color(): string | null;
  protected abstract get ImageLocation(): string | null;

  public abstract Load(): void;
  public abstract Update(deltaTime: number): void;
  public abstract Draw(deltaTime: number): void;

  public abstract SetLocation(x: number, y: number, z: number): void;
  public abstract SetColor(hexColor: string): void;
  public abstract SetImage(imageLocal: string): void;
  public abstract SetSize(width: number, height: number): void;
  public abstract SetCollisionBox(x: number, y: number, width: number, height: number): void;
  public abstract SetHidden(hidden: boolean): void;
  public abstract SetEnabled(enabled: boolean): void;
}
