
var canvas, ctx, viewPort;

var dataSet;





function SignalGenerator() {
    this.Value = function (time) {
        return 0;
    }
}

function ModulatedSineGenerator(ampl1, freq1, ampl2, freq2) {
    ModulatedSineGenerator.prototype = SignalGenerator;
    this.ampl1 = ampl1;
    this.freq1 = 2 * Math.PI * freq1;
    this.ampl2 = ampl2;
    this.freq2 = 2 * Math.PI * freq2;
    var ampl = ampl1 * ampl2;
    this.Value = function (time) {
        return ampl * Math.sin(freq1 * time) * Math.sin(freq2 * time);
    }

}

function DataSet
    (duration  // seconds
    , rate      // Hertz
    , generator // function
) {
    this.Duration = duration;
    this.Rate = rate;
    this.Period = 1.0 / rate;
    this.Data = [];
    this.Min = Number.MAX_VALUE;
    this.Max = -Number.MIN_VALUE;

    var N = duration * rate;
    for (n = 0; n <= N; n++) {
        var value = generator.Value(n * this.Period);
        this.Min = Math.min(value, this.Min);
        this.Max = Math.max(value, this.Max);
        this.Data.push(value);
    }

    this.Render = function (context, viewport, duration) {
        ctx.save();

        ctx.translate(viewport.left, viewport.height / 2);
        var N = Math.min(duration * rate,this.Data.length);
        var xScale = viewport.width / (N - 1);
        var yScale = (viewport.height/2) / (this.Max - this.Min)

        ctx.lineWidth = 1;
        ctx.beginPath();
        var x = 0, y = this.Data[0];
        ctx.moveTo(x,y);
        for (_x = 1; _x < N; _x++) {
            x = _x * xScale;
            y = -this.Data[_x]*yScale;
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.beginPath();
        for (_x = 0; _x < N; _x++) {
            x = _x * xScale;
            y = -this.Data[_x] * yScale;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.restore();
    }
}

