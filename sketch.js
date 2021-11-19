/*
Utilitzo principalment figures triangulars i circulars les quals es van movent, canviant de color i a certa distancia es connecten. Més una línia que va creixent depenen del mode de visualització fan algunes coses diferents 
*/
/*
Toc
0-0 afegeix un pacman
0-1 afegeix un triangle
0-2 suma velocitat a línia que es mou de fons
0-3 resta velocitat a línia que es mou de fons
1-0 posa la vista 0
1-1 posa la vista 1
1-2 posa la vista 2
1-3 canvia de color els pacmans i els triangles a la vista 2
Mantenir 
0-3 1-3 crea una línia de dit a dit
*/

let linies = [];
let PM = [];
let T = [];
let view = 0;
let primer = false;
let timer = 1000;
let num = 20;
let llista = 0;

function setup() {
  sketch = createCanvas(1080, 720);

  capture = createCapture(VIDEO);
  capture.hide();

  // Colors for each fingertip
  colorMap = [
    // Left fingertips
    [
      color(0, 0, 0),
      color(255, 0, 255),
      color(0, 0, 255),
      color(255, 255, 255),
    ],
    // Right fingertips
    [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 255, 0)],
  ];
  // #1 Turn on some models (hand tracking) and the show debugger
  // @see https://handsfree.js.org/#quickstart-workflow
  handsfree = new Handsfree({
    showDebug: true, // Comment this out to hide the default webcam feed with landmarks
    hands: true,
    setup: {
      video: {
        $el: capture.elt,
      },
    },
  });
  buttonStart = createButton("Start Webcam");
  buttonStart.class("handsfree-show-when-stopped");
  buttonStart.class("handsfree-hide-when-loading");
  buttonStart.mousePressed(() => handsfree.start());

  // Create a "loading..." button
  buttonLoading = createButton("...loading...");
  buttonLoading.class("handsfree-show-when-loading");

  // Create a stop button
  buttonStop = createButton("Stop Webcam");
  buttonStop.class("handsfree-show-when-started");
  buttonStop.mousePressed(() => handsfree.stop());
}

function draw() {
  background(255);
  fingerPaint();
  drawHands();

  if (view == 0) {
    if (primer == false) {
      linies = [];
      PM = [];
      T = [];
      llista = 0;
      for (let i = 0; i < 1; i++) {
        append(linies, new linia(width / 2, height / 2, view));
      }
      for (let i = 0; i < num; i++) {
        append(PM, new pacman(view));
      }
      for (let i = 0; i < num; i++) {
        append(T, new trianglee(view));
      }
      primer = true;
    }
    PM.forEach(function (p) {
      p.run();
    });
    T.forEach(function (t) {
      t.run();
    });
    linies.forEach(function (l) {
      l.run();
    });

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        if (i != j) {
          let d = dist(PM[i].getX(), PM[i].getY(), T[i].getX(), T[i].getY());

          if (d < 50) {
            stroke(int(random(255)), int(random(255)), int(random(255)));
            line(PM[i].getX(), PM[i].getY(), T[j].getX(), T[j].getY());
          }
        }
      }
    }

    if (millis() > timer) {
      changeDir();
      timer += random(5000);
    }
  }

  if (view == 1) {
    if (primer == false) {
      linies = [];
      PM = [];
      T = [];
      llista = 0;
      for (let i = 0; i < 1; i++) {
        append(linies, new linia(width / 2, height / 2, view));
      }
      for (let i = 0; i < num; i++) {
        append(PM, new pacman(view));
      }
      for (let i = 0; i < num; i++) {
        append(T, new trianglee(view));
      }
      primer = true;
    }

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        if (i != j) {
          let d = dist(PM[i].getX(), PM[i].getY(), T[i].getX(), T[i].getY());

          if (d < 50) {
            stroke(int(random(255)), int(random(255)), int(random(255)));
            line(PM[i].getX(), PM[i].getY(), T[j].getX(), T[j].getY());
          }
        }
      }
    }
  }

  if (view == 2) {
    if (primer == false) {
      linies = [];
      PM = [];
      T = [];
      llista = 0;
      for (let i = 0; i < 1; i++) {
        append(linies, new linia(width / 2, height / 2, view));
      }
      for (let i = 0; i < num; i++) {
        append(PM, new pacman(view));
      }
      for (let i = 0; i < num; i++) {
        append(T, new trianglee(view));
      }
      primer = true;
    }
  }

  PM.forEach(function (p) {
    p.run();
  });
  T.forEach(function (t) {
    t.run();
  });
  linies.forEach(function (l) {
    l.run();
  });

  if (millis() > timer) {
    changeDir();
    timer += random(5000);
  }
}

