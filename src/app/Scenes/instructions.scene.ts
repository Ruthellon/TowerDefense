import { Button } from "../GameObjects/Utilities/button.gameobject";
import { TextBox } from "../GameObjects/Utilities/textbox.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { CustomLevel } from "../Services/angryelfapi.service";
import { Game } from "../Utility/game.model";
import { BaseLevel } from "./base.scene";
import { BlankLevelScene } from "./blanklevel.scene";
import { EditStage } from "./editstage.scene";
import { eLayerTypes, IScene } from "./scene.interface";


export class InstructionsScene extends BaseLevel {
  gameObjects: IGameObject[] = [];
  protected override get GameObjects(): IGameObject[] {
    return this.gameObjects;
  }

  private editStageButton: Button = new Button();
  private addCreditsButton: Button = new Button();

  private scenes: CustomLevel[] = [];

  private settingsButton: Button = new Button();
  startLevel1Button = new Button();
  startLevel2Button = new Button();
  startLevel3Button = new Button();
  startLevel4Button = new Button();
  startLevel5Button = new Button();
  startLevel6Button = new Button();
  startLevel7Button = new Button();
  fetchCustomsButton = new Button();
  private customClose: Button = new Button();

  private deleteCustomButton: Button = new Button();
  private playCustomButton: Button = new Button();
  private editCustomButton: Button = new Button();
  private closeCustomWindowButton: Button = new Button();

  private username: TextBox = new TextBox();
  private password: TextBox = new TextBox();
  private submitButton: Button = new Button();
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
    this.startLevel2Button.SetEnabled(false);
    //this.LoadGameObject(this.startLevel2Button);

    this.startLevel3Button.SetLocation((Game.CANVAS_WIDTH / 2) - 250, Game.CANVAS_HEIGHT - 250, eLayerTypes.UI);
    this.startLevel3Button.SetSize(200, 100);
    this.startLevel3Button.SetText('Start Level 3');
    this.startLevel3Button.SetClickFunction(() => Game.SetTheScene('levelthree'));
    this.startLevel3Button.SetEnabled(false);
    //this.LoadGameObject(this.startLevel3Button);

    this.startLevel4Button.SetLocation((Game.CANVAS_WIDTH / 2) + 0, Game.CANVAS_HEIGHT - 250, eLayerTypes.UI);
    this.startLevel4Button.SetSize(200, 100);
    this.startLevel4Button.SetText('Start Level 4');
    this.startLevel4Button.SetClickFunction(() => Game.SetTheScene('levelfour'));
    this.startLevel4Button.SetEnabled(false);
    //this.LoadGameObject(this.startLevel4Button);

    this.startLevel5Button.SetLocation((Game.CANVAS_WIDTH / 2) + 250, Game.CANVAS_HEIGHT - 250, eLayerTypes.UI);
    this.startLevel5Button.SetSize(200, 100);
    this.startLevel5Button.SetText('Start Level 5');
    this.startLevel5Button.SetClickFunction(() => Game.SetTheScene('levelfive'));
    this.startLevel5Button.SetEnabled(false);
    //this.LoadGameObject(this.startLevel5Button);

    this.startLevel6Button.SetLocation((Game.CANVAS_WIDTH / 2) + 500, Game.CANVAS_HEIGHT - 250, eLayerTypes.UI);
    this.startLevel6Button.SetSize(200, 100);
    this.startLevel6Button.SetText('Start Level 6');
    this.startLevel6Button.SetClickFunction(() => Game.SetTheScene('levelsix'));
    this.startLevel6Button.SetEnabled(false);
    //this.LoadGameObject(this.startLevel6Button);

    this.startLevel7Button.SetLocation((Game.CANVAS_WIDTH / 2) - 750, Game.CANVAS_HEIGHT - 125, eLayerTypes.UI);
    this.startLevel7Button.SetSize(200, 100);
    this.startLevel7Button.SetText('Start Level 7');
    this.startLevel7Button.SetClickFunction(() => Game.SetTheScene('levelseven'));
    this.startLevel7Button.SetEnabled(false);
    //this.LoadGameObject(this.startLevel7Button);

