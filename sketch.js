let targetX, targetY;
let targetSize = 30;
let gameState = 'START'; // START, PLAYING, WON, LOST
let timeLeft = 30;
let startTime;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  resetGame();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(30); // 深色背景

  drawGrid(); // 繪製背景網格

  if (gameState === 'START') {
    drawMessage("雷達找顏色\n點擊畫面開始遊戲\n(限時 30 秒)");
  } else if (gameState === 'PLAYING') {
    playGame();
  } else if (gameState === 'WON') {
    showWin();
  } else if (gameState === 'LOST') {
    drawMessage("時間到！\n沒能找到方塊\n點擊畫面重玩");
  }
}

function drawGrid() {
  stroke(60); // 深灰色線條
  strokeWeight(1);
  let gridSize = 50; 
  for (let x = 0; x <= width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = 0; y <= height; y += gridSize) {
    line(0, y, width, y);
  }
}

function resetGame() {
  targetX = random(targetSize, width - targetSize);
  targetY = random(targetSize, height - targetSize);
  timeLeft = 30;
  particles = [];
}

function playGame() {
  // 計算剩餘時間
  let elapsed = (millis() - startTime) / 1000;
  timeLeft = 30 - elapsed;

  if (timeLeft <= 0) {
    gameState = 'LOST';
    return;
  }

  // 繪製雷達效果
  let d = dist(mouseX, mouseY, targetX, targetY);
  let intensity = map(d, 0, width, 255, 50);
  
  noFill();
  strokeWeight(2);
  stroke(255 - intensity, intensity, 0, 150); // 越近越紅，越遠越綠
  let pulse = (sin(frameCount * (0.05 + (1/d * 10))) * 20) + 40;
  ellipse(mouseX, mouseY, pulse, pulse);

  // 介面文字
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  text(`剩餘時間: ${nf(timeLeft, 1, 1)}s`, 10, 10);
  
  // 偵測是否點擊到 (在 mousePressed 處理，這裡提供視覺提示)
  cursor(CROSS);
}

function showWin() {
  // 慶祝特效：粒子系統
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  drawMessage(`恭喜找到！\n座標: [X: ${floor(targetX)}, Y: ${floor(targetY)}]\n點擊畫面再玩一次`);
}

function drawMessage(msg) {
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  text(msg, width / 2, height / 2);
}

function mousePressed() {
  if (gameState === 'START' || gameState === 'WON' || gameState === 'LOST') {
    resetGame();
    startTime = millis();
    gameState = 'PLAYING';
  } else if (gameState === 'PLAYING') {
    let d = dist(mouseX, mouseY, targetX, targetY);
    if (d < targetSize) {
      gameState = 'WON';
      console.log(`找到方塊！座標為: X=${targetX}, Y=${targetY}`);
      // 初始化慶祝粒子
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle(targetX, targetY));
      }
    }
  }
}

// 慶祝用的小粒子類別
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 6));
    this.acc = createVector(0, 0.1);
    this.color = color(random(255), random(255), random(255));
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
  display() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }
}
