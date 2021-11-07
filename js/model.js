/*const readline = require('readline')
const rl = readline.createInterface({input: process.stdin,
output: process.stdout});

rl.question('white or black?',
    (userInput)=>{console.log(userInput)})
*/


/*
let cellGraph=[]

cellGraphInit(cellGraph)


function cellGraphInit(graph) {

    let first = 1;
    let last = 9;
    let columns=['A','B','C','D','E','F','G','H','I']
    for (let i = first; i <= last; i++) {
        for (let j = 0; j <= 8; j++) {
            graph[columns[j]+i] = {pos: {row: i, column: j}, name: columns[j]+i}
        }
    }

    for (let i = first; i <= last; i++) {
        for (let j = 0; j <= 8; j++) {

            graph[columns[j]+i].leftN = j - 1 < 0 ? null : graph[columns[j-1]+i];
            graph[columns[j]+i].rightN = j + 1 > 8 ? null : graph[columns[j+1]+i];
            graph[columns[j]+i].bottomN = i + 1 > last ? null : graph[columns[j]+(i+1)];
            graph[columns[j]+i].topN = i - 1 < first ? null : graph[columns[j]+(i-1)];

        }
    }


}
*/

//import cloneDeep from "../clone-deep-master";

module.exports = {
  canAddWall,
  getNewWall,
  addWallToGraph,
  getPlayer,
  restart_model,
  playFriend,
  playII,

  getCurrentPlayer,
  getCurrentPlayerRow,
  getCurrentPlayerColumn,
  changeCurrentPlayerPos,
  isCurrentPlayerNeighbor,
  getCurrentPlayerNeighbors,
  isFinish,

  getFirstPlayerWalls,
  getSecondPlayerWalls,
  getIsTwoRealPlayers,
  resetCounterModel,

  jumpOver
};

let graph = {}
graphInit(graph);

let isTwoRealPlayers = 1;
let isGameOver = 0
let newWall = {
  rowN: 1,
  columnN: 1,
  wallType: "hboard",
  player: 0
}
let firstPlayer = {
  prevPos: {
    row: 9,
    column: 5,
  },
  row: 9,
  column: 5,
  wallsAmount: 10,
  finishCellRow: 1,
  changePos: 0,
  points: 0
}
let secondPlayer = {
  prevPos: {
    row: 1,
    column: 5,
  },
  row: 1,
  column: 5,
  wallsAmount: 10,
  finishCellRow: 9,
  changePos: 0,
  points: 0
}
let players = [firstPlayer, secondPlayer]
let currentPlayer = players[0]

function convertGraphToDoubleArray() {
  let convertedGraph = []
  let row = []
  let rowNum = 1
  let keysArray = Object.keys(graph)
  //console.log(keysArray)
  for (const elem of keysArray) {
    let char = elem.split('-')
    //console.log(elem);
    graph[elem].isLeft = graph[elem].leftN != null ? true : false;
    graph[elem].isRight = graph[elem].rightN != null ? true : false;
    graph[elem].isTop = graph[elem].topN != null ? true : false;
    graph[elem].isBottom = graph[elem].bottomN != null ? true : false;

    if (char[0] != rowNum) {

      convertedGraph.push(row)
      row = []
      rowNum = char[0]
    }
    row.push(graph[elem])
    if (elem === '9-9') {
      convertedGraph.push(row)
    }
  }
  // console.log(convertedGraph[8].length);
  return convertedGraph
}

function jumpOver() {
  let opponent
  if (currentPlayer === players[0]) {
    opponent = players[1]
  } else {
    opponent = players[0]
  }
  let currentCell = graph[currentPlayer.row + "-" + currentPlayer.column]
  let opponentCell = graph[opponent.row + "-" + opponent.column]
  if (isCurrentPlayerNeighborCell(opponent.row + "-" + opponent.column)) {
    if (currentCell.leftN === opponentCell && opponentCell.leftN != null) {
      changeCurrentPlayerPos(opponentCell.leftN.pos.row, opponentCell.leftN.pos.column)
    } else if (currentCell.rightN === opponentCell && opponentCell.rightN != null) {
      changeCurrentPlayerPos(opponentCell.rightN.pos.row, opponentCell.rightN.pos.column)
    } else if (currentCell.topN === opponentCell && opponentCell.topN != null) {
      changeCurrentPlayerPos(opponentCell.topN.row, opponentCell.topN.pos.column)
    } else if (currentCell.bottomN === opponentCell && opponentCell.bottomN != null) {
      changeCurrentPlayerPos(opponentCell.bottomN.pos.row, opponentCell.bottomN.pos.column)
    }else return;
  }else return
  //console.log("white "+ players[0].row+"-"+players[0].column)
 // console.log("black "+ players[1].row+"-"+players[1].column)
}