    this.fetchCustomsButton.SetLocation((Game.CANVAS_WIDTH / 2) - 100, Game.CANVAS_HEIGHT - 125, eLayerTypes.UI);
    this.fetchCustomsButton.SetSize(200, 100);
    this.fetchCustomsButton.SetText('Open Custom List');
    this.fetchCustomsButton.SetClickFunction(async () => {
      this.customSceneOpen = true;
      this.gameObjects.forEach((go) => {
        go.SetEnabled(false);
      });

      this.sceneButtons = [];
      this.scenes = await Game.GetCustomScenes();
      for (let i = 0; i < this.scenes.length; i++) {
        let sceneButton = new Button();
        let x = (Game.CANVAS_WIDTH / 2 - 350) + ((i % 3) * 250);
        
        let y = 50 + (Math.floor(i / 3) * 125);

        sceneButton.SetLocation(x, y, eLayerTypes.UI);
        sceneButton.SetSize(200, 100);
        sceneButton.SetText(`${this.scenes[i].levelName}\nby ${this.scenes[i].creatorName}`);
        sceneButton.SetClickFunction(async () => {
          this.selectedSceneIndex = i;
          this.selectedScene = await Game.GetCustomScene(this.scenes[i].unid);

          this.sceneButtons.forEach((butt) => butt.SetEnabled(false));
        });
        sceneButton.Load();
        this.sceneButtons.push(sceneButton);
      }
    });
    this.LoadGameObject(this.fetchCustomsButton);

    this.settingsButton.SetLocation(Game.CANVAS_WIDTH - 75, 25, eLayerTypes.UI);
    this.settingsButton.SetSize(50, 50);
    this.settingsButton.SetImage('/assets/images/cog.png');
    this.settingsButton.SetClickFunction(async () => {
      if (this.settingsOpen) {
        this.settingsOpen = false;
        this.gameObjects.forEach((go) => {
          go.SetEnabled(true);
        });
      }
      else {
        this.settingsOpen = true;
        this.gameObjects.forEach((go) => {
          go.SetEnabled(false);
        });
        this.settingsButton.SetEnabled(true);
      }
      
    });

    this.settingsButton.Load();
    this.LoadGameObject(this.settingsButton);

    this.username.SetLocation((Game.CANVAS_WIDTH / 2) - 100, 75, eLayerTypes.UI);
    this.username.SetSize(200, 50);
    this.username.SetText('Username');
    this.username.SetPrompt('Enter username:');
    this.username.Load();

    this.password.SetLocation((Game.CANVAS_WIDTH / 2) - 100, 150, eLayerTypes.UI);
    this.password.SetSize(200, 50);
    this.password.SetText('Password');
    this.password.SetPrompt('Enter password:');
    this.password.Load();

    this.submitButton.SetLocation((Game.CANVAS_WIDTH / 2) - 75, 225, eLayerTypes.UI);
    this.submitButton.SetSize(150, 50);
    this.submitButton.SetText('Submit');
    this.submitButton.SetClickFunction(async () => {
      this.hasPermission = await Game.TheAPI.Login(this.username.Text!, this.password.Text!);

      if (this.hasPermission) {
        sessionStorage.setItem('username', this.username.Text!)
        Game.SetUsername(this.username.Text!);
      }
    });
    this.submitButton.Load();

    this.customClose.SetLocation((Game.CANVAS_WIDTH / 2 + 390), 35, eLayerTypes.UI);
    this.customClose.SetSize(50, 50);
    this.customClose.SetText('X');
    this.customClose.SetClickFunction(() => {
      this.customSceneOpen = false;

      this.gameObjects.forEach((go) => {
        go.SetEnabled(true);
      });
    });
    this.customClose.Load();


    this.playCustomButton.SetLocation((Game.CANVAS_WIDTH / 2 - 100), 150, eLayerTypes.UI);
    this.playCustomButton.SetSize(200, 50);
    this.playCustomButton.SetText('Play');
    this.playCustomButton.SetClickFunction(() => {
      if (this.selectedScene)
        Game.SetTheScene('blank', new BlankLevelScene(this.selectedScene));
    });
    this.playCustomButton.Load();
    this.editCustomButton.SetLocation((Game.CANVAS_WIDTH / 2 - 100), 225, eLayerTypes.UI);
    this.editCustomButton.SetSize(200, 50);
    this.editCustomButton.SetText('Edit');
    this.editCustomButton.SetClickFunction(() => {
      if (this.selectedScene && this.selectedSceneIndex)
        Game.SetTheScene('editstage', new EditStage(this.selectedScene, this.scenes[this.selectedSceneIndex].unid));
    });
    this.editCustomButton.Load();
    this.deleteCustomButton.SetLocation((Game.CANVAS_WIDTH / 2 - 100), 300, eLayerTypes.UI);
    this.deleteCustomButton.SetSize(200, 50);
    this.deleteCustomButton.SetText('Delete');
    this.deleteCustomButton.SetClickFunction(() => {
      if (this.selectedSceneIndex !== null && this.scenes[this.selectedSceneIndex].creatorName.toLowerCase() === Game.Username.toLowerCase())
        Game.DeleteCustomScene(this.scenes[this.selectedSceneIndex].unid);

      this.selectedScene = null;
      this.selectedSceneIndex = null;
      this.customSceneOpen = false;
    });
    this.deleteCustomButton.Load();
    this.closeCustomWindowButton.SetLocation((Game.CANVAS_WIDTH / 2 - 100), 375, eLayerTypes.UI);
    this.closeCustomWindowButton.SetSize(200, 50);
    this.closeCustomWindowButton.SetText('Close');
    this.closeCustomWindowButton.SetClickFunction(() => {
      this.selectedScene = null;

      this.sceneButtons.forEach((butt) => butt.SetEnabled(true));
    });
    this.closeCustomWindowButton.Load();

