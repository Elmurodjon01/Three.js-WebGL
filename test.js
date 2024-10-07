import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

var renderer, scene, camera, vShader, fShader;

var cameraPos = new THREE.Vector3(0, 4, -7);
var originalCameraPos = new THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z);
var cameraLookAt = new THREE.Vector3(0, 2.5, 0);
var cameraDirection = new THREE.Vector3(cameraLookAt.x - cameraPos.x, cameraLookAt.y - cameraPos.y, cameraLookAt.z - cameraPos.z);
var temporaryCameraDirection = null;
var temporaryLength = 0.0;
var cameraLength = 0.0;
var lengthRatio = 0.0;

var screen_width = 0.0;
var screen_height = 0.0;
var prev_screen_width = 0.0;
var prev_screen_height = 0.0;
var userCircle = true; 
var stlLoader = null;
var siloMesh = null;
var topMesh = null;
var bodyMesh = null;
var bottomMesh = null;

var surfaceMeshBody = null;
var surfaceMeshBottom = null;
var surfaceDataPath = "";

var meshGeometry = null;

var meshGroup = null;
var directionViewer = null;

var loadTrigger = false;
var loadResult = 0;
var bodyModelLoadTrigger = false;
var bottomModelLoadTrigger = false;

var Height = 0.0;
var bottomHeight = 0.0;
var bodyHeight = 0.0;
var topHeight = 0.0;
var diameter = 0.0;
var maxDiameter = 0.0;
var bottomLimit = 0.0;

var bodyModelZValueArray = null;

cameraLength = cameraDirection.length();
cameraDirection.normalize();

function initLoader() {
    stlLoader = new STLLoader();
}

function setupRenderer() {
    var test_canvas = document.createElement('canvas');
    var gl = null;
    try {
        gl = (test_canvas.getContext("webgl") || test_canvas.getContext("experimental-webgl"));
    } catch (e) {
        console.error("Error while checking WebGL support: ", e);
    }

    if (gl) {
        renderer = new THREE.WebGLRenderer();
        console.log('WebGL is supported, using WebGLRenderer.');
    } else {
        alert("WebGL is not supported in your browser. Please try another browser.");
        return; // Stop execution if WebGL isn't supported
    }

    calcScreenSize();
    renderer.setSize(screen_width, screen_height - 60);
    renderer.setClearColor(0xffffff, 1.0);
    document.body.appendChild(renderer.domElement);
}

function setupScene() {
    scene = new THREE.Scene();
}

// function setupCamera() {
//     camera = new THREE.PerspectiveCamera(
//         35,
//         screen_width / screen_height,
//         .1,
//         10000
//     );
//     console.log("Height SU: " + Height);
//     cameraLookAt = new THREE.Vector3(0, (Height / 2) + 1 / Height, 0);
//     cameraDirection = new THREE.Vector3(cameraLookAt.x - cameraPos.x, cameraLookAt.y - cameraPos.y, cameraLookAt.z - cameraPos.z);
//     cameraDirection.normalize();
//     cameraPos.x += cameraDirection.x * -1 * lengthRatio / 2;
//     cameraPos.y += cameraDirection.y * -1 * lengthRatio / 2;
//     cameraPos.z += cameraDirection.z * -1 * lengthRatio / 2;
//     camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
//     camera.lookAt(cameraLookAt);
//     scene.add(camera);
    
//     window.addEventListener('resize', function () {
//         calcScreenSize();
//         if (screen_width < screen_height) {
//             screen_height -= (100 * (screen_height / screen_width));
//         }
//         camera.aspect = screen_width / screen_height;
//         camera.updateProjectionMatrix();
//         renderer.setSize(screen_width - 20, screen_height - 20);
//     });
// }

function calcScreenSize() {
    prev_screen_width = screen_width;
    prev_screen_height = screen_height;
    screen_width = window.innerWidth - 20;
    screen_height = window.innerHeight - 20;
}

function loadModelPart(url, scale, positionY) {
    stlLoader.load(url, function (geometry) {
        const attrib = geometry.getAttribute('position');
        if (!attrib) {
            throw new Error('The given BufferGeometry object must have a position attribute.');
        }
        const positions = attrib.array;
        const vertices = [];
        for (let i = 0, n = positions.length; i < n; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];
            vertices.push(x, y, z);
        }
        const geometry22 = new THREE.BufferGeometry();
        geometry22.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const geometry1 = BufferGeometryUtils.mergeVertices(geometry22);
        geometry1.computeVertexNormals();
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x111111,
            shininess: 200
        });
        const surfaceMesh = new THREE.Mesh(geometry1, material);
        surfaceMesh.rotation.set(-Math.PI / 2, 0, 0);
        surfaceMesh.position.y = positionY;
        surfaceMesh.scale.set(scale, scale, bodyHeight);
        surfaceMesh.material.side = THREE.DoubleSide;
        siloMesh.add(surfaceMesh);
        
        // After loading all parts, add siloMesh to the scene
        if (!scene.children.includes(siloMesh)) {
            siloMesh.position.y = -15; // Adjust position if needed

            scene.add(siloMesh);

        }

        bodyModelZValueArray = new Array(surfaceMesh.geometry.attributes.position.count);
        bodyModelLoadTrigger = true;
    });
}

