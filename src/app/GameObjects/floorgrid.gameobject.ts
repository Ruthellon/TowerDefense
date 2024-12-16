import { Rect, Vector2 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { PathFinder } from "../Utility/pathfinding.service";
import { Block } from "./block.gameobject";
import { IGameObject } from "./gameobject.interface";

export class FloorGrid extends IGameObject {
  private gridSize: number = 0;
  private shouldHighlight: boolean = false;
  private grid: number[][] = [];
  private gridColumns: number = 0;
  private gridRows: number = 0;

  public get Path(): Vector2[] {
    return this.path;
  }

  constructor() {
    super();

    this.SetGridSize(64);
  }

  public SetGridSize(grid: number) {
    this.gridSize = grid;
    this.createGrid();
  }

  public SetShouldHighlight(should: boolean) {
    this.shouldHighlight = should;
  }


  private path: Vector2[] = [];

  

  private savedSquares: Rect[] = [];

  private topLeft: Vector2 | null = null;
  private bottomRight: Vector2 | null = null;
  private previousMouse: Vector2 | null = null;
  Update(deltaTime: number): void {
    

    
  }

  Draw(deltaTime: number): void {
    Game.CONTEXT.lineWidth = 2;
    

    


    Game.CONTEXT.lineWidth = 1;
  }

  private createGrid() {
    
  }
}
