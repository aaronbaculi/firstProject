var debug = false;

var board = [8]; //board will be a 2d array with a piece (or nothing)
var scl = 64;

var moving = false;
var moveList = [];

var tempRow;
var tempCol;

var turn = "w";

function preload()
{
  /*
  wPawn = loadImage("assets/wPawn.png");
  bPawn = loadImage("assets/bPawn.png");
  wKnight = loadImage("assets/wKnight.png");
  bKnight = loadImage("assets/bKnight.png");
  wKing = loadImage("assets/wKing.png");
  bKing = loadImage("assets/bKing.png");
  wBishop = loadImage("assets/wBishop.png");
  bBishop = loadImage("assets/bBishop.png");
  wQueen = loadImage("assets/wQueen.png");
  bQueen = loadImage("assets/bQueen.png");
  wRook = loadImage("assets/wRook.png");
  bRook = loadImage("assets/bRook.png");
  */
  
  spriteSheet = loadImage("chessSpriteSheet.png");
}

function setup() {
  createCanvas(512, 512);
  for(var i = 0; i < 8; i ++)
  {
    board[i] = new Array(8);
  }
  for(var row = 0; row < board.length; row ++)
  {
    for(var col = 0; col < board[0].length; col ++)
    {
      board[row][col] = new Cell("e", "e", row, col);
      
      
    }
  }
  
  //gonna have to manually code the starting positions of all the pieces
  //white side
  board[7][0] = new Cell("w", "r", 7, 0);
  board[7][1] = new Cell("w", "n", 7, 1);
  board[7][2] = new Cell("w", "b", 7, 2);
  board[7][3] = new Cell("w", "q", 7, 3);
  board[7][4] = new Cell("w", "k", 7, 4);
  board[7][5] = new Cell("w", "b", 7, 5);
  board[7][6] = new Cell("w", "n", 7, 6);
  board[7][7] = new Cell("w", "r", 7, 7);
  
  board[6][0] = new Cell("w", "p", 6, 0);
  board[6][1] = new Cell("w", "p", 6, 1);
  board[6][2] = new Cell("w", "p", 6, 2);
  board[6][3] = new Cell("w", "p", 6, 3);
  board[6][4] = new Cell("w", "p", 6, 4);
  board[6][5] = new Cell("w", "p", 6, 5);
  board[6][6] = new Cell("w", "p", 6, 6);
  board[6][7] = new Cell("w", "p", 6, 7);
  //black side
  board[0][0] = new Cell("b", "r", 0, 0);
  board[0][1] = new Cell("b", "n", 0, 1);
  board[0][2] = new Cell("b", "b", 0, 2);
  board[0][3] = new Cell("b", "q", 0, 3);
  board[0][4] = new Cell("b", "k", 0, 4);
  board[0][5] = new Cell("b", "b", 0, 5);
  board[0][6] = new Cell("b", "n", 0, 6);
  board[0][7] = new Cell("b", "r", 0, 7);
  
  board[1][0] = new Cell("b", "p", 1, 0);
  board[1][1] = new Cell("b", "p", 1, 1);
  board[1][2] = new Cell("b", "p", 1, 2);
  board[1][3] = new Cell("b", "p", 1, 3);
  board[1][4] = new Cell("b", "p", 1, 4);
  board[1][5] = new Cell("b", "p", 1, 5);
  board[1][6] = new Cell("b", "p", 1, 6);
  board[1][7] = new Cell("b", "p", 1, 7);
}

function draw() {
  background(220);
  for(var row = 0; row < board.length; row ++)
  {
    for(var col = 0; col < board[0].length; col ++)
    {
      if(debug === true)
      {
        board[row][col].debugShow();
      }else
      {
        board[row][col].show();
      }
      
    }
  }
  
  
  if(moving === true)
  {
    for(var i = 2; i < moveList.length; i += 2)
    {
      fill(0, 255, 0, 70);
      rect(moveList[i + 1] * scl, moveList[i] * scl, scl, scl);
    }
  }
}

