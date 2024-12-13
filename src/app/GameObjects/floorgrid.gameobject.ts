import { Rect, Vector2 } from "../Utility/classes.model";
import { Game } from "../Utility/game.model";
import { PathFinder } from "../Utility/pathfinding.service";
import { IGameObject } from "./gameobject.interface";

export class FloorGrid extends IGameObject {

  private gridSize: number = 64;
  private shouldHighlight: boolean = false;

  public SetShouldHighlight(should: boolean) {
    this.shouldHighlight = should;
  }

  public AddObstacle(obstacle: IGameObject): void {

  }

  public CalculatePath(obstacles: IGameObject[]): void {
    
  }

  private savedSquares: Rect[] = [];

  private topLeft: Vector2 | null = null;
  private bottomRight: Vector2 | null = null;
  private previousMouse: Vector2 | null = null;
  Update(deltaTime: number): void {
    if (this.shouldHighlight) {
      if ((!this.previousMouse) ||
        (this.previousMouse.X !== Game.MOUSE_LOCATION.X &&
        this.previousMouse.Y !== Game.MOUSE_LOCATION.Y)) {
        let mouseLocal = Game.MOUSE_LOCATION;
        this.previousMouse = mouseLocal;

        this.bottomRight = new Vector2(Math.ceil(mouseLocal.X / this.gridSize) * this.gridSize,
          Math.ceil(mouseLocal.Y / this.gridSize) * this.gridSize);

        this.topLeft = new Vector2(Math.max(0, this.bottomRight.X - (this.gridSize * 2)),
          Math.max(0, this.bottomRight.Y - (this.gridSize * 2)));
      }
    }

    if (Game.MOUSE_CLICKED && this.topLeft && this.bottomRight) {
      let isOpen: boolean = true;
      let newSquare = new Rect(this.topLeft.X, this.topLeft.Y,
        (this.bottomRight.X - this.topLeft.X),
        (this.bottomRight.Y - this.topLeft.Y));
      this.savedSquares.forEach((square) => {
        isOpen = !Rect.IsOverlapping(newSquare, square) && isOpen;
      });
      if (isOpen)
        this.savedSquares.push(newSquare);
    }
  }

  Draw(deltaTime: number): void {
    let width = (Game.CANVAS_WIDTH / this.gridSize);
    let height = (Game.CANVAS_HEIGHT / this.gridSize);
    Game.CONTEXT.strokeStyle = this.Color!;
    for (let i = 1; i < width; i++) {
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(this.gridSize * i, 0);
      Game.CONTEXT.lineTo(this.gridSize * i, Game.CANVAS_HEIGHT);
      Game.CONTEXT.stroke();
    }
    for (let i = 1; i < height; i++) {
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(0, this.gridSize * i);
      Game.CONTEXT.lineTo(Game.CANVAS_WIDTH, this.gridSize * i);
      Game.CONTEXT.stroke();
    }

    if (this.topLeft && this.bottomRight) {
      Game.CONTEXT.strokeStyle = '#ffffff';
      Game.CONTEXT.beginPath();
      Game.CONTEXT.moveTo(this.topLeft.X, this.topLeft.Y);
      Game.CONTEXT.lineTo(this.bottomRight.X, this.topLeft.Y);
      Game.CONTEXT.lineTo(this.bottomRight.X, this.bottomRight.Y);
      Game.CONTEXT.lineTo(this.topLeft.X, this.bottomRight.Y);
      Game.CONTEXT.lineTo(this.topLeft.X, this.topLeft.Y);
      Game.CONTEXT.stroke();
    }

    if (this.savedSquares.length > 0) {
      Game.CONTEXT.strokeStyle = '#ffff00';
      this.savedSquares.forEach((savedSquare) => {
        Game.CONTEXT.beginPath();
        Game.CONTEXT.moveTo(savedSquare.X, savedSquare.Y);
        Game.CONTEXT.lineTo(savedSquare.X + savedSquare.Width, savedSquare.Y);
        Game.CONTEXT.lineTo(savedSquare.X + savedSquare.Width, savedSquare.Y + savedSquare.Height);
        Game.CONTEXT.lineTo(savedSquare.X, (savedSquare.Y + savedSquare.Height));
        Game.CONTEXT.lineTo(savedSquare.X, savedSquare.Y);
        Game.CONTEXT.stroke();
      });
    }
  }

  
}
