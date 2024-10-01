import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

const cubeGeometry = new THREE.BoxGeometry(1,1,1);
const cubeMaterial = new THREE.MeshBasicMaterial({color: 'grey'});

const cubeMesh = new THREE.Mesh(
  cubeGeometry,
  cubeMaterial
);

scene.add(cubeMesh);

//initialize camera 
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight,
  0.1, //this is camera distance and anything closer than this, user won't be able to see
  30, //anything further than this, user can not also see
);


//orthographic camera

// const aspectRatio = window.innerWidth / window.innerHeight;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio, 
//   1 * aspectRatio, 
//   1, 
//   -1, 
//   0.1, 
//   200
// );

//Anything created in the scene will be at point 0 by default, camera, mesh or any other 3D objects. it is like camera being inside mesh or 3D object, where it is too hard to see anything as camera is inside that thing that has to be seen
//so lets move the camera back
camera.position.z = 5;

scene.add(camera);

const canvas = document.querySelector('canvas.threejs');

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true, //it removes stair case patterns on the edge of 3D object
});



//initialize controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
//initialize renderer

renderer.setPixelRatio(window.devicePixelRatio, 1);
renderer.setSize(window.innerWidth, window.innerHeight);

const renderLoop = ()=> {
controls.update();
renderer.render(scene, camera);
window.requestAnimationFrame(renderLoop)
}


window.addEventListener(('resize'), ()=> {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
})

renderLoop();
