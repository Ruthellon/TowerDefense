import { IGameObject } from "../GameObjects/gameobject.interface";
import { IScene } from "./scene.interface";


export abstract class BaseLevel extends IScene {
  private objectsToDestroy: IGameObject[] = [];
  private colliderLocations: IGameObject[] = [];
  Update(deltaTime: number): void {
    this.gameObjects.sort((a, b) =>
      a.Location.Z - b.Location.Z
    );

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
      if (!obj.IsHidden && obj.IsEnabled)
        obj.Update(deltaTime);
    });
  }

  Draw(deltaTime: number): void {
    this.gameObjects.sort((a, b) =>
      a.Location.Z - b.Location.Z
    );
    this.GameObjects.forEach((obj) => {
      if (!obj.IsHidden)
        obj.Draw(deltaTime);
    });
  }

  LoadGameObject(gameObject: IGameObject) {
    gameObject.Load();
    this.gameObjects.push(gameObject);
  }

  DestroyGameObject(gameObject: IGameObject) {
    this.objectsToDestroy.push(gameObject);
  }
}
