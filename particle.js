class Particle {
  constructor(mode) {
    if (mode == 0) {
      this.pos = createVector(0,random(height/2 - 10, height/2 + 10));
      this.vel = createVector(10,0);
    } else if (mode == 1) {
      this.pos = createVector(mouseX,mouseY);
      this.vel = createVector(0,0);
    }
    this.acc = createVector(0,0);
    this.maxSpeed = 12;
  }

  update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
  }

  follow(vectors) {
    let x = floor(this.pos.x / scale);
    let y = floor(this.pos.y / scale);

    if (x > 0 && x < width/scale && y > 0 && y < height/scale) {
      this.applyForce(vectors[x][y]);
    } else {
      this.applyForce(vectors[1][1]);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    secondGraphics.strokeWeight(5);
    secondGraphics.point(this.pos.x, this.pos.y);
  }

  edges() {
    if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
      particles.slice(this);
    }
  }

}