function check(board, color) //color is the opposite color of the king
{
  //takes in a board and a color, and outputs whether the king is in check
  var enemyPieces = [];
  var kingRow, kingCol;
  
  //adds all enemy pieces to an array
  for(var row = 0; row < board.length; row ++)
  {
    for(var col = 0; col < board[0].length; col ++)
    {
      if(board[row][col].color === color)
      {
        enemyPieces.push(board[row][col]);
      }else if(board[row][col].piece === "k")
      {
        kingRow = row;
        kingCol = col;
      }
    }
  }
  
  for(var i = 0; i < enemyPieces.length; i ++) //for every enemy piece
  {
    //print(enemyPieces);
    var tempMoves = enemyPieces[i].showMoves();
    for(var j = 2; j < tempMoves.length; j += 2)
    {
      //tempMoves[j] is col, tempMoves[j + 1] is row
      if(tempMoves[j] === kingRow && tempMoves[j + 1] === kingCol)
      {
        // print("King location: " + kingRow + ", " + kingCol);
        // print("Piece causing check:" + enemyPieces[i].piece);
        // print("Moves: " + tempMoves);
        // print("Specific move" + tempMoves[j + 1] + ", " + [j]);
        return true;
      }
    }
  }
  return false;
}


function Cell(c, piece, row, col) //is either a piece or an empty cell
{
  this.row = row;
  this.col = col;
  this.x = this.col * scl;
  this.y = this.row * scl;
  this.piece = piece;
  this.color = c; //color is "e" if the piece is empty, or "b", or "w"
  // this.fill = color(200); legacy code
  
  this.toString = function()
  {
    return "c: " + this.color + "piece: " + this.piece;
  }
  
  this.debugShow = function()
  {
    if(this.color === "b")
    {
      fill(100);
    }else if(this.color === "w")
    {
      fill(255);
    }else //if the color is "e" and the Cell is "empty"
    {
      //add code to create the black and white checkerboard
      //placeholder text
      fill(200);
    }
    rect(this.x, this.y, scl, scl);
    fill(0);
    textSize(16);
    text(this.piece + "r" + this.row + "c:" + this.col, this.x + 2, this.y + 20);
  }
  
  this.show = function()
  {
    if(this.row % 2 === this.col % 2)
    {
      fill(255);
    }else
    {
      fill(100);
    }
    rect(this.x, this.y, scl, scl); //figure out how to make the checkerboard pattern
    
    if(this.color === "w")
    {
      if(this.piece === "p")
      {
        image(spriteSheet, this.x, this.y, scl, scl, 1670, 12, 256, 256);
      }
      if(this.piece === "n")
      {
        image(spriteSheet, this.x, this.y, scl, scl, 1000, 4, 256, 256);
      }
      if(this.piece === "b")
      {
        image(spriteSheet, this.x, this.y, scl, scl, 666, 0, 256, 256);
      }
      if(this.piece === "r")
      {
        image(spriteSheet, this.x, this.y, scl, scl, 1338, 10, 256, 256);
      }
      if(this.piece === "k")
      {
        image(spriteSheet, this.x, this.y, scl, scl, 0, 0, 256, 256);
      }
      if(this.piece === "q")
      {
        image(spriteSheet, this.x, this.y, scl, scl, 320, 0, 286, 256);
      }
    }else if(this.color === "b")
    {
      if(this.piece === "p")
      {
        image(spriteSheet, this.x, this.y, scl, scl, 1670, 336, 256, 256);
      }
      if(this.piece === "n")
      {
        image(spriteSheet, this.x, this.y, scl, scl, 1000, 336, 256, 256);
      }
      if(this.piece === "b")
      {
        image(spriteSheet, this.x, this.y, scl, scl, 666, 336, 256, 256);
      }
      if(this.piece === "r")
      {
        image(spriteSheet, this.x, this.y, scl, scl, 1338, 336, 256, 256);
      }
      if(this.piece === "k")
      {
        image(spriteSheet, this.x, this.y, scl, scl, 0, 336, 256, 256);
      }
      if(this.piece === "q")
      {
        image(spriteSheet, this.x, this.y, scl, scl, 320, 336, 286, 256);
      }
    }
  }
  
  this.move = function(newRow, newCol)
  {
    //board[newRow][newCol] = board[this.row][this.col];
    //print("row" + newRow + "col" + newCol);
    board[newRow][newCol].piece = this.piece;
    board[newRow][newCol].color = this.color;
    //copys piece to new cords
    
    this.piece = "e";
    this.color = "e";
    // print(this.piece + this.color + this.row + this.col);
    // effectively deletes current piece from cords
  }
  
  
  this.showMoves = function() //returns an array
  {
    let moveList = []; //will contain pairs of cords, when checking count by += 2
    let tempBoard = board;
    //not sure if this is good, 
    //but it's cool nonetheless|| just start the for loop at i = 1
    
    moveList.push(this.row, this.col);
    
    switch(this.piece)
    {
      case "e":
        //nothing... this should never happen
        //print("This shouldn't happen...");
        break;
      case "p":
        if(this.color === "w")
        {
          //moving 1 square above
          if(this.row > 0) //as long as the piece is not on the top row
          {
            //as long as the piece above the current piece is empty
            if(board[this.row - 1][this.col].piece === "e") 
            {
              moveList.push(this.row - 1, this.col);
              //moving 2 squares above
              if(this.row === 6)
              {
                if(board[this.row - 2][this.col].piece === "e")
                {
                  moveList.push(this.row - 2, this.col);
                }
              }
            }
            
            //pretty sure I can just put everything in this if statement 
            //to avoid out of bounds indexes
            
            

              //diagonal attacks
            //left
            if(this.col != 0) //have to use nested if statements instead of && to avoid index out of bounds
            {
              if(board[this.row - 1][this.col - 1].color === "b")
              {
                moveList.push(this.row - 1, this.col - 1);
              }
            }
            //right
            if(this.col != 7)
            {
              if(board[this.row - 1][this.col + 1].color === "b")
              {
                moveList.push(this.row - 1, this.col + 1);
              }
            }
            
          }
        }else if(this.color === "b")
        {
          //moving 1 square below
          if(this.row < 7) //as long as the piece is not on the bottom row
          {
            //as long as the piece above the current piece is empty
            if(board[this.row + 1][this.col].piece === "e") 
            {
              moveList.push(this.row + 1, this.col);
              //moving 2 squares above
              if(this.row === 1)
              {
                if(board[this.row + 2][this.col].piece === "e")
                {
                  moveList.push(this.row + 2, this.col);
                }
              }
            }
            
            //pretty sure I can just put everything in this if statement 
            //to avoid out of bounds indexes
            
            

              //diagonal attacks
            //left
            if(this.col != 0) //have to use nested if statements instead of && to avoid index out of bounds
            {
              if(board[this.row + 1][this.col - 1].color === "w")
              {
                moveList.push(this.row + 1, this.col - 1);
              }
            }
            //right
            if(this.col != 7)
            {
              if(board[this.row + 1][this.col + 1].color === "w")
              {
                moveList.push(this.row + 1, this.col + 1);
              }
            }
          }
        }
        break;
      case "r": //NOTE: use a while loop to figure out the moveList for pieces that move in lines
        //up
        tempRow = this.row - 1;
        while(tempRow >= 0 && board[tempRow][this.col].color != this.color)
        {
          moveList.push(tempRow, this.col);
          if(board[tempRow][this.col].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempRow += -1; //messy code but it works
        }
        //left
        tempCol = this.col - 1;
        while(tempCol >= 0 && board[this.row][tempCol].color != this.color)
        {
          moveList.push(this.row, tempCol);
          if(board[this.row][tempCol].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempCol += -1; //messy code but it works
        }
        //down
        tempRow = this.row + 1;
        while(tempRow <= 7 && board[tempRow][this.col].color != this.color)
        {
          moveList.push(tempRow, this.col);
          if(board[tempRow][this.col].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempRow += 1; //messy code but it works
        }
        //right
        tempCol = this.col + 1;
        while(tempCol <= 7 && board[this.row][tempCol].color != this.color)
        {
          moveList.push(this.row, tempCol);
          if(board[this.row][tempCol].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempCol += 1; //messy code but it works
        }
        break;
      case "n": //this one should be the easiest to code
        //should check each spot first then check the color of the piece e.g. if(board[][].color != this.color)
        if(this.row >= 2 && this.col > 0)//up 2 left 1
        {
          if(this.color != board[this.row - 2][this.col - 1].color)
          {
            moveList.push(this.row - 2, this.col - 1);
          }
        }
        if(this.row >= 2 && this.col < 7) //up 2 right 1
        {
          if(this.color != board[this.row - 2][this.col + 1].color)
          {
            moveList.push(this.row - 2, this.col + 1);
          }
        }
        if(this.col >= 2 && this.row > 0) //left 2 up 1
        {
          if(this.color != board[this.row - 1][this.col - 2].color)
          {
            moveList.push(this.row - 1, this.col - 2);
          }
        }
        if(this.col >= 2 && this.row < 7) //left 2 down 1
        {
          if(this.color != board[this.row + 1][this.col - 2].color)
          {
            moveList.push(this.row + 1, this.col - 2);
          }
        }
        if(this.col > 0 && this.row <= 5) //down 2 left 1
        {
          if(this.color != board[this.row + 2][this.col - 1].color)
          {
            moveList.push(this.row + 2, this.col - 1);
          }
        }
        if(this.col < 7 && this.row <= 5) //down 2 right 1
        {
          if(this.color != board[this.row + 2][this.col + 1].color)
          {
            moveList.push(this.row + 2, this.col + 1);
          }
        }
        if(this.col <= 5 && this.row < 7) //right 2 down 1
        {
          if(this.color != board[this.row + 1][this.col + 2].color)
          {
            moveList.push(this.row + 1, this.col + 2);
          }
        }
        if(this.col <= 5 && this.row > 0) //right 2 up 1
        {
          if(this.color != board[this.row - 1][this.col + 2].color)
          {
            moveList.push(this.row - 1, this.col + 2);
          }
        }
        break;
      case "b":
        //up left
        tempRow = this.row - 1;
        tempCol = this.col - 1;
        while(tempRow >= 0 && tempCol >= 0 && board[tempRow][tempCol].color != this.color)
        {
          moveList.push(tempRow, tempCol);
          if(board[tempRow][tempCol].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempRow += -1;
          tempCol += -1;
        }
        //down left
        tempRow = this.row + 1;
        tempCol = this.col - 1;
        while(tempRow <= 7 && tempCol >= 0 && board[tempRow][tempCol].color != this.color)
        {
          moveList.push(tempRow, tempCol);
          if(board[tempRow][tempCol].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempRow += 1;
          tempCol += -1;
        }
        //down right
        tempRow = this.row + 1;
        tempCol = this.col + 1;
        while(tempRow <= 7 && tempCol <= 7 && board[tempRow][tempCol].color != this.color)
        {
          moveList.push(tempRow, tempCol);
          if(board[tempRow][tempCol].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempRow += 1;
          tempCol += 1;
        }
        //up right
        tempRow = this.row - 1;
        tempCol = this.col + 1;
        while(tempRow >= 0 && tempCol <= 7 && board[tempRow][tempCol].color != this.color)
        {
          moveList.push(tempRow, tempCol);
          if(board[tempRow][tempCol].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempRow += -1;
          tempCol += 1;
        }
        break;
      case "q":
        //up
        tempRow = this.row - 1;
        while(tempRow >= 0 && board[tempRow][this.col].color != this.color)
        {
          moveList.push(tempRow, this.col);
          if(board[tempRow][this.col].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempRow += -1; //messy code but it works
        }
        //left
        tempCol = this.col - 1;
        while(tempCol >= 0 && board[this.row][tempCol].color != this.color)
        {
          moveList.push(this.row, tempCol);
          if(board[this.row][tempCol].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempCol += -1; //messy code but it works
        }
        //down
        tempRow = this.row + 1;
        while(tempRow <= 7 && board[tempRow][this.col].color != this.color)
        {
          moveList.push(tempRow, this.col);
          if(board[tempRow][this.col].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempRow += 1; //messy code but it works
        }
        //right
        tempCol = this.col + 1;
        while(tempCol <= 7 && board[this.row][tempCol].color != this.color)
        {
          moveList.push(this.row, tempCol);
          if(board[this.row][tempCol].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempCol += 1; //messy code but it works
        }
        //up left
        tempRow = this.row - 1;
        tempCol = this.col - 1;
        while(tempRow >= 0 && tempCol >= 0 && board[tempRow][tempCol].color != this.color)
        {
          moveList.push(tempRow, tempCol);
          if(board[tempRow][tempCol].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempRow += -1;
          tempCol += -1;
        }
        //down left
        tempRow = this.row + 1;
        tempCol = this.col - 1;
        while(tempRow <= 7 && tempCol >= 0 && board[tempRow][tempCol].color != this.color)
        {
          moveList.push(tempRow, tempCol);
          if(board[tempRow][tempCol].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempRow += 1;
          tempCol += -1;
        }
        //down right
        tempRow = this.row + 1;
        tempCol = this.col + 1;
        while(tempRow <= 7 && tempCol <= 7 && board[tempRow][tempCol].color != this.color)
        {
          moveList.push(tempRow, tempCol);
          if(board[tempRow][tempCol].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempRow += 1;
          tempCol += 1;
        }
        //up right
        tempRow = this.row - 1;
        tempCol = this.col + 1;
        while(tempRow >= 0 && tempCol <= 7 && board[tempRow][tempCol].color != this.color)
        {
          moveList.push(tempRow, tempCol);
          if(board[tempRow][tempCol].color != "e") //must be a piece of the opposite color
          {
            break;
          }
          tempRow += -1;
          tempCol += 1;
        }
        break;
      case "k":
        //top left
        if(this.row > 0 && this.col > 0)
        {
          if(this.color != board[this.row - 1][this.col - 1].color)
          {
            moveList.push(this.row - 1, this.col - 1);
          }
        }
        //top middle
        if(this.row > 0)
        {
          if(this.color != board[this.row - 1][this.col].color)
          {
            moveList.push(this.row - 1, this.col);
          }
        }
        //top right
        if(this.row > 0 && this.col < 7)
        {
          if(this.color != board[this.row - 1][this.col + 1].color)
          {
            moveList.push(this.row - 1, this.col + 1);
          }
        }
        //right middle
        if(this.col < 7)
        {
          if(this.color != board[this.row][this.col + 1].color)
          {
            moveList.push(this.row, this.col + 1);
          }
        }
        //right down
        if(this.row < 7 && this.col < 7)
        {
          if(this.color != board[this.row + 1][this.col + 1].color)
          {
            moveList.push(this.row + 1, this.col + 1);
          }
        }
        //down middle
        if(this.row < 7)
        {
          if(this.color != board[this.row + 1][this.col].color)
          {
            moveList.push(this.row + 1, this.col);
          }
        }
        //down left
        if(this.row < 7 && this.col > 0)
        {
          if(this.color != board[this.row + 1][this.col - 1].color)
          {
            moveList.push(this.row + 1, this.col - 1);
          }
        }
        //left middle
        if(this.col > 0)
        {
          if(this.color != board[this.row][this.col - 1].color)
          {
            moveList.push(this.row, this.col - 1);
          }
        }
    }
    return moveList;
  }
}

//probably not neccesary, though might come back to it later

// function possibleMove(row, col)
// {
//   this.row = row;
//   this.col = col;
//   this.x = this.col * scl;
//   this.y = this.row * scl;
  
//   this.show
// }


function printBoard(b)
{
  let msg = "";
  this.board = b;
  for(var row = 0; row < this.board.length; row ++)
  {
    for(var col = 0; col < this.board[0].length; col ++)
    {
      msg += this.board[row][col].color + this.board[row][col].piece + this.board[row][col].row + this.board[row][col].col;
      msg += " ";
    }
    msg += "\n";
  }
  print(msg);
}


function mouseClicked()
{
  //print(moveList);
  if(moving === false) //prevents clearing the move list before the piece is moved
  {
    for(var row = 0; row < board.length; row ++)
    {
      for(var col = 0; col < board[0].length; col ++)
      {
        let temp = board[row][col];
        if(mouseX > temp.x && mouseX < temp.x + scl && mouseY > temp.y && mouseY < temp.y + scl && temp.color === turn)
        {
          moveList = temp.showMoves();
          //print(moveList);
          if(moveList.length > 2) //if the move list has more cords other than the base
          {
            moving = true;
          }
          break;
        }
      }
    }
  }else
  {
  //code to check each piece in moveList if it was clicked on, and do stuff after that  
    for(var i = 2; i < moveList.length; i += 2)
    {
      let tempY = moveList[i] * scl;
      let tempX = moveList[i + 1] * scl;
      //print(mouseX + " " + tempX);
      if(mouseX > tempX && mouseX < tempX + scl && mouseY > tempY && mouseY < tempY + scl)
      {
        //if the potential move was clicked
        //print(moveList);
        board[moveList[0]][moveList[1]].move(moveList[i], moveList[i + 1]); //actual mindflood
        if(turn === "w")
        {
          //print("White turn ended: check? " + check(board, "w"));
          if(check(board, "w"))
          {
            print("Check!");
          }
          turn = "b";
        }else
        {
          //print("Black turn ended: check? " + check(board, "b"));
          if(check(board, "b"))
          {
            print("Check!");
          }
          turn = "w";
        }
      }
    }
    moving = false;
  }
  //printBoard();
  //print(moving);
}


