import { AppComponent } from "../app.component";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Rect, Vector2 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";

export abstract class IScene {
  protected abstract get GameObjects(): IGameObject[];
  abstract Load(): void;

  private colliderLocations: IGameObject[] = [];
  Update(deltaTime: number): void {
    this.colliderLocations = [];
    this.GameObjects.forEach((obj) => {
      if (obj.CollisionBox) {
        this.colliderLocations.forEach((collider) => {
          if (Rect.IsOverlapping(obj.CollisionBox!, collider.CollisionBox!)) {
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
}
