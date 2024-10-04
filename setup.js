// import * as THREE from 'three';
// import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// var stlLoader = new STLLoader.STLLoader();
// var siloMesh = null;






// //load 3D stl model
// stlLoader.load('model/body.stl', function (geometry) {
//     var material = new THREE.MeshPhongMaterial({
//         color: 0xAAAAAA,
//         specular: 0x111111,
//         shininess: 200
//     });
//     topMesh = new THREE.Mesh(geometry, material);
//     topMesh.rotation.set(-Math.PI / 2, 0, 0);
//     topMesh.position.y = -((Height / 2) + 1 / Height);
//     topMesh.position.y += (bottomHeight + bodyHeight);
//     //topMesh.position.y += 2;
//     //topMesh.position.y += 2.0;
//     topMesh.scale.set(diameter, diameter, topHeight);
//     topMesh.material.side = THREE.DoubleSide;
//     siloMesh.add(topMesh);
//     //console.log(Height);
// });
// stlLoader.load('model/down.stl', function (geometry) {
//     var material = new THREE.MeshPhongMaterial({
//         color: 0xAAAAAA,
//         specular: 0x111111,
//         shininess: 200
//     });
//     topMesh = new THREE.Mesh(geometry, material);
//     topMesh.rotation.set(-Math.PI / 2, 0, 0);
//     topMesh.position.y = -((Height / 2) + 1 / Height);
//     topMesh.position.y += (bottomHeight + bodyHeight);
//     //topMesh.position.y += 2;
//     //topMesh.position.y += 2.0;
//     topMesh.scale.set(diameter, diameter, topHeight);
//     topMesh.material.side = THREE.DoubleSide;
//     siloMesh.add(topMesh);
//     //console.log(Height);
// });
// stlLoader.load('model/up.stl', function (geometry) {
//     var material = new THREE.MeshPhongMaterial({
//         color: 0xAAAAAA,
//         specular: 0x111111,
//         shininess: 200
//     });
//     topMesh = new THREE.Mesh(geometry, material);
//     topMesh.rotation.set(-Math.PI / 2, 0, 0);
//     topMesh.position.y = -((Height / 2) + 1 / Height);
//     topMesh.position.y += (bottomHeight + bodyHeight);
//     //topMesh.position.y += 2;
//     //topMesh.position.y += 2.0;
//     topMesh.scale.set(diameter, diameter, topHeight);
//     topMesh.material.side = THREE.DoubleSide;
//     siloMesh.add(topMesh);
//     //console.log(Height);
// });

import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 200);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add basic lighting
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Initialize STLLoader
const stlLoader = new STLLoader();
let siloMesh = new THREE.Group();  // Group to hold all meshes
scene.add(siloMesh);

// Load 3D STL model parts and add to the scene
function loadModelPart(url, scale, positionY) {
    stlLoader.load(url, function (geometry) {
        const material = new THREE.MeshPhongMaterial({
            color: 0xAAAAAA,
            specular: 0x111111,
            shininess: 200
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        mesh.position.y = positionY;
        mesh.scale.set(scale, scale, scale);
        mesh.material.side = THREE.DoubleSide;
        siloMesh.add(mesh);
    });
}

// Define dimensions for scaling and positioning
const diameter = 10;
const bodyHeight = 20;
const bottomHeight = 10;
const topHeight = 5;
const Height = bodyHeight + bottomHeight + topHeight;

// Load different parts of the 3D object
loadModelPart('model/body.stl', diameter, -(Height / 2) + (bottomHeight + bodyHeight));
loadModelPart('model/down.stl', diameter, -(Height / 2) + bottomHeight);
loadModelPart('model/up.stl', diameter, -(Height / 2) + Height);

// Render and animate the scene
function animate() {
    requestAnimationFrame(animate);
    siloMesh.rotation.y += 0.01; // Rotate the model for better visualization
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
