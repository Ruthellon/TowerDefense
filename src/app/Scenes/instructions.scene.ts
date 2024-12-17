import { Button } from "../GameObjects/button.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Game } from "../Utility/game.model";
import { BaseLevel } from "./base.scene";
import { IScene } from "./scene.interface";


export class InstructionsScene extends BaseLevel {
  gameObjects: IGameObject[] = [];
  protected override get GameObjects(): IGameObject[] {
    return this.gameObjects;
  }

  startButton = new Button();
  Load(): void {
    this.startButton.SetLocation((Game.CANVAS_WIDTH / 2) - 100, Game.CANVAS_HEIGHT - 200, 10);
    this.startButton.SetSize(200, 100);
    this.startButton.SetText('Start Game');

    this.LoadGameObject(this.startButton);
  }

  override Update(deltaTime: number) {
    super.Update(deltaTime);

    if (this.startButton.Pressed) {
      Game.SetTheScene('levelone');
    }
  }

  override Draw(deltaTime: number) {
    Game.CONTEXT!.fillStyle = '#111111';
    Game.CONTEXT!.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '32px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText('Welcome To Tower Defense by Angry Elf Games!', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 - 150);

    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '18px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText('The objective is to destroy the monsters before they reach the other side.', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 - 50);
    Game.CONTEXT.fillText('Build Turrets and Walls to lead the monsters along a path of your choosing.', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2);
    Game.CONTEXT.fillText("But be careful, you have a limited number of *credits* and once the monsters start coming you'll no longer be able to place Walls or Turrets.", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 50);
    Game.CONTEXT.fillText("The game ends when you defeat all the monsters, or lose 10 life. Refresh to restart whenever.", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 100);
    Game.CONTEXT.fillText("Good Luck!     Press 'Start Game' to begin!", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 150);

    super.Draw(deltaTime);
  }
}
