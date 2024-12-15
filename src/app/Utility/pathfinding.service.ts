import { Vector2 } from "./classes.model";

export class cell {
  parent_x: number;
  parent_y: number;
  f: number;
  g: number;
  h: number;

  // this.ROW_COUNT and Column index of its parent
  // Note that 0 <= i <= this.ROW_COUNT-1 & 0 <= j <= COL-1
  constructor() {
    this.parent_x = 0;
    this.parent_y = 0;
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }
}

export class PathFinder {
  private static ROW_COUNT: number = 0;
  private static COL_COUNT: number = 0;

  private static GRID: number[][] = [];
  private static SOURCE: Vector2 = new Vector2(0, 0);
  private static DEST: Vector2 = new Vector2(0, 0);
  
  // A Function to find the shortest path between
  // a given source cell to a destination cell according
  // to A* Search Algorithm
  public static AStarSearch(grid: number[][], gridSize: Vector2, src: Vector2, dest: Vector2): any[] {
    this.COL_COUNT = gridSize.X;
    this.ROW_COUNT = gridSize.Y;
    this.GRID = grid;
    this.SOURCE = src;
    this.DEST = dest;

    // If the source is out of range
    if (!this.isValid(src.X, src.Y)) {
      console.log("Source is invalid\n");
      return [];
    }

    // If the destination is out of range
    if (!this.isValid(dest.X, src.Y)) {
      console.log("Destination is invalid\n");
      return [];
    }

    // Either the source or the destination is blocked
    if (this.isBlocked(grid, src) ||
      this.isBlocked(grid, dest)) {
      console.log("Source or the destination is blocked\n");
      return [];
    }

    // If the destination cell is the same as source cell
    if (this.isDestination(src, dest)) {
      console.log("We are already at the destination\n");
      return [];
    }

    // Create a closed list and initialise it to false which
    // means that no cell has been included yet 
    let closedList = new Array(this.COL_COUNT);
    for (let i = 0; i < this.COL_COUNT; i++) {
      closedList[i] = new Array(this.ROW_COUNT).fill(false);
    }

    // Declare a 2D array of structure to hold the details
    // of that cell
    let cellDetails = new Array(this.COL_COUNT);
    for (let i = 0; i < this.COL_COUNT; i++) {
      cellDetails[i] = new Array(this.ROW_COUNT);
    }

    let x, y;

    for (x = 0; x < this.COL_COUNT; x++) {
      for (y = 0; y < this.ROW_COUNT; y++) {
        cellDetails[x][y] = new cell();
        cellDetails[x][y].f = 2147483647;
        cellDetails[x][y].g = 2147483647;
        cellDetails[x][y].h = 2147483647;
        cellDetails[x][y].parent_x = -1;
        cellDetails[x][y].parent_y = -1;
      }
    }

    // Initialising the parameters of the starting node
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

      // Add this vertex to the closed list
      x = p.coord[0];
      y = p.coord[1];
      closedList[x][y] = true;

      /*
       Generating all the 8 successor of this cell
  
           N.W   N   N.E
             \   |   /
              \  |  /
           W----Cell----E
                / | \
              /   |  \
           S.W    S   S.E
      */

      // To store the 'g', 'h' and 'f' of the 8 successors
      let parent = new Vector2(x, y);

      //North
      let result = this.processCell(new Vector2(x, y - 1), parent,
        cellDetails, openList, closedList);

      if (result) {
        return this.tracePath(cellDetails, dest);
      }

      //South
      result = this.processCell(new Vector2(x, y + 1), parent,
        cellDetails, openList, closedList);

      if (result) {
        return this.tracePath(cellDetails, dest);
      }

      //East
      result = this.processCell(new Vector2(x + 1, y), parent,
        cellDetails, openList, closedList);

      if (result) {
        return this.tracePath(cellDetails, dest);
      }

      //West
      result = this.processCell(new Vector2(x - 1, y), parent,
        cellDetails, openList, closedList);

      if (result) {
        return this.tracePath(cellDetails, dest);
      }

      //North East
      result = this.processCell(new Vector2(x + 1, y - 1), parent,
        cellDetails, openList, closedList);

      if (result) {
        return this.tracePath(cellDetails, dest);
      }

      //North West
      result = this.processCell(new Vector2(x - 1, y - 1), parent,
        cellDetails, openList, closedList);

      if (result) {
        return this.tracePath(cellDetails, dest);
      }

      //South East
      result = this.processCell(new Vector2(x + 1, y + 1), parent,
        cellDetails, openList, closedList);

      if (result) {
        return this.tracePath(cellDetails, dest);
      }

      //South West
      result = this.processCell(new Vector2(x - 1, y + 1), parent,
        cellDetails, openList, closedList);

      if (result) {
        return this.tracePath(cellDetails, dest);
      }

      openList = openList.sort((a, b) => a.val - b.val);
    }

    // When the destination cell is not found and the open
    // list is empty, then we conclude that we failed to
    // reach the destination cell. This may happen when the
    // there is no way to destination cell (due to
    // blockages)
    if (foundDest == false)
      console.log("Failed to find the Destination Cell\n");

    return [];
  }

  private static isValid(x: number, y: number) {
    return (x >= 0) && (x < this.COL_COUNT) && (y >= 0) && (y < this.ROW_COUNT);
  }

  private static isBlocked(grid: number[][], point: Vector2) {
    return grid[point.X][point.Y] === 1;
  }

  private static isDestination(dest: Vector2, point: Vector2): boolean {
    return point.isEqual(dest);
  }

  private static calculateHValue(point: Vector2, dest: Vector2) {
    return (Math.sqrt(Math.pow(dest.X - point.X, 2) + Math.pow(dest.Y - point.Y, 2)));
  }

  private static processCell(point: Vector2, parent: Vector2, cellDetails: any, openList: any, closedList: any): boolean {
    if (this.isValid(point.X, point.Y)) {

      // If the destination cell is the same as the
      // current successor
      if (this.isDestination(point, this.DEST)) {
        // Set the Parent of the destination cell
        cellDetails[point.X][point.Y].parent_x = parent.X;
        cellDetails[point.X][point.Y].parent_y = parent.Y;
        console.log("The destination cell is found\n");
        return true;
      }
      // If the successor is already on the closed
      // list or if it is blocked, then ignore it.
      // Else do the following
      else if (!closedList[point.X][point.Y]
        && !this.isBlocked(this.GRID, point)) {
        let gNew = cellDetails[parent.X][parent.Y].g + 1;
        let hNew = this.calculateHValue(point, this.DEST);
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
