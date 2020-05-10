// Get all surrounding squares from clicked square
  const getSurrounding = (idx, boardWidth, totalSquares) => {
    const leftTouching = idx - 1;
    const rightTouching = idx + 1;
    const topTouching = idx - boardWidth;
    const bottomTouching = idx + boardWidth;
    const topLeftTouching = (idx - boardWidth) - 1;
    const topRightTouching = (idx - boardWidth) + 1;
    const bottomLeftTouching = (idx + boardWidth) - 1;
    const bottomRightTouching = (idx + boardWidth) + 1;

    // top-left corner
      if(idx === 0) {
        return [rightTouching, bottomTouching, bottomRightTouching];
    // top-right corner
      }else if(idx === (boardWidth - 1)) {
        return [leftTouching, bottomTouching, bottomLeftTouching];
    // bottom-left corner
      }else if(idx === (totalSquares - boardWidth)) {
        return [rightTouching, topTouching, topRightTouching];
    // bottom-right corner
      }else if(idx === (totalSquares - 1)) {
        return [topLeftTouching, topTouching, leftTouching];
    // in first column    
      }else if(idx % boardWidth === 0) {
        return [topTouching, topRightTouching, rightTouching, bottomTouching, bottomRightTouching]
    // in last column
      }else if((rightTouching) % boardWidth === 0) {
        return [topLeftTouching, topTouching, leftTouching, bottomLeftTouching, bottomTouching]
    // in first row
      }else if((idx > 0 && idx < (boardWidth - 1))) {
        return [leftTouching, rightTouching, bottomLeftTouching, bottomTouching, bottomRightTouching]
    // in last row
      }else if((idx > (totalSquares - boardWidth) && idx < (totalSquares - 1))) {
        return [topLeftTouching, topTouching, topRightTouching, leftTouching, rightTouching]
    // not on a border
      }else {
        return [topLeftTouching, topTouching, topRightTouching,
                leftTouching, rightTouching,
                bottomLeftTouching, bottomTouching, bottomRightTouching]
      }   
    }

    // Set mineNumber of squares surrounding placed mine
  const markSurrounding = (array, mineIdx, boardWidth, totalSquares) => {
    const surrounding = getSurrounding(mineIdx, boardWidth, totalSquares);

    surrounding.forEach(square => {
      if(array[square].mineNumber !== 'M') {
        array[square].mineNumber++;
      }
    });

    return array;
  }

  // Randomly set mines on initial click
  const placeMines = (clickedIdx, arr, mines, boardWidth, totalSquares) => {
    let totalMines = mines;
    let minesArray = [];
    let startSurrounding = getSurrounding(clickedIdx, boardWidth, totalSquares);

    while(totalMines > 0) {
      let newMine = Math.floor(Math.random() * Math.max(totalSquares));
      if(newMine !== clickedIdx && !startSurrounding.includes(newMine) && !minesArray.includes(newMine)) {
        minesArray.push(newMine);
        arr[newMine].isMine = true;
        arr[newMine].mineNumber = 'M';
        arr = markSurrounding(arr, newMine, boardWidth, totalSquares);
        totalMines--;
      }
    }
    return arr;
  }

  // Clear squares around initial click, and then around neighboring squares that have a mineNumber of 0.
  const clearSquares = (clickedIdx, arr, boardWidth, totalSquares) => {
    let surrounding = getSurrounding(clickedIdx, boardWidth, totalSquares);
    let squaresToClear = [];

  // If clicked square does not have a mine in surrounding squares, begin process of clearing neighboring squares
    if(arr[clickedIdx].mineNumber === 0) {

      arr[clickedIdx].mineNumber = '';

      // Show squares surrounding clicked square
      surrounding.forEach(squareIdx => {
        arr[squareIdx].show = true
        // If surrounding squares mineNumber is 0, set mineNumber to empty and push it into the array of
        // remaining squares to clear      
        if(arr[squareIdx].mineNumber === 0) {
          arr[squareIdx].mineNumber = '';
          squaresToClear.push(squareIdx);
        }
      });
    }
  // Otherwise, if mine is present in surrounding squares, only show clicked square
    arr[clickedIdx].show = true;

    // Function for pulling squares out of squaresToClear array one at a time and clearing the neighbors of said square.
    // If neighbor mineNumber is 0, push to the end of the array. Function finishes when squaresToClear array is emptied,
    // meaning there are no more connected neighbors with mineNumber === 0,
    const clearNeighbors = () => {
      let toClear = Number(squaresToClear.splice(0, 1));
      let newNeighbors = getSurrounding(toClear, boardWidth, totalSquares);

      newNeighbors.forEach(newSquareIdx => {
        if(!arr[newSquareIdx].show && !arr[newSquareIdx].isMine) {
          arr[newSquareIdx].show = true;
          if(arr[newSquareIdx].mineNumber === 0) {
            arr[newSquareIdx].mineNumber = '';
            squaresToClear.push(newSquareIdx);
          }
        }
      }); 
    }

    // Initiate clearNeighbors function
    while(squaresToClear.length > 0) {
      clearNeighbors();
    }

    return arr;
  }

    module.exports = { placeMines, clearSquares }