    this.editStageButton.SetLocation(Game.CANVAS_WIDTH / 2 - 100, Game.CANVAS_HEIGHT / 2, eLayerTypes.UI);
    this.editStageButton.SetSize(200, 100);
    this.editStageButton.SetText('Create Level');
    this.editStageButton.SetClickFunction(() => Game.SetTheScene('editstage'));
    this.editStageButton.Load();

    this.addCreditsButton.SetLocation(Game.CANVAS_WIDTH / 2 - 100, (Game.CANVAS_HEIGHT / 2) + 125, eLayerTypes.UI);
    this.addCreditsButton.SetSize(200, 100);
    this.addCreditsButton.SetText('Add Credits');
    this.addCreditsButton.SetClickFunction(() => Game.AddCredits(10));
    this.addCreditsButton.Load();

    if (Game.Username !== '') {
      this.hasPermission = true;
      this.username.SetText(Game.Username);
    }
  }

  private sceneButtons: Button[] = [];

  private hasPermission = false;
  override Update(deltaTime: number) {
    super.Update(deltaTime);

    if (this.settingsOpen) {
      this.username.Update(deltaTime);
      this.password.Update(deltaTime);
      this.submitButton.Update(deltaTime);
    }

    if (this.hasPermission) {
      this.editStageButton.Update(deltaTime);
      this.addCreditsButton.Update(deltaTime);
    }

    if (this.customSceneOpen) {
      this.customClose.Update(deltaTime);

      this.sceneButtons.forEach((btn) => btn.Update(deltaTime));
    }

    if (this.selectedScene) {
      this.playCustomButton.Update(deltaTime);
      this.closeCustomWindowButton.Update(deltaTime);

      if (this.hasPermission && this.scenes[this.selectedSceneIndex!].creatorName.toLowerCase() === Game.Username.toLowerCase()) {
        this.editCustomButton.Update(deltaTime);
        this.deleteCustomButton.Update(deltaTime);
      }
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

      this.username.Draw(deltaTime);
      this.password.Draw(deltaTime);
      this.submitButton.Draw(deltaTime);

      if (this.hasPermission) {
        this.editStageButton.Draw(deltaTime);
        this.addCreditsButton.Draw(deltaTime);
      }
    }

    if (this.customSceneOpen) {
      Game.CONTEXT!.fillStyle = '#555555';
      Game.CONTEXT!.fillRect((Game.CANVAS_WIDTH / 2) - 400, 25, 850, Game.CANVAS_HEIGHT - 50);

      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect((Game.CANVAS_WIDTH / 2) - 400, 25, 850, Game.CANVAS_HEIGHT - 50);

      this.customClose.Draw(deltaTime);

      this.sceneButtons.forEach((btn) => btn.Draw(deltaTime));
    }

    if (this.selectedScene) {
      Game.CONTEXT!.fillStyle = '#555555';
      Game.CONTEXT!.fillRect((Game.CANVAS_WIDTH / 2) - 200, 125, 400, Game.CANVAS_HEIGHT - 550);

      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect((Game.CANVAS_WIDTH / 2) - 200, 125, 400, Game.CANVAS_HEIGHT - 550);

      this.playCustomButton.Draw(deltaTime);
      this.closeCustomWindowButton.Draw(deltaTime);

      if (this.hasPermission && this.scenes[this.selectedSceneIndex!].creatorName.toLowerCase() === Game.Username.toLowerCase()) {
        this.editCustomButton.Draw(deltaTime);
        this.deleteCustomButton.Draw(deltaTime);
      }
    }
  }


  private settingsOpen: boolean = false;
  private customSceneOpen: boolean = false;
  private selectedScene: string | null = null;
  private selectedSceneIndex: number | null = null;
}