paint = [];

function fingerPaint() {
  // Check for pinches and create dots if something is pinched
  const hands = handsfree.data?.hands;
  if (hands?.pinchState) {
    // Loop through each hand
    hands.pinchState.forEach((hand, handIndex) => {
      // Loop through each finger
      hand.forEach((state, finger) => {
        // Other states are "start" and "released"
        if (state === "held") {
          // Left [0] index finger [0] is the eraser, so let's make it paint larger
          const circleSize = handIndex === 0 && finger === 0 ? 40 : 10;

          // Store the paint
          paint.push([
            hands.curPinch[handIndex][finger].x,
            hands.curPinch[handIndex][finger].y,
            handIndex,
            finger,
            circleSize,
          ]);
        }
      });
    });
  }

  // Draw the paint
  /*
  paint.forEach((dot) => {
    
    push();
    fill(colorMap[dot[2]][dot[3]]);
    circle(
      sketch.width - dot[0] * sketch.width,
      dot[1] * sketch.height,
      dot[4]
    );5
    pop();
  });*/

  // Clear everything if the left [0] pinky [3] is pinched
  if (hands?.pinchState && hands.pinchState[0][0] === "released") {
    append(PM, new pacman(view));
  }
  if (hands?.pinchState && hands.pinchState[0][1] === "released") {
    append(T, new trianglee(view));
  }
  if (hands?.pinchState && hands.pinchState[0][2] === "released") {
    //canviar vel linia
    linies[linies.length - 1].SumVel();
  }
  if (hands?.pinchState && hands.pinchState[0][3] === "released") {
    //canviar vel linia
    linies[linies.length - 1].RestVel();
  }
  if (hands?.pinchState && hands.pinchState[1][0] === "released") {
    view = 0;
    primer = false;
  }
  if (hands?.pinchState && hands.pinchState[1][1] === "released") {
    view = 1;
    primer = false;
  }
  if (hands?.pinchState && hands.pinchState[1][2] === "released") {
    view = 2;
    primer = false;
  }
  if (
    hands?.pinchState &&
    hands.pinchState[0][3] === "held" &&
    hands?.pinchState &&
    hands.pinchState[1][3] === "held"
  ) {
    line(
      sketch.width - hands.curPinch[1][3].x * sketch.width,
      hands.curPinch[1][3].y * sketch.height,
      sketch.width - hands.curPinch[0][3].x * sketch.width,
      hands.curPinch[0][3].y * sketch.height
    );
  }

  if (hands?.pinchState && hands.pinchState[1][3] === "released") {
    if (view == 2) {
      PM.forEach(function (p) {
        let colorr = color(
          map(
            sketch.width - hands.curPinch[1][3].x * sketch.width,
            0,
            width,
            0,
            255
          ),
          map(hands.curPinch[1][3].y * sketch.height, 0, height, 0, 255),
          255
        );
        p.changeColor(colorr.toString());
      });

      T.forEach(function (t) {
        let colorr = color(
          map(hands.curPinch[1][3].y * sketch.height, 0, height, 0, 255),
          map(
            sketch.width - hands.curPinch[1][3].x * sketch.width,
            0,
            width,
            0,
            255
          ),
          255
        );
        t.changeColor(colorr.toString());
      });
    }
  }
}

function drawHands() {
  const hands = handsfree.data?.hands;

  // Bail if we don't have anything to draw
  if (!hands?.landmarks) return;

  // Draw keypoints
  hands.landmarks.forEach((hand, handIndex) => {
    hand.forEach((landmark, landmarkIndex) => {
      // Set color
      // @see https://handsfree.js.org/ref/model/hands.html#data
      if (colorMap[handIndex]) {
        switch (landmarkIndex) {
          case 8:
            fill(colorMap[handIndex][0]);

            break;
          case 12:
            fill(colorMap[handIndex][1]);
            break;
          case 16:
            fill(colorMap[handIndex][2]);
            break;
          case 20:
            fill(colorMap[handIndex][3]);
            break;
          default:
            fill(color(255, 255, 255));
        }
      }

      // Set stroke
      push();
      if (handIndex === 0 && landmarkIndex === 8) {
        stroke(color(255, 255, 255));
        strokeWeight(5);
        circleSize = 40;
      } else {
        stroke(color(0, 0, 0));
        strokeWeight(0);
        circleSize = 10;
      }
      pop();
      circle(
        // Flip horizontally
        sketch.width - landmark.x * sketch.width,
        landmark.y * sketch.height,
        circleSize
      );
    });
  });
}

