console.log("new js connected");

var container = document.getElementById('gridContainer');
var boxSize = 50;
var gridSize = 6;
var gridArray = [];
var matched = false;
drawGrid();


$('.box').click(function(event){
  if(event.target.classList.contains('dot')){
    let containerPos = container.getBoundingClientRect();
    let divPos = event.target.getBoundingClientRect();
    console.log(containerPos)
    console.log(divPos);
    let xx = Math.floor((divPos.left - containerPos.left)/boxSize);
    let yy = Math.floor((divPos.top - containerPos.top)/boxSize);
    console.log(xx + " , " + yy);
  }
})




$('#gridContainer').click(function(event){
  if(event.target.classList.contains('box')){
    let containerPos = container.getBoundingClientRect();
    let divPos = event.target.getBoundingClientRect();

    let xx = Math.floor((divPos.left - containerPos.left)/boxSize);
    let yy = Math.floor((divPos.top - containerPos.top)/boxSize);
    console.log(xx + " , " + yy);
  }
})

$('#matchBtn').click(function(){
  for(let y = 0; y < gridSize; y++){
    for(let x = 0; x < gridSize; x++){
      let color2Match = gridArray[x][y].color;
      if(x < gridSize -2){
        //check down two
        if(gridArray[x +1][y].color === color2Match && gridArray[x +2][y].color === color2Match){
          gridArray[x][y].matched = true;
          tempMark(x, y)
          gridArray[x +1][y].matched = true;
          tempMark(x+1, y)
          gridArray[x +2][y].matched = true;
          tempMark(x +2, y)
          matched = true;
        }
      }
      //check right two
      if(y < gridSize -2){
        if(gridArray[x][y +1].color === color2Match && gridArray[x][y +2].color === color2Match){
          gridArray[x][y].matched = true;
          tempMark(x,y)
          gridArray[x][y +1].matched = true;
          tempMark(x, y+1)
          gridArray[x][y +2].matched = true;
          tempMark(x, y+2)
          matched = true;
        }
      }
    }
  }
})

// $('#destroyBtn').click(function(){
//   if(matched === true){
//     for(let x = 0;x < gridSize; x++){
//       for(let y = 0; y < gridSize; y++){
//         if(gridArray[y][x].matched === true){
//           destroyDiv(y, x);
//           //gridArray[y][x].matched = false;
//         }
//       }
//     }
//   }
// })

// function destroyDiv(y, x){
//   let containerPos = container.getBoundingClientRect();
//   let divAtPos = document.elementFromPoint(x*boxSize + containerPos.left +1, y*boxSize + containerPos.top +1)
//   divAtPos.style.backgroundColor = "white"
// }

function tempMark(y, x){
  let containerPos = container.getBoundingClientRect();
  let divAtPos = document.elementFromPoint(x*boxSize + containerPos.left +1, y*boxSize + containerPos.top +1)
  let new = divAtPos.find('dot')
  new.append('X');
  // divAtPos.append("X")
}

function drawGrid(){
  container.style.width = (gridSize * boxSize) + "px";
  container.style.height = (gridSize * boxSize) + "px";
  //create 3d array of object for the grid
  for(let x = 0; x < gridSize; x++){
    gridArray[x] = [];
    for(let y = 0; y < gridSize; y++){
      gridArray[x][y]= {
        color: randomColor(0,6),
        matched: false
      }
    }
  }
  //draw actual grid with divs on the page
  for(let w = 0; w < gridSize; w++){
    for(let h = 0; h < gridSize; h++){
      let tempDiv = document.createElement('div');
      tempDiv.style.width = boxSize + "px"
      tempDiv.style.height = boxSize + "px"
      tempDiv.className = 'box'
      container.append(tempDiv)
      let dotDiv = document.createElement('div');
      dotDiv.className = "dot";
      dotDiv.style.backgroundColor = gridArray[w][h].color;
      dotDiv.style.width = boxSize -4 + "px"
      dotDiv.style.height = boxSize -4 + "px"
      tempDiv.append(dotDiv)
    }
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
