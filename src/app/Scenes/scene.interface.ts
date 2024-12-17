import { AppComponent } from "../app.component";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Rect, Vector2 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";

export abstract class IScene {
  protected abstract get GameObjects(): IGameObject[];
  public abstract Load(): void;
  public abstract Update(deltaTime: number): void;
  public abstract Draw(deltaTime: number): void;
  public abstract LoadGameObject(gameObject: IGameObject): void;
  public abstract DestroyGameObject(gameObject: IGameObject): void;
}