function changeDir() {
  //for (linia l : linies) {
  linies[llista].changeDirection();
  append(linies, new linia(linies[llista].getX(), linies[llista].getY(), view));
  llista++;
  //}
}
/*
function keyPressed() {
  if (key == 'A' || key == 'a'){
    view=0;
    primer=false;
    print("aaaa");
  }
  if (key == 'S' || key == 's'){
    view=1;
    primer=false;
    print("ssss");
  }
  if (key == 'D' || key == 'd'){
    view=2;
    primer=false;
  }
}*/

class linia {
  constructor(x, y, v) {
    this.x = x;
    this.y = y;
    this.v = v;
    this.px = this.x;
    this.py = this.y;
    this.p_inix = this.x;
    this.p_iniy = this.y;
    this.ang = 45;
    if (this.v == 2) {
      this.step = 1;
    } else {
      this.step = 5;

      strokeWeight(3);
      this.myrandom = int(random(4));
    }
  }
  run() {
    if (this.myrandom == 0 && this.px < width - 5) {
      this.px += this.step;
    } else if (this.myrandom == 1 && this.px > 5) {
      this.px -= this.step;
    } else if (this.myrandom == 2 && this.py > 5) {
      this.py -= this.step;
    } else if (this.myrandom == 3 && this.py < height - 5) {
      this.py += this.step;
    }

    noFill();
    push();

    stroke(0);
    line(this.p_inix, this.p_iniy, this.px, this.py);

    pop();
  }

  changeDirection() {
    this.myrandom = 5;
  }
  SumVel() {
    this.step++;
  }
  RestVel() {
    this.step--;
  }
  getX() {
    return this.px;
  }
  getY() {
    return this.py;
  }
}

class pacman {
  constructor(x) {
    this.x = x;
    this.posX = 0;
    this.posY = 0;
    this.velX = 0;
    this.velY = 0;
    this.sz = 50;

    if (this.x == 2) {
      this.velX = 1;
      this.velY = 1;
    } else if (this.x == 0) {
      this.velX = int(random(20));

      this.velY = int(random(20));
    } else {
      this.velX = 5;
      this.velY = 5;
    }
    this.view = this.x;

    this.posX = int(random(width));
    this.posY = int(random(height));

    this.color = color(0, 0, 0);
  }

  run() {
    if (this.view == 0) {
      this.posX += this.velX;
      this.posY += this.velY;

      push();
      stroke(int(random(255)), int(random(255)), int(random(255)));
      circle(this.posX, this.posY, 60);

      circle(this.posX, this.posY, int(random(40)));
      rotate(0);
      pop();
      //comprovem la posició X
      if (this.posX - this.sz / 2 < 0 || this.posX + this.sz / 2 > width) {
        this.velX = -this.velX;
      }
      //comprovem la posició Y
      if (this.posY - this.sz / 2 < 0 || this.posY + this.sz / 2 > height) {
        this.velY = -this.velY;
      }
    }

    if (this.view == 1) {
      //actualitzem posicions
      this.posX += this.velX;
      this.posY += this.velY;

      //dibuixem

      push();
      stroke(int(random(255)), int(random(255)), int(random(255)));

      rotate(0);
      pop();
      //comprovem la posició X
      if (this.posX - this.sz / 2 < 0 || this.posX + this.sz / 2 > width) {
        this.velX = -this.velX;
      }
      //comprovem la posició Y
      if (this.posY - this.sz / 2 < 0 || this.posY + this.sz / 2 > height) {
        this.velY = -this.velY;
      }
    }

    if (this.view == 2) {
      //actualitzem posicions
      this.posX += this.velX;
      this.posY += this.velY;

      //dibuixem

      push();
      stroke(this.color);
      circle(this.posX, this.posY, 60);

      rotate(0);
      pop();
      //comprovem la posició X
      if (this.posX - this.sz / 2 < 0 || this.posX + this.sz / 2 > width) {
        this.velX = -this.velX;
      }
      //comprovem la posició Y
      if (this.posY - this.sz / 2 < 0 || this.posY + this.sz / 2 > height) {
        this.velY = -this.velY;
      }
    }
  }

