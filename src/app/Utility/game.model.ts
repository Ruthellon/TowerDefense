import { InstructionsScene } from "../Scenes/instructions.scene";
import { LevelOneScene } from "../Scenes/levelone.scene";
import { IScene } from "../Scenes/scene.interface";
import { Vector2 } from "./classes.model";

export class Game {
  private static canvas_width: number = 1600;
  public static get CANVAS_WIDTH(): number {
    return this.canvas_width;
  }
  private static canvas_height: number = 900;
  public static get CANVAS_HEIGHT(): number {
    return this.canvas_height;
  }
  private static canvas_context: CanvasRenderingContext2D | null = null;
  public static get CONTEXT(): CanvasRenderingContext2D {
    if (this.canvas_context)
      return this.canvas_context;
    else
      throw new Error("Canvas Missing");
  }
  private static mouseLocal: Vector2 = new Vector2(-1, -1);
  public static get MOUSE_LOCATION(): Vector2 {
    return this.mouseLocal;
  }
  private static mouseClick: boolean = false;
  public static get MOUSE_CLICKED(): boolean {
    return this.mouseClick;
  }
  private static theScene: any = [];
  public static get TheScene(): IScene {
    return this.theScene;
  }

  public static SetTheScene(scene: string): boolean {
    if (scene === 'instructions') {
      this.theScene = new InstructionsScene();
    }
    else if (scene === 'levelone') {
      this.theScene = new LevelOneScene();
    }
    else {
      return false;
    }

    this.theScene.Load();
    return true;
  }

  public static SetCanvasContext(canvas: CanvasRenderingContext2D): void {
    this.canvas_context = canvas;
  }

  public static SetMouseLocation(x: number, y: number): void {
    this.mouseLocal = new Vector2(x, y);
  }

  public static SetMouseClick(down: boolean): void {
    this.mouseClick = down;
  }

  public static SetWidth(width: number): void {
    this.canvas_width = width;
  }

  public static SetHeight(height: number): void {
    this.canvas_height = height;
  }
}
