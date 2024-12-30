import { Rect, Vector2, Vector3 } from "Utility/classes.model";
import { Game } from "Utility/game.model";
import { IGameObject } from "GameObjects/gameobject.interface";


export abstract class UtilityBase extends IGameObject {

  protected location: Vector3 = new Vector3(0, 0, 0);
  public get Location(): Vector3 {
    return this.location;
  }
  protected size: Vector2 = new Vector2(0, 0);
  public get Size(): Vector2 {
    return this.size;
  }
  protected pressed: boolean = false;
  public get Pressed(): boolean {
    if (this.pressed) {
      return true;
    }
    else {
      return false;
    }
  }
  protected clickFunction: (() => void) | undefined;
  protected clicked: boolean = false;
  public get Clicked(): boolean {
    if (this.clicked) {
      this.pressed = false;
      this.clicked = false;
      return true;
    }
    else {
      return false;
    }
  }
  protected selected: boolean = false;
  public get Selected(): boolean {
    return this.selected;
  }
  protected color: string | null = null;
  public get Color(): string | null {
    return this.color;
  }
  protected sprite: HTMLImageElement | null = null;
  public get Sprite(): HTMLImageElement | null {
    return this.sprite;
  }
  protected isHidden: boolean = false;
  public get IsHidden(): boolean {
    return this.isHidden;
  }
  protected isEnabled: boolean = true;
  public get IsEnabled(): boolean {
    return this.isEnabled;
  }

  protected imageLocation: string | null = null;
  protected get ImageLocation(): string | null {
    return this.imageLocation;
  }
  protected objectRect: Rect = new Rect(0, 0, 0, 0);
  protected get ObjectRect(): Rect {
    return this.objectRect;
  }

  public Load() {
  }

  public Update(deltaTime: number) {

  }

  public Draw(deltaTime: number) {

  }

  public SetLocation(x: number, y: number, z: number): void {
    this.location = new Vector3(x, y, z);
    this.objectRect = new Rect(this.Location.X, this.Location.Y, this.Size.X, this.Size.Y);
  }

  public SetColor(hexColor: string): void {
    this.color = hexColor;
  }

  public SetImage(imageLocal: string): void {
    this.imageLocation = imageLocal;
    this.sprite = new Image();
    this.sprite.src = imageLocal;
    //this.sprite.onload = this.onload.bind(this);
  }

  public SetSize(width: number, height: number): void {
    this.size = new Vector2(width, height);

    if (this.sprite) {
      this.sprite.width = width;
      this.sprite.height = height;
    }

    this.objectRect = new Rect(this.Location.X, this.Location.Y, this.Size.X, this.Size.Y);
  }

  public SetSelected(isSelected: boolean): void {
    if (this.selected !== isSelected) {
      this.selected = isSelected;

      if (isSelected)
        this.location.Z++;
      else
        this.location.Z--;
    }
  }

  public SetClickFunction(clicked: () => void): void {
    this.clickFunction = clicked;
  }

  public SetHidden(hidden: boolean) {
    this.isHidden = hidden;
  }

  public SetEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  protected UpdateClick(): void {
    if (Game.MOUSE_PRESSED && this.ObjectRect.ContainsPoint(Game.MOUSE_PRESS_LOCATION)) {
      this.pressed = true;
      this.clicked = false;
    }
    else if (this.pressed && !Game.MOUSE_PRESSED && this.ObjectRect.ContainsPoint(Game.MOUSE_PRESS_LOCATION)) {
      if (this.clickFunction) {
        this.pressed = false;
        this.clickFunction();
      }
      else {
        this.pressed = false;
        this.clicked = true;
      }
    }
    else if (this.pressed && !Game.MOUSE_PRESSED) {
      this.pressed = false;
    }
  }


  public get CollisionBox(): Rect | null {
    return null;
  }
  public SetCollisionBox(x: number, y: number, width: number, height: number): void {

  }
  public OnCollision(collision: IGameObject): void {

  }
}
