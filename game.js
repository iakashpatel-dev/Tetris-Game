// shapes are in the form of array matrix each 1 represents that there is color and 0 means there is no color  using combination of 1 and 0 we made shapes.
//we will be using the index values of SHAPES array and COLORS array in this code.
// by using the index values from COLORS array we will  get the colors for our shapes.

const SHAPES = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],  
        [0,1,0],  
        [1,1,0]   
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1],
    ]
]

const COLORS = [
    "#fff",
    "#9b5fe0",
    "#16a4d8",
    "#60dbe8",
    "#8bd346",
    "#efdf48",
    "#f9a52c",
    "#d64e12"
]

const ROWS = 20;
const COLS= 10;

let canvas = document.querySelector('#tetris')
let ctx = canvas.getContext('2d')
ctx.scale(30,30)

let scoreData = document.querySelector('h2')
let score = 0 ;
let pieceObject= null;
let grid = gridGenerator();

function randomPieceGenerator(){
    let ran = Math.floor( Math.random()*7);
    let piece = SHAPES[ran];
    let colorCode= ran + 1;
    let xAxis = 4;
    let yAxis = 0 ;
    return{piece,xAxis,yAxis,colorCode};
}

// i will represent rows so it will have y axis , j will represent colums so it will have x axis.
// displayPiece will show shapes on canvas.
// set interval will again and again call the new piece after every one second. 

setInterval(changeState,600)


function changeState(){
    checkGrid();
    if (pieceObject==null) {
        pieceObject= randomPieceGenerator();
        displayPiece();
        
    }
    moveShapeDown();
}

function checkGrid(){
    let count = 0 ;
    for (let i=0;i<grid.length;i++){
        let allColors = true;
        for(j=0;j<grid[i].length;j++){
            if (grid [i][j]==0){
                allColors= false;
            }
        }
        if(allColors){
            grid.splice(i,1)
            grid.unshift([0,0,0,0,0,0,0,0,0,0])
            count ++;
        }
    }
    if(count == 1){
        score+=10;
    }else if(count == 2){
        score+=30;
    }else if(count == 3){
        score+=50;
    }else if(count>3){
        score+=100
    }
    scoreData.innerHTML = "Score: " + score;
}





function displayPiece(){
     let showpiece = pieceObject.piece;
     for (let i=0;i<showpiece.length;i++){
        for(let j=0;j<showpiece[i].length;j++){
            if(showpiece[i][j]==1){
                ctx.fillStyle = COLORS[pieceObject.colorCode]
                ctx.fillRect(pieceObject.xAxis+j,pieceObject.yAxis+i,1,1)
            }
        }
    }

} 
// r =row and c=column for grid
// once we hit the bottom of canvas the shape will become part of grid then it will be no more an object then pieceobject will again become null.
function moveShapeDown(){
    if(!hitWalls(pieceObject.xAxis, pieceObject.yAxis+1))
    pieceObject.yAxis+=1;
    else{
        for(let i=0 ; i<pieceObject.piece.length;i++){
            for(let j=0 ; j<pieceObject.piece[i].length;j++){
                if(pieceObject.piece[i][j]==1){
                    let r = pieceObject.xAxis+j;
                    let c = pieceObject.yAxis+i;
                    grid[c][r]=pieceObject.colorCode;

                }
            }
            
            }
            if(pieceObject.yAxis==0){
                alert ('Game Over !');
                grid=gridGenerator();
                score = 0;
            }
          pieceObject=null;
    }

displayGrid();

}

// generategrid and displaygrid is used to display falling piece effect. 
// first displaygrid function will paint the whole shape and then the displaypiece fucntion will show us the shape.

function gridGenerator(){
    let grid =[]
    for (let i=0;i<ROWS;i++){
        grid.push([]);
        for(let j=0; j<COLS;j++){
            grid[i].push(0)

        }
    }
    return grid;
}

function displayGrid(){
    for (let i=0; i<grid.length;i++){
        for (let j=0; j<grid[i].length;j++){
            ctx.fillStyle = COLORS[grid[i][j]];
            ctx.fillRect(j,i,1,1)
        }
    }
    displayPiece();
}
// to move shape left
function moveShapeLeft(){
    if(!hitWalls(pieceObject.xAxis-1, pieceObject.yAxis))
    pieceObject.xAxis-=1;
    displayGrid();
}
// to move shape right 
function moveShapeRight(){
    if(!hitWalls(pieceObject.xAxis+1, pieceObject.yAxis))
    pieceObject.xAxis+=1;
    displayGrid();
}

// rotate function works on transpose principle.. rotation will be of 90 deg every time

function rotateShape(){
    let rotatedPiece = [];
    let piece = pieceObject.piece;
    for(let i=0;i<piece.length;i++){
        rotatedPiece.push([]);
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i].push(0);
        }
    }
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i][j] = piece[j][i]
        }
    }

    for(let i=0;i<rotatedPiece.length;i++){
        rotatedPiece[i] = rotatedPiece[i].reverse();
    }
    if(!hitWalls(pieceObject.xAxis,pieceObject.yAxis,rotatedPiece))
        pieceObject.piece = rotatedPiece
    displayGrid()

}



function hitWalls(x,y,rotatedPiece){
    let piece = rotatedPiece || pieceObject.piece;
    for (let i=0; i<piece.length;i++){
        for (let j=0; j<piece[i].length;j++){
            if(piece[i][j]==1){
                let r = x+j;
                let c= y+i;
                if(r>=0 && r<COLS && c>=0 && c<ROWS){
                    if(grid[c][r]>0){
                        return true;
                    }

                }else{
                    return true;
                }

            }
        }
    }
    return false;
}

// keyboard event listner to capture keypressing. 

document.addEventListener("keydown",function(e){
    let key = e.code;
    if (key =="ArrowDown"){
        moveShapeDown();
    }else if(key == "ArrowLeft"){
        moveShapeLeft();
    } else if(key == "ArrowRight"){
        moveShapeRight();
    } else if(key == "ArrowUp"){
        rotateShape();
    } 
    
})

