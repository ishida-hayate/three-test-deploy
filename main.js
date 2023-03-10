import './style.css';
import * as THREE from 'three';

// CANVAS
const canvas = document.querySelector('#webgl');

// シーン
const scene = new THREE.Scene();

// 背景用のテクスチャ
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load('./bg.jpg');
scene.background = bgTexture;

// サイズ
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

// カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio); // 粗さが軽減される

// オブジェクトを作成
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);
scene.add(box);

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 1, 10);
scene.add(torus);

// 線形保管で滑らかに移動させる
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

function scalePercent(start, end) {
  return (scrollPercent - start) / (end - start);
}

// スクロールアニメーション
const animationScripts = [];

animationScripts.push({
  start: 0,
  end: 40,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.position.z = lerp(-15, 2, scalePercent(0, 40));
    torus.position.z = lerp(10, -20, scalePercent(0, 40));
  },
});

animationScripts.push({
  start: 40,
  end: 60,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.rotation.z = lerp(1, Math.PI, scalePercent(40, 60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  function() {
    camera.lookAt(box.position);
    camera.position.x = lerp(0, -15, scalePercent(60, 80));
    camera.position.y = lerp(1, 15, scalePercent(60, 80));
    camera.position.z = lerp(10, 25, scalePercent(60, 80));
  },
});

animationScripts.push({
  start: 80,
  end: 100,
  function() {
    camera.lookAt(box.position);
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;
    torus.rotation.x += 0.02;
    torus.rotation.y += 0.02;
  },
});

// アニメーションを開始
function playScrollAnimation() {
  animationScripts.forEach((animation) => {
    if (scrollPercent >= animation.start && scrollPercent <= animation.end) {
      animation.function();
    }
  });
}

// ブラウザのスクロール率を取得

let scrollPercent = 0;
document.body.onscroll = () => {
  scrollPercent =
    (document.documentElement.scrollTop /
      (document.documentElement.scrollHeight -
        document.documentElement.clientHeight)) *
    100;
};

// アニメーション
const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimation();
  renderer.render(scene, camera);
};

tick();

// リサイズ
window,
  addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix;

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
  });
