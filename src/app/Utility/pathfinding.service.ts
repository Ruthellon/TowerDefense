import { Vector2 } from "./classes.model";

export class cell {
  parent_i: number;
  parent_j: number;
  f: number;
  g: number;
  h: number;

  // this.ROW_COUNT and Column index of its parent
  // Note that 0 <= i <= this.ROW_COUNT-1 & 0 <= j <= COL-1
  constructor() {
    this.parent_i = 0;
    this.parent_j = 0;
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }
}

export class PathFinder {
  private static ROW_COUNT: number = 0;
  private static COL_COUNT: number = 0;

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

  private static tracePath(cellDetails: cell[][], dest: Vector2): Vector2[] {
    let y = dest.Y;
    let x = dest.X;

    // stack<Pair> Path;
    let Path: Vector2[] = [];
    while (!(cellDetails[x][y].parent_i == y && cellDetails[x][y].parent_j == x)) {
      Path.push(new Vector2(x, y));
      let tempX = cellDetails[x][y].parent_i;
      let tempY = cellDetails[x][y].parent_j;
      x = tempX;
      y = tempY;
    }

    Path.push(new Vector2(x,y));

    return Path;
  }

  // A Function to find the shortest path between
  // a given source cell to a destination cell according
  // to A* Search Algorithm
  public static AStarSearch(grid: number[][], gridSize: Vector2, src: Vector2, dest: Vector2): any[] {
    this.COL_COUNT = gridSize.X;
    this.ROW_COUNT = gridSize.Y;

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
    // means that no cell has been included yet This closed
    // list is implemented as a boolean 2D array
    let closedList = new Array(this.ROW_COUNT);
    for (let i = 0; i < this.ROW_COUNT; i++) {
      closedList[i] = new Array(this.COL_COUNT).fill(false);
    }

    // Declare a 2D array of structure to hold the details
    // of that cell
    let cellDetails = new Array(this.ROW_COUNT);
    for (let i = 0; i < this.ROW_COUNT; i++) {
      cellDetails[i] = new Array(this.COL_COUNT);
    }

    let i, j;

    for (i = 0; i < this.ROW_COUNT; i++) {
      for (j = 0; j < this.COL_COUNT; j++) {
        cellDetails[i][j] = new cell();
        cellDetails[i][j].f = 2147483647;
        cellDetails[i][j].g = 2147483647;
        cellDetails[i][j].h = 2147483647;
        cellDetails[i][j].parent_i = -1;
        cellDetails[i][j].parent_j = -1;
      }
    }

    // Initialising the parameters of the starting node
    i = src.X, j = src.Y;
    cellDetails[i][j].f = 0;
    cellDetails[i][j].g = 0;
    cellDetails[i][j].h = 0;
    cellDetails[i][j].parent_i = i;
    cellDetails[i][j].parent_j = j;

    /*
     Create an open list having information as-
     <f, <i, j>>
     where f = g + h,
     and i, j are the this.ROW_COUNT and column index of that cell
     Note that 0 <= i <= this.ROW_COUNT-1 & 0 <= j <= COL-1
     This open list is implemented as a set of pair of
     pair.*/
    let openList = new Map();

    // Put the starting cell on the open list and set its
    // 'f' as 0
    openList.set(0, [i, j]);

    // We set this boolean value as false as initially
    // the destination is not reached.
    let foundDest = false;

    while (openList.size > 0) {
      let p = openList.entries().next().value!;

      // Remove this vertex from the open list
      openList.delete(p[0]);

      // Add this vertex to the closed list
      i = p[1][0];
      j = p[1][1];
      closedList[i][j] = true;

      /*
       Generating all the 8 successor of this cell
  
           N.W   N   N.E
             \   |   /
              \  |  /
           W----Cell----E
                / | \
              /   |  \
           S.W    S   S.E
  
       Cell-->Popped Cell (i, j)
       N -->  North       (i-1, j)
       S -->  South       (i+1, j)
       E -->  East        (i, j+1)
       W -->  West           (i, j-1)
       N.E--> North-East  (i-1, j+1)
       N.W--> North-West  (i-1, j-1)
       S.E--> South-East  (i+1, j+1)
       S.W--> South-West  (i+1, j-1)*/

      // To store the 'g', 'h' and 'f' of the 8 successors
      let gNew, hNew, fNew;

      //----------- 1st Successor (North) ------------
      // Only process this cell if this is a valid one
      if (this.isValid(i - 1, j)) {
        let vector = new Vector2(i - 1, j);

        // If the destination cell is the same as the
        // current successor
        if (this.isDestination(vector, dest)) {
          // Set the Parent of the destination cell
          cellDetails[i - 1][j].parent_i = i;
          cellDetails[i - 1][j].parent_j = j;
          console.log("The destination cell is found\n");
          return this.tracePath(cellDetails, dest);
        }
        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (!closedList[i - 1][j]
          && !this.isBlocked(grid, vector)) {
          gNew = cellDetails[i][j].g + 1;
          hNew = this.calculateHValue(vector, dest);
          fNew = gNew + hNew;

          // If it isn’t on the open list, add it to
          // the open list. Make the current square
          // the parent of this square. Record the
          // f, g, and h costs of the square cell
          //                OR
          // If it is on the open list already, check
          // to see if this path to that square is
          // better, using 'f' cost as the measure.
          if (cellDetails[i - 1][j].f == 2147483647
            || cellDetails[i - 1][j].f > fNew) {
            openList.set(fNew, [i - 1, j]);

            // Update the details of this cell
            cellDetails[i - 1][j].f = fNew;
            cellDetails[i - 1][j].g = gNew;
            cellDetails[i - 1][j].h = hNew;
            cellDetails[i - 1][j].parent_i = i;
            cellDetails[i - 1][j].parent_j = j;
          }
        }
      }

      //----------- 2nd Successor (South) ------------

      // Only process this cell if this is a valid one
      if (this.isValid(i + 1, j)) {
        let vector = new Vector2(i + 1, j);
        // If the destination cell is the same as the
        // current successor
        if (this.isDestination(vector, dest)) {
          // Set the Parent of the destination cell
          cellDetails[i + 1][j].parent_i = i;
          cellDetails[i + 1][j].parent_j = j;
          console.log("The destination cell is found\n");
          return this.tracePath(cellDetails, dest);
        }
        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i + 1][j] == false
          && !this.isBlocked(grid, i + 1, j)) {
          gNew = cellDetails[i][j].g + 1;
          hNew = this.calculateHValue(i + 1, j, dest);
          fNew = gNew + hNew;

          // If it isn’t on the open list, add it to
          // the open list. Make the current square
          // the parent of this square. Record the
          // f, g, and h costs of the square cell
          //                OR
          // If it is on the open list already, check
          // to see if this path to that square is
          // better, using 'f' cost as the measure.
          if (cellDetails[i + 1][j].f == 2147483647
            || cellDetails[i + 1][j].f > fNew) {
            openList.set(fNew, [i + 1, j]);
            // Update the details of this cell
            cellDetails[i + 1][j].f = fNew;
            cellDetails[i + 1][j].g = gNew;
            cellDetails[i + 1][j].h = hNew;
            cellDetails[i + 1][j].parent_i = i;
            cellDetails[i + 1][j].parent_j = j;
          }
        }
      }

