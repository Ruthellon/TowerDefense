
import { Attacker } from "../GameObjects/attacker.gameobject";
import { Block } from "../GameObjects/block.gameobject";
import { Button } from "../GameObjects/Utilities/button.gameobject";
import { Wall } from "../GameObjects/wall.gameobject";
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

  protected override RestartFunction() {
    Game.SetStartingCredits(this.StartingCredits >= 10 ? (this.StartingCredits - 10) : this.StartingCredits);
    let blankScene = new BlankLevelScene(this.sceneInfoString);
    Game.SetTheScene('blank', blankScene);
  }

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
        this.SetObstacles(sceneInfo.ObstacleCells);
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

    if (this.obstaclesToLoad) {
      this.obstaclesToLoad.forEach((cell) => {
        let wall = new Wall();
        wall.SetSize(this.theGrid.GridCellSize, this.theGrid.GridCellSize);
        wall.SetColor('#770000');
        wall.SetEnabled(false);
        this.theGrid.AddObstacle(wall, true, cell, true);
      });
      this.theGrid.ClearSelectedObstacle();
      this.obstaclesToLoad = [];
    }

    if (Game.Credits === 0) {
      Game.SetStartingCredits(this.StartingCredits);
      this.startCredits = 0;
    }
    else
      Game.AddCredits(30);
  }

  override HandleAttackers(deltaTime: number) {
    let round = this.rounds[this.CurrentRound];

    for (let i = 0; i < round.EnemyBatches.length; i++) {
      let batch = round.EnemyBatches[i];
      if (batch.TimeBetweenCurrent <= 0 && batch.EnemyCountCurrent < batch.EnemyCountStart) {
        let newAttacker = new Block();
        newAttacker.SetDamage(batch.EnemyDamage);

        let startCell = 0;
        if (batch.EnemyStartCells.length > 1)
          startCell = Math.floor(Math.random() * ((batch.EnemyStartCells.length - 1) + 1));

        newAttacker.SetLocation(this.StartingCells[batch.EnemyStartCells[startCell]].X * this.GridCellSize,
          this.StartingCells[batch.EnemyStartCells[startCell]].Y * this.GridCellSize,
          eLayerTypes.Object - i);
        newAttacker.SetPath(this.GetPath(batch.EnemyStartCells[startCell]), this.GridCellSize);
        newAttacker.SetSize(batch.EnemySize, batch.EnemySize);
        newAttacker.SetStartingSpeed(batch.EnemySpeed);
        newAttacker.SetStartingHealth(batch.EnemyHealth);
        newAttacker.SetValue(batch.EnemyValue);
        newAttacker.SetCanFly(batch.EnemyCanFly);
        newAttacker.SetShieldValue(batch.ShieldValue);

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
    }
  }

  protected CreateNewAttacker(attackerCount: number): Attacker {
    return new Block();
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

  private obstaclesToLoad: Vector2[] = [];
  public SetObstacles(obstaclesCells: Vector2[]) {
    this.obstaclesToLoad = obstaclesCells;
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

        if (batch.EnemyCanFly && this.AvailableDefenders.findIndex((type) => type === eDefenderTypes.SAMTurret) === -1) {
          this.AvailableDefenders.push(eDefenderTypes.SAMTurret);
        }
      });

      this.enemyRounds.push(count);
    });
  }

  public SetStartingHealth(health: number) {
    this.startingHealth = health;
  }
}
