var fps = {
    startTime: 0,
    frameNumber: 0,
    getFPS: function () {
        this.frameNumber++;
        var d = new Date().getTime(),
            currentTime = (d - this.startTime) / 1000,
            result = Math.floor((this.frameNumber / currentTime));

        if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        return result;

    }
};

function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}

function randomColor() {
    return rgb(Math.round(127 + Math.random() * 128), Math.round(127 + Math.random() * 128), 127 + Math.round(Math.random() * 128));
}

function Rect(top, left, width, height) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;

    this.Adjusted = function (left, top, right, bottom) {
        return new Rect(this.left + left, this.top + top, this.width + right + left, this.bottom + bottom + top);
    }
}
