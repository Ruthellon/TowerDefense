import { BlankLevelScene } from "../Scenes/blanklevel.scene";
import { DefenseBaseLevel } from "../Scenes/defensebase.scene";
import { eLayerTypes } from "../Scenes/scene.interface";
import { BlankSceneInfo, EnemyBatch, EnemyRound, Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Base } from "./base.gameobject";
import { EditBatch } from "./editbatch.gameobject";
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
      if (this.startingCells.length === 0 && this.endingCells.length === 0) {
        alert('Set a starting and ending cell');
        return;
      }
      if (this.startingCells.length !== this.endingCells.length) {
        alert('Start count must match End count');
        return;
      }
      
      this.saveScene();
    });
    this.saveButton.Load();
    this.gameObjects.push(this.saveButton);

    this.presetEasy.SetLocation(this.ObjectRect.TopRight.X - 100, this.ObjectRect.TopRight.Y + 25, eLayerTypes.UI);
    this.presetEasy.SetSize(75, 50);
    this.presetEasy.SetText('Easy');
    this.presetEasy.SetClickFunction(() => {
      this.setPresetEasy();
    });
    this.presetEasy.Load();
    this.gameObjects.push(this.presetEasy);

    this.presetMedium.SetLocation(this.ObjectRect.TopRight.X - 100, this.ObjectRect.TopRight.Y + 100, eLayerTypes.UI);
    this.presetMedium.SetSize(75, 50);
    this.presetMedium.SetText('Med.');
    this.presetMedium.SetClickFunction(() => {
      this.setPresetMedium();
    });
    this.presetMedium.Load();
    this.gameObjects.push(this.presetMedium);

    this.presetHard.SetLocation(this.ObjectRect.TopRight.X - 100, this.ObjectRect.TopRight.Y + 175, eLayerTypes.UI);
    this.presetHard.SetSize(75, 50);
    this.presetHard.SetText('Hard');
    this.presetHard.SetClickFunction(() => {
      this.setPresetHard();
    });
    this.presetHard.Load();
    this.gameObjects.push(this.presetHard);

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
          this.setRoundButtons(1);
          return '1';
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

      this.setRoundButtons(1);
      return '1';
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

  public SetStartEndCells(startCells: Vector2[], endCells: Vector2[]) {
    this.startingCells = startCells;
    this.endingCells = endCells;
  }

  public SetObstacles(obstaclesCells: Vector2[]) {
    this.obstaclesCells = obstaclesCells;
  }

  public SetGridSize(gridSize: number) {
    this.gridSize = gridSize;
  }

  public SetDefenderMultiplier(mulitplier: number) {
    this.defenderMultiplier = mulitplier;
  }

  public SetCredits(credits: number) {
    this.creditPrompt.SetText(credits.toFixed(0));
  }

  public SetHealth(health: number) {
    this.healthPrompt.SetText(health.toFixed(0));
  }

  public SetSceneName(unid: number, name: string) {
    this.sceneUnid = unid;
    this.sceneName = name;
  }

  public SetRounds(rounds: EnemyRound[]) {
    this.roundsPrompt.SetText(rounds.length.toFixed(0));
    this.setRoundButtons(rounds.length);

    for (let i = 0; i < rounds.length; i++) {
      for (let j = 0; j < rounds[i].EnemyBatches.length; j++) {
        let batch = rounds[i].EnemyBatches[j];
        this.roundEditors[i].AddBatch(batch);
      }
    }
  }

  public AddRound(round: EnemyRound) {
    let roundCount = Number(this.roundsPrompt.Text) + 1;
    this.roundsPrompt.SetText(roundCount.toFixed(0));
    this.setRoundButtons(roundCount);

    for (let j = 0; j < round.EnemyBatches.length; j++) {
      let batch = round.EnemyBatches[j];
      this.roundEditors[(roundCount - 1)].AddBatch(batch);
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

  private setPresetEasy() {
    this.SetCredits(150);
    this.SetHealth(20);
    this.roundsPrompt.SetText('0');
    this.setRoundButtons(0);

    let enemyRound1 = new EnemyRound();
    let enemyBatch1 = new EnemyBatch();
    enemyBatch1.EnemyCountStart = 15;
    enemyBatch1.EnemyDamage = 1;
    enemyBatch1.EnemyHealth = 18;
    enemyBatch1.EnemySize = Math.floor(this.gridSize / 2);
    enemyBatch1.EnemySpeed = 8;
    enemyBatch1.EnemyStartCells = [0];
    enemyBatch1.EnemyValue = 3;
    enemyBatch1.TimeBetweenStart = 1;
    enemyRound1.EnemyBatches.push(enemyBatch1);
    this.AddRound(enemyRound1);

    let enemyRound2 = new EnemyRound();
    let enemyBatch2 = new EnemyBatch();
    enemyBatch2.EnemyCountStart = 10;
    enemyBatch2.EnemyDamage = 1;
    enemyBatch2.EnemyHealth = 18;
    enemyBatch2.EnemySize = Math.floor(this.gridSize / 2);
    enemyBatch2.EnemySpeed = 10;
    enemyBatch2.EnemyStartCells = [0];
    enemyBatch2.EnemyValue = 3;
    enemyBatch2.TimeBetweenStart = 1;
    enemyRound2.EnemyBatches.push(enemyBatch2);
    let enemyBatch22 = new EnemyBatch();
    enemyBatch22.EnemyCountStart = 10;
    enemyBatch22.EnemyDamage = 1;
    enemyBatch22.EnemyHealth = 27;
    enemyBatch22.EnemySize = this.gridSize;
    enemyBatch22.EnemySpeed = 8;
    enemyBatch22.EnemyStartCells = [0];
    enemyBatch22.EnemyValue = 3;
    enemyBatch22.TimeBetweenStart = 1.5;
    enemyRound2.EnemyBatches.push(enemyBatch22);
    this.AddRound(enemyRound2);

    let enemyRound3 = new EnemyRound();
    let enemyBatch3 = new EnemyBatch();
    enemyBatch3.EnemyCountStart = 15;
    enemyBatch3.EnemyDamage = 1;
    enemyBatch3.EnemyHealth = 21;
    enemyBatch3.EnemySize = Math.floor(this.gridSize / 2);
    enemyBatch3.EnemySpeed = 12;
    enemyBatch3.EnemyStartCells = [0];
    enemyBatch3.EnemyValue = 3;
    enemyBatch3.TimeBetweenStart = 1;
    enemyRound3.EnemyBatches.push(enemyBatch3);
    let enemyBatch32 = new EnemyBatch();
    enemyBatch32.EnemyCountStart = 15;
    enemyBatch32.EnemyDamage = 1;
    enemyBatch32.EnemyHealth = 30;
    enemyBatch32.EnemySize = this.gridSize;
    enemyBatch32.EnemySpeed = 10;
    enemyBatch32.EnemyStartCells = [0];
    enemyBatch32.EnemyValue = 3;
    enemyBatch32.TimeBetweenStart = 1;
    enemyRound3.EnemyBatches.push(enemyBatch32);
    this.AddRound(enemyRound3);

    let enemyRound4 = new EnemyRound();
    let enemyBatch4 = new EnemyBatch();
    enemyBatch4.EnemyCountStart = 1;
    enemyBatch4.EnemyDamage = 5;
    enemyBatch4.EnemyHealth = 300;
    enemyBatch4.EnemySize = Math.floor(this.gridSize * 1.25);
    enemyBatch4.EnemySpeed = 8;
    enemyBatch4.EnemyStartCells = [0];
    enemyBatch4.EnemyValue = 30;
    enemyBatch4.TimeBetweenStart = 1;
    enemyRound4.EnemyBatches.push(enemyBatch4);
    this.AddRound(enemyRound4);
  }

  private setPresetMedium() {
    this.SetCredits(100);
    this.SetHealth(15);
    this.roundsPrompt.SetText('0');
    this.setRoundButtons(0);

    let enemyRound1 = new EnemyRound();
    let enemyBatch1 = new EnemyBatch();
    enemyBatch1.EnemyCountStart = 10;
    enemyBatch1.EnemyDamage = 1;
    enemyBatch1.EnemyHealth = 18;
    enemyBatch1.EnemySize = Math.floor(this.gridSize / 2);
    enemyBatch1.EnemySpeed = 8;
    enemyBatch1.EnemyStartCells = [0];
    enemyBatch1.EnemyValue = 3;
    enemyBatch1.TimeBetweenStart = 1;
    enemyRound1.EnemyBatches.push(enemyBatch1);
    let enemyBatch12 = new EnemyBatch();
    enemyBatch12.EnemyCountStart = 10;
    enemyBatch12.EnemyDamage = 1;
    enemyBatch12.EnemyHealth = 18;
    enemyBatch12.EnemySize = Math.floor(this.gridSize / 2);
    enemyBatch12.EnemySpeed = 8;
    enemyBatch12.EnemyStartCells = [1];
    enemyBatch12.EnemyValue = 3;
    enemyBatch12.TimeBetweenStart = 1;
    enemyRound1.EnemyBatches.push(enemyBatch12);
    this.AddRound(enemyRound1);

    let enemyRound2 = new EnemyRound();
    let enemyBatch2 = new EnemyBatch();
    enemyBatch2.EnemyCountStart = 10;
    enemyBatch2.EnemyDamage = 1;
    enemyBatch2.EnemyHealth = 21;
    enemyBatch2.EnemySize = Math.floor(this.gridSize / 2);
    enemyBatch2.EnemySpeed = 10;
    enemyBatch2.EnemyStartCells = [0];
    enemyBatch2.EnemyValue = 3;
    enemyBatch2.TimeBetweenStart = 1;
    enemyRound2.EnemyBatches.push(enemyBatch2);
    let enemyBatch22 = new EnemyBatch();
    enemyBatch22.EnemyCountStart = 10;
    enemyBatch22.EnemyDamage = 1;
    enemyBatch22.EnemyHealth = 27;
    enemyBatch22.EnemySize = this.gridSize;
    enemyBatch22.EnemySpeed = 8;
    enemyBatch22.EnemyStartCells = [0];
    enemyBatch22.EnemyValue = 3;
    enemyBatch22.TimeBetweenStart = 1.5;
    enemyRound2.EnemyBatches.push(enemyBatch22);
    let enemyBatch23 = new EnemyBatch();
    enemyBatch23.EnemyCountStart = 10;
    enemyBatch23.EnemyDamage = 1;
    enemyBatch23.EnemyHealth = 21;
    enemyBatch23.EnemySize = Math.floor(this.gridSize / 2);
    enemyBatch23.EnemySpeed = 10;
    enemyBatch23.EnemyStartCells = [0];
    enemyBatch23.EnemyValue = 3;
    enemyBatch23.TimeBetweenStart = 1;
    enemyRound2.EnemyBatches.push(enemyBatch23);
    let enemyBatch24 = new EnemyBatch();
    enemyBatch24.EnemyCountStart = 10;
    enemyBatch24.EnemyDamage = 1;
    enemyBatch24.EnemyHealth = 27;
    enemyBatch24.EnemySize = this.gridSize;
    enemyBatch24.EnemySpeed = 8;
    enemyBatch24.EnemyStartCells = [1];
    enemyBatch24.EnemyValue = 3;
    enemyBatch24.TimeBetweenStart = 1.5;
    enemyRound2.EnemyBatches.push(enemyBatch24);
    this.AddRound(enemyRound2);

    let enemyRound3 = new EnemyRound();
    let enemyBatch3 = new EnemyBatch();
    enemyBatch3.EnemyCountStart = 15;
    enemyBatch3.EnemyDamage = 1;
    enemyBatch3.EnemyHealth = 21;
    enemyBatch3.EnemySize = Math.floor(this.gridSize / 2);
    enemyBatch3.EnemySpeed = 12;
    enemyBatch3.EnemyStartCells = [0];
    enemyBatch3.EnemyValue = 3;
    enemyBatch3.TimeBetweenStart = 1;
    enemyRound3.EnemyBatches.push(enemyBatch3);
    let enemyBatch32 = new EnemyBatch();
    enemyBatch32.EnemyCountStart = 15;
    enemyBatch32.EnemyDamage = 1;
    enemyBatch32.EnemyHealth = 30;
    enemyBatch32.EnemySize = this.gridSize;
    enemyBatch32.EnemySpeed = 10;
    enemyBatch32.EnemyStartCells = [0];
    enemyBatch32.EnemyValue = 3;
    enemyBatch32.TimeBetweenStart = 1;
    enemyRound3.EnemyBatches.push(enemyBatch32);
    let enemyBatch33 = new EnemyBatch();
    enemyBatch33.EnemyCountStart = 15;
    enemyBatch33.EnemyDamage = 1;
    enemyBatch33.EnemyHealth = 21;
    enemyBatch33.EnemySize = Math.floor(this.gridSize / 2);
    enemyBatch33.EnemySpeed = 12;
    enemyBatch33.EnemyStartCells = [1];
    enemyBatch33.EnemyValue = 3;
    enemyBatch33.TimeBetweenStart = 1;
    enemyRound3.EnemyBatches.push(enemyBatch33);
    let enemyBatch34 = new EnemyBatch();
    enemyBatch34.EnemyCountStart = 15;
    enemyBatch34.EnemyDamage = 1;
    enemyBatch34.EnemyHealth = 30;
    enemyBatch34.EnemySize = this.gridSize;
    enemyBatch34.EnemySpeed = 10;
    enemyBatch34.EnemyStartCells = [1];
    enemyBatch34.EnemyValue = 3;
    enemyBatch34.TimeBetweenStart = 1;
    enemyRound3.EnemyBatches.push(enemyBatch34);
    let enemyBatch35 = new EnemyBatch();
    enemyBatch35.EnemyCountStart = 1;
    enemyBatch35.EnemyDamage = 5;
    enemyBatch35.EnemyHealth = 360;
    enemyBatch35.EnemySize = this.gridSize;
    enemyBatch35.EnemySpeed = 10;
    enemyBatch35.EnemyStartCells = [0];
    enemyBatch35.EnemyValue = 50;
    enemyBatch35.TimeBetweenStart = 5;
    enemyRound3.EnemyBatches.push(enemyBatch35);
    this.AddRound(enemyRound3);
  }

  private setPresetHard() {

  }

  private saveScene(): void {

    let sceneInfo = new BlankSceneInfo();
    sceneInfo.GridSize = this.gridSize;
    sceneInfo.DefSizeMulti = this.defenderMultiplier;
    sceneInfo.StartingCells = this.startingCells;
    sceneInfo.EndingCells = this.endingCells;
    sceneInfo.ObstacleCells = this.obstaclesCells;
    sceneInfo.Credits = this.creditPrompt.Text ? Number(this.creditPrompt.Text) : 30;
    sceneInfo.Health = this.healthPrompt.Text ? Number(this.healthPrompt.Text) : 10;

    let enemyRounds: EnemyRound[] = [];

    let highestStartCell = 0;
    this.roundEditors.forEach((editor) => {
      let round = new EnemyRound();

      editor.BatchEditors.forEach((batch) => {
        let enemyBatch = new EnemyBatch();
        enemyBatch.EnemyCountStart = batch.NumberEnemies;
        enemyBatch.EnemyDamage = batch.EnemyDamage;
        enemyBatch.EnemyHealth = batch.EnemyHealth;
        enemyBatch.EnemySize = batch.EnemySize;
        enemyBatch.EnemySpeed = batch.EnemySpeed;
        enemyBatch.EnemyStartCells = batch.StartCells;

        enemyBatch.EnemyStartCells.forEach((cell) => {
          if (cell > highestStartCell)
            highestStartCell = cell;
        });

        enemyBatch.EnemyValue = batch.EnemyValue;
        enemyBatch.TimeBetweenStart = (batch.EnemyCooldownTime / 1000);
        enemyBatch.BatchDelayTime = (batch.BatchDelayTime / 1000);
        enemyBatch.EnemyCanFly = batch.EnemiesCanFly;
        enemyBatch.ShieldValue = batch.ShieldValue;
        round.EnemyBatches.push(enemyBatch);
      });

      if (round.EnemyBatches.length > 0)
        enemyRounds.push(round);
    });

    if (highestStartCell > this.startingCells.length) {
      alert(`Missing ${highestStartCell - this.startingCells.length} Start and End cells`);
      return;
    }

    sceneInfo.Rounds = enemyRounds;

    let name = prompt('Name of your level?', this.sceneName);
    if (name) {
      sceneInfo.SceneName = name;
      let str = JSON.stringify(sceneInfo);

      if (name === this.sceneName && this.sceneUnid)
        Game.UpdateCustomScene(this.sceneUnid, this.sceneName, str);
      else
        Game.AddNewCustomScene(name, str);
      
      let blankScene = new BlankLevelScene(str);
      Game.SetTheScene('blank', blankScene);
    }
  }

  private resumeButton: Button = new Button();
  private homeButton: Button = new Button();
  private resetButton: Button = new Button();
  private saveButton: Button = new Button();

  private presetEasy: Button = new Button();
  private presetMedium: Button = new Button();
  private presetHard: Button = new Button();

  private roundButtons: Button[] = [];
  private roundEditors: EditRound[] = [];

  private creditLabel: Label = new Label();
  private healthLabel: Label = new Label();
  private roundsLabel: Label = new Label();

  private creditPrompt: TextBox = new TextBox();
  private healthPrompt: TextBox = new TextBox();
  private roundsPrompt: TextBox = new TextBox();

  private editRoundOpen = false;

  private startingCells: Vector2[] = [];
  private endingCells: Vector2[] = [];
  private obstaclesCells: Vector2[] = [];

  private gridSize: number = 0;
  private defenderMultiplier: number = 0;

  private sceneName: string | undefined;
  private sceneUnid: number | undefined;
}
