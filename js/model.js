import {Parser as jQuery} from "acorn";
import cloneDeep from "../clone-deep-master";


let graph = {}
graphInit(graph);

let twoRealPlayers=1;

let firstPlayerRow = 9;
let firstPlayerColumn = 5;
let fpWallsAmount = 10;

let secondPlayerRow = 1;
let secondPlayerColumn = 5;

let dots = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

/*
function VtoMCellConverter(rowOrColumn) {
  return (parseInt(rowOrColumn) + 1) / 2
}*/
/*
function MtoVCellConverter(rowOrColumn) {
  return parseInt(rowOrColumn) * 2 - 1
}*/

/*
export function CellEventModel(rowCell, columnCell) {

  if (rowCell=== firstPlayerRow && columnCell === firstPlayerColumn) {
    firstPlayerCellTouched=1;
  }
  else if  (firstPlayerCellTouched && isPlayerNeighbor(rowCell + "" + columnCell, firstPlayerRow + "" + firstPlayerColumn)) {
//переміщаємось


  }
}*/

export function changePlayerPos(newRow, newColumn) {
  firstPlayerRow = newRow
  firstPlayerColumn = newColumn
}

export function getFirstPlayerRow() {
  return firstPlayerRow
}

export function getFirstPlayerColumn() {
  return firstPlayerColumn
}

export function getFirstPlayerNeighbors() {
  let playerCell = graph[firstPlayerRow + "-" + firstPlayerColumn]
  return [playerCell.leftN, playerCell.rightN, playerCell.topN, playerCell.bottomN]
}


export function isPlayerNeighbor(askedID, isFirstPlayer) {

  let askedCell = graph[askedID]
  if (isFirstPlayer) {
    let playerCell = graph[firstPlayerRow + "-" + firstPlayerColumn]
    let neighbors = [playerCell.leftN, playerCell.rightN, playerCell.topN, playerCell.bottomN]
    for (let neighborCell of neighbors) {
      if (askedCell === neighborCell) {
        return true
      }
    }
  }
  return false
}

/*
export function isPlayerNeighbor1(graph, askedRow, askedColumn, playerRow, playerColumn) {
  askedRow = VtoMCellConverter(askedRow)
  askedColumn = VtoMCellConverter(askedColumn)
  playerRow = VtoMCellConverter(playerRow)
  playerColumn = VtoMCellConverter(playerColumn)
  let askedCell = graph[askedRow + "-" + askedColumn]
  let playerCell = graph[playerRow + "-" + playerColumn]
  let neighbors = [playerCell.leftN, playerCell.rightN, playerCell.topN, playerCell.bottomN]
  for (let neighborCell of neighbors) {
    if (askedCell === neighborCell) {
      return true
    }
  }
  return false
}
*/
export function graphInit(graph) {

  let first = 1;
  let last = 9;
  for (let i = first; i <= last; i++) {
    for (let j = first; j <= last; j++) {
      graph[i + "-" + j] = {pos: {row: i, column: j}}
    }
  }

  for (let i = first; i <= last; i++) {
    for (let j = first; j <= last; j++) {
      /*graph[i + "-" + j].leftN = graph[i + "-" + (j - 1)]
        graph[i + "-" + j].rightN = graph[i + "-" + (j + 1)]
        graph[i + "-" + j].topN = graph[(i + 1) + "-" + j]
        graph[i + "-" + j].bottomN = graph[(i - 1) + "-" + j]*/

      graph[i + "-" + j].leftN = j - 1 < first ? null : graph[i + "-" + (j - 1)];
      graph[i + "-" + j].rightN = j + 1 > last ? null : graph[i + "-" + (j + 1)];
      graph[i + "-" + j].bottomN = i + 1 > last ? null : graph[(i + 1) + "-" + j];
      graph[i + "-" + j].topN = i - 1 < first ? null : graph[(i - 1) + "-" + j];

    }
  }


}