  getX() {
    return this.posX;
  }
  getY() {
    return this.posY;
  }

  changeColor(color) {
    push();
    this.color = color;
    pop();
  }
}

class trianglee {
  constructor(x) {
    this.x = x;
    this.velX = 0;
    this.velY = 0;
    this.h = 0;
    this.w = 0;
    this.ws = 0;
    this.hs = 0;
    this.resta = 0;
    this.posX = 0;
    this.posY = 0;
    this.sz = 50;
    this.view = 0;

    this.posX = int(random(width));
    this.posY = int(random(height));
    if (this.x == 2) {
      this.velX = 1;
      this.velY = 1;
    } else if (this.x == 0) {
      this.velX = int(random(20));
      this.velY = int(random(20));
    } else {
      this.velX = 5;
      this.velY = 5;
    }

    this.h = 0;
    this.w = 0;
    this.ws = 1;
    this.hs = 1;
    this.resta = 1;
    this.view = this.x;
    this.color = color(0, 0, 0);
  }

  run() {
    if (this.view == 0) {
      //background(0);
      //actualitzem posicions
      this.posX += this.velX;
      this.posY += this.velY;
      this.w += this.ws;
      this.h += this.hs;

      if (this.w == 50) {
        this.ws = -1;
      } else if (this.w == -50) {
        this.ws = 1;
      }

      if (this.h == 50) {
        this.hs = -2;
      } else if (this.h == -50) {
        this.hs = 2;
      }

      //dibuixem

      push();
      stroke(int(random(255)), int(random(255)), int(random(255)));

      triangle(
        this.posX,
        this.posY,
        this.posX - this.w,
        this.posY,
        this.posX,
        this.posY + this.h
      );
      rotate(0);
      pop();
      //comprovem la posició X
      if (this.posX - this.sz / 2 < 0 || this.posX + this.sz / 2 > width) {
        this.velX = -this.velX;
      }
      //comprovem la posició Y
      if (this.posY - this.sz / 2 < 0 || this.posY + this.sz / 2 > height) {
        this.velY = -this.velY;
      }
    }

    if (this.view == 1) {
      //actualitzem posicions
      this.posX += this.velX;
      this.posY += this.velY;
      this.w += this.ws;
      this.h += this.hs;

      if (this.w == 50) {
        this.ws = -1;
      } else if (this.w == -50) {
        this.ws = 1;
      }

      if (this.h == 50) {
        this.hs = -2;
      } else if (this.h == -50) {
        this.hs = 2;
      }

      //dibuixem

      push();
      stroke(int(random(255)), int(random(255)), int(random(255)));

      pop();
      //comprovem la posició X
      if (this.posX - this.sz / 2 < 0 || this.posX + this.sz / 2 > width) {
        this.velX = -this.velX;
      }
      //comprovem la posició Y
      if (this.posY - this.sz / 2 < 0 || this.posY + this.sz / 2 > height) {
        this.velY = -this.velY;
      }
    }

    if (this.view == 2) {
      //actualitzem posicions
      this.posX += this.velX;
      this.posY += this.velY;
      this.w += this.ws;
      this.h += this.hs;

      if (this.w == 50) {
        this.ws = -1;
      } else if (this.w == -50) {
        this.ws = 1;
      }

      if (this.h == 50) {
        this.hs = -2;
      } else if (this.h == -50) {
        this.hs = 2;
      }

      //dibuixem

      push();
      stroke(this.color);

      triangle(
        this.posX,
        this.posY,
        this.posX - this.w,
        this.posY,
        this.posX,
        this.posY + this.h
      );

      pop();
      //comprovem la posició X
      if (this.posX - this.sz / 2 < 0 || this.posX + this.sz / 2 > width) {
        this.velX = -this.velX;
      }
      //comprovem la posició Y
      if (this.posY - this.sz / 2 < 0 || this.posY + this.sz / 2 > height) {
        this.velY = -this.velY;
      }
    }
  }

  getX() {
    return this.posX;
  }
  getY() {
    return this.posY;
  }

  changeColor(color) {
    push();
    this.color = color;
    pop();
  }
}
