import { eLayerTypes } from "../Scenes/scene.interface";
import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Base } from "./base.gameobject";
import { EditRound } from "./editround.gameobject";
import { IGameObject } from "./gameobject.interface";
import { Button } from "./Utilities/button.gameobject";
import { Label } from "./Utilities/label.gameobject";
import { TextBox } from "./Utilities/textbox.gameobject";

export class EditStageSettings extends Base {
  public override get Value(): number | null {
    return null;
  }

  public override Load() {
    super.Load();

    this.homeButton.SetLocation(this.ObjectRect.Center.X - 125, this.ObjectRect.Center.Y + 250, eLayerTypes.UI + 1);
    this.homeButton.SetSize(100, 50);
    this.homeButton.SetText('Home');
    this.homeButton.SetClickFunction(() => Game.SetTheScene('instructions'));
    this.homeButton.Load();
    this.gameObjects.push(this.homeButton);

    this.resetButton.SetLocation(this.ObjectRect.Center.X + 25, this.ObjectRect.Center.Y + 250, eLayerTypes.UI + 1);
    this.resetButton.SetSize(100, 50);
    this.resetButton.SetText('Reset');
    this.resetButton.SetClickFunction(() => Game.SetTheScene('editstage'));
    this.resetButton.Load();
    this.gameObjects.push(this.resetButton);

    this.resumeButton.SetLocation(this.ObjectRect.Center.X + 25, this.ObjectRect.Center.Y + 325, eLayerTypes.UI + 1);
    this.resumeButton.SetSize(100, 50);
    this.resumeButton.SetText('Close');
    this.resumeButton.SetClickFunction(() => {
      this.isHidden = true;
    });
    this.resumeButton.Load();
    this.gameObjects.push(this.resumeButton);

    this.saveButton.SetLocation(this.ObjectRect.Center.X - 125, this.ObjectRect.Center.Y + 325, eLayerTypes.UI + 1);
    this.saveButton.SetSize(100, 50);
    this.saveButton.SetText('Save');
    this.saveButton.SetClickFunction(() => {
      //if (this.startingCells.length !== this.endingCells.length) {
      //  alert('Start count must match End count');
      //  return;
      //}
    });
    this.saveButton.Load();
    this.gameObjects.push(this.saveButton);

    this.creditPrompt.SetLocation(this.ObjectRect.Center.X - 75, this.Location.Y + 50, eLayerTypes.UI + 1);
    this.creditPrompt.SetSize(150, 50);
    this.creditPrompt.SetText('40');
    this.creditPrompt.SetPrompt('Set Starting Credits (10 - 1000)');
    this.creditPrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        let textAsNumber = Number(text);

        if (isNaN(textAsNumber)) {
          alert('Enter a valid number');
          return '40';
        }

        if (textAsNumber < 10)
          return '10';

        if (textAsNumber > 1000)
          return '1000';

        return textAsNumber.toFixed(0);
      }

