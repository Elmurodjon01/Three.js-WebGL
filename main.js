
//1단계
// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



// const scene = new THREE.Scene();

// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// const cubeMaterial = new THREE.MeshBasicMaterial({ color: 'grey' });

// const cubeMesh = new THREE.Mesh(
//   cubeGeometry,
//   cubeMaterial
// );
// cubeMesh.position.y = 1;
// console.log(cubeMesh);
// scene.add(cubeMesh);

// //initialize camera 
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1, //this is camera distance and anything closer than this, user won't be able to see
//   30, //anything further than this, user can not also see
// );


// //orthographic camera

// // const aspectRatio = window.innerWidth / window.innerHeight;
// // const camera = new THREE.OrthographicCamera(
// //   -1 * aspectRatio, 
// //   1 * aspectRatio, 
// //   1, 
// //   -1, 
// //   0.1, 
// //   200
// // );

// //Anything created in the scene will be at point 0 by default, camera, mesh or any other 3D objects. it is like camera being inside mesh or 3D object, where it is too hard to see anything as camera is inside that thing that has to be seen
// //so lets move the camera back
// camera.position.z = 5;


// scene.add(camera);
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

// const canvas = document.querySelector('canvas.threejs');

// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
//   antialias: true, //it removes stair case patterns on the edge of 3D object
// });



// //initialize controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// // controls.autoRotate = true;
// //initialize renderer

// renderer.setPixelRatio(window.devicePixelRatio, 1);
// renderer.setSize(window.innerWidth, window.innerHeight);

// const renderLoop = () => {
//   controls.update();
//   renderer.render(scene, camera);
//   window.requestAnimationFrame(renderLoop)
// }


// window.addEventListener(('resize'), () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// })

// renderLoop();


// //2단계
// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
// import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
// // Initialize scene, camera, and renderer
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(0, 50, 100);  // Move camera back to see the entire object
// const geometer = new THREE.BufferGeometry();


// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Add OrbitControls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// // Lighting setup (VERY IMPORTANT for Phong material)
// const ambientLight = new THREE.AmbientLight(0x404040, 2);  // Soft ambient light
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(50, 50, 50);
// scene.add(directionalLight);

// // Helper: Axes to visualize coordinate system
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// // STL Loader
// const stlLoader = new STLLoader();
// let siloMesh = new THREE.Group();  // Group to hold all the parts
// scene.add(siloMesh);

// // Dimensions
// const diameter = 15;
// const bodyHeight = 20;
// const bottomHeight = 10;
// const topHeight = 5;
// const Height = bodyHeight + bottomHeight + topHeight;

// // Load STL model parts and add them to the scene
// // function loadModelPart(url, scale, positionY) {
// //   stlLoader.load(url, (geometry) => {
// //     const material = new THREE.MeshPhongMaterial({
// //       color: 0xffffff,  // Corrected the color
// //       specular: 0x111111,
// //       shininess: 200
// //     });
// //     const mesh = new THREE.Mesh(geometry, material);
// //     mesh.rotation.set(-Math.PI / 2, 0, 0);  // Correct orientation
// //     mesh.position.y = positionY;
// //     mesh.scale.set(scale, scale, scale);  // Apply scaling
// //     mesh.material.side = THREE.DoubleSide;  // Show both sides
// //     siloMesh.add(mesh);  // Add to the group
// //   });
// // }
// function loadModelPart(url, scale, positionY) {
//   stlLoader.load(url, function (geometry) {
//     const attrib = geometry.getAttribute('position');
//     if (!attrib) {
//       throw new Error('The given BufferGeometry object must have a position attribute.');
//     }

//     const positions = attrib.array;
//     const vertices = [];

//     // Extract positions into vertices
//     for (let i = 0, n = positions.length; i < n; i += 3) {
//       const x = positions[i];
//       const y = positions[i + 1];
//       const z = positions[i + 2];
//       vertices.push(x, y, z); // Storing them directly into the array
//     }

//     // Create a new BufferGeometry and assign vertices
//     const geometry2 = new THREE.BufferGeometry();
//     geometry2.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

//     // Compute normals for lighting
//     geometry2.computeVertexNormals();


//     // Create the material for the mesh
//     const material = new THREE.MeshPhongMaterial({
//       color: 0xffffff,
//       specular: 0x111111,
//       shininess: 200
//     });

//     // Create the mesh
//     const surfaceMesh = new THREE.Mesh(geometry2, material);