//convertGraphToDoubleArray()

let dots = []
dotsInit(dots)/*= [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];*/

function dotsInit(dots) {

  // creating two dimensional array
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      dots[i] = [];
    }
  }

  // inserting elements to array
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      dots[i][j] = 1;
    }
  }
  //console.log(dots)

}

function playII() {
  isTwoRealPlayers = 0
}

function playFriend() {
  isTwoRealPlayers = 1
}


function restart_model() {
  isGameOver = 0
  newWall = {
    rowN: 1,
    columnN: 1,
    wallType: "hboard",
    player: 0
  }
  /*players[0] = {
    prevPos: {
      row: 9,
      column: 5,
    },
    row: 9,
    column: 5,
    wallsAmount: 10,
    finishCellRow: 1,
    changePos: 0
  }*/
  players[0].prevPos.row = 9
  players[0].prevPos.column = 5
  players[0].row = 9
  players[0].column = 5
  players[0].wallsAmount = 10

  //console.log("гравці рестартнуті",players)
  /*players[1] = {
    prevPos: {
      row: 1,
      column: 5,
    },
    row: 1,
    column: 5,
    wallsAmount: 10,
    finishCellRow: 9,
    changePos: 0
  }*/

  players[1].prevPos.row = 1
  players[1].prevPos.column = 5
  players[1].row = 1
  players[1].column = 5
  players[1].wallsAmount = 10


  firstPlayer = players[0]
  secondPlayer = players[1]
  currentPlayer = players[0]
  //console.log("поточний гравець",currentPlayer)
  //console.log("гравці рестартнуті",players)

  graphInit(graph);
  dotsInit(dots)
}

function resetCounterModel() {
  players[0].points = 0
  players[1].points = 0
}

function getCurrentPlayer() {
  //console.log(currentPlayer)
  if (currentPlayer === players[0]) return 0
  else return 1
}

/*
function getOpponentPlayer() {
    if (currentPlayer === players[0]) {
        return players[1]
    } else {
        return players[0]
    }
}
*/
function getPlayer(num) {
  return players[num]
}

function isFinish() {
  return isGameOver
}

function getIsTwoRealPlayers() {
  return isTwoRealPlayers

}

function getFirstPlayerWalls() {
  return players[0].wallsAmount
}

function getSecondPlayerWalls() {
  return players[1].wallsAmount
}

function getCurrentPlayerRow() {

  return currentPlayer.row
}

function getCurrentPlayerColumn() {

  return currentPlayer.column
}

function changeCurrentPlayerPos(newRow, newColumn) {
  currentPlayer.prevPos.row = JSON.parse(JSON.stringify(currentPlayer.row))
  currentPlayer.prevPos.column = JSON.parse(JSON.stringify(currentPlayer.column))
  currentPlayer.row = newRow
  currentPlayer.column = newColumn
  currentPlayer.changePos = 1

  if ((currentPlayer.row) === currentPlayer.finishCellRow) {

    isGameOver = 1
    currentPlayer.points = currentPlayer.points + 1
    return
  }
  changeCurrentPlayer()
}

function changePlayerPos(newRow, newColumn) {
  players[0].row = newRow
  players[0].column = newColumn
}

function changeCurrentPlayer() {
  if (currentPlayer === players[0]) {
    currentPlayer = players[1]
  } else {
    currentPlayer = players[0]
  }
  if (currentPlayer === players[1] && !isTwoRealPlayers) {
    console.log("тут йде")
    goII()

  }
}