export function canAddWall(rowN, columnN, wallType) {
  if (wallType === "vborder") {
    let leftCellRow = parseInt(rowN);
    let leftCellColumn = parseInt(columnN);

console.log("canReachAtLeastOne")
//console.log(canReachAtLeastOne(graph, firstPlayerRow+"-"+firstPlayerColumn, 1))
    if (graph[leftCellRow + "-" + leftCellColumn].rightN === null
      || (graph[leftCellRow + 1 + "-" + leftCellColumn] != null && graph[leftCellRow + 1 + "-" + leftCellColumn].rightN === null)
      || leftCellRow===9
      || ((graph[leftCellRow + 1 + "-" + leftCellColumn] != null && graph[leftCellRow + 1 + "-" + leftCellColumn].topN === null)
        && (graph[(leftCellRow + 1) + "-" + (leftCellColumn + 1)] != null && graph[(leftCellRow + 1) + "-" + (leftCellColumn + 1)].topN === null)
      && !dots[leftCellRow-1][leftCellColumn-1])
      ||!canReachAtLeastOne(graph, firstPlayerRow+"-"+firstPlayerColumn, 1, leftCellRow,leftCellColumn,wallType)


     ) {console.log("can`t Reach vertical")
      return false
    } else return true
  }

  if (wallType === "hborder") {
    let BottomCellRow = parseInt(rowN);
    let BottomCellColumn = parseInt(columnN);
    console.log("hborder")
console.log(graph[BottomCellRow + "-" + BottomCellColumn].rightN === null)


    if (graph[BottomCellRow + "-" + BottomCellColumn].topN === null
      || (graph[BottomCellRow + "-" + (BottomCellColumn + 1)] != null && graph[BottomCellRow + "-" + (BottomCellColumn + 1)].topN === null)
      || BottomCellColumn === 9
      || ((graph[BottomCellRow + "-" + (BottomCellColumn+1)] != null && graph[BottomCellRow + "-" + (BottomCellColumn+1)].leftN === null)
        && (graph[(BottomCellRow-1) + "-" + (BottomCellColumn+1)] != null && graph[(BottomCellRow-1) + "-" + (BottomCellColumn+1)].leftN === null)
        && !dots[BottomCellRow-2][BottomCellColumn-1]
      )||!canReachAtLeastOne(graph, firstPlayerRow+"-"+firstPlayerColumn, 1,BottomCellRow,BottomCellColumn,wallType)
      //|| (graph[BottomCellRow + "-" + (BottomCellColumn + 1)] != null && graph[BottomCellRow + "-" + (BottomCellColumn + 1)].topN === null)
      /*graph[BottomCellRow + "-" + BottomCellColumn].topN === null
      || (graph[BottomCellRow + "-" + (BottomCellColumn + 1)] === null)
      || (graph[BottomCellRow + "-" + (BottomCellColumn + 1)] != null && graph[BottomCellRow + "-" + (BottomCellColumn + 1)].topN === null)
      || (graph[BottomCellRow + "-" + (BottomCellColumn - 1)] != null && graph[BottomCellRow + "-" + (BottomCellColumn - 1)].topN === null)
      || !canReachAtLeastOne(addWall(graph,rowN,columnN,wallType), firstPlayerRow+"-"+firstPlayerColumn, 1)*/) {
      console.log("can`t Reach horizon")
      return false
    } else return true
  }

}

export function addWallToGraph(rowN, columnN, wallType) {
  graph = addWall(graph,dots, rowN, columnN, wallType)

}

