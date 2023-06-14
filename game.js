$(document).ready(function () {
  var SudokuGrid = [];
  generateEmptyMatrix();
  generateNewSudoku();

  var previousElement = null;

  $(document).on('click', 'h1', function (event) {
    var clickedElement = event.target;
    var clickedText = $(clickedElement).text();

    // Remove styling from previous element
    if (previousElement !== null && previousElement !== clickedElement) {
      $(previousElement).css({
        'background-color': '',
        'color': ''
      });
    }

    // Apply styling to clicked element
    $(clickedElement).css({
      'background-color': '#red',
      'color': '#344861'
    });

    // Change text color of other visible h1 elements with the same text
    $('h1:visible').not(clickedElement).each(function () {
      if ($(this).text() === clickedText) {
        $(this).css('background-color', '#c3d7ea');

      } else {
        $(this).css('color', '');
      }
    });

    // Store the clicked element as the new previous element
    previousElement = clickedElement;

    // Remove styling from previous row and column elements
    $('h1').css('backgroundColor', '');

    // Highlight the row and column of the clicked element
    highlightRowAndColumn(clickedElement);
  });
  $(document).on('keypress', function (event) {
    var pressedNumber = parseInt(String.fromCharCode(event.which));

    if (pressedNumber >= 1 && pressedNumber <= 9 && previousElement !== null) {
      var currentText = $(previousElement).text();
      var newText = pressedNumber;
      // Validate the pressed number
      var isValid = validateNumber(newText);

      // Change the color of the h1 element based on validation result
      $(previousElement).css('color', isValid ? 'navy' : 'red');

      $(previousElement).text(newText);
    }
  });

  $(".myButton").on("click", function () {
    $(".overlay-pop-up").toggle();
  });

  $(".cross").on("click", function () {
    $(".overlay-pop-up").toggle();
  });

  //starting new game
  $(".start-game-btn").on("click", function () {
    $(".overlay-pop-up").toggle();
  });
  $(document).on('keydown', function (event) {
    if (event.which === 8 || event.which === 46) {
      event.preventDefault();

      if (previousElement !== null) {
        var currentText = $(previousElement).text();
        var newText = currentText.slice(0, -1);

        // Remove the last character from the h1 element
        $(previousElement).text(newText);
      }
    }
  });
  function generateNewSudoku() {
    //calculates the current column

    firstSection();
    first4Sections();
    fill5thOrRedo();
    fill6thOrRedo();
    fill7thOrRedo();
    fillLastSectionOrRedo();
    showMatrix();
    hideRandomH1Elements(50)
  }
  //generates an empty sudokuGrid in a 1-dimensional Array which will later be layed over a sudokuMatrix
  function generateEmptyMatrix() {
    for (let index = 0; index < 81; index++) {
      var section = $("h1")[index].parentNode.className;
      var row = rowCalc(index, section);
      var column = columnCalc(index, section);

      var obj = {
        element: $("h1")[index],
        section: section,
        row: row,
        column: column,
        value: undefined,
      };

      SudokuGrid.push(obj);
    }
    return SudokuGrid;
  }
  function columnCalc(index, section) {
    var column;
    switch (section) {
      case "1":
      case "4":
      case "7":
        column = index % 3 + 1;
        break;
      case "2":
      case "5":
      case "8":
        column = (index % 3) + 1 + 3;
        break;
      case "3":
      case "6":
      case "9":
        column = (index % 3) + 1 + 6;
        break;
    }
    return column;
  }

  //calculates the current row
  function rowCalc(index, section) {
    var row;
    switch (section) {
      case "1":
      case "2":
      case "3":
        row = Math.floor((index + 9 - section * 9) / 3) + 1;
        break;
      case "4":
      case "5":
      case "6":
        row = Math.floor((index + 9 - section * 9) / 3) + 1 + 3;
        break;
      case "7":
      case "8":
      case "9":
        row = Math.floor((index + 9 - section * 9) / 3) + 1 + 6;
        break;
    }
    return row;
  }

  function randomNumberArray() {
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    // Create an array with numbers 1 to 9
    const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
    // Shuffle the array
    shuffleArray(numbers);
    return numbers;
  }

  //generates the first 3x3
  function firstSection() {
    const element = randomNumberArray();
    for (let index = 0; index < element.length; index++) {
      SudokuGrid[index].value = element[index];
    }
    console.log(SudokuGrid.value);
  }

  //displays values in UI
  function showMatrix() {
    for (let index = 0; index < SudokuGrid.length; index++) {
      var sm = SudokuGrid[index];
      if (sm.value == undefined) {
        sm.element.innerHTML = "-";
      } else {
        sm.element.innerHTML = sm.value;
      }
    }
    console.log(SudokuGrid);
  }
  //fills one section
  function fillingSection(section) {
    var sectionNumbers;
    var hasUndefinedValue;

    // Function to check if a number is valid in the Sudoku grid


    do {
      resetSection(section)
      var numberArray = randomNumberArray();
      var numberArrayCopy = numberArray.slice(); // Make a copy of the numberArray
      sectionNumbers = numberArrayCopy;
      hasUndefinedValue = false;

      for (let j = 0; j < 9; j++) {
        var cell = SudokuGrid[section * 9 + j];
        var nextNumber = sectionNumbers[0];

        for (let index = 0; index < sectionNumbers.length && numberIsValid(SudokuGrid, cell, nextNumber) == false; index++) {
          nextNumber = sectionNumbers[index];
        }

        if (numberIsValid(SudokuGrid, cell, nextNumber)) {
          cell.value = nextNumber;
          const place = sectionNumbers.indexOf(cell.value);
          if (place !== -1) {
            sectionNumbers.splice(place, 1);
          }
        } else {
          cell.value = undefined;
          hasUndefinedValue = true; // Mark that an undefined value was encountered
          break; // Break the loop to retry the section generation
        }
      }
    } while (hasUndefinedValue);

    showMatrix()
  }
  function first4Sections() {
    for (let section = 1; section < 5; section++) {
      fillingSection(section);
    }
  }
  function resetSection(section) {
    for (let j = 0; j < 9; j++) {
      SudokuGrid[section * 9 + j].value = undefined;
    }
  }
  function numberIsValid(SudokuGrid, cell, number) {
    var Row = cell.row;
    var Column = cell.column;
    var rowArray = SudokuGrid.filter(obj => obj.row === Row);
    var columnArray = SudokuGrid.filter(obj => obj.column === Column);
    var rowValues = rowArray.map(obj => obj.value);
    var columnValues = columnArray.map(obj => obj.value);

    if (rowValues.includes(number) || columnValues.includes(number)) {
      return false;
    } else {
      return true;
    }
  }
  //ob Sektion Lösbar ist
  function isSectionSolvable(section) {
    // Iterate over cells in the last section
    for (let iSS = 0; iSS < 9; iSS++) {
      const cell = SudokuGrid[section * 9 + iSS];
      let isCellSolvable = false;

      // Try numbers from 1 to 9 for the current cell
      for (let number = 1; number <= 9; number++) {
        if (numberIsValid(SudokuGrid, cell, number)) {
          isCellSolvable = true;
          break;
        }
      }

      // If no valid number can be found for the cell, invalidate the section
      if (isCellSolvable == false) {
        return false;
      }
    }

    // If a valid number can be found for each cell, section is solvable
    return true;
  }
  //vorvorletzte geprüft
  function fill5thOrRedo() {
    while (isSectionSolvable(5) == false) {
      console.log("Last section cannot be filled. Redoing the 8th section...");
      fillingSection(4);
    }
    console.log("Last section has been filled successfully.");
    fillingSection(5);
  }
  //7. geprüft
  function fill6thOrRedo() {
    while (isSectionSolvable(6) == false) {
      console.log("Last section cannot be filled. Redoing the 8th section...");
      fillingSection(5);
    }
    console.log("Last section has been filled successfully.");
    fillingSection(6);
  }
  //vorletzte geprüft
  function fill7thOrRedo() {
    while (isSectionSolvable(7) == false || isSectionSolvable(8) == false) {
      console.log("Last section cannot be filled. Redoing the 8th section...");
      fillingSection(6);
    }
    console.log("Last section has been filled successfully.");
    fillingSection(7);
  }
  function fillLastSectionOrRedo() {
    while (isSectionSolvable(8) == false) {
      console.log("Last section cannot be filled. Redoing the 8th section...");
      fillingSection(7);
    }
    console.log("Last section has been filled successfully.");
    fillingSection(8);
  }

  function hideRandomH1Elements(count) {
    const h1Elements = document.querySelectorAll('h1');
    if (count >= h1Elements.length) {
      throw new Error('Count should be less than the number of <h1> elements');
    }

    const hiddenIndices = new Set();
    while (hiddenIndices.size < count) {
      const randomIndex = Math.floor(Math.random() * h1Elements.length);
      hiddenIndices.add(randomIndex);
    }

    h1Elements.forEach((element, index) => {
      if (hiddenIndices.has(index)) {
        element.innerText = '';

      }
    });
  }
  function highlightRowAndColumn(clickedElement) {
    // Get the row and column values of the clicked element from the SudokuGrid array
    const clickedRow = SudokuGrid.find(obj => obj.element === clickedElement).row;
    const clickedColumn = SudokuGrid.find(obj => obj.element === clickedElement).column;
    const clickedSection = SudokuGrid.find(obj => obj.element === clickedElement).section;
    const clickedValue = $(clickedElement).text();

    // Find all <h1> elements in the same row, column, and with the same value and hidden
    const h1Elements = Array.from(document.querySelectorAll('h1'));
    const rowElements = h1Elements.filter(element => SudokuGrid.find(obj => obj.element === element).row === clickedRow);
    const columnElements = h1Elements.filter(element => SudokuGrid.find(obj => obj.element === element).column === clickedColumn);
    const sectionElements = h1Elements.filter(element => SudokuGrid.find(obj => obj.element === element).section === clickedSection);
    const valueElements = h1Elements.filter(element => $(element).text() === clickedValue && element.innerText !== "");

    // Change the background color of each element in the row and column
    rowElements.forEach(element => {
      element.style.backgroundColor = '#e2ebf3';
    });
    columnElements.forEach(element => {
      element.style.backgroundColor = '#e2ebf3';
    });
    sectionElements.forEach(element => {
      element.style.backgroundColor = '#e2ebf3';
    });
    valueElements.forEach(element => {
      element.style.background = '#c3d7ea';
    });
    clickedElement.style.backgroundColor = '#bbdefb';
  }
  function validateNumber(number) {
    var gridObject = SudokuGrid.find(obj => obj.element == previousElement);
    return gridObject.value == number;
  }
});