function goII() {

  while (true) {
    if (Math.round(Math.random())) {
      let neighbors = getCurrentPlayerNeighbors()
      //console.log(neighbors)
      let notNullNeighbors = []
      for (let i = 0; i < neighbors.length; i++) {
        if (neighbors[i] != null) {
          notNullNeighbors.push(neighbors[i])
        }
      }
      let newN = Math.round(Math.random() * (notNullNeighbors.length - 1))
      changeCurrentPlayerPos(notNullNeighbors[newN].pos.row, notNullNeighbors[newN].pos.column)
      return;
    } else {

      let row = Math.round(Math.random() * (9 - 1) + 1)
      let column = Math.round(Math.random() * (9 - 1) + 1)
      let wallType
      if (Math.round(Math.random())) {
        wallType = "vborder"
      } else {
        wallType = "hborder"
      }
      if (canAddWall(row, column, wallType)) {
        addWallToGraph(row, column, wallType)
        return
      }

    }
  }


}

function getPlayerRow(num) {
  if (num) {
    return players[1].row
  } else {
    return players[0].row
  }
}

function getPlayerColumn(num) {
  if (num) {
    return players[1].column
  } else {
    return players[0].column
  }
}

function getPlayerPrevRow(num) {
  if (num) {
    return players[1].prevPos.row
  } else {
    return players[0].prevPos.row
  }
}

function getPlayerPrevColumn(num) {
  if (num) {
    return players[1].prevPos.column
  } else {
    return players[0].prevPos.column
  }
}

function getNewWall() {
  return newWall
}

function getFirstPlayerNeighbors() {
  let playerCell = graph[players[0].row + "-" + players[0].column]
  return [playerCell.leftN, playerCell.rightN, playerCell.topN, playerCell.bottomN]
}

function getCurrentPlayerNeighbors() {

  let opponent
  if (currentPlayer === players[0]) {
    opponent = players[1]
  } else {
    opponent = players[0]
  }
  let playerCell = graph[currentPlayer.row + "-" + currentPlayer.column]
  let leftNeighbor
  let rightNeighbor
  let topNeighbor
  let bottomNeighbor
  let opponentCell = graph[opponent.row + "-" + opponent.column]
  if (playerCell.leftN === opponentCell) {
    if (graph[opponent.row + "-" + (opponent.column - 1)] != null && opponentCell.leftN != null) {
      leftNeighbor = graph[opponent.row + "-" + (opponent.column - 1)]
    } else leftNeighbor = null
  } else {
    leftNeighbor = playerCell.leftN
  }

  if (playerCell.rightN === opponentCell) {
    if (graph[opponent.row + "-" + (opponent.column + 1)] != null && opponentCell.rightN != null) {
      rightNeighbor = graph[opponent.row + "-" + (opponent.column + 1)]
    } else rightNeighbor = null
  } else {
    rightNeighbor = playerCell.rightN
  }

  if (playerCell.topN === opponentCell) {
    if (graph[(opponent.row - 1) + "-" + opponent.column] != null && opponentCell.topN != null) {
      topNeighbor = graph[(opponent.row - 1) + "-" + opponent.column]
    } else topNeighbor = null
  } else {
    topNeighbor = playerCell.topN
  }
  if (playerCell.bottomN === opponentCell) {
    if (graph[(opponent.row + 1) + "-" + opponent.column] != null && opponentCell.bottomN != null) {
      bottomNeighbor = graph[(opponent.row + 1) + "-" + opponent.column]
    } else bottomNeighbor = null
  } else {
    bottomNeighbor = playerCell.bottomN
  }
  return [leftNeighbor, rightNeighbor, topNeighbor, bottomNeighbor]
}

function isPlayerNeighbor(askedID, isFirstPlayer) {

  let askedCell = graph[askedID]
  if (isFirstPlayer) {
    let playerCell = graph[players[0].row + "-" + players[0].column]
    let neighbors = [playerCell.leftN, playerCell.rightN, playerCell.topN, playerCell.bottomN]
    for (let neighborCell of neighbors) {
      if (askedCell === neighborCell) {
        return true
      }
    }
  }
  return false
}

function isCurrentPlayerNeighbor(askedID) {
  let opponent
  if (currentPlayer === players[0]) {
    opponent = players[1]
  } else {
    opponent = players[0]
  }

  let askedCell = graph[askedID]
//console.log(graph[askedID])
  let neighbors = getCurrentPlayerNeighbors()
 // console.log(getCurrentPlayerNeighbors())
  for (let neighborCell of neighbors) {
    if (askedCell === neighborCell) {
      return true
    }
  }

  return false
}


