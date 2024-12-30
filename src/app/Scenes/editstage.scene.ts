
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Boundary } from "../GameObjects/boundary.gameobject";
import { EditStageSettings } from "../GameObjects/editstagesettings.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Grid } from "../GameObjects/grid.gameobject";
import { Button } from "../GameObjects/Utilities/button.gameobject";
import { Slider } from "../GameObjects/Utilities/slider.gameobject";
import { TextBox } from "../GameObjects/Utilities/textbox.gameobject";
import { Rect, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { ePathCellStatus } from "../Utility/pathfinding.service";
import { BaseLevel } from "./base.scene";
import { eDefenderTypes } from "./defensebase.scene";
import { eLayerTypes } from "./scene.interface";

export class EditStage extends BaseLevel {

  protected gameObjects: IGameObject[] = [];
  protected override get GameObjects(): IGameObject[] {
    return this.gameObjects;
  }
  protected get LevelUnid(): number {
    return -1;
  }
  protected get CurrentSceneName(): string {
    return 'editstage';
  }
  protected get NextLevelName(): string {
    return '';
  }
  protected get PlayerStartingHealth(): number {
    return 10;
  }
  protected get SecondsBetweenMonsters(): number {
    return 1.25;
  }
  protected get SecondsToStart(): number {
    return 120;
  }
  private availableDefenders = [eDefenderTypes.BasicTurret];
  protected get AvailableDefenders(): eDefenderTypes[] {
    return this.availableDefenders;
  }
  protected get TotalEnemies(): number {
    return 50;
  }
  private startingCells: Vector2[] = [];
  protected get StartingCells(): Vector2[] {
    return this.startingCells;
  }
  private endingCells: Vector2[] = [];
  protected get EndingCells(): Vector2[] {
    return this.endingCells;
  }
  protected get TurretCellSize(): number {
    return 100;
  }
  protected get GridCellSize(): number {
    return 100;
  }
  protected get UICellSize(): number {
    return 100;
  }

  public Load(): void {
    this.theGrid.SetLocation(0, 0, eLayerTypes.Background);
    this.theGrid.SetSize(Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
    this.theGrid.SetGridCellSize(this.GridCellSize);
    this.theGrid.SetUICellSize(this.UICellSize);
    this.theGrid.SetClickFunction(() => {
      this.theGrid.AddStartPoint();
    });
    this.LoadGameObject(this.theGrid);

    this.setUpBoundaries();

    this.LoadGameObject(this.topBoundary);
    this.LoadGameObject(this.bottomBoundary);
    this.LoadGameObject(this.rightBoundary);
    this.LoadGameObject(this.leftBoundary);
    
    this.slider.SetLocation(Game.CANVAS_WIDTH / 2 - 100, 25, 5);
    this.slider.SetSize(200, 25);
    this.slider.SetValueRange(20, 175);
    this.slider.SetValue(this.GridCellSize);
    this.LoadGameObject(this.slider);

    this.selectStartButton.SetLocation(Game.CANVAS_WIDTH - (this.UICellSize * 1), this.UICellSize * 1, eLayerTypes.UI);
    this.selectStartButton.SetSize(this.UICellSize, this.UICellSize);
    this.selectStartButton.SetText(`Start`);
    this.selectStartButton.SetSelected(true);
    this.selectStartButton.SetClickFunction(() => {
      this.selectEndButton.SetSelected(false);
      this.selectStartButton.SetSelected(true);

      this.theGrid.SetClickFunction(() => {
        this.theGrid.AddStartPoint();
      });
    });
    this.LoadGameObject(this.selectStartButton);

    this.selectEndButton.SetLocation(Game.CANVAS_WIDTH - (this.UICellSize * 1), this.UICellSize * 2, eLayerTypes.UI);
    this.selectEndButton.SetSize(this.UICellSize, this.UICellSize);
    this.selectEndButton.SetText(`End`);
    this.selectEndButton.SetClickFunction(() => {
      this.selectStartButton.SetSelected(false);
      this.selectEndButton.SetSelected(true);

      this.theGrid.SetClickFunction(() => {
        this.theGrid.AddEndPoint();
      });
    });
    this.LoadGameObject(this.selectEndButton);

    this.settings.SetLocation((Game.CANVAS_WIDTH / 2) - 300, 50, eLayerTypes.UI);
    this.settings.SetSize(600, 800);
    this.settings.SetHidden(true);
    this.LoadGameObject(this.settings);

    this.settingsButton.SetLocation(Game.CANVAS_WIDTH - 75, 25, eLayerTypes.UI);
    this.settingsButton.SetSize(50, 50);
    this.settingsButton.SetImage('/assets/images/cog.png');
    this.settingsButton.SetClickFunction(() => {
      if (this.settings.IsHidden) {
        this.settingsOpen = true;

        this.gameObjects.forEach((obj) => {
          obj.SetEnabled(false);
        });

        this.settings.SetHidden(false);
        this.settings.SetEnabled(true);
        this.settingsButton.SetEnabled(true);
      }
      else {
        this.settingsOpen = false;

        this.gameObjects.forEach((obj) => {
          obj.SetEnabled(true);
        });

        this.settings.SetHidden(true);
      }
    });
    this.LoadGameObject(this.settingsButton);
  }

  override Update(deltaTime: number): void {
    super.Update(deltaTime);
    
    if (this.theGrid.GridCellSize !== this.slider.Value) {
      this.updateGrid = true;
      this.theGrid.SetGridCellSize(this.slider.Value);
    }
    else if (this.updateGrid && !this.slider.Pressed) {
      this.updateGrid = false;
      this.theGrid.SetUpGrid();
      this.setUpBoundaries();
    }

    if (this.settings.IsHidden && this.settingsOpen) {
      this.settingsOpen = false;

      this.gameObjects.forEach((obj) => {
        obj.SetEnabled(true);
      });
    }
  }

  override Draw(deltaTime: number): void {
    Game.CONTEXT!.fillStyle = '#111111';
    Game.CONTEXT!.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

    super.Draw(deltaTime);
  }

  private setUpBoundaries(): void {
    //Top Wall
    this.topBoundary.SetLocation(0, 0, eLayerTypes.Boundary);
    this.topBoundary.SetSize(this.theGrid.PlayableArea.X + this.theGrid.PlayableArea.Width, this.theGrid.PlayableArea.Y);
    this.topBoundary.SetColor('#44444444');

    //Left Wall
    this.leftBoundary.SetLocation(0, this.theGrid.PlayableArea.Y, eLayerTypes.Boundary);
    this.leftBoundary.SetSize(this.theGrid.PlayableArea.X, Game.CANVAS_HEIGHT);
    this.leftBoundary.SetColor('#44444444');

    //Right Wall
    this.rightBoundary.SetLocation(this.theGrid.PlayableArea.TopRight.X, 0, eLayerTypes.Boundary);
    this.rightBoundary.SetSize((Game.CANVAS_WIDTH - this.theGrid.PlayableArea.TopRight.X), this.theGrid.PlayableArea.BottomRight.Y);
    this.rightBoundary.SetColor('#44444444');

    //Bottom Wall
    this.bottomBoundary.SetLocation(this.theGrid.PlayableArea.X, this.theGrid.PlayableArea.BottomLeft.Y, eLayerTypes.Boundary);
    this.bottomBoundary.SetSize(Game.CANVAS_WIDTH, (Game.CANVAS_HEIGHT - this.theGrid.PlayableArea.BottomLeft.Y));
    this.bottomBoundary.SetColor('#44444444');
  }

  private updateGrid = false;

  private slider: Slider = new Slider();
  private topBoundary: Boundary = new Boundary();
  private bottomBoundary: Boundary = new Boundary();
  private rightBoundary: Boundary = new Boundary();
  private leftBoundary: Boundary = new Boundary();

  private selectStartButton: Button = new Button();
  private selectEndButton: Button = new Button();
  private settingsButton: Button = new Button();

  private theGrid: Grid = new Grid();

  private settingsOpen = false;
  private settings: EditStageSettings = new EditStageSettings();
}
