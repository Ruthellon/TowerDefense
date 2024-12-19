import { InstructionsScene } from "../Scenes/instructions.scene";
import { LevelOneScene } from "../Scenes/levelone.scene";
import { LevelThreeScene } from "../Scenes/levelthree.scene";
import { LevelTwoScene } from "../Scenes/leveltwo.scene";
import { IScene } from "../Scenes/scene.interface";
import { IAngryElfAPIService } from "../Services/angryelfapi.service.interface";
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
  private static credits: number = 0;
  public static get Credits(): number {
    return this.credits;
  }

  private static api: IAngryElfAPIService;
  public static get TheAPI(): IAngryElfAPIService {
    return this.api;
  }

  public static SetTheAPI(api: IAngryElfAPIService) {
    this.api = api;
  }

  public static SetTheScene(scene: string): boolean {
    if (scene === 'instructions') {
      this.theScene = new InstructionsScene();
    }
    else if (scene === 'levelone') {
      this.theScene = new LevelOneScene();
    }
    else if (scene === 'leveltwo') {
      this.theScene = new LevelTwoScene();
    }
    else if (scene === 'levelthree') {
      this.theScene = new LevelThreeScene();
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

  public static SetStartingCredits(credits: number): void {
    this.credits = credits;
  }

  public static SubtractCredits(subtrahend: number): void {
    this.credits -= subtrahend;

    if (this.credits <= 0) {
      this.credits = 0;
    }
  }

  public static AddCredits(addend: number): void {
    this.credits += addend;
  }
}
