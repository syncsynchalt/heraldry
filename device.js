var glob = {
    halfLine: 1,
    border: "rgb(0, 0, 0)",
    bottomStyle: "rgb(0, 0, 0)",
    topStyle: "rgb(255, 255, 255)",
    bottomCharge: "rgb(255, 255, 255)",
    topCharge: "rgb(0, 0, 0)"
};

function draw() {
    var canvas = document.getElementById('canvas1');
    drawCanvas(canvas);
};

function resize() {
    if (glob.redrawing) {
        return;
    }

    glob.redrawing = true;
    window.setTimeout(function() {
        draw();
        glob.redrawing = false;
    }, 100);
};

function drawCanvas(canvas) {
    var w = window.innerWidth-20;
    if (w > 500) {
        w = 500;
    }
    canvas.width = w;
    var h = 1.35*w;
    canvas.height = h;

    var ctx = canvas.getContext('2d');
    window.glob.halfLine = Math.max(1, Math.floor(w/200));
    window.glob.height = canvas.height;
    window.glob.width = canvas.width;
    window.glob.arcStart = Math.floor(canvas.height/3);

    drawBorder(ctx);
    drawChevron(ctx);
    drawTopCharges(ctx);
    drawBottomCharge(ctx);
};

function drawBorder(ctx) {
    ctx.strokeStyle = glob.border;
    ctx.lineWidth = 2*glob.halfLine;
    ctx.strokeRect(glob.halfLine, glob.halfLine, glob.width-2*glob.halfLine, glob.height-2*glob.halfLine);
    ctx.clearRect(0, glob.arcStart, glob.width, glob.height - glob.arcStart);

    ctx.beginPath();
    ctx.arc(glob.halfLine, glob.arcStart, glob.width-2*glob.halfLine, 0, Math.PI/3);
    ctx.arc(glob.width-1*glob.halfLine, glob.arcStart, glob.width-2*glob.halfLine, 2*Math.PI/3, Math.PI);
    ctx.stroke();
};

function drawChevron(ctx) {
    ctx.strokeStyle = glob.border;
    ctx.fillStyle = glob.bottomStyle;

    var subtend = Math.PI/8;

    ctx.beginPath();
    ctx.moveTo(glob.width/2, glob.height/3);
    ctx.arc(glob.halfLine, glob.arcStart, glob.width-2*glob.halfLine, subtend, Math.PI/3);
    ctx.arc(glob.width-1*glob.halfLine, glob.arcStart, glob.width-2*glob.halfLine, 2*Math.PI/3, Math.PI-subtend);
    ctx.lineTo(glob.width/2, glob.height/3);
    ctx.fill();
    // ctx.stroke();
};

function trefoil(ctx, x, y, style) {

    var xUnit = glob.width / 10;
    var yUnit = glob.height / 7;
    var xEps = xUnit / 3;
    var yEps = yUnit / 3;
    var xRad = xUnit/1.2;
    var yRad = yUnit/2.0;

    var foil = function (xFoil, yFoil) {
        ctx.beginPath();

        ctx.moveTo(xFoil, yFoil);
        ctx.ellipse(xFoil, yFoil, xRad, yRad, 0, 0, Math.PI*2);

        var miniFoil = function(xMini, yMini) {
            ctx.moveTo(xMini, yMini);
            ctx.ellipse(xMini, yMini, xRad/6, yRad/6, 0, 0, Math.PI*2);
        };
        miniFoil(xFoil-xRad, yFoil);
        miniFoil(xFoil+xRad, yFoil);
        miniFoil(xFoil, yFoil+yRad);
        miniFoil(xFoil, yFoil-yRad);

        ctx.fill();
    };

    var origLineWidth = ctx.lineWidth;
    ctx.lineWidth = 0;
    ctx.fillStyle = style;

    foil(x, y-yUnit/2-yEps);
    foil(x+xUnit+xEps, y);
    foil(x-xUnit-xEps, y);

    // center
    ctx.beginPath();
    ctx.ellipse(x-xUnit/2.6, y-yUnit/4, xRad*2/6.5, yRad*2/7, 0, -Math.PI*2/5,  Math.PI*4/5);
    ctx.ellipse(x-xUnit/3.0, y+yUnit/3, xRad*2/6.0, yRad*3/6, 0, -Math.PI*4/5,  Math.PI*0/5);
    ctx.ellipse(x+xUnit/3.0, y+yUnit/3, xRad*2/6.0, yRad*3/6, 0,  Math.PI*5/5,  Math.PI*9/5);
    ctx.ellipse(x+xUnit/2.6, y-yUnit/4, xRad*2/6.5, yRad*2/7, 0,  Math.PI*1/5,  Math.PI*7/5);
    ctx.fill();

    // stem
    ctx.beginPath();
    ctx.lineWidth = xEps;
    ctx.lineCap = 'round';
    ctx.strokeStyle = style;
    ctx.moveTo(x, y);
    ctx.lineTo(x, y+yUnit/2);
    ctx.bezierCurveTo(x+xEps/8, y+yUnit/2+yEps, x+xEps/8, y+yUnit*2/2-yEps, x, y+yUnit);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y+yUnit);
    ctx.bezierCurveTo(x-xEps/8, y+yUnit+yEps,   x-xEps/8, y+yUnit*3/2-yEps, x, y+yUnit*3/2);
    ctx.stroke();

    ctx.lineWidth = origLineWidth;
};

function drawTopCharges(ctx) {
    trefoil(ctx, glob.width/4,            glob.height/4.3, glob.topCharge);
    trefoil(ctx, glob.width-glob.width/4, glob.height/4.3, glob.topCharge);
};

function drawBottomCharge(ctx) {
    trefoil(ctx, glob.width/2, glob.height-glob.height/2.8, glob.bottomCharge);
};

/*
 * ellipse polyfill from canvas-5-polyfill
 * https://github.com/google/canvas-5-polyfill
 */
if (CanvasRenderingContext2D.prototype.ellipse == undefined) {
  CanvasRenderingContext2D.prototype.ellipse = function(
        x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
    this.save();
    this.translate(x, y);
    this.rotate(rotation);
    this.scale(radiusX, radiusY);
    this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
    this.restore();
  }
}

