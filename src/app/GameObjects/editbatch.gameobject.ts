import { eLayerTypes } from "../Scenes/scene.interface";
import { Vector2 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { Base } from "./base.gameobject";
import { Button } from "./Utilities/button.gameobject";
import { TextBox } from "./Utilities/textbox.gameobject";

export class EditBatch extends Base {
  public override get Value(): number | null {
    return null;
  }

  public override Load() {
    super.Load();

    this.closeButton.SetLocation(this.ObjectRect.Center.X - 50, this.ObjectRect.Center.Y + 150, eLayerTypes.UI);
    this.closeButton.SetSize(100, 50);
    this.closeButton.SetText('Close');
    this.closeButton.SetClickFunction(() => {
      this.isHidden = true;
    });
    this.closeButton.Load();
    this.gameObjects.push(this.closeButton);

    this.numEnemiesPrompt.SetLocation(this.ObjectRect.Center.X - 125, this.Location.Y + 25, eLayerTypes.UI);
    this.timeBetweenPrompt.SetLocation(this.ObjectRect.Center.X - 125, this.Location.Y + 100, eLayerTypes.UI);
    this.speedPrompt.SetLocation(this.ObjectRect.Center.X - 125, this.Location.Y + 175, eLayerTypes.UI);
    this.healthPrompt.SetLocation(this.ObjectRect.Center.X - 125, this.Location.Y + 250, eLayerTypes.UI);
    this.canFlyPrompt.SetLocation(this.ObjectRect.Center.X - 125, this.Location.Y + 325, eLayerTypes.UI);

    this.valuePrompt.SetLocation(this.ObjectRect.Center.X + 125, this.Location.Y + 25, eLayerTypes.UI);
    this.sizePrompt.SetLocation(this.ObjectRect.Center.X + 125, this.Location.Y + 100, eLayerTypes.UI);
    this.damagePrompt.SetLocation(this.ObjectRect.Center.X + 125, this.Location.Y + 175, eLayerTypes.UI);
    this.startLocalPrompt.SetLocation(this.ObjectRect.Center.X + 125, this.Location.Y + 250, eLayerTypes.UI);

    this.numEnemiesPrompt.SetSize(75, 50);
    this.timeBetweenPrompt.SetSize(75, 50);
    this.speedPrompt.SetSize(75, 50);
    this.healthPrompt.SetSize(75, 50);
    this.valuePrompt.SetSize(75, 50);
    this.sizePrompt.SetSize(75, 50);
    this.damagePrompt.SetSize(75, 50);
    this.startLocalPrompt.SetSize(75, 50);
    this.canFlyPrompt.SetSize(75, 50);

    this.numEnemiesPrompt.SetText('5');
    this.timeBetweenPrompt.SetText('500');
    this.speedPrompt.SetText('5');
    this.healthPrompt.SetText('15');
    this.valuePrompt.SetText('3');
    this.sizePrompt.SetText('25');
    this.damagePrompt.SetText('1');
    this.startLocalPrompt.SetText('1,2');
    this.canFlyPrompt.SetText('0');

    this.numEnemiesPrompt.SetPrompt('Set number of enemies for batch (1 - 50):');
    this.timeBetweenPrompt.SetPrompt('Set time between spawns (in milliseconds) (100 - 5000):');
    this.speedPrompt.SetPrompt('Set speed of enemy (1 - 20):');
    this.healthPrompt.SetPrompt('Set health of enemy (1 - 1000):');
    this.valuePrompt.SetPrompt('Set value of enemy (0 - 1000):');
    this.sizePrompt.SetPrompt('Set size of enemy (5 - 200):');
    this.damagePrompt.SetPrompt('Set damage enemy deals (1 - 100):');
    this.startLocalPrompt.SetPrompt('Set staring location (1 - ???):');
    this.canFlyPrompt.SetPrompt('Set if enemies should fly (0 false, 1 true):');

    this.numEnemiesPrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        let textAsNumber = Number(text);

        if (isNaN(textAsNumber)) {
          alert('Enter a valid number');
          return '5';
        }

        if (textAsNumber < 1)
          return '1';

        if (textAsNumber > 50)
          return '50';

        return textAsNumber.toFixed(0);
      }

      return '5';
    });
    this.timeBetweenPrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        let textAsNumber = Number(text);

        if (isNaN(textAsNumber)) {
          alert('Enter a valid number');
          return '500';
        }

        if (textAsNumber < 100)
          return '100';

        if (textAsNumber > 5000)
          return '5000';

        return textAsNumber.toFixed(0);
      }

      return '500';
    });
    this.speedPrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        let textAsNumber = Number(text);

        if (isNaN(textAsNumber)) {
          alert('Enter a valid number');
          return '5';
        }

        if (textAsNumber < 1)
          return '1';

        if (textAsNumber > 20)
          return '20';

        return textAsNumber.toFixed(0);
      }

      return '5';
    });
    this.healthPrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        let textAsNumber = Number(text);

        if (isNaN(textAsNumber)) {
          alert('Enter a valid number');
          return '15';
        }

        if (textAsNumber < 1)
          return '1';

        if (textAsNumber > 1000)
          return '1000';

        return textAsNumber.toFixed(0);
      }

      return '15';
    });
    this.valuePrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        let textAsNumber = Number(text);

        if (isNaN(textAsNumber)) {
          alert('Enter a valid number');
          return '3';
        }

        if (textAsNumber < 0)
          return '0';

        if (textAsNumber > 1000)
          return '1000';

        return textAsNumber.toFixed(0);
      }

      return '3';
    });
    this.sizePrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        let textAsNumber = Number(text);

        if (isNaN(textAsNumber)) {
          alert('Enter a valid number');
          return '25';
        }

        if (textAsNumber < 5)
          return '5';

        if (textAsNumber > 200)
          return '200';

        return textAsNumber.toFixed(0);
      }

      return '25';
    });
    this.damagePrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        let textAsNumber = Number(text);

        if (isNaN(textAsNumber)) {
          alert('Enter a valid number');
          return '1';
        }

        if (textAsNumber < 1)
          return '1';

        if (textAsNumber > 100)
          return '100';

        return textAsNumber.toFixed(0);
      }

      return '1';
    });
    this.startLocalPrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        if (text.includes(',') || text.includes('-')) {
          let numbers = text.includes(',') ? text.split(',') : text.split('-');
          for (let i = 0; i < numbers.length; i++) {
            let num = Number(numbers[i]);

            if (isNaN(num)) {
              alert('Enter a valid number, a list of numbers (1,3), or a range (1-3)');
              return this.startLocalPrompt.Text;
            }
          }
          return text;
        }
        else {
          let textAsNumber = Number(text);

          if (isNaN(textAsNumber)) {
            alert('Enter a valid number, a list of numbers (1,3), or a range (1-3)');
            return this.startLocalPrompt.Text;
          }

          if (textAsNumber < 1)
            return '1';

          if (textAsNumber > 100)
            return '100';

          return textAsNumber.toFixed(0);
        }
      }

      return this.startLocalPrompt.Text;
    });
    this.canFlyPrompt.SetVerifyFunction((text: string | null) => {
      if (text) {
        let textAsNumber = Number(text);

        if (isNaN(textAsNumber)) {
          alert('Enter a valid number');
          return '0';
        }

        if (textAsNumber < 0)
          return '0';

        if (textAsNumber > 1)
          return '1';

        return textAsNumber.toFixed(0);
      }

      return '1';
    });

    this.numEnemiesPrompt.SetLabel('Number of Enemies:');
    this.timeBetweenPrompt.SetLabel('Time Between:');
    this.speedPrompt.SetLabel('Speed:');
    this.healthPrompt.SetLabel('Health:');
    this.valuePrompt.SetLabel('Credit Value:');
    this.sizePrompt.SetLabel('Size:');
    this.damagePrompt.SetLabel('Damage:');
    this.startLocalPrompt.SetLabel('Starting Spot:');
    this.canFlyPrompt.SetLabel('Can Fly:');

    this.numEnemiesPrompt.Load();
    this.timeBetweenPrompt.Load();
    this.speedPrompt.Load();
    this.healthPrompt.Load();
    this.valuePrompt.Load();
    this.sizePrompt.Load();
    this.damagePrompt.Load();
    this.startLocalPrompt.Load();
    this.canFlyPrompt.Load();

    this.gameObjects.push(this.numEnemiesPrompt);
    this.gameObjects.push(this.timeBetweenPrompt);
    this.gameObjects.push(this.speedPrompt);
    this.gameObjects.push(this.healthPrompt);
    this.gameObjects.push(this.valuePrompt);
    this.gameObjects.push(this.sizePrompt);
    this.gameObjects.push(this.damagePrompt);
    this.gameObjects.push(this.startLocalPrompt);
    this.gameObjects.push(this.canFlyPrompt);
  }

  public override Draw(deltaTime: number) {
    if (!this.isHidden) {
      Game.CONTEXT!.fillStyle = '#555555';
      Game.CONTEXT!.fillRect(this.Location.X, this.Location.Y, this.Size.X, this.Size.Y);

      Game.CONTEXT.lineWidth = 5;
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.strokeRect(this.Location.X, this.Location.Y, this.Size.X, this.Size.Y);
    }
  }

  public get NumberEnemies(): number {
    return Number(this.numEnemiesPrompt.Text!);
  }
  public SetNumberEnemies(num: number): void {
    this.numEnemiesPrompt.SetText(num.toFixed(0));
  }

  public get EnemyDamage(): number {
    return Number(this.damagePrompt.Text!);
  }
  public SetEnemyDamage(num: number): void {
    this.damagePrompt.SetText(num.toFixed(0));
  }

  public get EnemyHealth(): number {
    return Number(this.healthPrompt.Text!);
  }
  public SetEnemyHealth(num: number): void {
    this.healthPrompt.SetText(num.toFixed(0));
  }

  public get EnemySize(): number {
    return Number(this.sizePrompt.Text!);
  }
  public SetEnemySize(num: number): void {
    this.sizePrompt.SetText(num.toFixed(0));
  }

  public get EnemySpeed(): number {
    return Number(this.speedPrompt.Text!);
  }
  public SetEnemySpeed(num: number): void {
    this.speedPrompt.SetText(num.toFixed(0));
  }

  public get StartCells(): number[] {
    if (this.startLocalPrompt.Text!.includes('-')) {
      let nums = this.startLocalPrompt.Text!.split('-');
      let cells: number[] = [];

      for (let i = Number(nums[0]); i <= Number(nums[1]); i++) {
        cells.push(i - 1);
      }

      return cells;
    }
    else if (this.startLocalPrompt.Text!.includes(',')) {
      let nums = this.startLocalPrompt.Text!.split(',');
      let cells: number[] = [];

      nums.forEach((num) => {
        cells.push(Number(num) - 1);
      });

      return cells;
    }
    else {
      return [Number(this.startLocalPrompt.Text!)]
    }
  }
  public SetStartCells(nums: number[]): void {
    let text = (nums[0] + 1).toFixed(0);
    if (nums.length > 3 && ((nums[nums.length - 1] - nums[0]) + 1) === nums.length) {
      text += '-' + (nums[nums.length - 1] + 1).toFixed(0);
    }
    else {
      for (let i = 1; i < nums.length; i++) {
        text += ',' + (nums[i] + 1).toFixed(0);
      }
    }

    this.startLocalPrompt.SetText(text);
  }

  public get EnemyValue(): number {
    return Number(this.valuePrompt.Text!);
  }
  public SetEnemyValue(num: number): void {
    this.valuePrompt.SetText(num.toFixed(0));
  }

  public get EnemyCooldownTime(): number {
    return Number(this.timeBetweenPrompt.Text!);
  }
  public SetEnemyCooldown(num: number): void {
    this.timeBetweenPrompt.SetText(num.toFixed(0));
  }

  public get EnemiesCanFly(): boolean {
    return (this.canFlyPrompt.Text! === '1');
  }
  public SetEnemyCanFly(can: boolean): void {
    this.canFlyPrompt.SetText(can ? '1' : '0');
  }

  private closeButton: Button = new Button();

  private numEnemiesPrompt: TextBox = new TextBox();
  private timeBetweenPrompt: TextBox = new TextBox();
  private speedPrompt: TextBox = new TextBox();
  private healthPrompt: TextBox = new TextBox();
  private valuePrompt: TextBox = new TextBox();
  private sizePrompt: TextBox = new TextBox();
  private damagePrompt: TextBox = new TextBox();
  private startLocalPrompt: TextBox = new TextBox();
  private canFlyPrompt: TextBox = new TextBox();
}
