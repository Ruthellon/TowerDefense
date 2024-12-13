
export class Vector2 {
  X: number;
  Y: number;

  constructor(x: number, y: number) {
    this.X = x;
    this.Y = y;
  }
}

export class Vector3 {
  X: number;
  Y: number;
  Z: number;

  constructor(x: number, y: number, z: number) {
    this.X = x;
    this.Y = y;
    this.Z = z;
  }
}

export class Rect {
  private x: number;
  public get X(): number {
    return this.x;
  }
  private y: number;
  public get Y(): number {
    return this.y;
  }
  private width: number;
  public get Width(): number {
    return this.width;
  }
  private height: number;
  public get Height(): number {
    return this.height;
  }

  private topLeft: Vector2;
  public get TopLeft(): Vector2 {
    return this.topLeft;
  }
  private topRight: Vector2;
  public get TopRight(): Vector2 {
    return this.topRight;
  }
  private bottomLeft: Vector2;
  public get BottomLeft(): Vector2 {
    return this.bottomLeft;
  }
  private bottomRight: Vector2;
  public get BottomRight(): Vector2 {
    return this.bottomRight;
  }

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.topLeft = new Vector2(x, y);
    this.topRight = new Vector2(x + width, y);
    this.bottomRight = new Vector2(x + width, y + height);
    this.bottomLeft = new Vector2(x, y + height);
  }

  public static IsOverlapping(rect1: Rect, rect2: Rect): boolean {
    return (rect1.X < rect2.bottomRight.X &&
      rect2.X < rect1.bottomRight.X &&
      rect1.Y < rect2.bottomRight.Y &&
      rect2.Y < rect1.bottomRight.Y);
  }
}
