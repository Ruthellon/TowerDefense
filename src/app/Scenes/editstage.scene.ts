
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Boundary } from "../GameObjects/boundary.gameobject";
import { Defender } from "../GameObjects/defender.gameobject";
import { EditStageSettings } from "../GameObjects/editstagesettings.gameobject";
import { IGameObject } from "../GameObjects/gameobject.interface";
import { Grid } from "../GameObjects/grid.gameobject";
import { Turret } from "../GameObjects/turret.gameobject";
import { Button } from "../GameObjects/Utilities/button.gameobject";
import { Slider } from "../GameObjects/Utilities/slider.gameobject";
import { TextBox } from "../GameObjects/Utilities/textbox.gameobject";
import { BlankSceneInfo, Rect, Vector2, Vector3 } from "../Utility/classes.model";
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
  private defenderSize: number = 100;
  protected get DefenderSize(): number {
    return this.defenderSize;
  }
  protected get GridCellSize(): number {
    return 100;
  }
  protected get UICellSize(): number {
    return 100;
  }

  private sceneInfoString: string | undefined;
  private sceneUnid: number | undefined;
  constructor(sceneJSON?: string, sceneUnid?: number) {
    super();

    if (sceneJSON && sceneUnid) {
      this.sceneInfoString = sceneJSON;
      this.sceneUnid = sceneUnid;
    }
  }

  public Load(): void {
    this.theGrid.SetLocation(0, 0, eLayerTypes.Background);
    this.theGrid.SetSize(Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
    this.theGrid.SetGridCellSize(this.GridCellSize);
    this.theGrid.SetUICellSize(this.UICellSize);
    this.theGrid.SetClickFunction(() => {
      this.theGrid.AddStartPoint();
    });
    this.theGrid.SetShowGrid(true);
    this.LoadGameObject(this.theGrid);

    this.setUpBoundaries();

    this.LoadGameObject(this.topBoundary);
    this.LoadGameObject(this.bottomBoundary);
    this.LoadGameObject(this.rightBoundary);
    this.LoadGameObject(this.leftBoundary);
    
    this.gridSlider.SetLocation(Game.CANVAS_WIDTH / 2 - 225, 25, 5);
    this.gridSlider.SetSize(200, 25);
    this.gridSlider.SetValueRange(10, 150);
    this.gridSlider.SetValue(this.GridCellSize);
    this.LoadGameObject(this.gridSlider);

    this.defenderSlider.SetLocation(Game.CANVAS_WIDTH / 2 + 25, 25, 5);
    this.defenderSlider.SetSize(200, 25);
    this.defenderSlider.SetValueRange(1, Math.ceil(150 / this.GridCellSize));
    this.defenderSlider.SetValue(this.defenderMultiplier);
    this.LoadGameObject(this.defenderSlider);

    let turretlocal = this.theGrid.AddObstacle(true, this.DefenderSize, new Vector2(this.theGrid.PlayableArea.Center.X, this.theGrid.PlayableArea.TopLeft.Y));

    if (turretlocal) {
      this.turret.SetLocation(turretlocal.X, turretlocal.Y, eLayerTypes.Object);
      this.turret.SetSize(this.DefenderSize, this.DefenderSize);
      this.LoadGameObject(this.turret);
    }

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
        this.settings.SetStartEndCells(this.theGrid.StartingCells, this.theGrid.EndingCells);
        this.settings.SetGridSize(this.theGrid.GridCellSize);
        this.settings.SetDefenderMultiplier(this.defenderMultiplier)
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

    if (this.sceneInfoString) {
      let sceneInfo: BlankSceneInfo = JSON.parse(this.sceneInfoString);

      this.gridSlider.SetValue(sceneInfo.GridSize);
      this.gridSlider.Load();
      this.theGrid.SetGridCellSize(sceneInfo.GridSize);
      this.defenderSlider.SetValueRange(1, Math.ceil(150 / sceneInfo.GridSize));
      this.defenderSlider.SetValue(sceneInfo.DefSizeMulti ? sceneInfo.DefSizeMulti : 1);
      this.defenderSlider.Load();
      this.defenderSize = sceneInfo.GridSize * this.defenderSlider.Value;
      this.theGrid.SetObstacleCellSize(this.DefenderSize);
      this.theGrid.SetUpGrid();
      this.setUpBoundaries();

      let turretlocal = this.theGrid.AddObstacle(true, this.DefenderSize, new Vector2(this.theGrid.PlayableArea.Center.X, this.theGrid.PlayableArea.TopLeft.Y));

      if (turretlocal) {
        this.turret.SetLocation(turretlocal.X, turretlocal.Y, eLayerTypes.Object);
        this.turret.SetSize(this.DefenderSize, this.DefenderSize);
        this.turret.SetRange(this.DefenderSize * 1.5);
        this.turret.Load();
      }

      sceneInfo.StartingCells.forEach((start) => {
        this.theGrid.AddStartPoint(new Vector2(start.X, start.Y), false);
      });
      sceneInfo.EndingCells.forEach((end) => {
        this.theGrid.AddEndPoint(new Vector2(end.X, end.Y), false);
      });

      this.settings.SetCredits(sceneInfo.Credits);
      this.settings.SetHealth(sceneInfo.Health);
      this.settings.SetRounds(sceneInfo.Rounds);

      if (this.sceneUnid)
        this.settings.SetSceneName(this.sceneUnid, sceneInfo.SceneName);
    }
  }

  override Update(deltaTime: number): void {
    super.Update(deltaTime);
    
    if (this.theGrid.GridCellSize !== this.gridSlider.Value) {
      this.updateGrid = true;
      this.theGrid.SetGridCellSize(this.gridSlider.Value);
    }
    else if (this.updateGrid && !this.gridSlider.Pressed) {
      this.updateGrid = false;
      this.theGrid.SetUpGrid();
      this.setUpBoundaries();
      this.defenderSize = this.gridSlider.Value * this.defenderMultiplier;
      this.theGrid.SetObstacleCellSize(this.DefenderSize);

      this.defenderSlider.SetValueRange(1, Math.ceil(150 / this.gridSlider.Value));
      this.defenderSlider.SetValue(this.defenderMultiplier);

      let turretlocal = this.theGrid.AddObstacle(true, this.DefenderSize, new Vector2(this.theGrid.PlayableArea.Center.X, this.theGrid.PlayableArea.TopLeft.Y));

      if (turretlocal) {
        this.turret.SetLocation(turretlocal.X, turretlocal.Y, eLayerTypes.Object);
        this.turret.SetSize(this.DefenderSize, this.DefenderSize);
        this.turret.SetRange(this.DefenderSize * 1.5);
        this.turret.Load();
      }
    }

    if (this.defenderMultiplier !== this.defenderSlider.Value) {
      this.defenderMultiplier = this.defenderSlider.Value;
      this.defenderSize = this.gridSlider.Value * this.defenderMultiplier;
      this.theGrid.SetObstacleCellSize(this.DefenderSize);
      this.turret.SetSize(this.DefenderSize, this.DefenderSize);
      this.turret.SetRange(this.DefenderSize * 1.5);
      this.turret.Load();
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

  private gridSlider: Slider = new Slider();
  private defenderSlider: Slider = new Slider();
  private topBoundary: Boundary = new Boundary();
  private bottomBoundary: Boundary = new Boundary();
  private rightBoundary: Boundary = new Boundary();
  private leftBoundary: Boundary = new Boundary();

  private selectStartButton: Button = new Button();
  private selectEndButton: Button = new Button();
  private settingsButton: Button = new Button();

  private theGrid: Grid = new Grid();

  private defenderMultiplier: number = 1;

  private turret: Turret = new Turret();

  private settingsOpen = false;
  private settings: EditStageSettings = new EditStageSettings();
}
