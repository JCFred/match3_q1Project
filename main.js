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
    //console.log(event.target)
    //console.log(divPos);
    let xx = Math.floor((divPos.left - containerPos.left)/boxSize);
    let yy = Math.floor((divPos.top - containerPos.top)/boxSize);
    //stupid fix for BAD math, fix later??
    if(xx === 8){xx = 7;}
    if(yy == 8){yy = 7;}
    console.log(yy + " , " + xx);

  //swap dots code
  if(event.target.classList.contains('dot') && playerPause === true){
    let gridDiv = $('#' + yy + "_" + xx);
    if(selected === 0){
      dotPick[0] = xx;
      dotPick[1] = yy;
      selected = 1;
      gridDiv.css("backgroundColor", "red");
      //console.log(gridDiv.style.backgroundColor);


    } else if (selected === 1){
      if(yy === dotPick[1] && xx === dotPick[0]){
        $('#' + dotPick[1] + "_" + dotPick[0]).css("backgroundColor", "#c2c0bd");
        selected = 0;
        //dotPick = [];
      } else if(((yy === dotPick[1]+1 || yy === dotPick[1]-1) && xx == dotPick[0])
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
        $('#' + dotPick[1] + "_" + dotPick[0]).css("backgroundColor", "#c2c0bd");
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
  let yScore = 0;
  let bScore = 0;
  let rScore = 0;
  for(let y = 0;y < gridSize; y++){
    for(let x = 0; x < gridSize; x++){
      if(gridArray[y][x].matched === true){
        gridArray[y][x].matched = false;
        gridArray[y][x].empty = true;
        switch(gridArray[y][x].color){
          case "red":
            rScore += 1;
            break;
          case "blue":
            bScore +=1
            break;
          case "yellow":
            yScore += 1;
            break;
          case "green":
            yScore += .5;
            bScore += .5
            break;
          case "orange":
            rScore += .5;
            yScore += .5;
            break;
          case "purple":
            rScore += .5;
            bScore += .5;
            break;
        }
        gridArray[y][x].color = "none";
        $('#' +y+ '_' +x).contents().remove()
      }
    }
  }
  shootScore(rScore, bScore, yScore);
}


//get and use the score!
function shootScore(redScore, blueScore, yellowScore){
  if(redScore > 0){
    $('#scoreOne').html("+" + redScore);
    shotAnimation("red", redScore);
  } else{
    $('#scoreOne').html("");
  }
  if(blueScore > 0){
    $('#scoreTwo').html("+" + blueScore);
    shotAnimation("blue", blueScore);
  } else {
    $('#scoreTwo').html("");
  }
  if(yellowScore > 0){
    $('#scoreThree').html("+" + yellowScore);
    shotAnimation("yellow", yellowScore)
  } else {
    $('#scoreThree').html("");
  }
}

function shotAnimation(color, score){
  if(color === "red"){
    let shotLane = $('#shotOne');
    let tempShot = document.createElement('div');
    tempShot.className = 'redShot'
    tempShot.id = "rBullet"
    shotLane.append(tempShot)
    let lanePos = shotLane.offset();

    $('#rBullet').css({
      'position': 'absolute',
      'left': lanePos.left +2,
      'top': lanePos.top + 23,
      'z-index': 1000
    });
    $('#rBullet').animate({'top': lanePos.top + 23, 'left': lanePos.left + 400}, 'slow', function(){
      $('#rBullet').remove();
    });

  } else if(color === "blue"){
    let shotLane = $('#shotTwo');
    let tempShot = document.createElement('div');
    shotLane.append(tempShot)
    tempShot.className = 'blueShot'
    tempShot.id = "bBullet"
    let lanePos = shotLane.offset();

    $('#bBullet').css({
      'position': 'absolute',
      'left': lanePos.left +2,
      'top': lanePos.top + 23,
      'z-index': 1000
    });
    $('#bBullet').animate({'top': lanePos.top + 23, 'left': lanePos.left + 400}, 'slow', function(){
      $('#bBullet').remove();
    });
  } else if(color === "yellow"){
      let shotLane = $('#shotThree')
      let tempShot = document.createElement('div');
      shotLane.append(tempShot);
      tempShot.className = 'yellowShotDiv'
      tempShot.id = 'yBullet'
      let bulletOne = document.createElement('div');
      let bulletTwo = document.createElement('div');
      bulletOne.className = 'yellowShot';
      bulletTwo.className = 'yellowShot';
      tempShot.append(bulletOne);
      $('#yBullet').append(bulletTwo);
      let lanePos = shotLane.offset();

      $('#yBullet').css({
        'position': 'absolute',
        'left': lanePos.left +2,
        'top': lanePos.top,
        'z-index': 1000
      });
      $('#yBullet').animate({'top': lanePos.top, 'left': lanePos.left + 400}, 'slow', function(){
        $('#yBullet').remove();
      });
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
        let spriteArr = getSprite(tempColor)
        tempDot.style.background = "url(sprites/gems.png)" + spriteArr[0] + "px " + spriteArr[1] + "px";
        tempDot.style.height = boxSize + "px";
        tempDot.style.width = boxSize + "px";
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
      tempDiv.style.backgroundColor = "#c2c0bd"
      tempDiv.className = 'box'
      tempDiv.id = w + "_" + h;
      container.append(tempDiv)

      let dotDiv = document.createElement('div');
      dotDiv.className = "dot";
      //console.log(dotDiv.id)
      //dotDiv.style.backgroundColor = gridArray[w][h].color;
      let spriteArr = getSprite(gridArray[w][h].color)
      dotDiv.style.background = "url(sprites/gems.png)" + spriteArr[0] + "px " + spriteArr[1] + "px";
      dotDiv.style.width = boxSize+ "px"
      dotDiv.style.height = boxSize+ "px"
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

function getSprite(color){
  let tempArr = [];
  switch(color){
    case "red":
      tempArr[0] = 0;
      tempArr[1] = 0;
      break;
    case "blue":
      tempArr[0] = 50;
      tempArr[1] = 50;
      break;
    case "yellow":
      tempArr[0] = 150;
      tempArr[1] = 100;
      break;
    case "green":
      tempArr[0] = 0;
      tempArr[1] = 100;
      break;
    case "orange":
      tempArr[0] = 0;
      tempArr[1] = 200;
      break;
    case "purple":
      tempArr[0] = 50;
      tempArr[1] = 0;
      break;
  }
  return tempArr;
}
