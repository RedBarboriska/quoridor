import {Move} from "../Interfaces/IField";

const player1WinRow: Array<Move> = [
  {x: 0, y: 0, type: "move"},
  {x: 1, y: 0, type: "move"},
  {x: 2, y: 0, type: "move"},
  {x: 3, y: 0, type: "move"},
  {x: 4, y: 0, type: "move"},
  {x: 5, y: 0, type: "move"},
  {x: 6, y: 0, type: "move"},
  {x: 7, y: 0, type: "move"},
  {x: 8, y: 0, type: "move"},
]

const player2WinRow: Array<Move> = [
  {x: 0, y: 8, type: "move"},
  {x: 1, y: 8, type: "move"},
  {x: 2, y: 8, type: "move"},
  {x: 3, y: 8, type: "move"},
  {x: 4, y: 8, type: "move"},
  {x: 5, y: 8, type: "move"},
  {x: 6, y: 8, type: "move"},
  {x: 7, y: 8, type: "move"},
  {x: 8, y: 8, type: "move"},
]

export { player1WinRow, player2WinRow }
