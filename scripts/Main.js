function Initialize() {
    try {
        canvas = document.getElementById("Drawing");
        canvas.addEventListener('mousemove', onCanvasMouseMove, false);
        canvas.addEventListener('mousedown', onCanvasMouseDown, false);
        canvas.addEventListener('mouseup', onCanvasMouseUp, false);
        canvas.addEventListener('mouseout', onCanvasMouseOut, false);

        renderer = new Renderer(canvas.getContext('2d'));
        deltaDuration = renderer.animationPeriod / 1000; // seconds
        viewPort = new Rect(0, 0, canvas.width, canvas.height);

        dataSet = new DataSet
            ( 5.0   // seconds
            , 1000  // Hz
            , new ModulatedSineGenerator(1.0, 300, 1.0, 20)
            );

        if (false) {
            var ballCount = 1;
            balls = [];
            for (n = 0; n < ballCount; n++) {
                balls.push(new Ball(viewPort.width / 2, viewPort.height / 2, Math.round(10 + Math.random() * 30), Math.random() * 10 - 5, Math.random() * 10 - 5, randomColor()));
            }
        }
        else {
            balls =
            [new Ball(viewPort.width / 4, viewPort.height / 2, 100, -2, 0, "#ff0000")
            , new Ball(3 * viewPort.width / 4, viewPort.height / 2, 100, 2, 0, "#00ff00")
            //, new Ball(viewPort.width / 2, viewPort.height / 2, 50,  3, -4, "#0000ff")
            ];
        }

        setTitle("Size: " + canvas.width + " x " + canvas.height);
        renderer.Request();
    }
    catch (err) {
        reportError(err.message);
    }
}

var renderer;
var m = 0;
var duration = 0;
var deltaDuration;

function doRender() {
    renderer.Request();
}

function Renderer(ctx, animationPeriod) {
    this.ctx = ctx;
    this.animationPeriod = animationPeriod; // ms
    this.animate = true;
    this.rendering = false;

    this.Request = function () {
        setTimeout(this.onTimerElapsed, animationPeriod);
    }

    this.onTimerElapsed = function () {
        requestAnimationFrame(doRender);
    }

    this.setDuration = function (posX) {
        if (!this.animate) {
            duration = durationOnDragBegin * mouseDragBeginPos.x / posX;
            duration = Math.min(duration, dataSet.Duration);
            duration = Math.max(duration, 0);
            this.Request();
        }
    }

    this.Render = function () {
        rendering = true;
        try {
            var grd = ctx.createRadialGradient(viewPort.width / 2, viewPort.height / 2, 1, viewPort.width / 2, viewPort.height / 2, viewPort.width / 2 + viewPort.height / 2);
            grd.addColorStop(0, "gray");
            grd.addColorStop(1, "white");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, viewPort.width, viewPort.height);
            ctx.fill();

            var renderBalls = false;
            if (renderBalls) {
                for (n = 0; n < balls.length; n++) {
                    balls[n].Move(1, viewPort);
                }
                // Collisions(balls);
                for (n = 0; n < balls.length; n++) {
                    balls[n].Render(ctx);
                }
            }
            var renderData = true;
            if (renderData) {
                ctx.save();
                ctx.strokeStyle = "#0000ff";
                ctx.fillStyle = "#0000ff";
                ctx.lineWidth = 1;
                dataSet.Render(ctx, viewPort, duration);
                ctx.restore();

                duration += deltaDuration;
                if (duration > dataSet.Duration) {
                    animate = false;
                }
                if (animate) {
                    Request();
                }
            }
            else {
                duration = dataSet.Duration;
            }
            var f = fps.getFPS();
            if (++m % 30 == 0) {
                setTitle(f + " FPS");
            }
        }
        catch (err) {
            reportError(err);
        }
        rendering = false;
    }

}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    };
}

var mouseDragBeginPos = {
    x: 0,
    y: 0
};
var durationOnDragBegin;

var mouseIsDragging = false;

function onCanvasMouseOut(evt) {

    if (mouseIsDragging = true) {
        mouseIsDragging = false;
    }
}

function onCanvasMouseDown(evt) {

    var mousePos = getMousePos(canvas, evt);
    mouseDragBeginPos = mousePos;
    if (evt.button == 0) {
        renderer.setDuration(mousePos.x);
    }
    mouseIsDragging = true;
}

function onCanvasMouseUp(evt) {
    var mousePos = getMousePos(canvas, evt);
    if (evt.button == 0) {
            renderer.setDuration(mousePos.x);
        }
    mouseIsDragging = false;
}

function onCanvasMouseMove(evt) {
    var mousePos = getMousePos(canvas, evt);
    if (evt.button == 0 && mouseIsDragging ) {
        renderer.setDuration(mousePos.x);
    }
}

function reportError(err) {
    document.getElementById("errorText").innerHTML = "<br>" + err;
}

function setTitle(text) {
    var info = document.getElementById('Info');
    info.innerText = text;
}

function textOut(text) {
    document.getElementById("out").innerHTML += "<div>" + text + "<div/>";
}
