// -------------------- Functions --------------------
// Change alphabet into digit
function toDigit(row) {
  let result = '';

  if ((/^[a-i]$/gi).test(row)) {
    let rowStr = row.toUpperCase();

    result = rowStr.charCodeAt(0) - 65;
  }

  return result;
}

// Change puzzleString into two-dimensional array;
function puzzleArray(puzzleString) {
  let result = [];

  let array = [];
  for (let i = 0; i < puzzleString.length; i++) {
    array.push(puzzleString[i]);

    if (array.length == 9) {
      result.push(array);
      array = [];
    }
  }

  return result;
}

// Look for empty box
function nextEmptyBox(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] == '.') {
        return [i, j];
      }
    }
  }

  // If no empty box found
  return [-1, -1];
}


// -------------------- SudokuSolver class --------------------
class SudokuSolver {

  validateLength(puzzleString) {
    return puzzleString.length == 81;
  }

  validateChar(puzzleString) {
    return (/^[1-9\.]+$/g).test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowNum = toDigit(row);
    let columnNum = column - 1;
    let board = puzzleArray(puzzleString);  

    if (board[rowNum][columnNum] == value) {
      return true;
    }

    for (let i = 0; i < board.length; i++) {
      if (board[rowNum][i] == value) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let rowNum = toDigit(row);
    let columnNum = column - 1;
    let board = puzzleArray(puzzleString);
    
    if (board[rowNum][columnNum] == value) {
      return true;
    }
    
    for (let i = 0; i < board.length; i++) {
      if (board[i][columnNum] == value) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowNum = toDigit(row);
    let columnNum = column - 1;
    let board = puzzleArray(puzzleString);

    let startAtR = Math.floor(rowNum / 3) * 3;
    let startAtC = Math.floor((columnNum) / 3) * 3;

    if (board[rowNum][columnNum] == value) {
      return true;
    }

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[startAtR + r][startAtC + c] == value) {
          return false;
        }
      }
    }

    return true;
  }

  backtracking(board) {
    let emptyBox = nextEmptyBox(board);
    let row = emptyBox[0];
    let column = emptyBox[1];

    // For check placement
    let puzzleString = board.flat().join('');
    let checkRow = String.fromCharCode(row + 65);
    let checkCol = column + 1;

    // Return board if no empty box found
    if (row == -1 && column == -1) {
      return true;
    }

    for (let value = 1; value <= 9; value++) {
      if (this.checkRowPlacement(puzzleString, checkRow, checkCol, value) && this.checkColPlacement(puzzleString, checkRow, checkCol, value) && this.checkRegionPlacement(puzzleString, checkRow, checkCol, value)) {
        board[row][column] = value;

        if (this.backtracking(board)) {return true};
      }
    }

    // If no valid value, reset it
    board[row][column] = '.';

    return false;
  }

  solve(puzzleString) {
    let board = [];
    let result = '';

    // Validate puzzleString
    if (!this.validateLength(puzzleString)) {
      return false;
    } 
    
    if (!this.validateChar(puzzleString)) {
      return false;
    }

    // Solve puzzle
    board = puzzleArray(puzzleString);
    this.backtracking(board);

    // Change two-dimensional array into str
    result = board.flat().join('');

    if (result == puzzleString) {
      return false;
    }

    return result;
  }

}

module.exports = SudokuSolver;
