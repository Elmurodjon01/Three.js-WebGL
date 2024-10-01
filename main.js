import * as THREE from 'three';

const scene = new THREE.Scene();

const cubeGeometry = new THREE.BoxGeometry(1,1,1);
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

const cubeMesh = new THREE.Mesh(
  cubeGeometry,
  cubeMaterial
);

scene.add(cubeMesh);

//initialize camera 
const camera = new THREE.PerspectiveCamera(
  75, 
  innerWidth / innerHeight,
  0.1, //this is camera distance and anything closer than this, user won't be able to see
  30, //anything further than this, user can not also see
);

//Anything created in the scene will be at point 0 by default, camera, mesh or any other 3D objects. it is like camera being inside mesh or 3D object, where it is too hard to see anything as camera is inside that thing that has to be seen
//so lets move the camera back
camera.position.z = 5;

scene.add(camera);

const canvas = document.querySelector('canvas.threejs');

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
//initialize renderer

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

console.log(canvas);