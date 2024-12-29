import { Button } from "../GameObjects/Utilities/button.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Game } from "../Utility/game.model";
import { BaseLevel } from "./base.scene";
import { eLayerTypes, IScene } from "./scene.interface";


export class InstructionsScene extends BaseLevel {
  gameObjects: IGameObject[] = [];
  protected override get GameObjects(): IGameObject[] {
    return this.gameObjects;
  }

  private editStageButton: Button = new Button();
  private addCreditsButton: Button = new Button();

  private settingsButton: Button = new Button();
  startLevel1Button = new Button();
  startLevel2Button = new Button();
  startLevel3Button = new Button();
  startLevel4Button = new Button();
  startLevel5Button = new Button();
  startLevel6Button = new Button();
  startLevel7Button = new Button();
  Load(): void {
    Game.SetStartingCredits(0);

    this.startLevel1Button.SetLocation((Game.CANVAS_WIDTH / 2) - 750, Game.CANVAS_HEIGHT - 250, eLayerTypes.UI);
    this.startLevel1Button.SetSize(200, 100);
    this.startLevel1Button.SetText('Start Level 1');
    this.startLevel1Button.SetClickFunction(() => Game.SetTheScene('levelone'));
    this.LoadGameObject(this.startLevel1Button);

    this.startLevel2Button.SetLocation((Game.CANVAS_WIDTH / 2) - 500, Game.CANVAS_HEIGHT - 250, eLayerTypes.UI);
    this.startLevel2Button.SetSize(200, 100);
    this.startLevel2Button.SetText('Start Level 2');
    this.startLevel2Button.SetClickFunction(() => Game.SetTheScene('leveltwo'));
    this.LoadGameObject(this.startLevel2Button);

    this.startLevel3Button.SetLocation((Game.CANVAS_WIDTH / 2) - 250, Game.CANVAS_HEIGHT - 250, eLayerTypes.UI);
    this.startLevel3Button.SetSize(200, 100);
    this.startLevel3Button.SetText('Start Level 3');
    this.startLevel3Button.SetClickFunction(() => Game.SetTheScene('levelthree'));
    this.LoadGameObject(this.startLevel3Button);

    this.startLevel4Button.SetLocation((Game.CANVAS_WIDTH / 2) + 0, Game.CANVAS_HEIGHT - 250, eLayerTypes.UI);
    this.startLevel4Button.SetSize(200, 100);
    this.startLevel4Button.SetText('Start Level 4');
    this.startLevel4Button.SetClickFunction(() => Game.SetTheScene('levelfour'));
    this.LoadGameObject(this.startLevel4Button);

    this.startLevel5Button.SetLocation((Game.CANVAS_WIDTH / 2) + 250, Game.CANVAS_HEIGHT - 250, eLayerTypes.UI);
    this.startLevel5Button.SetSize(200, 100);
    this.startLevel5Button.SetText('Start Level 5');
    this.startLevel5Button.SetClickFunction(() => Game.SetTheScene('levelfive'));
    this.LoadGameObject(this.startLevel5Button);

    this.startLevel6Button.SetLocation((Game.CANVAS_WIDTH / 2) + 500, Game.CANVAS_HEIGHT - 250, eLayerTypes.UI);
    this.startLevel6Button.SetSize(200, 100);
    this.startLevel6Button.SetText('Start Level 6');
    this.startLevel6Button.SetClickFunction(() => Game.SetTheScene('levelsix'));
    this.LoadGameObject(this.startLevel6Button);

    this.startLevel7Button.SetLocation((Game.CANVAS_WIDTH / 2) - 750, Game.CANVAS_HEIGHT - 125, eLayerTypes.UI);
    this.startLevel7Button.SetSize(200, 100);
    this.startLevel7Button.SetText('Start Level 7');
    this.startLevel7Button.SetClickFunction(() => Game.SetTheScene('levelseven'));
    this.LoadGameObject(this.startLevel7Button);

    this.settingsButton.SetLocation(Game.CANVAS_WIDTH - 75, 25, eLayerTypes.UI);
    this.settingsButton.SetSize(50, 50);
    this.settingsButton.SetImage('/assets/images/cog.png');
    this.settingsButton.SetClickFunction(() => this.openSettings());
    this.LoadGameObject(this.settingsButton);

    this.editStageButton.SetLocation(Game.CANVAS_WIDTH / 2 - 100, Game.CANVAS_HEIGHT / 2, eLayerTypes.UI);
    this.editStageButton.SetSize(200, 100);
    this.editStageButton.SetText('Edit Level');
    this.editStageButton.SetClickFunction(() => Game.SetTheScene('editstage'));
    this.editStageButton.Load();

    this.addCreditsButton.SetLocation(Game.CANVAS_WIDTH / 2 - 100, (Game.CANVAS_HEIGHT / 2) + 125, eLayerTypes.UI);
    this.addCreditsButton.SetSize(200, 100);
    this.addCreditsButton.SetText('Add Credits');
    this.addCreditsButton.SetClickFunction(() => Game.AddCredits(10));
    this.addCreditsButton.Load();
  }

  private hasPermission = false;
  override Update(deltaTime: number) {
    super.Update(deltaTime);

    if (this.hasPermission) {
      this.editStageButton.Update(deltaTime);
      this.addCreditsButton.Update(deltaTime);
    }
  }

  override Draw(deltaTime: number) {
    Game.CONTEXT!.fillStyle = '#111111';
    Game.CONTEXT!.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

    super.Draw(deltaTime);

    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '64px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText('Welcome To Tower Defense by Angry Elf Games!', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 - 300);

    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '32px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText('The objective is to destroy the monsters before they reach the other side.', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 - 200);
    Game.CONTEXT.fillText('Build Turrets and Walls to lead the monsters along a path of your choosing.', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 - 150);
    Game.CONTEXT.fillText("But be careful, you have a limited number of *credits* ", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 - 100);
    Game.CONTEXT.fillText("and once the monsters start coming you'll no longer be able to place Walls or Turrets on their path.", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 - 50);
    Game.CONTEXT.fillText("If you start at Level 1, credits earned and spent carry over to Level 2. So spend wisely.", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 0);
    Game.CONTEXT.fillText("The game ends when you defeat all the monsters, or lose 10 life.", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 50);
    Game.CONTEXT.fillText("Good Luck!", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 100);
    Game.CONTEXT.fillText("Look out for the 'Upgrade' and 'Delete' buttons when selecting defenders on the field!", Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 150);

    if (this.settingsOpen) {
      Game.CONTEXT!.fillStyle = '#555555';
      Game.CONTEXT!.fillRect((Game.CANVAS_WIDTH / 2) - 250, 50, 500, Game.CANVAS_HEIGHT - 250);

      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect((Game.CANVAS_WIDTH / 2) - 250, 50, 500, Game.CANVAS_HEIGHT - 250);

      if (this.hasPermission) {
        this.editStageButton.Draw(deltaTime);
        this.addCreditsButton.Draw(deltaTime);
      }
    }
  }

  private openSettings(): void {
    if (this.settingsOpen) {
      this.hasPermission = false;
      this.settingsOpen = false;
    }
    else {
      this.settingsOpen = true;
      let sign = prompt("What's the password?");

      if (sign) {
        if (sign.toLowerCase() === "please") {
          this.hasPermission = true;
        }
      }
    }
  }

  private settingsOpen: boolean = false;
}
