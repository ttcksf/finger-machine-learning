const start = document.querySelector('.start');
const webcam = document.querySelector('.webcam');
const label = document.querySelector('.label');
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

const block = {
  x: 100,
  y: 100,

  update: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(this.x, this.y, 100, 100);
    ctx.fill();
  },
};

const url = 'https://teachablemachine.withgoogle.com/models/5z_y9dtXu/';

let model;
let cam;

const startFn = async () => {
  model = await tmImage.load(url + 'model.json', url + 'metadata.json');
  cam = new tmImage.Webcam(200, 200, true);
  await cam.setup();
  cam.play();
  webcam.appendChild(cam.canvas);
  loop();
};

const predict = async () => {
  const predict = await model.predict(cam.canvas);
  // console.log(predict);
  for (let i = 0; i < model.getTotalClasses(); i++) {
    const name = predict[i].className;
    const value = predict[i].probability.toFixed(2);

    if (value > 0.85) {
      switch (name) {
        case '上':
          block.y -= 4;
          break;
        case '下':
          block.y += 4;
          break;
        case '右':
          block.x += 4;
          break;
        case '左':
          block.x -= 4;
      }
    }
  }
};

const loop = async () => {
  cam.update();
  await predict();
  block.update();
  window.requestAnimationFrame(loop);
};

start.addEventListener('click', startFn);
