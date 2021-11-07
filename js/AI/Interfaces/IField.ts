import { Graph } from '../../astar'


interface IField{
  bestPossibleMove: Move
  moveValue: number
  player1WallAmount: number
  player2WallAmount: number
  player1Position: {
    x: number,
    y: number
  }
  player2Position: {
    x: number,
    y: number
  }
  canAddWall: (rowN: number, colN: number, waaType: string) => boolean
  /*
   * Handle both player movement and wallPlacing
   * @returns a new field / or can be converted into another type due to model
   */
  makeMove: (currentPlayer: number, move: Move) => Object
  /*
  * that is graph from astar
  * */
  convertGraphToDoubleArray: () => typeof Graph
  getCellsForMove: (playerNumber: number) => Array<Move>;
}

interface Move {
  x: number,
  y: number,
  type: string // wall or playerMove
  moveValue?: number
  wallOrientation?: string // vborder or hborder
  value?: number
}

export { IField, Move }
