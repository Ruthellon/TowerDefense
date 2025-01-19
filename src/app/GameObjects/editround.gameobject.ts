import { AppComponent } from "../app.component";
import { eLayerTypes } from "../Scenes/scene.interface";
import { EnemyBatch, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Attacker } from "./attacker.gameobject";
import { Base } from "./base.gameobject";
import { EditBatch } from "./editbatch.gameobject";
import { IGameObject } from "./gameobject.interface";
import { Button } from "./Utilities/button.gameobject";
import { Label } from "./Utilities/label.gameobject";
import { TextBox } from "./Utilities/textbox.gameobject";

export class EditRound extends Base {
  public override get Value(): number | null {
    return null;
  }

  public get BatchEditors(): EditBatch[] {
    return this.batchEditors;
  }

  public override Load() {
    super.Load();

    this.closeButton.SetLocation(this.ObjectRect.Center.X - 50, this.ObjectRect.Center.Y + 200, eLayerTypes.UI + 1);
    this.closeButton.SetSize(100, 50);
    this.closeButton.SetText('Close');
    this.closeButton.SetClickFunction(() => {
      this.isHidden = true;
    });
    this.closeButton.Load();
    this.gameObjects.push(this.closeButton);

    this.addBatchButton.SetLocation(this.ObjectRect.TopRight.X - 75, this.ObjectRect.TopRight.Y + 25, eLayerTypes.UI + 1);
    this.addBatchButton.SetSize(50, 50);
    this.addBatchButton.SetText('+');
    this.addBatchButton.SetClickFunction(() => {
      if (this.batchButtons.length >= 32)
        return;

      this.AddBatch();
    });
    this.addBatchButton.Load();
    this.gameObjects.push(this.addBatchButton);

    this.enemyCountLabel.SetLocation(this.ObjectRect.Center.X - 75, this.Location.Y + 50, eLayerTypes.UI + 1);
    this.enemyCountLabel.SetSize(150, 50);
    this.enemyCountLabel.SetText('Add and Edit Batches of Enemies', undefined, 'center');
    this.enemyCountLabel.Load();
    this.gameObjects.push(this.enemyCountLabel);
  }

  public override Update(deltaTime: number) {
    if (!this.isHidden && this.isEnabled) {
      this.GameObjects.forEach((obj) => {
        if (!obj.IsHidden && obj.IsEnabled) {
          obj.Update(deltaTime);
        }
      });

      for (let i = 0; i < this.batchButtons.length; i++) {
        if (this.batchButtons[i].ButtonText! !== this.batchEditors[i].NumberEnemies.toFixed(0)) {
          this.batchButtons[i].SetText(this.batchEditors[i].NumberEnemies.toFixed(0));
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

      this.gameObjects.sort((a, b) =>
        a.Location.Z - b.Location.Z
      );

      this.GameObjects.forEach((obj) => {
        if (!obj.IsHidden)
          obj.Draw(deltaTime);
      });
    }
  }

  public AddBatch(batch?: EnemyBatch) {
    let batchEdit = new EditBatch();
    batchEdit.SetSize(700, 500);
    batchEdit.SetLocation(this.ObjectRect.Center.X - 350, this.ObjectRect.Center.Y - 250, eLayerTypes.UI + 5);
    batchEdit.SetHidden(true);
    this.LoadGameObject(batchEdit);
    this.batchEditors.push(batchEdit);

    if (batch) {
      batchEdit.SetEnemyDamage(batch.EnemyDamage);
      batchEdit.SetEnemyHealth(batch.EnemyHealth);
      batchEdit.SetEnemySize(batch.EnemySize);
      batchEdit.SetEnemySpeed(batch.EnemySpeed);
      batchEdit.SetStartCells(batch.EnemyStartCells);
      batchEdit.SetEnemyValue(batch.EnemyValue);
      batchEdit.SetEnemyCooldown(batch.TimeBetweenStart * 1000);
      batchEdit.SetBatchDelayTime(batch.BatchDelayTime * 1000);
      batchEdit.SetEnemyCanFly(batch.EnemyCanFly);
      batchEdit.SetNumberEnemies(batch.EnemyCountStart);
      batchEdit.SetShieldValue(batch.ShieldValue);
    }

    let batchButt = new Button();

    let x = this.Location.X + 25;
    x += (this.batchButtons.length % 8) * 100;
    let y = this.Location.Y + 125;
    y += Math.floor(this.batchButtons.length / 8) * 100;

    let count = this.batchButtons.length;
    batchButt.SetLocation(x, y, eLayerTypes.UI + 1);
    batchButt.SetSize(50, 50);
    batchButt.SetText(batchEdit.NumberEnemies.toFixed(0));
    batchButt.SetClickFunction(() => {
      this.batchEditors[count].SetHidden(false);
    });
    this.LoadGameObject(batchButt);
    this.batchButtons.push(batchButt);
  }

  private batchButtons: Button[] = [];
  private batchEditors: EditBatch[] = [];

  private enemyCountLabel: Label = new Label();

  private closeButton: Button = new Button();
  private addBatchButton: Button = new Button();
}
