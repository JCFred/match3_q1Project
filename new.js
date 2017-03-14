console.log("new js connected");

var container = document.getElementById('gridContainer');
var boxSize = 50;
var gridSize = 8;
var gridArray = [];
var matched = false;
drawGrid();

//test click, logs position and array object
$('.box').click(function(event){
  //if(event.target.classList.contains('dot')){
    let containerPos = container.getBoundingClientRect();
    let divPos = event.target.getBoundingClientRect();
    // console.log(containerPos)
    // console.log(divPos);
    let xx = Math.floor((divPos.left - containerPos.left)/boxSize);
    let yy = Math.floor((divPos.top - containerPos.top)/boxSize);
    //console.log(xx + " , " + yy);
    let shit = gridArray[yy][xx]
    console.log(yy + " , " + xx);
    console.log(shit);
  //}
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

$('#destroyBtn').click(function(){
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
})

$('#dropBtn').click(function(){
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
})

$('#repopBtn').click(function(){
  for(let y = 0; y < gridSize; y++){
    $('#0_' + y).contents().append(y);
    if(gridArray[0][y].empty == true){
      if(gridArray[1][y].empty == true){
        //empty and div below is empty
        let noFloor = true;
        let down = 1;
        while(noFloor){
          if(gridArray[down][y].empty == true){
            down += 1;
          } else {noFloor = false;}
        }
        popNDrop(y, down)
      } else {
        popNDrop(y, 1)
      }
    }
  }
  matched = false;
})

function popNDrop(y, number){
  for(let i = number; i > 0; i--){
    let dotDiv = document.createElement('div');
    dotDiv.className = "dot";
    let tempColor = randomColor(0,6)
    dotDiv.style.backgroundColor = tempColor;
    gridArray[i -1][y].color = tempColor;
    gridArray[i -1][y].empty = false;
    dotDiv.style.width = boxSize -4 + "px"
    dotDiv.style.height = boxSize -4 + "px"
    $('#' +(i-1)+ '_' +y).append(dotDiv)
    let child = $('#' +i+ '_' +y).contents();
    child.hide();

    let oldOffSet = $('#0_'+y).offset();
    let newOffSet = $('#'+(i-1)+'_'+y).offset();
    let tempClone = child.clone().appendTo('body');
    tempClone.css({
      'position': 'absolute',
      'left': oldOffSet.left,
      'top': oldOffSet.top - boxSize,
      'z-index': 1000
    });
    tempClone.animate({'top': newOffSet.top, 'left': newOffSet.left}, 'slow', function(){
      child.show();
      tempClone.remove();
    });
  }
}

//drop each piece in column one at a time
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

function tempMark(y, x){
  //let containerPos = container.getBoundingClientRect();
  //let divAtPos = document.elementFromPoint(x*boxSize + containerPos.left +1, y*boxSize + containerPos.top +1)
  $('#' +y+ '_' +x).contents().append("X")
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
