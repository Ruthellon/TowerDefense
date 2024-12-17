
export class Vector2 {
  X: number;
  Y: number;

  constructor(x: number, y: number) {
    this.X = x;
    this.Y = y;
  }

  public isEqual(other: Vector2): boolean {
    return (this.X === other.X && this.Y === other.Y);
  }

  public distanceTo(other: Vector2): number {
    return Math.sqrt(Math.pow((this.X - other.X), 2) + Math.pow((this.Y - other.Y), 2));
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

  public distanceTo(other: Vector3): number {
    return Math.sqrt(Math.pow((this.X - other.X), 2) + Math.pow((this.Y - other.Y), 2));
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

  public IsOverlapping(other: Rect): boolean {
    return (this.X < other.bottomRight.X &&
      other.X < this.bottomRight.X &&
      this.Y < other.bottomRight.Y &&
      other.Y < this.bottomRight.Y);
  }

  public ContainsPoint(point: Vector2): boolean {
    return (point.X >= this.X &&
      point.X <= (this.X + this.width) &&
      point.Y >= this.Y &&
      point.Y <= (this.Y + this.height));
  }
}
