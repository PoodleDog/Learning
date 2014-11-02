var balls;


function Ball(X, Y, R, Vx, Vy, color) {
    this.X = X;
    this.Y = Y;
    this.R = R;
    this.Vx = Vx;
    this.Vy = Vy;
    this.Ax = 0;
    this.Ay = 0.1;
    this.Elasticity = 1;

    this.color = color;

    this.inCollision = 0;

    this.collidesWith = function (ball) {
        var xd = X - ball.X;
        var yd = Y - ball.Y;

        var sumRadius = R + ball.R;
        var sqrRadius = sumRadius * sumRadius;

        var distSqr = xd * xd + yd * yd;

        return distSqr <= sqrRadius;
    }

    this.resolveCollision = function (ball) {
        // // get the mtd
        // Vector2d delta = (position.subtract(ball.position));
        // float d = delta.getLength();
        // // minimum translation distance to push balls apart after intersecting
        // Vector2d mtd = delta.multiply(((R + ball.R)-d)/d); 
        // 
        // 
        // // resolve intersection --
        // // inverse mass quantities
        // float im1 = 1 / getMass(); 
        // float im2 = 1 / ball.getMass();
        // 
        // // push-pull them apart based off their mass
        // position = position.add(mtd.multiply(im1 / (im1 + im2)));
        // ball.position = ball.position.subtract(mtd.multiply(im2 / (im1 + im2)));
        // 
        // // impact speed
        // Vector2d v = (this.velocity.subtract(ball.velocity));
        // float vn = v.dot(mtd.normalize());
        // 
        // // sphere intersecting but moving away from each other already
        // if (vn > 0.0f) return;
        // 
        // // collision impulse
        // float i = (-(1.0f + Constants.restitution) * vn) / (im1 + im2);
        // Vector2d impulse = mtd.multiply(i);
        // 
        // // change in momentum
        // this.velocity = this.velocity.add(impulse.multiply(im1));
        // ball.velocity = ball.velocity.subtract(impulse.multiply(im2));

        // Vx = -Vx;
        // Vy = -Vy;
        // 
        // ball.Vx = -ball.Vx;
        // ball.Vy = -ball.Vy;
    }

    this.Render = function (ctx) {
        ctx.save();
        ctx.translate(X, Y);
        var grd = ctx.createRadialGradient(0, 0, 1, 0, 0, R);

        grd.addColorStop(0, "white");
        if (this.inCollision > 0) {
            grd.addColorStop(1, "black");
            this.inCollision = false;
        } else {
            grd.addColorStop(1, color);
        }
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(0, 0, R, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    this.Move = function (time, rect) {
        Vx += this.Ax * time * time / 2;
        Vy += this.Ay * time * time / 2;

        X += Vx * time;
        Y += Vy * time;
        if (X - R < 0) {
            X = R;
            Vx = -Vx;
            Vx = Vx * this.Elasticity;
            Vy = Vy * this.Elasticity;
        }
        if (X + R >= rect.width) {
            X = rect.width - R - 1;
            Vx = -Vx;
            Vx = Vx * this.Elasticity;
            Vy = Vy * this.Elasticity;
        }
        if (Y - R < 0) {
            Y = R;
            Vy = -Vy;
            Vx = Vx * this.Elasticity;
            Vy = Vy * this.Elasticity;
        }
        if (Y + R > rect.height) {
            Y = rect.height - R - 1;
            Vy = -Vy;
            Vx = Vx * this.Elasticity;
            Vy = Vy * this.Elasticity;
        }
    }
}

function Collisions(balls) {
    for (i = 0; i < balls.length; i++) {
        for (j = i + 1; j < balls.length; j++) {
            if (balls[i].collidesWith(balls[j])) {
                balls[i].inCollision++;
                balls[j].inCollision++;
                balls[i].resolveCollision(balls[j]);
            }
            else {
                if (balls[i].inCollision > 0) balls[i].inCollision--;
                if (balls[j].inCollision > 0) balls[j].inCollision--;
            }
        }
    }
}
