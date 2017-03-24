//fill empty spots at top with new dots (needs animation!)
function rePop(){
  for(let y = 0; y < gridSize; y++){
    if(gridArray[0][y].empty === true){
      let noFloor = true;
      let checkDown = 1;

      while(noFloor){
        if(checkDown >= gridArray){
          noFloor = false;
        }else if(gridArray[checkDown][y].empty === true){
          checkDown += 1;
        }else{
          noFloor = false;
        }
      }

      //$('#'+down+'_' + y).contents().append(down);
      for(let i = checkDown -1; i > -1 ; i--){
        let newDiv = $('#'+i+"_"+y)
        let topDiv = $('#0_' +i);

        let tempDot = document.createElement('div');
        tempDot.className = "dot";
        let tempColor = randomColor(0,6)
        let spriteArr = getSprite(tempColor)
        tempDot.style.background = "url(sprites/gems.png)" + spriteArr[0] + "px " + spriteArr[1] + "px";
        tempDot.style.height = boxSize + "px";
        tempDot.style.width = boxSize + "px";
        gridArray[i][y].empty = false;
        gridArray[i][y].color = tempColor;
        newDiv.append(tempDot);

        if(i != 0){
          setTimeout(function(){
            let topDivPos = topDiv.offset();
            let newDivPos = newDiv.offset();
            tempDot.id = "dotId"
            let tempClone = $('#dotId').clone().appendTo(topDiv);
            $('#dotId').hide()

            tempClone.id = 'dotCloneId'
            $('#dotCloneId').css({
              'position': 'absolute',
              'left': topDivPos.left,
              'top': topDivPos.top,
              'z-index': 1000
            });
            $('#dotCloneId').animate({'top': newDivPos.top, 'left': newDivPos.left}, 'slow', function(){
              $('#dotId').show();
              $('#dotCloneId').remove();
            });
          }, 200)
        }

      }
    }
  }
}
