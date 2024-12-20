import { IGameObject } from "../GameObjects/gameobject.interface";
import { IScene } from "./scene.interface";


export abstract class BaseLevel extends IScene {
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
    let go = this.GameObjects.sort((a, b) =>
      a.Location.Z - b.Location.Z
    );
    for (let i = 0; i < go.length; i++) {
      go[i].Draw(deltaTime);
    }
  }

  LoadGameObject(gameObject: IGameObject) {
    gameObject.Load();
    this.GameObjects.push(gameObject);
  }

  DestroyGameObject(gameObject: IGameObject) {
    this.objectsToDestroy.push(gameObject);
  }
}
