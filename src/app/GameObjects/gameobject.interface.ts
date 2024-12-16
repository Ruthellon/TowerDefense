import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { PathFinder } from "../Utility/pathfinding.service";

export abstract class IGameObject {
  protected color: string | null = null;
  protected imageLocation: string | null = null;
  protected location: Vector3 = new Vector3(0, 0, 0);
  protected size: Vector2 = new Vector2(0, 0);
  protected collisionBox: Vector2 | null = null;

  get Location(): Vector3 {
    return this.location;
  }
  get Color(): string | null {
    return this.color;
  }
  get Image(): string | null {
    return this.imageLocation;
  }
  get Size(): Vector2 {
    return this.size;
  }
  get CollisionBox(): Rect | null {
    if (this.collisionBox)
      return new Rect(this.location.X, this.location.Y, this.collisionBox.X, this.collisionBox.Y);
    else
      return null;
  }

  OnCollision(collision: IGameObject): void {

  }

  abstract Update(deltaTime: number): void;
  abstract Draw(deltaTime: number): void;
  ///////
  //
  // FOR FUTURE USE
  // When allowing obstacle adding DURING the match
  //
  ///////
  //UpdatePath(grid: number[][], gridSize:number, dest: Vector2): boolean {
  //  let startingCell = new Vector2(this.location.X / gridSize, this.location.Y / gridSize)
  //  let tempPath = PathFinder.AStarSearch(grid, startingCell, dest);

  //  if (tempPath.length > 0)
  //    return true;

  //  return false;
  //}

  Load(): void {

  }

  SetLocation(x: number, y: number, z: number): void {
    this.location = new Vector3(x, y, z);
  }

  SetColor(hexColor: string): void {
    this.color = hexColor;
  }

  SetImage(imageLocal: string): void {
    this.imageLocation = imageLocal;
  }

  SetSize(width: number, height: number): void {
    this.size = new Vector2(width, height);
  }

  SetCollisionBox(width: number, height: number): void {
    this.collisionBox = new Vector2(width, height);
  }
}
