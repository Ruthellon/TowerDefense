import { AppComponent } from "../app.component";
import { Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { IGameObject } from "./gameobject.interface";

export class Block extends Attacker {
    public override OnCollision(collision: IGameObject): void {
    }
  
}