      //----------- 3rd Successor (East) ------------

      // Only process this cell if this is a valid one
      if (this.isValid(i, j + 1) == true) {
        // If the destination cell is the same as the
        // current successor
        if (this.isDestination(i, j + 1, dest) == true) {
          // Set the Parent of the destination cell
          cellDetails[i][j + 1].parent_i = i;
          cellDetails[i][j + 1].parent_j = j;
          console.log("The destination cell is found\n");
          return this.tracePath(cellDetails, dest);
        }

        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i][j + 1] == false
          && !this.isBlocked(grid, i, j + 1)) {
          gNew = cellDetails[i][j].g + 1;
          hNew = this.calculateHValue(i, j + 1, dest);
          fNew = gNew + hNew;

          // If it isn’t on the open list, add it to
          // the open list. Make the current square
          // the parent of this square. Record the
          // f, g, and h costs of the square cell
          //                OR
          // If it is on the open list already, check
          // to see if this path to that square is
          // better, using 'f' cost as the measure.
          if (cellDetails[i][j + 1].f == 2147483647
            || cellDetails[i][j + 1].f > fNew) {
            openList.set(fNew, [i, j + 1]);

            // Update the details of this cell
            cellDetails[i][j + 1].f = fNew;
            cellDetails[i][j + 1].g = gNew;
            cellDetails[i][j + 1].h = hNew;
            cellDetails[i][j + 1].parent_i = i;
            cellDetails[i][j + 1].parent_j = j;
          }
        }
      }

      //----------- 4th Successor (West) ------------

      // Only process this cell if this is a valid one
      if (this.isValid(i, j - 1) == true) {
        // If the destination cell is the same as the
        // current successor
        if (this.isDestination(i, j - 1, dest) == true) {
          // Set the Parent of the destination cell
          cellDetails[i][j - 1].parent_i = i;
          cellDetails[i][j - 1].parent_j = j;
          console.log("The destination cell is found\n");
          return this.tracePath(cellDetails, dest);
        }

        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i][j - 1] == false
          && !this.isBlocked(grid, i, j - 1)) {
          gNew = cellDetails[i][j].g + 1;
          hNew = this.calculateHValue(i, j - 1, dest);
          fNew = gNew + hNew;

          // If it isn’t on the open list, add it to
          // the open list. Make the current square
          // the parent of this square. Record the
          // f, g, and h costs of the square cell
          //                OR
          // If it is on the open list already, check
          // to see if this path to that square is
          // better, using 'f' cost as the measure.
          if (cellDetails[i][j - 1].f == 2147483647
            || cellDetails[i][j - 1].f > fNew) {
            openList.set(fNew, [i, j - 1]);

            // Update the details of this cell
            cellDetails[i][j - 1].f = fNew;
            cellDetails[i][j - 1].g = gNew;
            cellDetails[i][j - 1].h = hNew;
            cellDetails[i][j - 1].parent_i = i;
            cellDetails[i][j - 1].parent_j = j;
          }
        }
      }

      //----------- 5th Successor (North-East)
      //------------

      // Only process this cell if this is a valid one
      if (this.isValid(i - 1, j + 1) == true) {
        // If the destination cell is the same as the
        // current successor
        if (this.isDestination(i - 1, j + 1, dest) == true) {
          // Set the Parent of the destination cell
          cellDetails[i - 1][j + 1].parent_i = i;
          cellDetails[i - 1][j + 1].parent_j = j;
          console.log("The destination cell is found\n");
          return this.tracePath(cellDetails, dest);
        }

        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i - 1][j + 1] == false
          && !this.isBlocked(grid, i - 1, j + 1)) {
          gNew = cellDetails[i][j].g + 1.414;
          hNew = this.calculateHValue(i - 1, j + 1, dest);
          fNew = gNew + hNew;

          // If it isn’t on the open list, add it to
          // the open list. Make the current square
          // the parent of this square. Record the
          // f, g, and h costs of the square cell
          //                OR
          // If it is on the open list already, check
          // to see if this path to that square is
          // better, using 'f' cost as the measure.
          if (cellDetails[i - 1][j + 1].f == 2147483647
            || cellDetails[i - 1][j + 1].f > fNew) {
            openList.set(fNew, [i - 1, j + 1]);

            // Update the details of this cell
            cellDetails[i - 1][j + 1].f = fNew;
            cellDetails[i - 1][j + 1].g = gNew;
            cellDetails[i - 1][j + 1].h = hNew;
            cellDetails[i - 1][j + 1].parent_i = i;
            cellDetails[i - 1][j + 1].parent_j = j;
          }
        }
      }

      //----------- 6th Successor (North-West)
      //------------

      // Only process this cell if this is a valid one
      if (this.isValid(i - 1, j - 1) == true) {
        // If the destination cell is the same as the
        // current successor
        if (this.isDestination(i - 1, j - 1, dest) == true) {
          // Set the Parent of the destination cell
          cellDetails[i - 1][j - 1].parent_i = i;
          cellDetails[i - 1][j - 1].parent_j = j;
          console.log("The destination cell is found\n");
          return this.tracePath(cellDetails, dest);
        }

        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i - 1][j - 1] == false
          && !this.isBlocked(grid, i - 1, j - 1)) {
          gNew = cellDetails[i][j].g + 1.414;
          hNew = this.calculateHValue(i - 1, j - 1, dest);
          fNew = gNew + hNew;

          // If it isn’t on the open list, add it to
          // the open list. Make the current square
          // the parent of this square. Record the
          // f, g, and h costs of the square cell
          //                OR
          // If it is on the open list already, check
          // to see if this path to that square is
          // better, using 'f' cost as the measure.
          if (cellDetails[i - 1][j - 1].f == 2147483647
            || cellDetails[i - 1][j - 1].f > fNew) {
            openList.set(fNew, [i - 1, j - 1]);
            // Update the details of this cell
            cellDetails[i - 1][j - 1].f = fNew;
            cellDetails[i - 1][j - 1].g = gNew;
            cellDetails[i - 1][j - 1].h = hNew;
            cellDetails[i - 1][j - 1].parent_i = i;
            cellDetails[i - 1][j - 1].parent_j = j;
          }
        }
      }

      //----------- 7th Successor (South-East)
      //------------

      // Only process this cell if this is a valid one
      if (this.isValid(i + 1, j + 1) == true) {
        // If the destination cell is the same as the
        // current successor
        if (this.isDestination(i + 1, j + 1, dest) == true) {
          // Set the Parent of the destination cell
          cellDetails[i + 1][j + 1].parent_i = i;
          cellDetails[i + 1][j + 1].parent_j = j;
          console.log("The destination cell is found\n");
          return this.tracePath(cellDetails, dest);
        }

        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i + 1][j + 1] == false
          && !this.isBlocked(grid, i + 1, j + 1)) {
          gNew = cellDetails[i][j].g + 1.414;
          hNew = this.calculateHValue(i + 1, j + 1, dest);
          fNew = gNew + hNew;

          // If it isn’t on the open list, add it to
          // the open list. Make the current square
          // the parent of this square. Record the
          // f, g, and h costs of the square cell
          //                OR
          // If it is on the open list already, check
          // to see if this path to that square is
          // better, using 'f' cost as the measure.
          if (cellDetails[i + 1][j + 1].f == 2147483647
            || cellDetails[i + 1][j + 1].f > fNew) {
            openList.set(fNew, [i + 1, j + 1]);

            // Update the details of this cell
            cellDetails[i + 1][j + 1].f = fNew;
            cellDetails[i + 1][j + 1].g = gNew;
            cellDetails[i + 1][j + 1].h = hNew;
            cellDetails[i + 1][j + 1].parent_i = i;
            cellDetails[i + 1][j + 1].parent_j = j;
          }
        }
      }

      //----------- 8th Successor (South-West)
      //------------

      // Only process this cell if this is a valid one
      if (this.isValid(i + 1, j - 1) == true) {
        // If the destination cell is the same as the
        // current successor
        if (this.isDestination(i + 1, j - 1, dest) == true) {
          // Set the Parent of the destination cell
          cellDetails[i + 1][j - 1].parent_i = i;
          cellDetails[i + 1][j - 1].parent_j = j;
          console.log("The destination cell is found\n");
          return this.tracePath(cellDetails, dest);
        }

        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i + 1][j - 1] == false
          && !this.isBlocked(grid, i + 1, j - 1)) {
          gNew = cellDetails[i][j].g + 1.414;
          hNew = this.calculateHValue(i + 1, j - 1, dest);
          fNew = gNew + hNew;

          // If it isn’t on the open list, add it to
          // the open list. Make the current square
          // the parent of this square. Record the
          // f, g, and h costs of the square cell
          //                OR
          // If it is on the open list already, check
          // to see if this path to that square is
          // better, using 'f' cost as the measure.
          if (cellDetails[i + 1][j - 1].f == 2147483647
            || cellDetails[i + 1][j - 1].f > fNew) {
            openList.set(fNew, [i + 1, j - 1]);

            // Update the details of this cell
            cellDetails[i + 1][j - 1].f = fNew;
            cellDetails[i + 1][j - 1].g = gNew;
            cellDetails[i + 1][j - 1].h = hNew;
            cellDetails[i + 1][j - 1].parent_i = i;
            cellDetails[i + 1][j - 1].parent_j = j;
          }
        }
      }
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
}
