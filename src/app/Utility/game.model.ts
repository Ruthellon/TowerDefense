import { EditStage } from "../Scenes/editstage.scene";
import { InstructionsScene } from "../Scenes/instructions.scene";
import { LevelFiveScene } from "../Scenes/levelfive.scene";
import { LevelFourScene } from "../Scenes/levelfour.scene";
import { LevelOneScene } from "../Scenes/levelone.scene";
import { LevelSevenScene } from "../Scenes/levelseven.scene";
import { LevelSixScene } from "../Scenes/levelsix.scene";
import { LevelThreeScene } from "../Scenes/levelthree.scene";
import { LevelTwoScene } from "../Scenes/leveltwo.scene";
import { IScene } from "../Scenes/scene.interface";
import { CustomLevel } from "../Services/angryelfapi.service";
import { IAngryElfAPIService } from "../Services/angryelfapi.service.interface";
import { ICookieService } from "../Services/cookie.service.interface";
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
  private static mousePressed: boolean = false;
  public static get MOUSE_PRESSED(): boolean {
    return this.mousePressed;
  }
  private static mousePressLocal: Vector2 = new Vector2(-1, -1);
  public static get MOUSE_PRESS_LOCATION(): Vector2 {
    return this.mousePressLocal;
  }
  private static keyPress: string | undefined;
  public static get KEY_PRESS(): string | undefined {
    let key = this.keyPress;
    this.keyPress = undefined
    return key;
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

  private static version: string;
  public static get Version(): string {
    return this.version;
  }

  public static SetTheAPI(api: IAngryElfAPIService) {
    this.api = api;
  }

  private static cookie: ICookieService;
  public static get CookieService(): ICookieService {
    return this.cookie;
  }
  public static SetCookieService(cookie: ICookieService) {
    this.cookie = cookie;
  }
  private static customScenes: CustomLevel[] = [];
  public static async GetCustomScenes(): Promise<CustomLevel[]> {
    this.customScenes = await this.api.GetCustomLevels();
    return this.customScenes;
    //let scenes = this.cookie.GetCookie('customScenes');
    //if (scenes) {
    //  return JSON.parse(scenes);
    //}
    //return [];
  }
  public static AddNewCustomScene(sceneName: string, sceneJSON: string) {
    //let scenesString = this.cookie.GetCookie('customScenes');
    //let scenes: string[] = [];
    //if (scenesString) {
    //  (JSON.parse(scenesString) as string[]).forEach((scene) => {
    //    scenes.push(scene);
    //  });
    //}
    //if (!scenes.find((name) => name === sceneName))
    //  scenes.push(sceneName);

    //this.cookie.SetCookie('customScenes', JSON.stringify(scenes), 1000);
    //this.cookie.SetCookie(sceneName, sceneJSON, 1000);

    this.api.AddCustomLevel(this.username, sceneName, sceneJSON);
  }
  public static UpdateCustomScene(sceneUnid: number, sceneName: string, sceneJSON: string) {
    //let scenesString = this.cookie.GetCookie('customScenes');
    //let scenes: string[] = [];
    //if (scenesString) {
    //  (JSON.parse(scenesString) as string[]).forEach((scene) => {
    //    scenes.push(scene);
    //  });
    //}
    //if (!scenes.find((name) => name === sceneName))
    //  scenes.push(sceneName);

    //this.cookie.SetCookie('customScenes', JSON.stringify(scenes), 1000);
    //this.cookie.SetCookie(sceneName, sceneJSON, 1000);

    this.api.UpdateCustomLevel(this.username, sceneUnid, sceneName, sceneJSON);
  }
  public static DeleteCustomScene(unid: number): void {
    this.api.DeleteCustomLevel(unid);
  }
  public static async GetCustomScene(unid: number): Promise<string | null>{
    return await this.api.GetCustomLevel(unid);
  }

  private static username: string = '';
  public static get Username(): string {
    return this.username;
  }
  public static SetUsername(username: string) {
    this.username = username;
  }

  public static SetTheScene(scene: string, customScene?: IScene): boolean {
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
    else if (scene === 'levelfour') {
      this.theScene = new LevelFourScene();
    }
    else if (scene === 'levelfive') {
      this.theScene = new LevelFiveScene();
    }
    else if (scene === 'levelsix') {
      this.theScene = new LevelSixScene();
    }
    else if (scene === 'levelseven') {
      this.theScene = new LevelSevenScene();
    }
    else if (scene === 'editstage') {
      if (customScene)
        this.theScene = customScene;
      else
        this.theScene = new EditStage();
    }
    else if (scene === 'blank' && customScene) {
      this.theScene = customScene;
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

  public static SetMousePressed(down: boolean): void {
    this.mousePressed = down;
  }

  public static SetMousePressLocation(x: number, y: number): void {
    this.mousePressLocal = new Vector2(x, y);
  }

  public static SetKeyPress(key: string) {
    this.keyPress = key;
  }

  public static SetWidth(width: number): void {
    this.canvas_width = width;
  }

  public static SetHeight(height: number): void {
    this.canvas_height = height;
  }

  public static SetVersion(version: string): void {
    this.version = version;
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
