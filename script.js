var myCanvas = document.getElementById("myCanvas");
myCanvas.width = 600;
myCanvas.height = 600;
  
var ctx = myCanvas.getContext("2d");

var coalitions = {
    "Order": 1100,
    "Federation": 1350,
    "Alliance": 680,
    "Assembly": 1020
};

var myBarchart = new Barchart(
{
        canvas:myCanvas,
        outer_padding:30,
        inner_padding:10,
        arrow_height:30,
        gridScale:250,
        gridColor:"#eeeeee",
        data:coalitions,
        colors:["#FF6849","#184D9B", "#27C57D","#A15DD4"],
        images:["images/order.png","images/federation.png", "images/alliance.png","images/assembly.png"]
    }
);
myBarchart.draw();

function drawLine(ctx, startX, startY, endX, endY,color){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
    ctx.restore();
}


function addImageProcess(src){
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height, arrow_height,color, image, score){
    height = height - arrow_height;
    ctx.save();
    ctx.fillStyle=color;
    ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
    ctx.beginPath();
    ctx.moveTo(upperLeftCornerX, upperLeftCornerY + height);
    ctx.lineTo(upperLeftCornerX + width, upperLeftCornerY + height);
    ctx.lineTo(upperLeftCornerX + width / 2, upperLeftCornerY + height + arrow_height);
    ctx.fill();
    ctx.drawImage(await addImageProcess(image), upperLeftCornerX, upperLeftCornerY + height - width, width, width); 
    ctx.font = "20px Arial";
    ctx.fillStyle="white";
    ctx.textAlign = "center";
    ctx.fillText(score,upperLeftCornerX + width/2, upperLeftCornerY + height - Math.round(width * 4/5));
    ctx.restore();
}

function Barchart(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
    this.images = options.images;
  
    this.draw = function(){
        var maxValue = 0;
        for (var categ in this.options.data){
            maxValue = Math.max(maxValue,this.options.data[categ]);
        }
        var canvasActualHeight = this.canvas.height - this.options.outer_padding * 2;
        var canvasActualWidth = this.canvas.width - this.options.outer_padding * 2;
 
        //drawing the grid lines
        var gridValue = 0;
        while (gridValue <= maxValue){
            var gridY = canvasActualHeight * (1 - gridValue/maxValue) + this.options.outer_padding;
            drawLine(
                this.ctx,
                0,
                gridY,
                this.canvas.width,
                gridY,
                this.options.gridColor
            );
             
            //writing grid markers
            this.ctx.save();
            this.ctx.fillStyle = this.options.gridColor;
            this.ctx.font = "bold 10px Arial";
            this.ctx.fillText(gridValue, 10,gridY - 2);
            this.ctx.restore();
 
            gridValue+=this.options.gridScale;
        }
  
        //drawing the bars
        var barIndex = 0;
        var numberOfBars = Object.keys(this.options.data).length;
        var barSize = (canvasActualWidth)/numberOfBars;
 
        for (categ in this.options.data){
            var val = this.options.data[categ];
            var barHeight = Math.round(canvasActualHeight * val/maxValue);
            var arrow_height = Math.round(barSize * this.options.arrow_height/100);
            drawBar(
                this.ctx,
                this.options.outer_padding + barIndex * (barSize + this.options.inner_padding),
                this.options.outer_padding,
                barSize,
                barHeight,
                arrow_height,
                this.colors[barIndex%this.colors.length],
                this.images[barIndex%this.images.length],
                val
            );
 
            barIndex++;
        }
  
    }
}