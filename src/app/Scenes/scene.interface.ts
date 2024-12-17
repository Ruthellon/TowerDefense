import { AppComponent } from "../app.component";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Rect, Vector2 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";

export abstract class IScene {
  protected abstract get GameObjects(): IGameObject[];
  abstract Load(): void;

  private objectsToDestroy: IGameObject[] = [];
  private colliderLocations: IGameObject[] = [];
  Update(deltaTime: number): void {
    for (let i = 0; i < this.objectsToDestroy.length; i++) {
      for (let j = 0; j < this.GameObjects.length; j++) {
        if (this.objectsToDestroy[i] === this.GameObjects[j]) {
          this.GameObjects.splice(j, 1);
          break;
        }
      }
    }
    this.objectsToDestroy = [];

    this.colliderLocations = [];
    this.GameObjects.forEach((obj) => {
      if (obj.CollisionBox) {
        this.colliderLocations.forEach((collider) => {
          if (collider.CollisionBox!.IsOverlapping(obj.CollisionBox!)) {
            obj.OnCollision(collider);
            collider.OnCollision(obj);
          }
        });
        this.colliderLocations.push(obj);
      }

      obj.Update(deltaTime);
    });
  }

  Draw(deltaTime: number): void {
    this.GameObjects.sort((a, b) =>
      a.Location.Z - b.Location.Z
    );
    this.GameObjects.forEach((obj) => {
      obj.Draw(deltaTime);
    });
  }

  LoadGameObject(gameObject: IGameObject) {
    gameObject.Load();
    this.GameObjects.push(gameObject);
  }

  DestroyGameObject(gameObject: IGameObject) {
    this.objectsToDestroy.push(gameObject);
  }
}
