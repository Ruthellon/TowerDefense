
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

  public static SetGridDimensions(rows: number, cols: number) {
    this.ROW_COUNT = rows;
    this.COL_COUNT = cols;
  }

  // A Utility Function to check whether given cell (row, col)
  // is a valid cell or not.
  private static isValid(row: number, col: number) {
    // Returns true if this.ROW_COUNT number and column number
    // is in range
    return (row >= 0) && (row < this.ROW_COUNT) && (col >= 0) && (col < this.COL_COUNT);
  }

  // A Utility Function to check whether the given cell is
  // blocked or not
  private static isUnBlocked(grid: number[][], row: number, col: number) {
    // Returns true if the cell is not blocked else false
    if (grid[row][col] == 1)
      return (true);
    else
      return (false);
  }

  // A Utility Function to check whether destination cell has
  // been reached or not
  private static isDestination(row: number, col: number, dest: number[]) {
    if (row == dest[0] && col == dest[1])
      return (true);
    else
      return (false);
  }

  // A Utility Function to calculate the 'h' heuristics.
  private static calculateHValue(row: number, col: number, dest: number[]) {
    // Return using the distance formula
    return (Math.sqrt((row - dest[0]) * (row - dest[0]) + (col - dest[1]) * (col - dest[1])));
  }

  // A Utility Function to trace the path from the source
  // to destination
  private static tracePath(cellDetails: cell[][], dest: number[]) {
    console.log("The Path is ");
    let row = dest[0];
    let col = dest[1];

    // stack<Pair> Path;
    let Path = [];

    while (!(cellDetails[row][col].parent_i == this.ROW_COUNT && cellDetails[row][col].parent_j == col)) {
      Path.push([row, col]);
      let temp_row = cellDetails[row][col].parent_i;
      let temp_col = cellDetails[row][col].parent_j;
      this.ROW_COUNT = temp_row;
      col = temp_col;
    }

    Path.push([row, col]);
    while (Path.length > 0) {
      let p = Path[0];
      Path.shift();

      if (p[0] == 2 || p[0] == 1) {
        console.log("-> (" + p[0] + ", " + (p[1] - 1) + ")");
      }
      else console.log("-> (" + p[0] + ", " + p[1] + ")");
    }

    return;
  }

  // A Function to find the shortest path between
  // a given source cell to a destination cell according
  // to A* Search Algorithm
  public static AStarSearch(grid: number[][], src: number[], dest: number[]) {
    // If the source is out of range
    if (this.isValid(src[0], src[1]) == false) {
      console.log("Source is invalid\n");
      return;
    }

    // If the destination is out of range
    if (this.isValid(dest[0], dest[1]) == false) {
      console.log("Destination is invalid\n");
      return;
    }

    // Either the source or the destination is blocked
    if (this.isUnBlocked(grid, src[0], src[1]) == false
      || this.isUnBlocked(grid, dest[0], dest[1])
      == false) {
      console.log("Source or the destination is blocked\n");
      return;
    }

    // If the destination cell is the same as source cell
    if (this.isDestination(src[0], src[1], dest)
      == true) {
      console.log("We are already at the destination\n");
      return;
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
    i = src[0], j = src[1];
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
      if (this.isValid(i - 1, j) == true) {
        // If the destination cell is the same as the
        // current successor
        if (this.isDestination(i - 1, j, dest) == true) {
          // Set the Parent of the destination cell
          cellDetails[i - 1][j].parent_i = i;
          cellDetails[i - 1][j].parent_j = j;
          console.log("The destination cell is found\n");
          this.tracePath(cellDetails, dest);
          foundDest = true;
          return;
        }
        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i - 1][j] == false
          && this.isUnBlocked(grid, i - 1, j)
          == true) {
          gNew = cellDetails[i][j].g + 1;
          hNew = this.calculateHValue(i - 1, j, dest);
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
      if (this.isValid(i + 1, j) == true) {
        // If the destination cell is the same as the
        // current successor
        if (this.isDestination(i + 1, j, dest) == true) {
          // Set the Parent of the destination cell
          cellDetails[i + 1][j].parent_i = i;
          cellDetails[i + 1][j].parent_j = j;
          console.log("The destination cell is found\n");
          this.tracePath(cellDetails, dest);
          foundDest = true;
          return;
        }
        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i + 1][j] == false
          && this.isUnBlocked(grid, i + 1, j)
          == true) {
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
          this.tracePath(cellDetails, dest);
          foundDest = true;
          return;
        }

        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i][j + 1] == false
          && this.isUnBlocked(grid, i, j + 1)
          == true) {
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
          this.tracePath(cellDetails, dest);
          foundDest = true;
          return;
        }

        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i][j - 1] == false
          && this.isUnBlocked(grid, i, j - 1)
          == true) {
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
          this.tracePath(cellDetails, dest);
          foundDest = true;
          return;
        }

        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i - 1][j + 1] == false
          && this.isUnBlocked(grid, i - 1, j + 1)
          == true) {
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
          this.tracePath(cellDetails, dest);
          foundDest = true;
          return;
        }

        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i - 1][j - 1] == false
          && this.isUnBlocked(grid, i - 1, j - 1)
          == true) {
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
          this.tracePath(cellDetails, dest);
          foundDest = true;
          return;
        }

        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i + 1][j + 1] == false
          && this.isUnBlocked(grid, i + 1, j + 1)
          == true) {
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
          this.tracePath(cellDetails, dest);
          foundDest = true;
          return;
        }

        // If the successor is already on the closed
        // list or if it is blocked, then ignore it.
        // Else do the following
        else if (closedList[i + 1][j - 1] == false
          && this.isUnBlocked(grid, i + 1, j - 1)
          == true) {
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

    return;
  }
}
