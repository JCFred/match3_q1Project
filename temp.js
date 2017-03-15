$('#repopBtn').click(function(){
  for(let y = 0; y < gridSize; y++){
    //$('#0_' + y).contents().append(y);
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
      }
      popNDrop(y, 0)
    }
  }
  matched = false;
})

function popNDrop(y, num){
  let tempColor = randomColor(0,6)
  let newDiv = $('#'+(num-1)+"_"+y)
  let newChild = document.createElement('div');

  newDiv.append(newChild);
  newChild.className = "dot";
  newChild.style.backgroundColor = tempColor;
  newChild.style.height = boxSize -4 + "px";
  newChild.style.width = boxSize -4 + "px";
  let yDiv = $('#0_'+y);

  // let divLeft = yDiv.offset();
  // let oldDivTop = divLeft.top - boxSize;
  // let newDivTop = divLeft.top + num*boxSize;
  //
  // //newChild.hide();
  // let dotClone = newChild.clone().appendTo(newDiv);
  // dotClone.css({
  //   'position': 'absolute',
  //   'left': divLeft.left,
  //   'top': oldDivTop,
  //   'z-index': 1000
  // });
  //
  // dotClone.animate({'top': newDivTop, 'left': divLeft.left}, 'slow', function(){
  //   //newChild.show();
  //   dotClone.remove();
  // });
  //
  gridArray[num][y].color = tempColor;
  gridArray[num][y].empty = false;
}