// вертикально лівий сусід
// горизонтальний нижній сусід
function addWall(graph,dots, rowN, columnN, wallType) {

  if (wallType === "vborder") {
    let leftCellRow = rowN;
    let leftCellColumn = columnN;

    graph[leftCellRow + "-" + leftCellColumn].rightN = null
    graph[leftCellRow + "-" + (leftCellColumn + 1)].leftN = null

    dots[leftCellRow-1][leftCellColumn-1]=0

    if (graph[(leftCellRow + 1) + "-" + leftCellColumn] != null) {
      graph[(leftCellRow + 1) + "-" + leftCellColumn].rightN = null
      graph[(leftCellRow + 1) + "-" + (leftCellColumn + 1)].leftN = null
    }
  } else if (wallType === "hborder") {
    let BottomCellRow = rowN;
    let BottomCellColumn = columnN;

    graph[BottomCellRow + "-" + BottomCellColumn].topN = null
    graph[(BottomCellRow - 1) + "-" + BottomCellColumn].bottomN = null
    dots[BottomCellRow-2][BottomCellColumn-1]=0

    if (graph[BottomCellRow + "-" + (BottomCellColumn + 1)] != null) {
      graph[BottomCellRow + "-" + (BottomCellColumn + 1)].topN = null
      graph[(BottomCellRow - 1) + "-" + (BottomCellColumn + 1)].bottomN = null
    }
  }
  return graph;

}
function deleteWall(rowN, columnN, wallType){

  if (wallType=== "vborder"){
    graph[rowN + "-" + (columnN+1)].leftN = columnN  < 1 ? null : graph[rowN + "-" + (columnN)];
    graph[rowN + "-" + columnN].rightN = columnN + 1 > 9 ? null : graph[rowN + "-" + (columnN + 1)];
    if(graph[rowN+1 + "-" + columnN]!=null){
      graph[rowN+1 + "-" + (columnN+1)].leftN = columnN  < 1 ? null : graph[rowN+1 + "-" + (columnN)];
      graph[rowN+1 + "-" + columnN].rightN = columnN + 1 > 9 ? null : graph[rowN+1 + "-" + (columnN + 1)];
    }
  }
  if (wallType=== "hborder"){
    //if(rowN - 1 < 9){}
    graph[rowN + "-" + columnN].topN = rowN - 1 < 1 ? null : graph[(rowN - 1) + "-" + columnN];
    graph[(rowN-1) + "-" + columnN].bottomN = rowN  > 9 ? null : graph[(rowN ) + "-" + columnN];

    console.log(graph[(rowN) + "-" + columnN])
    //console.log(graph[(rowN-1) + "-" + columnN])
    if(rowN + "-" + (columnN+1)!=null){
      graph[rowN + "-" + (columnN+1)].topN = rowN - 1 < 1 ? null : graph[(rowN - 1) + "-" + (columnN+1)];
      graph[rowN-1 + "-" + (columnN+1)].bottomN = rowN  > 9 ? null : graph[(rowN ) + "-" + (columnN+1)];

      //console.log(graph[(rowN) + "-" + columnN])
      //console.log(graph[(rowN-1) + "-" + columnN])
    }
  }
  /*
      graph[i + "-" + j].leftN = j - 1 < first ? null : graph[i + "-" + (j - 1)];
      graph[i + "-" + j].rightN = j + 1 > last ? null : graph[i + "-" + (j + 1)];
      graph[i + "-" + j].bottomN = i + 1 > last ? null : graph[(i + 1) + "-" + j];
      graph[i + "-" + j].topN = i - 1 < first ? null : graph[(i - 1) + "-" + j];*/
}
function canReachAtLeastOne(graph, startID, appointedRow,rowN,column,wallType) {

  let first = 1
  let last = 9
  for (let j = first; j <= last; j++) {
    if (canReach(addWall(graph,JSON.parse(JSON.stringify(dots)),rowN,column,wallType), graph[startID], graph[appointedRow + "-" + j])) {
      deleteWall(rowN,column,wallType)
  return true;
    }
  }
  console.log(graph)
  deleteWall(rowN,column,wallType)
  return false;
}

function canReach(graph, startCell, finishCell) {
  // graph - мап обьектов
  // startCell - начальная вершина
  // finishCell - пункт назначения

  //graph=JSON.parse(JSON.stringify(graph))
  // инициализируем очередь
  let queue = []
  // добавляем startCell в очередь
  queue.push(startCell)
  // помечаем startCell как посещенную вершину во избежание повторного добавления в очередь
  startCell.visited = true
  while (queue.length > 0) {
    // удаляем первый (верхний) элемент из очереди
    let currentCell = queue.shift()
    let neighbors = [currentCell.leftN, currentCell.rightN, currentCell.topN, currentCell.bottomN]
    for (let neighborCell of neighbors) {
      // если сосед не посещался
      if (neighborCell != null) {//тут треба ще подумать
        if (!neighborCell.visited) {
          // добавляем его в очередь
          queue.push(neighborCell)
          // помечаем вершину как посещенную
          neighborCell.visited = true
          // если сосед является пунктом назначения, мы победили


          try {

            if (neighborCell === finishCell) {
              console.log('graph', graph)

              /*for (let element in graph) {
                element.visited = false
              }*/
              Object.keys(graph).forEach(key => graph[key].visited = false)
              return true
            }
          } catch (e) {
            console.log(e)
          }


        }
      }
    }
  }
  // если finishCell не обнаружено, значит пункта назначения достичь невозможно
  /*for (let element of graph) {
    element.visited = false
  }*/
  Object.keys(graph).forEach(key => graph[key].visited = false)
  return false
}


export function sum(a, b) {/*тестова штука*/
  return a + b;
}

export default graph

