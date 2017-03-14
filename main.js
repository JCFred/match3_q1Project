console.log("js connected");

var container = document.getElementById('gridContainer');
var boxSize = 50;
var gridSize = 6;
var gridArray = [];
var selected = {
  x: -1,
  y: -1
}
drawGrid();




$('#gridContainer').click(function(event){
  if(event.target.classList.contains('box')){
    let containerPos = container.getBoundingClientRect();
    let divPos = event.target.getBoundingClientRect();
    console.log(containerPos)
    console.log(divPos);
    let xx = Math.floor((divPos.left - containerPos.left)/boxSize);
    let yy = Math.floor((divPos.top - containerPos.top)/boxSize);
    console.log(xx + " , " + yy);
    runMatch();

  }
})

function drawGrid(){
  container.style.width = (gridSize * boxSize) + "px";
  container.style.height = (gridSize * boxSize) + "px";
  //create 3d array of object for the grid
  for(let x = 0; x < gridSize; x++){
    gridArray[x] = [];
    for(let y = 0; y < gridSize; y++){
      gridArray[x][y] = {
        color: randomColor(0,6),
        matched: false
      }
    }
  }
  //draw actual grid with divs on the page
  for(let w = 0; w < gridSize; w++){
    for(let h = 0; h < gridSize; h ++){
      let tempDiv = document.createElement('div');
      tempDiv.style.width = boxSize + "px"
      tempDiv.style.height = boxSize + "px"
      tempDiv.className = 'box'
      tempDiv.style.backgroundColor = gridArray[w][h].color;
      container.append(tempDiv)

    }
  }
}

function runMatch(){
  matchCheck()
  //pause before destroying matches
  updateGrid();
}

function matchCheck(){
  for(let x = 0; x < gridSize; x++){
    for(let y = 0; y < gridSize; y++){
      let color2Match = gridArray[y][x].color;
      if(y < gridSize -2 && color2Match != "white"){
        //check down two
        if(gridArray[y +1][x].color === color2Match && gridArray[y +2][x].color === color2Match){
          gridArray[y][x].matched = true;
          gridArray[y +1][x].matched = true;
          gridArray[y +2][x].matched = true;
        }
      }
      //check right two
      if(x < gridSize -2 && color2Match != "white"){
        if(gridArray[y][x +1].color === color2Match && gridArray[y][x +2].color === color2Match){
          gridArray[y][x].matched = true;
          gridArray[y][x +1].matched = true;
          gridArray[y][x +2].matched = true;
        }
      }
    }
  }
}

function updateGrid(){
  for(let x = 0;x < gridSize; x++){
    for(let y = 0; y < gridSize; y++){
      if(gridArray[y][x].matched === true){
        let containerPos = container.getBoundingClientRect();
        let divAtPos = document.elementFromPoint(x*boxSize + containerPos.left +1, y*boxSize + containerPos.top +1)
        let oldColor = gridArray[y][x].color;
        let newColor = colorSwitch(oldColor);
        divAtPos.style.backgroundColor = newColor
        setTimeout(function(){divAtPos.style.backgroundColor = "white"},300)
        gridArray[y][x].color = "white"
        gridArray[y][x].matched = false;
      }
    }
  }
  popNDrop();
}

function popNDrop(){
  for(let x = 0; x < gridSize; x++){
    for(let y = gridSize-1; y > -1; y--){
      let containerPos = container.getBoundingClientRect();
      let divAtPos = document.elementFromPoint(x*boxSize + containerPos.left +1, y*boxSize + containerPos.top +1)
      divAtPos.append(x + " , " + y)
      if(gridArray[x][y].color == "white"){
        let whites = 1;
        let empty = true;
        while(empty === true){
          if((y-whites > -1) && gridArray[x][y - whites].color == "white"){
            whites += 1;
          } else {
            empty = false;
          }
        }
        realDrop(x, y, whites);
      }
    }
  }
}
function realDrop(x, y, dropSpaces){
  if(y-dropSpaces > -1){
    let containerPos = container.getBoundingClientRect();
    let dropDivAtPos = document.elementFromPoint(x*boxSize + containerPos.left +1, (y -dropSpaces)*boxSize + containerPos.top +1)
    let bottomDivAtPos = document.elementFromPoint(x*boxSize + containerPos.left +1, y*boxSize + containerPos.top +1)

    let moveColor = gridArray[x][y - dropSpaces].color;
    bottomDivAtPos.style.backgroundColor = moveColor;
    dropDivAtPos.style.backgroundColor = "white"
  }
}

function drop(y,x, drop){
  let containerPos = container.getBoundingClientRect();
  let divAtPos = document.elementFromPoint(x*boxSize + containerPos.left +1, y*boxSize + containerPos.top +1)
  let downDivAtPos = document.elementFromPoint(x *boxSize + containerPos.left +1, (y + drop)*boxSize + containerPos.top +1)
  //update new colors
  downDivAtPos.style.backgroundColor = gridArray[y][x].color;
  gridArray[y+1][x].color = gridArray[y][x].color;
  divAtPos.style.backgroundColor = "white"
  gridArray[y][x].color = "white"
}

function array2Div(x, y){
  let containerPos = container.getBoundingClientRect();
  let divAtPos = document.elementFromPoint(x*boxSize + containerPos.left +1, y*boxSize + containerPos.top +1)
  divAtPos.style.backgroundColor = gridArray[x][y].color;
}

function colorSwitch(color){
  switch(color){
    case "red":
    return "rgb(255, 120, 84)"
      break;
    case "blue":
      return "rgb(94, 251, 228)"
      break;
    case "yellow":
      return "rgb(234, 241, 104)"
      break;
    case "green":
      return "rgb(86, 228, 91)"
      break;
    case "orange":
      return "rgb(250, 191, 76)"
      break;
    case "purple":
      return "rgb(239, 75, 254)"
      break;
  }
}

function randomColor(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let num = Math.floor(Math.random() * (max - min)) + min;
  switch(num){
    case 0:
    return "red"
      break;
    case 1:
      return "blue"
      break;
    case 2:
      return "yellow"
      break;
    case 3:
      return "green"
      break;
    case 4:
      return "orange"
      break;
    case 5:
      return "purple"
      break;
  }
}
