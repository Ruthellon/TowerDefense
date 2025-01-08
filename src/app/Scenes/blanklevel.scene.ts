
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Button } from "../GameObjects/Utilities/button.gameobject";
import { BlankSceneInfo, EnemyRound, Vector2, Vector3 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { DefenseBaseLevel, eDefenderTypes } from "./defensebase.scene";
import { eLayerTypes, IScene } from "./scene.interface";

export class BlankLevelScene extends DefenseBaseLevel {
  protected get LevelUnid(): number {
    return 1;
  }
  private sceneName = '';
  protected get CurrentSceneName(): string {
    return this.sceneName;
  }
  protected get NextLevelName(): string {
    return 'instructions';
  }
  private startingHealth = 10;
  protected get PlayerStartingHealth(): number {
    return this.startingHealth;
  }
  private secondsBetweenMonsters: number = 1;
  protected override get SecondsBetweenMonsters(): number {
    return 1;
  }
  private startSeconds: number = 120;
  protected override get SecondsToStart(): number {
    return this.startSeconds;
  }
  private availableDefenders = [eDefenderTypes.BasicTurret];
  protected get AvailableDefenders(): eDefenderTypes[] {
    return this.availableDefenders;
  }
  private enemyRounds = [5, 5, 5, 10, 10, 15];
  protected get EnemyRounds(): number[] {
    return this.enemyRounds;
  }
  protected override ReduceHealth(reduceBy: number): void {
    this.playerHealth -= reduceBy;
  }
  private startingCells = [new Vector2(0, 4)];
  protected get StartingCells(): Vector2[] {
    return this.startingCells;
  }
  private endingCells = [new Vector2(14, 4)];
  protected override get EndingCells(): Vector2[] {
    return this.endingCells;
  }
  private defenderSize = 100;
  protected get DefenderSize(): number {
    return this.defenderSize;
  }
  private gridSize = 100;
  protected get GridCellSize(): number {
    return this.gridSize;
  }
  private startCredits = 30;
  public get StartingCredits(): number {
    return this.startCredits;
  }
  private rounds: EnemyRound[] = [];
  private sceneInfoString: string = '';

  constructor(sceneJSON?: string) {
    super();

    if (sceneJSON) {
      this.sceneInfoString = sceneJSON;
      let sceneInfo: BlankSceneInfo = JSON.parse(sceneJSON);
      
      if (sceneInfo) {
        this.SetSceneName(sceneInfo.SceneName);
        this.SetGridSize(sceneInfo.GridSize);
        this.SetDefenderSize(sceneInfo.GridSize * sceneInfo.DefSizeMulti);
        this.SetStartEndCells(sceneInfo.StartingCells, sceneInfo.EndingCells);
        this.SetStartingCredits(sceneInfo.Credits);
        this.SetStartingHealth(sceneInfo.Health);
        this.SetRounds(sceneInfo.Rounds);
      }
    }
  }

  override Update(deltaTime: number): void {
    super.Update(deltaTime);
  }

  override Draw(deltaTime: number): void {
    super.Draw(deltaTime);

    if (!this.IsGameOver) {
      Game.CONTEXT.fillStyle = '#ffffff';
      Game.CONTEXT.font = '22px serif';
      Game.CONTEXT.textAlign = "center";
      Game.CONTEXT.fillText(`${this.CurrentSceneName} - Round ${this.CurrentRound + 1} / ${this.EnemyRounds.length}`, Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT - 50);
    }
  }

  override Load(): void {
    super.Load();
    Game.AddCredits(this.StartingCredits);
    this.restartButton.SetClickFunction(() => {
      Game.SetStartingCredits(this.StartingCredits >= 10 ? (this.StartingCredits - 10) : this.StartingCredits);
      let blankScene = new BlankLevelScene(this.sceneInfoString);
      Game.SetTheScene('blank', blankScene);
    });
  }

  override HandleAttackers(deltaTime: number) {
    let round = this.rounds[this.CurrentRound];

    round.EnemyBatches.forEach((batch) => {
      if (batch.TimeBetweenCurrent <= 0 && batch.EnemyCountCurrent < batch.EnemyCountStart) {
        let newAttacker = new Block();
        newAttacker.SetDamage(batch.EnemyDamage);
        newAttacker.SetLocation(this.StartingCells[batch.EnemyStartCell - 1].X - this.GridCellSize, this.StartingCells[batch.EnemyStartCell - 1].Y - this.GridCellSize, eLayerTypes.Object - 5);
        newAttacker.SetPath(this.GetPath(batch.EnemyStartCell - 1), this.GridCellSize);
        newAttacker.SetSize(batch.EnemySize, batch.EnemySize);
        newAttacker.SetStartingSpeed(batch.EnemySpeed);
        newAttacker.SetStartingHealth(batch.EnemyHealth);
        newAttacker.SetValue(batch.EnemyValue);
        newAttacker.SetCanFly(batch.EnemyCanFly);

        if (batch.EnemyCanFly)
          newAttacker.SetColor('#BB22BB');
        else
          newAttacker.SetColor('#22BB22');

        this.LoadGameObject(newAttacker);
        this.attackers.push(newAttacker);

        batch.EnemyCountCurrent++;
        batch.TimeBetweenCurrent = batch.TimeBetweenStart;
      }
      else if (batch.EnemyCountCurrent < batch.EnemyCountStart) {
        batch.TimeBetweenCurrent -= deltaTime;
      }
    });

  }

  protected CreateNewAttacker(attackerCount: number): Attacker {
    let newAttacker = new Block();
    newAttacker.SetDamage(1);
    newAttacker.SetColor('#22BB22');

    if (this.CurrentRound === 0) {
      this.startSeconds = 60;
      newAttacker.SetSize(20, 20);
      newAttacker.SetStartingSpeed(7);
      newAttacker.SetStartingHealth(15);
      newAttacker.SetValue(3);
    }
    else if (this.CurrentRound === 1) {
      newAttacker.SetSize(20, 20);
      newAttacker.SetStartingSpeed(7);
      newAttacker.SetStartingHealth(15);
      newAttacker.SetValue(3);
    }
    else if (this.CurrentRound === 2) {
      newAttacker.SetSize(30, 30);
      newAttacker.SetStartingSpeed(8);
      newAttacker.SetStartingHealth(18);
      newAttacker.SetValue(3);
    }
    else if (this.CurrentRound === 3) {
      newAttacker.SetSize(30, 30);
      newAttacker.SetStartingSpeed(8);
      newAttacker.SetStartingHealth(24);
      newAttacker.SetValue(3);
    }
    else if (this.CurrentRound === 4) {
      this.secondsBetweenMonsters = .75;

      if (attackerCount % 2 === 0) {
        newAttacker.SetSize(20, 20);
        newAttacker.SetStartingSpeed(10);
        newAttacker.SetStartingHealth(18);
        newAttacker.SetValue(3);
      }
      else {
        newAttacker.SetSize(40, 40);
        newAttacker.SetStartingSpeed(7);
        newAttacker.SetStartingHealth(24);
        newAttacker.SetValue(3);
      }
    }
    else if (this.CurrentRound === 5) {
      this.secondsBetweenMonsters = .75;

      if (attackerCount % 2 === 0) {
        newAttacker.SetSize(20, 20);
        newAttacker.SetStartingSpeed(10);
        newAttacker.SetStartingHealth(21);
        newAttacker.SetValue(3);
      }
      else {
        newAttacker.SetSize(40, 40);
        newAttacker.SetStartingSpeed(7);
        newAttacker.SetStartingHealth(27);
        newAttacker.SetValue(3);
      }
    }
    newAttacker.SetLocation(this.StartingCells[0].X - this.GridCellSize, this.StartingCells[0].Y - this.GridCellSize, eLayerTypes.Object - 5);
    newAttacker.SetPath(this.GetPath(0), this.GridCellSize);

    return newAttacker;
  }

  private firstWonCall = true;
  protected PlayerWonScreen(): void {
    Game.CONTEXT.fillStyle = '#ffffff';
    Game.CONTEXT.font = '32px serif';
    Game.CONTEXT.textAlign = "center";
    Game.CONTEXT.fillText('You Won!', Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT / 2 + 75);
  }

  public SetSceneName(name: string) {
    this.sceneName = name;
  }

  public SetGridSize(gridSize: number) {
    this.gridSize = gridSize;
  }

  public SetDefenderSize(defenderSize: number) {
    this.defenderSize = defenderSize;
  }

  public SetStartEndCells(startingCells: Vector2[], endingCells: Vector2[]) {
    this.startingCells = [];
    startingCells.forEach((cell) => {
      this.startingCells.push(new Vector2(cell.X, cell.Y));
    });
    this.endingCells = [];
    endingCells.forEach((cell) => {
      this.endingCells.push(new Vector2(cell.X, cell.Y));
    });
  }

  public SetStartingCredits(credits: number) {
    this.startCredits = credits;
  }

  public SetRounds(rounds: EnemyRound[]) {
    this.rounds = rounds;

    this.enemyRounds = [];

    this.rounds.forEach((round) => {
      let count = 0;

      round.EnemyBatches.forEach((batch) => {
        count += batch.EnemyCountStart;

        if (batch.EnemyCanFly && this.availableDefenders.length === 1) {
          this.availableDefenders.push(eDefenderTypes.SAMTurret);
        }
      });

      this.enemyRounds.push(count);
    });
  }

  public SetStartingHealth(health: number) {
    this.startingHealth = health;
  }
}
