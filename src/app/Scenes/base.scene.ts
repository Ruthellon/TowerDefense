import { Attacker } from "../GameObjects/attacker.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Missile } from "../GameObjects/missile.gameobject";
import { IScene } from "./scene.interface";


export abstract class BaseLevel extends IScene {
  private objectsToDestroy: IGameObject[] = [];
  private colliderLocations: IGameObject[] = [];
  Update(deltaTime: number): void {
    this.gameObjects.sort((a, b) =>
      a.Location.Z - b.Location.Z
    );

    for (let i = 0; i < this.objectsToDestroy.length; i++) {
      if (this.objectsToDestroy[i].CollisionBox != null) {
        this.colliderLocations.splice(this.colliderLocations.findIndex((obj) => obj === this.objectsToDestroy[i]), 1);
      }
      this.GameObjects.splice(this.GameObjects.findIndex((obj) => obj === this.objectsToDestroy[i]), 1);
    }
    this.objectsToDestroy = [];

    this.GameObjects.forEach((obj) => {
      if (!obj.IsHidden && obj.IsEnabled) {
        obj.Update(deltaTime);

        if (obj.CollisionBox && obj.IsTrigger) {
          this.colliderLocations.forEach((collider) => {
            if (obj instanceof Missile && collider instanceof Attacker) {
              let i = 0;
              i++;
            }
            if (obj !== collider && collider.CollisionBox!.IsOverlapping(obj.CollisionBox!)) {
              obj.OnCollision(collider);
              collider.OnCollision(obj);
            }
          });
        }
      }
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
    if (gameObject.CollisionBox != null)
      this.colliderLocations.push(gameObject);

    this.gameObjects.push(gameObject);
  }

  DestroyGameObject(gameObject: IGameObject) {
    this.objectsToDestroy.push(gameObject);
  }
}