function isCurrentPlayerNeighborCell(askedID) {
  let opponent
  if (currentPlayer === players[0]) {
    opponent = players[1]
  } else {
    opponent = players[0]
  }

  let askedCell = graph[askedID]
//console.log(graph[askedID])
  let playerCell = graph[currentPlayer.row + "-" + currentPlayer.column]
  let neighbors = [playerCell.leftN, playerCell.rightN, playerCell.topN, playerCell.bottomN]
  //console.log(getCurrentPlayerNeighbors())
  for (let neighborCell of neighbors) {
    if (askedCell === neighborCell) {
      return true
    }
  }

  return false
}


function graphInit(graph) {

  let first = 1;
  let last = 9;
  for (let i = first; i <= last; i++) {
    for (let j = first; j <= last; j++) {
      graph[i + "-" + j] = {pos: {row: i, column: j}}
    }
  }

  for (let i = first; i <= last; i++) {
    for (let j = first; j <= last; j++) {

      graph[i + "-" + j].leftN = j - 1 < first ? null : graph[i + "-" + (j - 1)];
      graph[i + "-" + j].rightN = j + 1 > last ? null : graph[i + "-" + (j + 1)];
      graph[i + "-" + j].bottomN = i + 1 > last ? null : graph[(i + 1) + "-" + j];
      graph[i + "-" + j].topN = i - 1 < first ? null : graph[(i - 1) + "-" + j];

    }
  }


}


function canAddWall(rowN, columnN, wallType) {
  if (wallType === "vborder") {
    let leftCellRow = parseInt(rowN);
    let leftCellColumn = parseInt(columnN);

    if (graph[leftCellRow + "-" + leftCellColumn].rightN === null
      || (graph[leftCellRow + 1 + "-" + leftCellColumn] != null && graph[leftCellRow + 1 + "-" + leftCellColumn].rightN === null)
      || leftCellRow === 9
      || ((graph[leftCellRow + 1 + "-" + leftCellColumn] != null && graph[leftCellRow + 1 + "-" + leftCellColumn].topN === null)
        && (graph[(leftCellRow + 1) + "-" + (leftCellColumn + 1)] != null && graph[(leftCellRow + 1) + "-" + (leftCellColumn + 1)].topN === null)
        && !dots[leftCellRow - 1][leftCellColumn - 1])
      || !canReachAtLeastOne(graph, players[0].row + "-" + players[0].column, players[0].finishCellRow, leftCellRow, leftCellColumn, wallType)
      || !canReachAtLeastOne(graph, players[1].row + "-" + players[1].column, players[1].finishCellRow, leftCellRow, leftCellColumn, wallType)
      || currentPlayer.wallsAmount < 1

    ) {
      return false
    } else return true
  }

  if (wallType === "hborder") {
    let BottomCellRow = parseInt(rowN);
    let BottomCellColumn = parseInt(columnN);
    /*console.log(players[0].row + "-" + players[0].column)
            console.log(players[0])
            console.log(players[0].row)
            console.log(players[0].column)*/

    if (graph[BottomCellRow + "-" + BottomCellColumn].topN === null
      || (graph[BottomCellRow + "-" + (BottomCellColumn + 1)] != null && graph[BottomCellRow + "-" + (BottomCellColumn + 1)].topN === null)
      || BottomCellColumn === 9
      || ((graph[BottomCellRow + "-" + (BottomCellColumn + 1)] != null && graph[BottomCellRow + "-" + (BottomCellColumn + 1)].leftN === null)
        && (graph[(BottomCellRow - 1) + "-" + (BottomCellColumn + 1)] != null && graph[(BottomCellRow - 1) + "-" + (BottomCellColumn + 1)].leftN === null)
        && !dots[BottomCellRow - 2][BottomCellColumn - 1])
      || !canReachAtLeastOne(graph, players[0].row + "-" + players[0].column, players[0].finishCellRow, BottomCellRow, BottomCellColumn, wallType)
      || !canReachAtLeastOne(graph, players[1].row + "-" + players[1].column, players[1].column, BottomCellRow, BottomCellColumn, wallType)
      || currentPlayer.wallsAmount < 1
    ) {
      return false
    } else return true
  }

}

function addWallToGraph(rowN, columnN, wallType) {
  graph = addWall(graph, dots, rowN, columnN, wallType)
  currentPlayer.wallsAmount = currentPlayer.wallsAmount - 1
  currentPlayer.changePos = 0
  newWall.rowN = rowN
  newWall.columnN = columnN
  newWall.wallType = wallType
  if (currentPlayer === players[0]) {
    newWall.player = 0
  } else {
    newWall.player = 1
  }

  changeCurrentPlayer()

}

