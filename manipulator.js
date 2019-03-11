class Manipulator {
  constructor(charge) {
    this.charge = charge;
    this.x = mouseX;
    this.y = mouseY;
    this.placed = false;
  }

  update() {
    if(!this.placed) {
      this.x = mouseX;
      this.y = mouseY;
    } else {
      if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
        manipulators.pop();
        console.log('yes');
      }
    }
    if (this.charge < 0) {
      image(repulsor,this.x - 16,this.y - 16);
    } else {
      image(attractor,this.x - 16,this.y - 16);
    }
  }
}
