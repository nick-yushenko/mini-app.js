class Sudoku {

  constructor(initString = '000000000000000000000000000000000000000000000000000000000000000000000000000000000') {
    const startValues = initString.split('').filter(x => '0123456789'.includes(x)).map(x => Number(x))

    this.body = []

    let idCounter = 1
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {

        this.body.push({
          id: idCounter,
          x: x,
          y: y,
          number: startValues[idCounter - 1],
          selected: false,
          supported: false,
          important: false,
          error: false,
          started: startValues[idCounter - 1] === 0 ? false : true,
          s: parseInt(y / 3) * 3 + parseInt(x / 3) // номер сегмента от 0 до 7
        })

        idCounter++
      }
    }

  }

  getRow(n) {
    const row = []

    for (let i = 0; i < 9; i++) {
      row.push(this.body[9 * n + i]) // тк массив одномерный, то кадый 9 элемент - нулевой элемент в строке
    }

    return row
  }

  getColumn(n) {
    const column = []

    for (let i = 0; i < 9; i++) {
      column.push(this.body[i * 9 + n])
    }

    return column
  }

  getSegment(n) {
    const segment = []

    const x = n % 3 // X первой ячейки в сегменте 
    const y = parseInt(n / 3) // Y первой ячейки в сегменте

    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        segment.push(this.body[y * 27 + dy * 9 + x * 3 + dx])
      }
    }

    return segment
  }

  keydownHandler(event, cell) {
    if (!cell.started) {
      if ('123456789'.includes(event.key)) {
        cell.number = parseInt(event.key)

        if (cell.error) {
          this.body.forEach(item => item.error = false)
        }

        for (const item of this.getRow(cell.y)) {
          if (item === cell) {
            continue
          }

          if (item.number === cell.number) {
            item.error = true
            cell.error = true
          }
        }
        for (const item of this.getColumn(cell.x)) {
          if (item === cell) {
            continue
          }

          if (item.number === cell.number) {
            item.error = true
            cell.error = true
          }
        }
        for (const item of this.getSegment(cell.s)) {
          if (item === cell) {
            continue
          }

          if (item.number === cell.number) {
            item.error = true
            cell.error = true
          }
        }


      } else if (['Delete', 'Backspace'].includes(event.key)) {
        cell.number = 0
      }

      this.body.forEach(cell => {
        cell.important = false
      })

      if (cell.number) {
        this.body.forEach(item => {
          if (item.number == cell.number)
            item.important = true
        })
      }
    }



    // отмена стандартной обработки события, чтобы вводить по 1 символу
    event.preventDefault()
    this.viewUpdate()
  }



  focusHandler(event, cell) {
    cell.selected = true
    // Выделяем ряд и строку
    this.getColumn(cell.x).forEach(item => item.supported = true)
    this.getRow(cell.y).forEach(item => item.supported = true)

    if (cell.number) {
      this.body.forEach(item => {
        if (item.number == cell.number)
          item.important = true
      })
    }

    this.viewUpdate()
  }

  blurHandler(event, cell) {
    cell.selected = false

    if (cell.error) {
      cell.number = 0
    }

    // Выделяем ряд и строку
    this.getColumn(cell.x).forEach(item => item.supported = false)
    this.getRow(cell.y).forEach(item => item.supported = false)
    this.body.forEach(item => {
      item.important = false
      item.error = false
    })


    this.viewUpdate()
  }

  getHTML(size) {
    // rewrite
    for (const item of this.body) {
      const inputElement = document.createElement('input')
      inputElement.classList.add('sudoku-cell')
      inputElement.setAttribute('type', 'text')

      inputElement.addEventListener('keydown', event => this.keydownHandler(event, item))
      inputElement.addEventListener('focus', event => this.focusHandler(event, item))
      inputElement.addEventListener('blur', event => this.blurHandler(event, item))

      if (item.started) {
        inputElement.classList.add('start-cell')
      }


      item.element = inputElement
    }
    // -rewrite

    const rootElement = document.createElement('div')

    rootElement.classList.add('sudoku-game')
    rootElement.style.width = size + 'px'
    rootElement.style.height = size + 'px'
    rootElement.style.fontSize = size / 20 + 'px'

    for (let s = 0; s < 9; s++) {
      const segmentElement = document.createElement('div')

      segmentElement.classList.add('sudoku-segment')
      // rewrite

      for (const item of this.getSegment(s)) {
        segmentElement.append(item.element)
      }
      // -rewrite


      rootElement.append(segmentElement)
    }

    this.viewUpdate()
    return rootElement
  }

  viewUpdate() {
    this.body.forEach(cell => {
      cell.element.classList.remove('error', 'supported-cell', 'selected-cell', 'important-cell')
      cell.element.value = cell.number ? cell.number : ''
      if (cell.supported)
        cell.element.classList.add('supported-cell')
      if (cell.selected)
        cell.element.classList.add('selected-cell')
      if (cell.important)
        cell.element.classList.add('important-cell')
      if (cell.error)
        cell.element.classList.add('error')

    })
  }

}