// вертикально лівий сусід
// горизонтальний нижній сусід
function addWall(graph, dots, rowN, columnN, wallType) {

  if (wallType === "vborder") {
    let leftCellRow = rowN;
    let leftCellColumn = columnN;

    graph[leftCellRow + "-" + leftCellColumn].rightN = null
    graph[leftCellRow + "-" + (leftCellColumn + 1)].leftN = null

    dots[leftCellRow - 1][leftCellColumn - 1] = 0

    if (graph[(leftCellRow + 1) + "-" + leftCellColumn] != null) {
      graph[(leftCellRow + 1) + "-" + leftCellColumn].rightN = null
      graph[(leftCellRow + 1) + "-" + (leftCellColumn + 1)].leftN = null
    }
  } else if (wallType === "hborder") {
    let BottomCellRow = rowN;
    let BottomCellColumn = columnN;

    graph[BottomCellRow + "-" + BottomCellColumn].topN = null
    graph[(BottomCellRow - 1) + "-" + BottomCellColumn].bottomN = null
    dots[BottomCellRow - 2][BottomCellColumn - 1] = 0

    if (graph[BottomCellRow + "-" + (BottomCellColumn + 1)] != null) {
      graph[BottomCellRow + "-" + (BottomCellColumn + 1)].topN = null
      graph[(BottomCellRow - 1) + "-" + (BottomCellColumn + 1)].bottomN = null
    }
  }
  return graph;

}

function deleteWall(rowN, columnN, wallType) {

  if (wallType === "vborder") {
    graph[rowN + "-" + (columnN + 1)].leftN = columnN < 1 ? null : graph[rowN + "-" + (columnN)];
    graph[rowN + "-" + columnN].rightN = columnN + 1 > 9 ? null : graph[rowN + "-" + (columnN + 1)];
    if (graph[rowN + 1 + "-" + columnN] != null) {
      graph[rowN + 1 + "-" + (columnN + 1)].leftN = columnN < 1 ? null : graph[rowN + 1 + "-" + (columnN)];
      graph[rowN + 1 + "-" + columnN].rightN = columnN + 1 > 9 ? null : graph[rowN + 1 + "-" + (columnN + 1)];
    }
  }
  if (wallType === "hborder") {
    //if(rowN - 1 < 9){}
    graph[rowN + "-" + columnN].topN = rowN - 1 < 1 ? null : graph[(rowN - 1) + "-" + columnN];
    graph[(rowN - 1) + "-" + columnN].bottomN = rowN > 9 ? null : graph[(rowN) + "-" + columnN];

    if (rowN + "-" + (columnN + 1) != null) {
      graph[rowN + "-" + (columnN + 1)].topN = rowN - 1 < 1 ? null : graph[(rowN - 1) + "-" + (columnN + 1)];
      graph[rowN - 1 + "-" + (columnN + 1)].bottomN = rowN > 9 ? null : graph[(rowN) + "-" + (columnN + 1)];

    }
  }

}

function canReachAtLeastOne(graph, startID, appointedRow, rowN, column, wallType) {

  let first = 1
  let last = 9
  for (let j = first; j <= last; j++) {
    if (canReach(addWall(graph, JSON.parse(JSON.stringify(dots)), rowN, column, wallType), graph[startID], graph[appointedRow + "-" + j])) {
      deleteWall(rowN, column, wallType)
      return true;
    }
  }
  deleteWall(rowN, column, wallType)
  return false;
}

function canReach(graph, startCell, finishCell) {

  let queue = []
  queue.push(startCell)
  startCell.visited = true
  while (queue.length > 0) {
    let currentCell = queue.shift()
    let neighbors = [currentCell.leftN, currentCell.rightN, currentCell.topN, currentCell.bottomN]
    for (let neighborCell of neighbors) {
      if (neighborCell != null) {
        if (!neighborCell.visited) {
          queue.push(neighborCell)
          neighborCell.visited = true
          try {
            if (neighborCell === finishCell) {
              Object.keys(graph).forEach(key => graph[key].visited = false)
              return true
            }
          } catch (e) {
          }
        }
      }
    }
  }

  Object.keys(graph).forEach(key => graph[key].visited = false)
  return false
}


function sum(a, b) {/*тестова штука*/
  return a + b;
}

//export default graph

