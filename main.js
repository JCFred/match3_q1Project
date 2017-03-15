console.log("new js connected");

var container = document.getElementById('gridContainer');
var boxSize = 50;
var gridSize = 8;
var gridArray = [];
var playerPause = true;
var selected = 0;
var dotPick = [];
var matched = false;

//initialize the game;
drawGrid();
runGameStep();

//functions with dot clicks
$('.box').click(function(event){
    let containerPos = container.getBoundingClientRect();
    let divPos = event.target.getBoundingClientRect();
    // console.log(containerPos)
    // console.log(divPos);
    let xx = Math.floor((divPos.left - containerPos.left)/boxSize);
    let yy = Math.floor((divPos.top - containerPos.top)/boxSize);
    //console.log(xx + " , " + yy);

  //swap dots code
  if(event.target.classList.contains('dot') && playerPause === true){
    let gridDiv = $('#' + yy + "_" + xx);
    if(selected === 0){
      dotPick[0] = xx;
      dotPick[1] = yy;
      selected = 1;
    } else if (selected === 1){
      if(((yy === dotPick[1]+1 || yy === dotPick[1]-1) && xx == dotPick[0])
      || ((xx === dotPick[0]+1 || xx === dotPick[0]-1) && yy == dotPick[1])){
        let divOne = $('#' + dotPick[1] + "_" + dotPick[0]);
        let dotOne = divOne.contents();
        divOne.contents().remove();
        gridDiv.contents().appendTo(divOne);
        dotOne.appendTo(gridDiv);
        let tempColor = gridArray[dotPick[1]][dotPick[0]].color;
        gridArray[dotPick[1]][dotPick[0]].color = gridArray[yy][xx].color
        gridArray[yy][xx].color = tempColor;
        selected = 0;
        playerPause = false;
        runGameStep();
      }
    }
  }
})




//run through a cycle of game step functions
function runGameStep(){
  let test = matchCheck();
  if(test){
    destroyMatched();
    setTimeout(function(){dotDrop();},200)
    setTimeout(function(){rePop();}, 600)

    //run function again, if a new match was created
    setTimeout(function(){
      let test2 = matchCheck();
      if(test2){
        console.log("run again?");
        runAgain();
        return;
      } else{
        console.log("should stop...");
        playerPause = true;
      }
    },700)
  } else {
    console.log("no match!");
    playerPause = true;
  }
}
function runAgain(){
  runGameStep();
}

//check game dot colors for matches and mark gridArray.matched
function matchCheck(){
  let noMatch = true;
  for(let y = 0; y < gridSize; y++){
    for(let x = 0; x < gridSize; x++){
      let color2Match = gridArray[x][y].color;
      if(color2Match !== "none"){
        if(x < gridSize -2){
          //check down two
          if(gridArray[x +1][y].color === color2Match && gridArray[x +2][y].color === color2Match){
            noMatch = false;
            gridArray[x][y].matched = true;
            gridArray[x +1][y].matched = true;
            gridArray[x +2][y].matched = true;
            matched = true;
          }
        }
        //check right two
        if(y < gridSize -2){
          if(gridArray[x][y +1].color === color2Match && gridArray[x][y +2].color === color2Match){
            noMatch = false;
            gridArray[x][y].matched = true;
            gridArray[x][y +1].matched = true;
            gridArray[x][y +2].matched = true;
            matched = true;
          }
        }
      }
    }
  }
  if(noMatch){
    return false;
  } else{
    return true;
  }
}

//remove any dots that were matched and reset gridArray values
function destroyMatched(){
  for(let y = 0;y < gridSize; y++){
    for(let x = 0; x < gridSize; x++){
      if(gridArray[y][x].matched === true){
        gridArray[y][x].matched = false;
        gridArray[y][x].empty = true;
        gridArray[y][x].color = "none";
        $('#' +y+ '_' +x).contents().remove()
      }
    }
  }
}

//find dots with empty grid underthem and run drop animation function
function dotDrop(){
  for(let x = 0; x < gridSize; x++){
    for(let y = gridSize -2; y > -1; y--){
      if(gridArray[y][x].empty == false && gridArray[y +1][x].empty == true){
        let emptyDown = 1;
        let down = 2
        while(y + down < gridSize){
          if(gridArray[y + down][x].empty == true){
            emptyDown += 1;
            down += 1;
          } else {
            down += gridSize;
          }
        }
        let child = $('#' +(y)+'_' +x).contents();
        let newParent =$('#' +(y + emptyDown)+'_' +x)
        //drop
        hotDrop(child, newParent, y, x, emptyDown);
      }
    }
  }
}

//animate the drop of each piece in column one at a time
function hotDrop(child, newParent, y, x, yChange){
  let oldOffSet = child.offset();
  child.appendTo(newParent);
  let newOffSet = child.offset();

  let tempClone = child.clone().appendTo(container);
  tempClone.css({
    'position': 'absolute',
    'left': oldOffSet.left,
    'top': oldOffSet.top,
    'z-index': 1000
  });
  child.hide();
  tempClone.animate({'top': newOffSet.top, 'left': newOffSet.left}, 'slow', function(){
    child.show();
    tempClone.remove();
  });
  gridArray[y +yChange][x].color = gridArray[y][x].color;
  gridArray[y][x].color = "none";
  gridArray[y +yChange][x].empty = false;
  gridArray[y][x].empty = true;
}

//fill empty spots at top with new dots (needs animation!)
function rePop(){
  for(let y = 0; y < gridSize; y++){
    if(gridArray[0][y].empty === true){
      let noFloor = true;
      let down = 1;
      while(noFloor){
        if(gridArray[down][y].empty === true){
          down += 1;
        }else if(down > gridArray -1){
          noFloor = false;
        } else if (gridArray[down][y].empty === false){
          noFloor = false;
        }
      }
      //$('#'+down+'_' + y).contents().append(down);
      for(let i = 0; i < down; i++){
        let tempDot = document.createElement('div');
        let newDiv = $('#'+i+"_"+y)
        let tempColor = randomColor(0,6)
        tempDot.className = "dot";
        tempDot.style.backgroundColor = tempColor;
        tempDot.style.height = boxSize -4 + "px";
        tempDot.style.width = boxSize -4 + "px";
        newDiv.append(tempDot);
        gridArray[i][y].empty = false;
        gridArray[i][y].color = tempColor;
      }
    }
  }
}




//draw the initial game board at specified sizes
function drawGrid(){
  container.style.width = (gridSize * boxSize)+ 7*gridSize + "px";
  container.style.height = (gridSize * boxSize)+ 7*gridSize + "px";
  //create 3d array of object for the grid
  for(let x = 0; x < gridSize; x++){
    gridArray[x] = [];
    for(let y = 0; y < gridSize; y++){
      gridArray[x][y]= {
        color: randomColor(0,6),
        empty: false,
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
      tempDiv.id = w + "_" + h;
      container.append(tempDiv)
      let dotDiv = document.createElement('div');
      dotDiv.className = "dot";
      //console.log(dotDiv.id)
      dotDiv.style.backgroundColor = gridArray[w][h].color;
      dotDiv.style.width = boxSize -4 + "px"
      dotDiv.style.height = boxSize -4 + "px"
      tempDiv.append(dotDiv)
    }
  }
}

//get random number and return a color
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