      return '40';
    });
    this.creditPrompt.Load();
    this.gameObjects.push(this.creditPrompt);

    this.creditLabel.SetLocation(this.ObjectRect.Center.X - 175, this.Location.Y + 50, eLayerTypes.UI + 1);
    this.creditLabel.SetSize(150, 50);
    this.creditLabel.SetText('Starting Credits:', undefined, 'right');
    this.creditLabel.Load();
    this.gameObjects.push(this.creditLabel);

    this.healthPrompt.SetLocation(this.ObjectRect.Center.X - 75, this.Location.Y + 125, eLayerTypes.UI + 1);
    this.healthPrompt.SetSize(150, 50);
    this.healthPrompt.SetText('10');
    this.healthPrompt.SetPrompt('Set Player Health (1 - 100)');
    this.healthPrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        let textAsNumber = Number(text);

        if (isNaN(textAsNumber)) {
          alert('Enter a valid number');
          return '10';
        }

        if (textAsNumber < 1)
          return '1';

        if (textAsNumber > 100)
          return '100';

        return textAsNumber.toFixed(0);
      }

      return '10';
    });
    this.healthPrompt.Load();
    this.gameObjects.push(this.healthPrompt);

    this.healthLabel.SetLocation(this.ObjectRect.Center.X - 175, this.Location.Y + 125, eLayerTypes.UI + 1);
    this.healthLabel.SetSize(150, 50);
    this.healthLabel.SetText('Player Health:', undefined, 'right');
    this.healthLabel.Load();
    this.gameObjects.push(this.healthLabel);

    this.roundsPrompt.SetLocation(this.ObjectRect.Center.X - 75, this.Location.Y + 200, eLayerTypes.UI + 1);
    this.roundsPrompt.SetSize(150, 50);
    this.roundsPrompt.SetText('4');
    this.roundsPrompt.SetPrompt('Set Number of Rounds (1 - 10)');
    this.roundsPrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        let textAsNumber = Number(text);

        if (isNaN(textAsNumber)) {
          alert('Enter a valid number');
          this.setRoundButtons(0);
          return null;
        }

        if (textAsNumber < 1) {
          this.setRoundButtons(1);
          return '1';
        }

        if (textAsNumber > 10) {
          this.setRoundButtons(10);
          return '10';
        }
        this.setRoundButtons(textAsNumber)
        return textAsNumber.toFixed(0);
      }

      this.setRoundButtons(0);
      return null;
    });
    this.roundsPrompt.Load();
    this.gameObjects.push(this.roundsPrompt);

    this.roundsLabel.SetLocation(this.ObjectRect.Center.X - 175, this.Location.Y + 200, eLayerTypes.UI + 1);
    this.roundsLabel.SetSize(150, 50);
    this.roundsLabel.SetText('# Rounds:', undefined, 'right');
    this.roundsLabel.Load();
    this.gameObjects.push(this.roundsLabel);

    for (let i = 0; i < 10; i++) {
      let roundEditor = new EditRound();
      roundEditor.SetLocation(this.ObjectRect.Center.X - 400, this.ObjectRect.Center.Y - 300, eLayerTypes.UI + 2);
      roundEditor.SetSize(800, 600);
      roundEditor.SetHidden(true);
      roundEditor.Load();
      this.roundEditors.push(roundEditor);
      this.gameObjects.push(this.roundEditors[i]);

      let roundButton = new Button();
      let x = this.ObjectRect.Center.X - 225;
      if (i % 2 !== 0)
        x = this.ObjectRect.Center.X + 25;

      let y = (this.ObjectRect.Center.Y - 125) + (Math.floor(i / 2) * 75);
      roundButton.SetLocation(x, y, eLayerTypes.UI + 1);
      roundButton.SetSize(200, 50);
      roundButton.SetText(`Round ${i+1}`);
      roundButton.SetClickFunction(() => {
        this.editRoundOpen = true;

        this.gameObjects.forEach((obj) => {
          obj.SetEnabled(false);
        });
        this.roundEditors[i].SetHidden(false);
        this.roundEditors[i].SetEnabled(true);
      });
      roundButton.Load();
      this.roundButtons.push(roundButton);
      this.gameObjects.push(this.roundButtons[i]);
    }

    this.setRoundButtons(4);

    this.gameObjects.sort((a, b) =>
      a.Location.Z - b.Location.Z
    );
  }

  public override Update(deltaTime: number) {
    if (!this.isHidden && this.IsEnabled) {
      this.GameObjects.forEach((obj) => {
        if (obj.IsEnabled && !obj.IsHidden)
          obj.Update(deltaTime);
      });

      if (this.editRoundOpen) {
        let allClosed = true;
        this.roundEditors.forEach((editor) => {
          if (!editor.IsHidden) {
            allClosed = false;
          }
        });
        if (allClosed) {
          this.editRoundOpen = false;

          this.gameObjects.forEach((obj) => {
            obj.SetEnabled(true);
          });
        }
      }
    }
  }

  public override Draw(deltaTime: number) {
    if (!this.isHidden) {
      Game.CONTEXT!.fillStyle = '#555555';
      Game.CONTEXT!.fillRect(this.Location.X, this.Location.Y, this.Size.X, this.Size.Y);

      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect(this.Location.X, this.Location.Y, this.Size.X, this.Size.Y);

      this.GameObjects.forEach((obj) => {
        if (!obj.IsHidden)
          obj.Draw(deltaTime);
      });
    }
  }

  private setRoundButtons(rounds: number): void {
    for (let i = 0; i < 10; i++) {
      if (i < rounds) {
        this.roundButtons[i].SetHidden(false);
      }
      else {
        this.roundButtons[i].SetHidden(true);
      }
    }
  } 

  private resumeButton: Button = new Button();
  private homeButton: Button = new Button();
  private resetButton: Button = new Button();
  private saveButton: Button = new Button();

  private roundButtons: Button[] = [];
  private roundEditors: EditRound[] = [];

  private creditLabel: Label = new Label();
  private healthLabel: Label = new Label();
  private roundsLabel: Label = new Label();

  private creditPrompt: TextBox = new TextBox();
  private healthPrompt: TextBox = new TextBox();
  private roundsPrompt: TextBox = new TextBox();

  private editRoundOpen = false;
}