/*
function graphInit1() {

  let first = 1;
  let last = 17;

  for (let j = first; j <= last; j++) {
    for (let i = first; i <= last; i++) {
      if (i === first && j === first) {
        graph.set(i + "-" + j, [(i + 1) + "-" + j, i + "-" + (j + 1)]);
      } else if (i === first && j === last) {
        graph.set(i + "-" + j, [(i + 1) + "-" + j, i + "-" + (j - 1)]);
      } else if (i === last && j === first) {
        graph.set(i + "-" + j, [(i - 1) + "-" + j, i + "-" + (j + 1)]);
      } else if (i === last && j === last) {
        graph.set(i + "-" + j, [(i - 1) + "-" + j, i + "-" + (j - 1)]);
      } else if ((i < last || i > first) && j === first) {
        graph.set(i + "-" + j, [(i + 1) + "-" + j, i + "-" + (j + 1), (i - 1) + "-" + j]);
      } else if ((i < last || i > first) && j === last) {
        graph.set(i + "-" + j, [(i + 1) + "-" + j, i + "-" + (j - 1), (i - 1) + "-" + j]);
      } else if ((j < last || j > first) && i === first) {
        graph.set(i + "-" + j, [i + "-" + (j + 1), (i + 1) + "-" + j, i + "-" + (j - 1)]);
      } else if ((j < last || j > first) && i === last) {
        graph.set(i + "-" + j, [i + "-" + (j + 1), (i - 1) + "-" + j, i + "-" + (j - 1)]);
      } else {
        //середина
        graph.set(i + "-" + j, [(i + 1) + "-" + j, i + "-" + (j + 1), (i - 1) + "-" + j, i + "-" + (j - 1)]);
      }
      //graph.add("cell"+i+"_"+j:["cell"+(i+1)+"_"+j, "cell"+i+"_"+(j+1), "cell"+(i-1)+"_"+j, "cell"+i+"_"+(j-1)])


    }
  }


}

function bfs1(adj, s, t) {
  // adj - смежный список
  // s - начальная вершина
  // t - пункт назначения

  // инициализируем очередь
  let queue = []
  // добавляем s в очередь
  queue.push(s)
  // помечаем s как посещенную вершину во избежание повторного добавления в очередь
  s.visited = true
  while (queue.length > 0) {
    // удаляем первый (верхний) элемент из очереди
    let v = queue.shift()
    // abj[v] - соседи v
    for (let neighbor of adj[v]) {
      // если сосед не посещался
      if (neighbor != null && !neighbor.visited) {
        // добавляем его в очередь
        queue.push(neighbor)
        // помечаем вершину как посещенную
        neighbor.visited = true
        // если сосед является пунктом назначения, мы победили
        if (neighbor === t) return true
      }
    }
  }
  // если t не обнаружено, значит пункта назначения достичь невозможно
  return false
}
*/
/*if(i===first && j===first){
        graph.set("cell"+i+"_"+j, ["cell"+(i+1)+"_"+j, "cell"+i+"_"+(j+1)]);
      }else if(i===first && j===last){
        graph.set("cell"+i+"_"+j, ["cell"+(i+1)+"_"+j, "cell"+i+"_"+(j-1)]);
      }else if(i===last && j===first){
        graph.set("cell"+i+"_"+j, ["cell"+(i-1)+"_"+j, "cell"+i+"_"+(j+1)]);
      }else if(i===last && j===last){
        graph.set("cell"+i+"_"+j, ["cell"+(i-1)+"_"+j, "cell"+i+"_"+(j-1)]);
      }else if((i<last || i>first) && j===first){
        graph.set("cell"+i+"_"+j, ["cell"+(i+1)+"_"+j, "cell"+i+"_"+(j+1), "cell"+(i-1)+"_"+j]);
      }else if((i<last || i>first) && j===last){
        graph.set("cell"+i+"_"+j, ["cell"+(i+1)+"_"+j, "cell"+i+"_"+(j-1), "cell"+(i-1)+"_"+j]);
      }else if((j<last || j>first) && i===first){
        graph.set("cell"+i+"_"+j, ["cell"+i+"_"+(j+1), "cell"+(i+1)+"_"+j, "cell"+i+"_"+(j-1)]);
      }else if((j<last || j>first) && i===last){
        graph.set("cell"+i+"_"+j, ["cell"+i+"_"+(j+1), "cell"+(i-1)+"_"+j, "cell"+i+"_"+(j-1)]);
      }else{
        //середина
        graph.set("cell"+i+"_"+j, ["cell"+(i+1)+"_"+j, "cell"+i+"_"+(j+1), "cell"+(i-1)+"_"+j, "cell"+i+"_"+(j-1)]);
      }*/

/*const graph = {
  cell1_1: ['cell1_2', 'cell2_1'],
  b: ['c'],
  c: ['d'],
  d: ['b', 'c']
}*/