//     // Set the rotation, position, and scale
//     surfaceMesh.rotation.set(-Math.PI / 2, 0, 0);
//     surfaceMesh.position.y = positionY;
//     surfaceMesh.scale.set(scale, scale, bodyHeight);
//     surfaceMesh.material.side = THREE.DoubleSide;
//     // Add the mesh to the main group (siloMesh)
//     siloMesh.add(surfaceMesh);
//     siloMesh.position.y = -15;

//     // Additional logic if needed
//     const bodyModelZValueArray = new Array(surfaceMesh.geometry.attributes.position.count);
//     const bodyModelLoadTrigger = true;

//     // Log or use these variables as necessary
//   });
// }



// // Load different parts of the 3D object
// loadModelPart('model/newbody.stl', diameter, -(Height / 2) + (bottomHeight + bodyHeight));
// loadModelPart('model/newbottom.stl', diameter, -(Height / 2.7) + bottomHeight);
// loadModelPart('model/newtop.stl', diameter, -(Height / 5) + Height);


// // Handle window resizing
// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // Render loop
// function animate() {
//   controls.update();
//   renderer.render(scene, camera);
//   requestAnimationFrame(animate);
// }
// animate();



//3단계

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 100);  // Move camera back to see the entire object
const geometer = new THREE.BufferGeometry();


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting setup (VERY IMPORTANT for Phong material)
const ambientLight = new THREE.AmbientLight(0x404040, 2);  // Soft ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 50, 50);
scene.add(directionalLight);

// Helper: Axes to visualize coordinate system
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// STL Loader
const stlLoader = new STLLoader();
let siloMesh = new THREE.Group();  // Group to hold all the parts
scene.add(siloMesh);

// Dimensions
const diameter = 15;
const bodyHeight = 20;
const bottomHeight = 10;
const topHeight = 5;
const Height = bodyHeight + bottomHeight + topHeight;

// Load STL model parts and add them to the scene
// function loadModelPart(url, scale, positionY) {
//   stlLoader.load(url, (geometry) => {
//     const material = new THREE.MeshPhongMaterial({
//       color: 0xffffff,  // Corrected the color
//       specular: 0x111111,
//       shininess: 200
//     });
//     const mesh = new THREE.Mesh(geometry, material);
//     mesh.rotation.set(-Math.PI / 2, 0, 0);  // Correct orientation
//     mesh.position.y = positionY;
//     mesh.scale.set(scale, scale, scale);  // Apply scaling
//     mesh.material.side = THREE.DoubleSide;  // Show both sides
//     siloMesh.add(mesh);  // Add to the group
//   });
// }
function loadModelPart(url, scale, positionY) {
  stlLoader.load(url, function (geometry) {
    const attrib = geometry.getAttribute('position');
    if (!attrib) {
      throw new Error('The given BufferGeometry object must have a position attribute.');
    }

    const positions = attrib.array;
    const vertices = [];

    // Extract positions into vertices
    for (let i = 0, n = positions.length; i < n; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      vertices.push(x, y, z); // Storing them directly into the array
    }

    // Create a new BufferGeometry and assign vertices
    const geometry22 = new THREE.BufferGeometry();
    geometry22.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // // Compute normals for lighting
    // geometry2.computeVertexNormals();

    const geometry1 = BufferGeometryUtils.mergeVertices(geometry22);
    geometry1.computeVertexNormals();



    // Create the material for the mesh
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x111111,
      shininess: 200
    });

    // Create the mesh
    const surfaceMesh = new THREE.Mesh(geometry1, material);

    // Set the rotation, position, and scale
    surfaceMesh.rotation.set(-Math.PI / 2, 0, 0);
    surfaceMesh.position.y = positionY;
    surfaceMesh.scale.set(scale, scale, bodyHeight);
    surfaceMesh.material.side = THREE.DoubleSide;
    // Add the mesh to the main group (siloMesh)
    siloMesh.add(surfaceMesh);
    siloMesh.position.y = -15;

    // Additional logic if needed
    const bodyModelZValueArray = new Array(surfaceMesh.geometry.attributes.position.count);
    const bodyModelLoadTrigger = true;

    // Log or use these variables as necessary
  });
}



// Load different parts of the 3D object
loadModelPart('model/newbody.stl', diameter, -(Height / 2) + (bottomHeight + bodyHeight));
loadModelPart('model/newbottom.stl', diameter, -(Height / 2.7) + bottomHeight);
loadModelPart('model/newtop.stl', diameter, -(Height / 5) + Height);


// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
