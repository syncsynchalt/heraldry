var glob = {};

function draw() {
    var canvas = document.getElementById('thecanvas');
    var ctx = canvas.getContext('2d');
    window.glob = {
        halfLine: 1,
        border: "rgb(0, 0, 0)",
        bottomStyle: "rgb(0, 0, 0)",
        topStyle: "rgb(255, 255, 255)",
        bottomCharge: "rgb(255, 255, 255)",
        topCharge: "rgb(0, 0, 0)",
        height: canvas.height,
        width: canvas.width,
        arcStart: Math.floor(canvas.height/3)
    };

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
    ctx.arc(1, glob.arcStart, glob.width-2*glob.halfLine, 0, Math.PI/3);
    ctx.arc(glob.width-1*glob.halfLine, glob.arcStart, glob.width-2*glob.halfLine, 2*Math.PI/3, Math.PI);
    ctx.stroke();
};

function drawChevron(ctx) {
    ctx.strokeStyle = glob.border;
    ctx.fillStyle = glob.bottomStyle;

    var subtend = Math.PI/8;

    ctx.beginPath();
    ctx.moveTo(glob.width/2, glob.height/3);
    ctx.arc(1, glob.arcStart, glob.width-2*glob.halfLine, subtend, Math.PI/3);
    ctx.arc(glob.width-1*glob.halfLine, glob.arcStart, glob.width-2*glob.halfLine, 2*Math.PI/3, Math.PI-subtend);
    ctx.moveTo(glob.width/2, glob.height/4);
    ctx.fill();
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
    ctx.ellipse(x-xUnit/2, y-yUnit/2, xRad*2/4, yRad*3/4, 0, 0, Math.PI*3/5);
    ctx.ellipse(x-xUnit/2, y+yUnit/2, xRad*2/4, yRad*3/4, 0, -Math.PI*3/5, 0);
    ctx.ellipse(x+xUnit/2, y+yUnit/2, xRad*2/4, yRad*3/4, 0, Math.PI, Math.PI*8/5);
    ctx.ellipse(x+xUnit/2, y-yUnit/2, xRad*2/4, yRad*3/4, 0, Math.PI*2/5, Math.PI*6/5);
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
