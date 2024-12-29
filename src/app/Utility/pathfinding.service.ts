import { Vector2 } from "./classes.model";

export enum ePathCellStatus {
  EndingPoint = -2,
  StartingPoint = -1,
  Open = 0,
  Path = 1,
  OutOfBounds = 2,
  Blocked = 3,
}

export class cell {
  parent_x: number;
  parent_y: number;
  f: number;
  g: number;
  h: number;

  constructor() {
    this.parent_x = 0;
    this.parent_y = 0;
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }
}

export class PathFinder {
  
  public static AStarSearch(grid: number[][], src: Vector2, dest: Vector2): Vector2[] {

    // If the source is out of range
    if (!this.isValid(src.X, src.Y, grid.length, grid[0].length)) {
      return [];
    }

    // If the destination is out of range
    if (!this.isValid(dest.X, src.Y, grid.length, grid[0].length)) {
      return [];
    }

    // Either the source or the destination is blocked
    if (grid[src.X][src.Y] >= ePathCellStatus.Blocked ||
      grid[dest.X][dest.Y] >= ePathCellStatus.Blocked) {
      return [];
    }

    // If the destination cell is the same as source cell
    if (src.isEqual(dest)) {
      return [];
    }

    // Create a closed list and initialise it to false which
    // means that no cell has been included yet 
    let closedList = new Array(grid.length);
    for (let i = 0; i < grid.length; i++) {
      closedList[i] = new Array(grid[i].length).fill(false);
    }

    let cellDetails = new Array(grid.length);
    for (let i = 0; i < grid.length; i++) {
      cellDetails[i] = new Array(grid[i].length);
    }

    let x, y;

    for (x = 0; x < grid.length; x++) {
      for (y = 0; y < grid[x].length; y++) {
        cellDetails[x][y] = new cell();
        cellDetails[x][y].f = 2147483647;
        cellDetails[x][y].g = 2147483647;
        cellDetails[x][y].h = 2147483647;
        cellDetails[x][y].parent_x = -1;
        cellDetails[x][y].parent_y = -1;
      }
    }

    x = src.X, y = src.Y;
    cellDetails[x][y].f = 0;
    cellDetails[x][y].g = 0;
    cellDetails[x][y].h = 0;
    cellDetails[x][y].parent_x = x;
    cellDetails[x][y].parent_y = y;

    let openList: any[] = [];
    openList.push({ val: 0, coord: [x, y] });

    let foundDest = false;

    while (openList.length > 0) {
      let p = openList.shift();

      x = p.coord[0];
      y = p.coord[1];
      closedList[x][y] = true;

      let parent = new Vector2(x, y);

      //North
      let result = this.processCell(new Vector2(x, y - 1), parent,
        cellDetails, openList, closedList, grid, dest);

      if (result) {
        return this.tracePath(cellDetails, dest);
      }

      //South
      result = this.processCell(new Vector2(x, y + 1), parent,
        cellDetails, openList, closedList, grid, dest);

      if (result) {
        return this.tracePath(cellDetails, dest);
      }

      //East
      result = this.processCell(new Vector2(x + 1, y), parent,
        cellDetails, openList, closedList, grid, dest);

      if (result) {
        return this.tracePath(cellDetails, dest);
      }

      //West
      result = this.processCell(new Vector2(x - 1, y), parent,
        cellDetails, openList, closedList, grid, dest);

      if (result) {
        return this.tracePath(cellDetails, dest);
      }

      ////North East
      //result = this.processCell(new Vector2(x + 1, y - 1), parent,
      //  cellDetails, openList, closedList, grid, dest);

      //if (result) {
      //  return this.tracePath(cellDetails, dest);
      //}

      ////North West
      //result = this.processCell(new Vector2(x - 1, y - 1), parent,
      //  cellDetails, openList, closedList, grid, dest);

      //if (result) {
      //  return this.tracePath(cellDetails, dest);
      //}

      ////South East
      //result = this.processCell(new Vector2(x + 1, y + 1), parent,
      //  cellDetails, openList, closedList, grid, dest);

      //if (result) {
      //  return this.tracePath(cellDetails, dest);
      //}

      ////South West
      //result = this.processCell(new Vector2(x - 1, y + 1), parent,
      //  cellDetails, openList, closedList, grid, dest);

      //if (result) {
      //  return this.tracePath(cellDetails, dest);
      //}

      openList = openList.sort((a, b) => a.val - b.val);
    }

    return [];
  }

  private static isValid(x: number, y: number, xMax: number, yMax: number) {
    return (x >= 0) && (x < xMax) && (y >= 0) && (y < yMax);
  }

  private static isBlocked(grid: number[][], point: Vector2) {
    return grid[point.X][point.Y] >= ePathCellStatus.OutOfBounds;
  }

  private static isDestination(dest: Vector2, point: Vector2): boolean {
    return point.isEqual(dest);
  }

  private static calculateHValue(point: Vector2, dest: Vector2) {
    return (Math.sqrt(Math.pow(dest.X - point.X, 2) + Math.pow(dest.Y - point.Y, 2)));
  }

  private static processCell(point: Vector2, parent: Vector2, cellDetails: any,
    openList: any, closedList: any, grid: number[][], dest: Vector2): boolean {
    if (this.isValid(point.X, point.Y, grid.length, grid[0].length)) {

      // If the destination cell is the same as the
      // current successor
      if (this.isDestination(point, dest)) {
        // Set the Parent of the destination cell
        cellDetails[point.X][point.Y].parent_x = parent.X;
        cellDetails[point.X][point.Y].parent_y = parent.Y;

        return true;
      }
      // If the successor is already on the closed
      // list or if it is blocked, then ignore it.
      // Else do the following
      else if (!closedList[point.X][point.Y]
        && !this.isBlocked(grid, point)) {
        let gNew = cellDetails[parent.X][parent.Y].g + 1;
        let hNew = this.calculateHValue(point, dest);
        let fNew = gNew + hNew;

        // If it isn’t on the open list, add it to
        // the open list. Make the current square
        // the parent of this square. Record the
        // f, g, and h costs of the square cell
        //                OR
        // If it is on the open list already, check
        // to see if this path to that square is
        // better, using 'f' cost as the measure.
        if (cellDetails[point.X][point.Y].f == 2147483647
          || cellDetails[point.X][point.Y].f > fNew) {
          openList.push({ val: fNew, coord: [point.X, point.Y] });

          // Update the details of this cell
          cellDetails[point.X][point.Y].f = fNew;
          cellDetails[point.X][point.Y].g = gNew;
          cellDetails[point.X][point.Y].h = hNew;
          cellDetails[point.X][point.Y].parent_x = parent.X;
          cellDetails[point.X][point.Y].parent_y = parent.Y;
        }
      }
    }

    return false;
  }

  private static tracePath(cellDetails: cell[][], dest: Vector2): Vector2[] {
    let y = dest.Y;
    let x = dest.X;

    // stack<Pair> Path;
    let Path: Vector2[] = [];
    while (!(cellDetails[x][y].parent_x == x && cellDetails[x][y].parent_y == y)) {
      Path.push(new Vector2(x, y));
      let tempX = cellDetails[x][y].parent_x;
      let tempY = cellDetails[x][y].parent_y;
      x = tempX;
      y = tempY;
    }

    Path.push(new Vector2(x, y));

    return Path;
  }


}
