$(document).ready(function() {
    // set the constructor
    class Cell {
        constructor(row, col) {
          this.row = row;
          this.col = col;
          this.mine = false;
          this.found = false;
          this.flagged = false;
        }
    }      
   // initialize variables
   var boardGame = [];
   var cols;
   var rows;
   var gameOver = false;
   var minesLeft;
   var time = 0;
   var isTimerOn = false;
   var firstPlace;
   var secondPlace;
   var thirdPlace;




   function isMine(cell) {
       if(cell.mine == true) {
           return true;
       }
       else if(cell.mine == false) {
           return false;
       }
   }

   // start timer
   function start() {
        inter = setInterval(setTimer, 1000);
    
}



    //timer 
   function setTimer() {
       if(isTimerOn) {
        time += 1;
        $("#timer").empty();
        $("#timer").append("Time: " + time + "s");
       }
        
   }

   function resetTimer() {
       time = 0;
       clearInterval(inter);
       isTimerOn = false;
       
   }

   
    // build the board
    function buildBoard() {

        rows = $("#rows").val();
        cols = $("#columns").val();
        for(i=1; i<=rows; i++){
            for(j=1; j<=cols; j++){
            if(j==1){
                boardGame[i]=[];
              }
          var pos = i + "*" + j;
          var newCell = $("<button type='button' class='cell'></button>");
          newCell.attr("id", pos);
          newCell.click(function() {
              clicked(this, event);
          })
          $("#board").append(newCell);
          boardGame[i][j]= new Cell(i, j);
        }
      }
      $("#board").css("grid-template-columns", "repeat(" + cols + ", 20px)");
      $("#board").css("grid-template-rows", "repeat(" + rows + ", 20px)");
    }

    function makeRandom(max) {
        return Math.floor(Math.random() * Math.floor(max) + 1);
    }

    // place the mines on the board
    function placeMines() {
        mines = $("#mines").val();
        rows = $("#rows").val();
        cols = $("#columns").val();

        for(i=0; i<mines; i++) {
            x = makeRandom(rows);
            y = makeRandom(cols);

            if(boardGame[x][y].mine == false) {
                boardGame[x][y].mine = true;
            }
            else if(boardGame[x][y].mine == true) {
                i--;
            }
        }
        
    }

    // get the number of adjacent mines
    function getAdjacentMines(x, y) {
        var num = 0;
        x = parseInt(x);
        y = parseInt(y);
        
        if(x-1 > 0) {
            if(boardGame[x-1][y].mine == true) {
                num += 1;
            }
        }
        if(x+1 <= rows) {
            if(boardGame[x+1][y].mine == true) {
                num += 1;
            }
        }
        if(y-1 > 0) {
            if(boardGame[x][y-1].mine == true) {
                num += 1;
            }
        }
        if(y+1 <= cols) {
            if(boardGame[x][y+1].mine == true) {
                num += 1;
            }
        }
        if(x-1 > 0 && y-1 > 0) {
            if(boardGame[x-1][y-1].mine == true) {
                num += 1;
            }
        }
        if(x+1 <= rows && y-1 >0) {
            if(boardGame[x+1][y-1].mine == true) {
                num += 1;
            }
        }
        if(x-1 > 0 && y+1 <= cols) {
            if(boardGame[x-1][y+1].mine == true) {
                num += 1;
            }
        }
        if(x+1 <= rows && y+1 <= cols) {
            if(boardGame[x+1][y+1].mine == true) {
                num += 1;
            }
        }
        
        return num;
    }

    // see if it's the high score

    function isHighScore() {
        if(firstPlace == null) {
            firstPlace = time;
            $("#highscore").empty();
            $("#highscore").append("First Place: " + time + "s, Second Place: , Third Place: ");
        }
        else if(secondPlace == null) {
            secondPlace = time;
            if(secondPlace < firstPlace) {
                var temp = firstPlace;
                firstPlace = secondPlace;
                secondPlace = temp;
            }
            $("#highscore").empty();
            $("#highscore").append("First Place: " + firstPlace + "s, Second Place: " + secondPlace + "s, Third Place: ");
        }
        else if(thirdPlace == null) {
            thirdPlace = time;
            if(thirdPlace < firstPlace) {
                var temp = firstPlace;
                var temp2 = secondPlace;
                firstPlace = thirdPlace;
                secondPlace = temp;
                thirdPlace = temp2;

            }
            else if(thirdPlace < secondPlace && thirdPlace > firstPlace) {
                var temp = secondPlace;
                secondPlace = thirdPlace;
                thirdPlace = temp;
                
            }
            $("#highscore").empty();
            $("#highscore").append("First Place: " + firstPlace + "s, Second Place: " + secondPlace + "s, Third Place: " + thirdPlace + "s");
        }
        else if(time < firstPlace) {
            var temp = firstPlace;
            var temp2 = secondPlace;

            firstPlace = time;
            secondPlace = temp;
            thirdPlace = temp2;
            $("#highscore").empty();
            $("#highscore").append("First Place: " + firstPlace + "s, Second Place: " + secondPlace + "s, Third Place: " + thirdPlace + "s");
        }
        else if(time > firstPlace && time < secondPlace) {
            var temp = secondPlace;

            secondPlace = time;
            thirdPlace = temp;
            $("#highscore").empty();
            $("#highscore").append("First Place: " + firstPlace + "s, Second Place: " + secondPlace + "s, Third Place: " + thirdPlace + "s");
        }
        else if(time > secondPlace && time < thirdPlace) {
            thirdPlace = time;

            $("#highscore").empty();
            $("#highscore").append("First Place: " + firstPlace + "s, Second Place: " + secondPlace + "s, Third Place: " + thirdPlace + "s");
        }

    }

    // check to see if player has won
    function win() {
        rows = $("#rows").val();
        cols = $("#columns").val();
        mines = $("#mines").val();
        var empties = (cols * rows) - mines;
        var n = 0;
        var m = 0;
        for(i=1; i<=rows; i++) {
            for(j=1; j<=cols; j++) {
                intI = parseInt(i);
                intJ = parseInt(j);
                thisId = i + "*" + j;
                if(boardGame[intI][intJ].mine == true && boardGame[intI][intJ].flagged == true) {
                    n += 1;
                    if(n == mines && m == empties) {
                        gameOver = true;
                        isHighScore();
                        resetTimer();
                        alert("You win!");
                        return;
                    }
                }
                else if(boardGame[intI][intJ].found == true) {
                    m +=1;
                    if(n == mines && m == empties) {
                        gameOver = true;
                        isHighScore();
                        resetTimer();
                        alert("You win!");
                        return;
                    }
                }
                else {
                    return;
                }

            }
        }
    }

    // when a cell is clicked
    function clicked(cell, event) {
        var id = $(cell).attr("id");
        var flagId = $(cell).attr("id") + "flag";
        var coor = id.split("*");
        var x = parseInt(coor[0]);
        var y = parseInt(coor[1]); 
        if(!isTimerOn && gameOver == false) {
            isTimerOn = true;
            start();
        }

        // shift click
        if(gameOver == false && boardGame[x][y].found == false) { 
            if(event.shiftKey) {
                if(boardGame[x][y].flagged == false) {
                    thisCell = document.getElementById(id);
                    $(thisCell).append($('<img />').attr('id', flagId));
                    thisFlag = document.getElementById(flagId);
                    $(thisFlag).attr('src', 'flag.png');
                    boardGame[x][y].flagged = true;
                    minesLeft -= 1;
                    $("#mines-left").empty();
                    $("#mines-left").append("Mines Left: " + minesLeft);
                    if(minesLeft == 0) {
                        win();
                    }
                }
                else {
                    thisCell = document.getElementById(id);
                    thisFlag = document.getElementById(flagId);
                    document.getElementById(flagId).remove();
                    boardGame[x][y].flagged = false;
                    minesLeft += 1;
                    $("#mines-left").empty();
                    $("#mines-left").append("Mines Left: " + minesLeft);
                }
                
            }
            // if it's a mine
            else if(isMine(boardGame[x][y]) && boardGame[x][y].flagged == false) {
                rows = $("#rows").val();
                cols = $("#columns").val();
                for(i=1; i<=rows; i++) {
                    for(j=1; j<=cols; j++) {
                          intI = parseInt(i);
                          intJ = parseInt(j);
                        thisId = i + "*" + j;
                        if(boardGame[intI][intJ].mine == true) {
                            thisCell = document.getElementById(thisId);
                            if(boardGame[intI][intJ].flagged == true) {
                                boardGame[intI][intJ].flagged = false;
                                flagId = thisId + "flag"
                                document.getElementById(flagId).remove();
                            }
                            $(thisCell).append($('<img />').attr('src', 'bomb.jpeg'));
                         //   document.getElementById(thisId).append("bomb");
                        }
                    }
                }
                gameOver = true;
                resetTimer();
                alert("You lost the game :((");

                
            }
            //if it's not a mine
            else if(!isMine(boardGame[x][y])) {
                boardGame[x][y].found = true;
                numMines = getAdjacentMines(x, y);
         //       numFlags = getAdjacentFlags(x, y);
                if(minesLeft == 0) {
                    win();
                }
                if(numMines != 0) {
                    document.getElementById(id).append(numMines);
                    document.getElementById(id).style.backgroundColor = "#a09a9c";
                }
                
                else if(numMines == 0) {
                    document.getElementById(id).style.backgroundColor = "#a09a9c";
                    clearAdjacent(x, y);

                }
                
            }

            

            
    } 
    else if(gameOver == false && boardGame[x][y].found == true) {
        numMines = getAdjacentMines(x, y);
        numFlags = getAdjacentFlags(x, y);

        if(numMines != 0 && numFlags != 0 && numMines == numFlags) {
            clickAdjacent(x, y);

        }
        else {
            return;
        } 
    }
        else if(gameOver == true) {
            return;
          //  alert("The game is over, you have to start a new game"); 
        } 
        }


    // click adjacent tiles if num adjacent flags = num adjacent bombs 
    function clickAdjacent(x, y) {
        x = parseInt(x);
        y = parseInt(y);
        
        if(x-1 > 0) {
            var newX = (x - 1).toString();
            var newY = y.toString();
            var thisId = newX + "*" + newY;
            if(boardGame[x-1][y].found == false && boardGame[x-1][y].flagged == false) {
                clicked(document.getElementById(thisId), event);
            }
            
        }
        if(x+1 <= rows) {
            var newX = (x + 1).toString();
            var newY = y.toString();
            var thisId = newX + "*" + newY;
            if(boardGame[x+1][y].found == false && boardGame[x+1][y].flagged == false) {
                clicked(document.getElementById(thisId), event);
            }
        }
        if(y-1 > 0) {
            var newX = x.toString();
            var newY = (y-1).toString();
            var thisId = newX + "*" + newY;
            if(boardGame[x][y-1].found == false && boardGame[x][y-1].flagged == false) {
                clicked(document.getElementById(thisId), event);
            }
        }
        if(y+1 <= cols) {
            var newX = x.toString();
            var newY = (y+1).toString();
            var thisId = newX + "*" + newY;
            if(boardGame[x][y+1].found == false && boardGame[x][y+1].flagged == false) {
                clicked(document.getElementById(thisId), event);
            }
        }
        if(x-1 > 0 && y-1 > 0) {
            var newX = (x-1).toString();
            var newY = (y-1).toString();
            var thisId = newX + "*" + newY;
            if(boardGame[x-1][y-1].found == false && boardGame[x-1][y-1].flagged == false) {
                clicked(document.getElementById(thisId), event);
            }
        }
        if(x+1 <= rows && y-1 >0) {
            var newX = (x+1).toString();
            var newY = (y-1).toString();
            var thisId = newX + "*" + newY;
            if(boardGame[x+1][y-1].found == false && boardGame[x+1][y-1].flagged == false) {
                clicked(document.getElementById(thisId), event);
            }
        }
        if(x-1 > 0 && y+1 <= cols) {
            var newX = (x-1).toString();
            var newY = (y+1).toString();
            var thisId = newX + "*" + newY;
            if(boardGame[x-1][y+1].found == false && boardGame[x-1][y+1].flagged == false) {
                clicked(document.getElementById(thisId), event);
            }
        }
        if(x+1 <= rows && y+1 <= cols) {
            var newX = (x+1).toString();
            var newY = (y+1).toString();
            var thisId = newX + "*" + newY;
            if(boardGame[x+1][y+1].found == false && boardGame[x+1][y+1].flagged == false) {
                clicked(document.getElementById(thisId), event);
            }
        }
        
    }

    // count the adjacent flags
    function getAdjacentFlags(x, y) {
        var numFlags = 0;
        x = parseInt(x);
        y = parseInt(y);
        
        if(x-1 > 0) {
            if(boardGame[x-1][y].flagged == true) {
                numFlags += 1;
            }
        }
        if(x+1 <= rows) {
            if(boardGame[x+1][y].flagged == true) {
                numFlags += 1;
            }
        }
        if(y-1 > 0) {
            if(boardGame[x][y-1].flagged == true) {
                numFlags += 1;
            }
        }
        if(y+1 <= cols) {
            if(boardGame[x][y+1].flagged == true) {
                numFlags += 1;
            }
        }
        if(x-1 > 0 && y-1 > 0) {
            if(boardGame[x-1][y-1].flagged == true) {
                numFlags += 1;
            }
        }
        if(x+1 <= rows && y-1 >0) {
            if(boardGame[x+1][y-1].flagged == true) {
                numFlags += 1;
            }
        }
        if(x-1 > 0 && y+1 <= cols) {
            if(boardGame[x-1][y+1].flagged == true) {
                numFlags += 1;
            }
        }
        if(x+1 <= rows && y+1 <= cols) {
            if(boardGame[x+1][y+1].flagged == true) {
                numFlags += 1;
            }
        }
        
        return numFlags;

    }


    // show all the empty adjacent cells if the cell is empty
    function clearAdjacent(x, y) {
        var x = parseInt(x);
        var y = parseInt(y);
        boardGame[x][y].found = true;

        if(x-1 > 0) {
            var left = boardGame[x-1][y];
            if(left.found == false && left.mine == false && left.flagged == false && getAdjacentMines(x-1, y) == 0) {
                left.found = true;
                var newX = (x - 1).toString();
                var newY = y.toString();
                var thisId = newX + "*" + newY
                document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                clearAdjacent(x-1, y);
                
            }
            else if(left.found == false && left.mine == false && left.flagged == false && getAdjacentMines(x-1, y) != 0) {
                left.found = true;
                numMines = getAdjacentMines(x-1, y);
                var newX = (x - 1).toString();
                var newY = y.toString();
                var thisId = newX + "*" + newY
                document.getElementById(thisId).append(numMines);
                document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                
                if(minesLeft == 0) {
                    left.found = true;
                    win();
                }
                else {
                    if(left.found == false) {
                    document.getElementById(thisId).append(numMines);
                    document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                    left.found = true;
                    }
                    
                }
            } 
        }
        if(x+1 <= rows) {
            var right = boardGame[x+1][y];
            if(right.found == false && right.mine == false && right.flagged == false && getAdjacentMines(x+1, y) == 0) {
                right.found = true;
                var newX = (x + 1).toString();
                var newY = y.toString();
                var thisId = newX + "*" + newY;
                document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                clearAdjacent(x+1, y);
                
            }
            else if(right.found == false && right.mine == false && right.flagged == false && getAdjacentMines(x+1, y) != 0) {
             //   right.found = true;
                numMines = getAdjacentMines(x+1, y);
                var newX = (x + 1).toString();
                var newY = y.toString();
                var thisId = newX + "*" + newY;
                
                if(minesLeft == 0) {
                    right.found = true;
                    win();
                }
                else {
                    if(right.found == false) {
                    document.getElementById(thisId).append(numMines);
                    document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                    right.found = true;
                    }
                    
                }
            } 
        }
        if(y-1 > 0) {
            var top = boardGame[x][y-1];
            if(top.found == false && top.mine == false && top.flagged == false && getAdjacentMines(x, y-1) == 0) {
                top.found = true;
                var newX = x.toString();
                var newY = (y-1).toString();
                var thisId = newX + "*" + newY;
                document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                clearAdjacent(x, y-1);
    
                
            }
            else if(top.found == false && top.mine == false && top.flagged == false && getAdjacentMines(x, y-1) != 0) {
             //   top.found = true;
                numMines = getAdjacentMines(x, y-1);
                var newX = x.toString();
                var newY = (y-1).toString();
                var thisId = newX + "*" + newY;

                if(minesLeft == 0) {
                    top.found = true;
                    win();
                }
                else {
                    if(top.found == false) {
                    document.getElementById(thisId).append(numMines);
                    document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                    top.found = true;
                    }
                    
                }
            } 
        }
        if(y+1 <= cols) {
            var bottom = boardGame[x][y+1];
            if(bottom.found == false && bottom.mine == false && bottom.flagged == false && getAdjacentMines(x, y+1) == 0) {
                bottom.found = true;
                var newX = x.toString();
                var newY = (y+1).toString();
                var thisId = newX + "*" + newY;
                document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                clearAdjacent(x, y+1);
            }
            else if(bottom.found == false && bottom.mine == false && bottom.flagged == false && getAdjacentMines(x, y+1) != 0) {
             //   bottom.found = true;
                numMines = getAdjacentMines(x, y+1);
                var newX = x.toString();
                var newY = (y+1).toString();
                var thisId = newX + "*" + newY;

                if(minesLeft == 0) {
                    bottom.found = true;
                    win();
                }
                else {
                    if(bottom.found == false) {
                        document.getElementById(thisId).append(numMines);
                        document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                        bottom.found = true;
                    }
                    

                }
            } 
            
        }

        // diagonals

        if(x-1 > 0 && y-1 > 0) {
            var topLeft = boardGame[x-1][y-1];
            if(topLeft.found == false && topLeft.mine == false && topLeft.flagged == false && getAdjacentMines(x-1, y-1) == 0) {
                // do nothing
            }
            else if(topLeft.found == false && topLeft.mine == false && topLeft.flagged == false && getAdjacentMines(x-1, y-1) != 0) {
                numMines = getAdjacentMines(x-1, y-1);
                var newX = (x-1).toString();
                var newY = (y-1).toString();
                var thisId = newX + "*" + newY;

                if(minesLeft == 0) {
                    topLeft.found = true;
                    win();
                }
                else {
                    if(topLeft.found == false) {
                        document.getElementById(thisId).append(numMines);
                        document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                        topLeft.found = true;
                    }
                    

                }
            } 
            
        }
        
        if(x+1 <= rows && y-1 > 0) {
            var topRight = boardGame[x+1][y-1];
            if(topRight.found == false && topRight.mine == false && topRight.flagged == false && getAdjacentMines(x+1, y-1) == 0) {
            // do nothing
            }
            else if(topRight.found == false && topRight.mine == false && topRight.flagged == false && getAdjacentMines(x+1, y-1) != 0) {
                numMines = getAdjacentMines(x+1, y-1);
                var newX = (x+1).toString();
                var newY = (y-1).toString();
                var thisId = newX + "*" + newY;

                if(minesLeft == 0) {
                    topRight.found = true;
                    win();
                }
                else {
                    if(topRight.found == false) {
                        document.getElementById(thisId).append(numMines);
                        document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                        topRight.found = true;
                    }
                    

                }
            } 
            
        }
        
            
        if(x-1 > 0 && y+1 <= cols) {
            var bottomLeft = boardGame[x-1][y+1];
            if(bottomLeft.found == false && bottomLeft.mine == false && bottomLeft.flagged == false && getAdjacentMines(x-1, y+1) == 0) {
            // do nothing
            }
            else if(bottomLeft.found == false && bottomLeft.mine == false && bottomLeft.flagged == false && getAdjacentMines(x-1, y+1) != 0) {
                numMines = getAdjacentMines(x-1, y+1);
                var newX = (x-1).toString();
                var newY = (y+1).toString();
                var thisId = newX + "*" + newY;

                if(minesLeft == 0) {
                    bottomLeft.found = true;
                    win();
                }
                else {
                    if(bottomLeft.found == false) {
                        document.getElementById(thisId).append(numMines);
                        document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                        bottomLeft.found = true;
                    }
                    

                }
            } 
            
        }
            
        if(x+1 <= rows && y+1 <= cols) {
            var bottomRight = boardGame[x+1][y+1];
            if(bottomRight.found == false && bottomRight.mine == false && bottomRight.flagged == false && getAdjacentMines(x+1, y+1) == 0) {
             // do nothing
            }
            else if(bottomRight.found == false && bottomRight.mine == false && bottomRight.flagged == false && getAdjacentMines(x+1, y+1) != 0) {
             //   bottom.found = true;
                numMines = getAdjacentMines(x+1, y+1);
                var newX = (x+1).toString();
                var newY = (y+1).toString();
                var thisId = newX + "*" + newY;

                if(minesLeft == 0) {
                    bottomRight.found = true;
                    win();
                }
                else {
                    if(bottomRight.found == false) {
                        document.getElementById(thisId).append(numMines);
                        document.getElementById(thisId).style.backgroundColor = "#a09a9c";
                        bottomRight.found = true;
                    }
                    

                }
            } 
            
        } 
        
        return;
        
    }

    // change the max number of mines if you change the rows/columns
    $("#columns").change(function() {
        rows = $("#rows").val();
        cols = $("#columns").val();
        maxMines = rows * cols - 1;
        $("#mines").attr("max", maxMines);
    }); 

    $("#rows").change(function() {
        rows = $("#rows").val();
        cols = $("#columns").val();
        maxMines = rows * cols - 1;
        $("#mines").attr("max", maxMines);
    }); 

    // validate board dimensions
    $("#go").on("click", function() {
        time = 0;
        rows = $("#rows").val();
        cols = $("#columns").val();
        var mines = $("#mines").val();
        maxMines = rows * cols - 1;
        gameOver = false;


        if(cols < 8 || cols > 40) {
            alert("Please make the number of columns an integer between 8 and 40");
        }
        else if(rows < 8 || rows > 30) {
            alert("Please make the number of rows an integer between 8 and 30");
        }
        else if(mines < 1 || mines > maxMines) {
            alert("Please make the number of mines between 1 and " + maxMines);
        }
        else {
            $("#board").empty();
            buildBoard();
            placeMines();
            if(isTimerOn) {
                resetTimer();
                $("#timer").empty();
                $("#timer").append("Time: " + time + "s");
            }
            time = 0;
            $("#timer").empty();
            $("#timer").append("Time: " + time + "s");
            minesLeft = mines;
            $("#mines-left").empty();
            $("#mines-left").append("Mines Left: " + minesLeft);
        }
        
    });

});