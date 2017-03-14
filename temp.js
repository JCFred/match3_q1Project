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





$('#dropBtn').click(function(){
  //run bottom to top, from left to right
  //let counter =1;
  for(let x = 0; x < gridSize; x++){
    for(let y = gridSize -1; y > -1; y--){
      let blank = 0;
      if(gridArray[y][x].empty === true){
        blank += 1;
        //$('#' +y+ '_' +x).append(blank)
        let looking = true;
        let up = 1;
        while(looking === true){
          if(y - up > -1){
            if(gridArray[y - up][x].empty === true){
                blank += 1;
                up +=1
            } else {
              $('#' +(y - up)+'_' +x).contents().append(blank)
              let child = $('#' +(y - up)+'_' +x).contents();
              let newParent = $('#' +y+'_' +x);
              dropDot(child, newParent, y -up, y, x);
              let newUp = up;
              let temp = 0;
              while(y - newUp > 0){
                newUp += 1;
                temp += 1;
                child = $('#' +(y - newUp)+'_' +x).contents();
                newParent = $('#' +(y-temp)+'_' +x);
                dropDot(child,newParent, y- newUp, y-temp, x)
              }
              looking = false;
            }
          } else {
            //at 0 place
            looking = false;
          }
        }
        //$('#' +y+ '_' +x).contents().append(counter)
        //counter += 1;
      }
      //console.log(y + " , " +x)
      //console.log(empty)
    }
  }
})

function dropDot(child, newParent, y1, y2, x){
  //update gridArray
  gridArray[y1][x].empty = true;
  gridArray[y2][x].empty = false;

  if(y2 - y1 > 0){
    let num = y2 + ((y2 - y1) -1)
    let temp = $('#'+num+"_"+x).contents();
    if ( temp === undefined){
      gridArray[y2 - num][x].empty = true;
    }
    //console.log("jumped: " +num);
  }

  gridArray[y2][x].color = gridArray[y1][x].color;
  gridArray[y1][x].color = "none"
  console.log(gridArray[y2][x].color);
  let oldOffSet = child.offset();
  if(oldOffSet != undefined){
    console.log(oldOffSet);
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
  }
  for(let n = gridSize -1; n >-1; n--){
    if(gridArray[n][x].color === "none"){
      gridArray[n][x].empty = true;
    }
  }

  if((y2+1 < gridSize -1) &&gridArray[y2 +1][x].empty === true){
    newParent = $('#' +(y2 +1)+'_' +x);
    dropDot(child, newParent, y2, y2+1, x);
  }
}
