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

 var scene = null;
 var camera = null;
 var renderer = null;
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// Create scene, camera, and renderer



function initLoader() {
    loader = new THREE.FileLoader();
    stlLoader = new THREE.STLLoader();
}

function setupScene() {
    scene = new THREE.Scene();
}
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
function setupCamera() {
    camera = new THREE.PerspectiveCamera(
        35, // Field of view
        screen_width / screen_height, // Aspect ratio
        .1, // Near clip plane
        10000 // Far clip plane
    );
    console.log("delete later Height SU: " + Height);
    cameraLookAt = new THREE.Vector3(0, (Height / 2) + 1 / Height, 0);
    cameraDirection = new THREE.Vector3(cameraLookAt.x - cameraPos.x, cameraLookAt.y - cameraPos.y, cameraLookAt.z - cameraPos.z);
    cameraDirection.normalize();
    cameraPos.x += cameraDirection.x * -1 * lengthRatio / 2;
    cameraPos.y += cameraDirection.y * -1 * lengthRatio / 2;
    cameraPos.z += cameraDirection.z * -1 * lengthRatio / 2;
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    camera.lookAt(cameraLookAt);
    scene.add(camera);
    window.addEventListener('resize', function() {
        calcScreenSize();

        if (screen_width < screen_height) {
            screen_height -= (100 * (screen_height / screen_width));
        }

        camera.aspect = screen_width / screen_height;

        camera.updateProjectionMatrix();
        renderer.setSize(screen_width - 20, screen_height - 20);
    });
}

camera.position.set(0, 0, 200);

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
function setupRenderer() {
    var test_canvas = document.createElement('canvas');
    var gl = null;
    try {
        gl = (test_canvas.getContext("webgl") ||
            test_canvas.getContext("experimental-webgl")
        );
    } catch (e) {}

    if (gl) {
        renderer = new THREE.WebGLRenderer();
        console.log('webgl!');
    } else {
        renderer = new THREE.CanvasRenderer();
        console.log('canvas');
    }
    test_canvas = undefined;

    calcScreenSize();
    renderer.setSize(screen_width, screen_height - 60);
    // renderer.setClearColor(0x777777, 1.0);
    renderer.setClearColor(0xffffff, 1.0);
    //renderer.setClearColor(0x7FFFD4, 1.0);

    // where to add the canvas element
    document.body.appendChild(renderer.domElement);
}

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