function addMesh() {
    siloMesh = new THREE.Group();

    if (userCircle) {
        // Load STL models
        loadModelPart('model/body.stl', 1, 0);   // Adjust the path and scale
        loadModelPart('model/bottom.stl', 1, -2);  // Adjust the path and scale
        loadModelPart('model/top.stl', 1, 2);    // Adjust the path and scale
        console.log("STL models are being loaded");
    } else {
        // Add a fallback geometry (e.g., a plane) using BufferGeometry
        const geometry = new THREE.PlaneGeometry(10, 10);  // PlaneGeometry is a subclass of BufferGeometry
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = Math.PI / 2;  // Rotate to lie flat
        scene.add(plane);
        console.log("Fallback plane geometry added to scene");
    }
}

function addLight() {
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFFFFF, 1);
    camera.add(pointLight);
}

function setupCamera() {
    camera = new THREE.PerspectiveCamera(
        35,
        screen_width / screen_height,
        .1,
        1000
    );
    console.log("Height SU: " + Height);
    camera.position.set(0, 4, -7);  // Adjust camera position if needed
    camera.lookAt(new THREE.Vector3(0, 2.5, 0));  // Ensure the camera looks at the model

    scene.add(camera);

    window.addEventListener('resize', function () {
        calcScreenSize();
        camera.aspect = screen_width / screen_height;
        camera.updateProjectionMatrix();
        renderer.setSize(screen_width - 20, screen_height - 20);
    });
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// animate();

// Initialization sequence

initLoader();
setupRenderer();
setupScene();
setupCamera();
addMesh();
animate();




// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// var renderer, scene, camera;
// var stlLoader = null;
// var siloMesh = null;

// // Initialize everything
// initLoader();
// setupRenderer();
// setupScene();
// setupCamera();
// addLight();
// addMesh();
// animate();

// function initLoader() {
//     stlLoader = new STLLoader();
// }

// function setupRenderer() {
//     renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xffffff);  // White background
//     document.body.appendChild(renderer.domElement);
//     console.log("Renderer initialized");
// }

// function setupScene() {
//     scene = new THREE.Scene();
//     console.log("Scene initialized");
// }

// function setupCamera() {
//     camera = new THREE.PerspectiveCamera(
//         45, 
//         window.innerWidth / window.innerHeight, 
//         0.1, 
//         1000
//     );
//     camera.position.set(0, 5, 10); // Set the camera back so it can see objects
//     camera.lookAt(new THREE.Vector3(0, 0, 0)); // Point at the center of the scene
//     console.log("Camera initialized");
// }

// function addLight() {
//     const light = new THREE.DirectionalLight(0xffffff, 1);
//     light.position.set(10, 10, 10);  // Add some light
//     scene.add(light);
//     console.log("Light added to the scene");
// }

// function loadModelPart(url, scale, positionY) {
//     stlLoader.load(url, function (geometry) {
//         const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
//         const mesh = new THREE.Mesh(geometry, material);
//         mesh.scale.set(scale, scale, scale);
//         mesh.position.y = positionY;
//         scene.add(mesh);
//         console.log("Model loaded and added to scene");
//     });
// }

// function addMesh() {
//     // Add a basic cube to ensure something is visible
//     const geometry = new THREE.BoxGeometry(1, 1, 1);
//     const material = new THREE.MeshBasicMaterial({ color: 0x544564 });
//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);
//     console.log("Test cube added to scene");
// }

// function animate() {
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
// }

// // Handle window resizing
// window.addEventListener('resize', () => {
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
// });





// // Initialize scene, camera, and renderer
// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xffffff);
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


// function loadModelPart(url, scale, positionY) {
//     stlLoader.load(url, function (geometry) {
//         const attrib = geometry.getAttribute('position');
//         if (!attrib) {
//             throw new Error('The given BufferGeometry object must have a position attribute.');
//         }

//         const positions = attrib.array;
//         const vertices = [];

//         // Extract positions into vertices
//         for (let i = 0, n = positions.length; i < n; i += 3) {
//             const x = positions[i];
//             const y = positions[i + 1];
//             const z = positions[i + 2];
//             vertices.push(x, y, z); // Storing them directly into the array
//         }

//         // Create a new BufferGeometry and assign vertices
//         const geometry22 = new THREE.BufferGeometry();
//         geometry22.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

//         // // Compute normals for lighting
//         // geometry2.computeVertexNormals();

//         const geometry1 = BufferGeometryUtils.mergeVertices(geometry22);
//         geometry1.computeVertexNormals();



//         // Create the material for the mesh
//         const material = new THREE.MeshPhongMaterial({
//             color: 0xffffff,
//             specular: 0x111111,
//             shininess: 200
//         });

//         // Create the mesh
//         const surfaceMesh = new THREE.Mesh(geometry1, material);

//         // Set the rotation, position, and scale
//         surfaceMesh.rotation.set(-Math.PI / 2, 0, 0);
//         surfaceMesh.position.y = positionY;
//         surfaceMesh.scale.set(scale, scale, bodyHeight);
//         surfaceMesh.material.side = THREE.DoubleSide;
//         // Add the mesh to the main group (siloMesh)
//         siloMesh.add(surfaceMesh);
//         siloMesh.position.y = -15;

//         // Additional logic if needed
//         const bodyModelZValueArray = new Array(surfaceMesh.geometry.attributes.position.count);
//         const bodyModelLoadTrigger = true;

//         // Log or use these variables as necessary
//     });
// }



// // Load different parts of the 3D object
// loadModelPart('model/body.stl', diameter, -(Height / 8) + (bottomHeight + bodyHeight));
// loadModelPart('model/bottom.stl', diameter, -(Height / 11) + bottomHeight);
// loadModelPart('model/top.stl', diameter, -(Height / 7.3) + Height);


// // Handle window resizing
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // Render loop
// function animate() {
//     controls.update();
//     renderer.render(scene, camera);
//     requestAnimationFrame(animate);
// }
// animate();
