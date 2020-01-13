const sudoku = new Sudoku(
  `
    0 0 0   1 0 0   2 0 4
    0 0 7   5 8 6   9 1 3
    0 1 0   3 0 0   0 0 7

    0 3 0   6 5 0   4 7 9
    0 0 8   7 0 3   0 6 2
    0 0 0   2 0 0   5 0 8

    8 7 0   0 0 0   0 0 0
    0 4 9   0 1 0   0 2 0
    2 5 0   4 0 9   8 9 0
  `)

document.querySelector('#app').append(sudoku.getHTML(700))