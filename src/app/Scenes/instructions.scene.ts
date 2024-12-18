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

  startLevel1Button = new Button();
  startLevel2Button = new Button();
  Load(): void {
    this.startLevel1Button.SetLocation((Game.CANVAS_WIDTH / 2) - 300, Game.CANVAS_HEIGHT - 150, 10);
    this.startLevel1Button.SetSize(200, 100);
    this.startLevel1Button.SetText('Start Level 1');
    this.LoadGameObject(this.startLevel1Button);

    this.startLevel2Button.SetLocation((Game.CANVAS_WIDTH / 2) + 100, Game.CANVAS_HEIGHT - 150, 10);
    this.startLevel2Button.SetSize(200, 100);
    this.startLevel2Button.SetText('Start Level 2');
    this.LoadGameObject(this.startLevel2Button);

  }

  override Update(deltaTime: number) {
    super.Update(deltaTime);

    if (this.startLevel1Button.Pressed) {
      Game.SetTheScene('levelone');
      return;
    }
    if (this.startLevel2Button.Pressed) {
      Game.SetTheScene('leveltwo');
      return;
    }
  }

  override Draw(deltaTime: number) {
    Game.CONTEXT!.fillStyle = '#111111';
    Game.CONTEXT!.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '64px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText('Welcome To Tower Defense by Angry Elf Games!', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 - 300);

    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '32px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText('The objective is to destroy the monsters before they reach the other side.', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 - 150);
    Game.CONTEXT.fillText('Build Turrets and Walls to lead the monsters along a path of your choosing.', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 - 100);
    Game.CONTEXT.fillText("But be careful, you have a limited number of *credits* ", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 - 50);
    Game.CONTEXT.fillText("and once the monsters start coming you'll no longer be able to place Walls or Turrets on their path.", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2);
    Game.CONTEXT.fillText("If you start at Level 1, credits earned and spent carry over to Level 2. So spend wisely.", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 50);
    Game.CONTEXT.fillText("The game ends when you defeat all the monsters, or lose 10 life.", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 100);
    Game.CONTEXT.fillText("Good Luck!", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 150);
    Game.CONTEXT.fillText("Press 'Start Level' to begin!", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 250);

    super.Draw(deltaTime);
  }
}
