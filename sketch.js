let scale = 40;
let cols,rows,v1;
let zoff = 0;
let particles = [];
let particleCount = 100;
let secondGraphics;
let flowField;
let directionOfParticles = 1;
let mouseCharge = 1;
let mouseControlling = false;
let manipulators = [];
let preFlowField;
let accurateSquareFalloff = false;
let counter = 0;
let particleStream = true;
let manipulating = false;
let fieldType = 'electric';

function preload() {
  attractor = loadImage("res/attractor.png");
  repulsor = loadImage("res/repulsor.png");
}

function setup() {
  createCanvas(800,800);
  secondGraphics = createGraphics(800,800);
  background(250);
  cols = floor(width / scale);
  rows = floor(height / scale);
  flowField = new Array(cols);
  preFlowField = new Array(cols);

  for (let i = 0; i < flowField.length; i++) {
    flowField[i] = new Array(rows);
    preFlowField[i] = new Array(rows);
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      preFlowField[x][y] = createVector(0,0);
    }
  }
  button = createButton('Change charge of cursor');
  button.position(800, 65);
  button.mousePressed(changeCharge);
  button = createButton('Control with cursor');
  button.position(800, 35);
  button.mousePressed(mouseControl);
  button = createButton('Add negative source');
  button.position(800, 95);
  button.mousePressed(addRepulsor);
  button = createButton('Add positive source');
  button.position(800, 125);
  button.mousePressed(addAttractor);
  button = createButton('Delete sources');
  button.position(800, 155);
  button.mousePressed(deleteLastSource);
  button = createButton('Switch between accurate / showcase');
  button.position(800, 185);
  button.mousePressed(switchMode);
  button = createButton('Toggle particle stream');
  button.position(800, 215);
  button.mousePressed(toggleParticleStream);
  button = createButton('Delete all particles');
  button.position(800, 245);
  button.mousePressed(deleteParticles);
}

function draw() {

  if (particleStream) {
    counter++;
    if (counter > 20) {
      particles.push(new Particle(0));
      counter = 0;
    }
  } else {
    if(mouseIsPressed && !manipulating && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      counter++;
      if (counter > 5) {
        particles.push(new Particle(1));
        counter = 0;
      }
    }
  }

  background(210);
  secondGraphics.background(255,50);
  if (particles[0] != null) {
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].show();
      particles[i].edges();
      particles[i].follow(flowField);
    }
  }
  image(secondGraphics,0,0);

  // Choose flowField
  //noiseFlowField();
  mouseFlowField();
}

function noiseFlowField() {
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let angle = noise(xoff,yoff,zoff) * TWO_PI;
      v1 = p5.Vector.fromAngle(angle);
      v1.setMag(5);
      flowField[x][y] = v1;
      xoff += 0.1;
      push();
      translate(x * scale, y * scale);
      rotate(v1.heading());
      strokeWeight(1);
      line(0,0,scale,0);
      line(scale,0,scale-3,3);
      line(scale,0,scale-3,-3);
      pop();
    }
    yoff += 0.1;
    zoff += 0.001;
  }
}

function mouseFlowField() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (mouseControlling) {
        v1 = createVector(mouseCharge*(x*scale - mouseX), mouseCharge*(y*scale - mouseY));
        v1.setMag(2000/pow((sqrt(pow((x*scale - mouseX),2) + pow((y*scale - mouseY),2))),2));
      } else {
        v1 = preFlowField[x][y];
      }
      flowField[x][y] = v1;
      push();
      translate(x * scale, y * scale);
      rotate(v1.heading());
      strokeWeight(1);
      let vectorLength;
      if (abs(v1.mag()*10) < 50) {
        vectorLength = v1.mag()*10;
      } else {
        vectorLength = 50;
      }

      line(0,0,vectorLength,0);
      if (vectorLength != 0) {
        line(vectorLength,0,vectorLength-3,3);
        line(vectorLength,0,vectorLength-3,-3);
      }
      pop();
    }
  }
  if (manipulators) {
    for (let i = 0; i < manipulators.length; i++) {
      manipulators[i].update();
    }
  }
}

function mouseReleased() {
  if (manipulators) {
    for (let i = 0; i < manipulators.length; i++) {
      manipulators[i].placed = true;
    }
    updateField();
    manipulating = false;
  }

}

function changeCharge() {
  mouseCharge = -mouseCharge;
}

function mouseControl() {
  mouseControlling = !mouseControlling;
}

function addRepulsor() {
  manipulating = true;
  manipulators.push(new Manipulator(-0.01));
}

function addAttractor() {
  manipulating = true;
  manipulators.push(new Manipulator(0.01));
}

function deleteLastSource() {
  manipulators.pop();
}

function switchMode() {
  accurateSquareFalloff = !accurateSquareFalloff;
}

function toggleParticleStream() {
  particleStream = !particleStream;
}

function deleteParticles() {
  for (let i = 0; i < particles.length; i++) {
    particles.splice(i);
  }
}

function updateField() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      v1 = createVector(0,0);
      v1.setMag(0);
      let tempVectorArray = [];
      for (let i = 0; i < manipulators.length; i++) {
        if (fieldType == 'electric') {
          v1 = createVector(manipulators[i].charge*(x*scale - manipulators[i].x), manipulators[i].charge*(y*scale - manipulators[i].y));
          if (accurateSquareFalloff) {
            v1.setMag(2000/pow((sqrt(pow((x*scale - manipulators[i].x),2) + pow((y*scale - manipulators[i].y),2))),2));
          } else {
            v1.setMag(2000/(sqrt(pow((x*scale - manipulators[i].x),2) + pow((y*scale - manipulators[i].y),2))));
          }
        } else {
          v1 = createVector(manipulators[i].charge*(x*scale - manipulators[i].x), manipulators[i].charge*(y*scale - manipulators[i].y));
          if (accurateSquareFalloff) {
            v1.setMag(2000/pow((sqrt(pow((x*scale - manipulators[i].x),2) + pow((y*scale - manipulators[i].y),2))),2));
          } else {
            v1.setMag(2000/(sqrt(pow((x*scale - manipulators[i].x),2) + pow((y*scale - manipulators[i].y),2))));
          }
        }
        tempVectorArray.push(v1);
      }
      let vsum = createVector(0,0);
      for (let i = 0; i < tempVectorArray.length; i++) {
        vsum.add(tempVectorArray[i]);
      }
      preFlowField[x][y] = vsum;
    }
  }
}
