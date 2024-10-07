import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
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
loadModelPart('model/body.stl', diameter, -(Height / 8) + (bottomHeight + bodyHeight));
loadModelPart('model/bottom.stl', diameter, -(Height / 11) + bottomHeight);
loadModelPart('model/top.stl', diameter, -(Height / 7.3) + Height);


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










  var CANVAS_WIDTH = 800,
  CANVAS_HEIGHT = 600;
  scene = null, // scene objectz
  camera = null; // camera object

var angleY = 0;
var IsClicked = false;
var PrevMouseX = 0;
var PrevMouseY = 0;

var RotateType = 0;
var mesh = null;

var angleY = 0;
var angleX = 0;

var worldWidth = 256,
  worldDepth = 256,
  worldHalfWidth = worldWidth / 2,
  worldHalfDepth = worldDepth / 2;

var vShader, fShader;

var prevAngleX = 0.0

var moveSpeed = 0.5;

var dragSwitch = true;

var retriveTriggerY = false;
var retriveTriggerX = false;
var retriveSpeed = 1.0;

var wheelSpeed = 1.0;

var useCircle = true;
var surfaceLoaded = false;

var test = false;





function retrive() {
    if (retriveTriggerY == true) {
        if (angleY <= 180) {
            angleY--;
        } else {
            angleY++;
        }

        meshGroup.rotation.y = angleY * retriveSpeed * Math.PI / 180;

        directionViewer.rotation.y = angleY * retriveSpeed * Math.PI / 180;

        if (angleY >= 360)
            angleY = 0;

        else if (angleY < 0)
            angleY += 360;

        if (angleY <= 1.0 && angleY >= -1.0) {
            angleY = 0;
        }

        if (angleY == 0)
            retriveTriggerY = false;
    }

    if (retriveTriggerX == true) {
        if (angleX < 0)
            angleX++;
        else if (angleX >= 0)
            angleX--;

        meshGroup.rotation.x = angleX * retriveSpeed * Math.PI / 180;

        directionViewer.rotation.x = angleX * retriveSpeed * Math.PI / 180;

        if (angleX <= 1.0 && angleX >= -1.0) {
            angleX = 0;
        }

        if (angleX == 0)
            retriveTriggerX = false;
    }
}

function showSwitch() {
    if (angleX <= -20 && prevAngleX > angleX)
        topMesh.visible = false;
    else if (angleX >= -20 && prevAngleX < angleX)
        topMesh.visible = true;

    // topMesh.visible = false;
    // console.log("Length : " +
    // surfaceMeshBody.geometry.vertices.length);

    /*
     * if (surfaceMeshBody != null) console.log("Length : " +
     * surfaceMeshBody.geometry.vertices.length);
     */
}


function GetHeight(x, y) {
    var nx = parseInt(x); // 내림
    var ny = parseInt(y); // 내림

    var dx = x - nx;
    var dy = y - ny;

    var v0, v1, v2, v3;
    v0 = HeightMatrix[nx][ny];

    if (ny + 1 <= 100)
        v1 = HeightMatrix[nx][ny + 1];
    else
        v1 = HeightMatrix[nx][ny];

    if (nx + 1 <= 100)
        v2 = HeightMatrix[nx + 1][ny];
    else
        v2 = HeightMatrix[nx][ny];

    if (nx + 1 <= 100 && ny + 1 <= 100)
        v3 = HeightMatrix[nx + 1][ny + 1];
    else
        v3 = HeightMatrix[nx][ny];

    var height;
    height = (1.0 - dx) * (1.0 - dy) * v0;
    height += (1.0 - dx) * dy * v1;

    height += dx * (1.0 - dy) * v2;
    height += dx * dy * v3;


    return height;
}



function loadDataToSurface() {
    // console.log("--------------");
    // console.log(HeightMatrix);
    // console.log("--------------");
    if (bodyModelLoadTrigger && bottomModelLoadTrigger && loadResult == 404) {
        surfaceLoaded = false;
        surfaceMeshBody.visible = surfaceLoaded;
        surfaceMeshBottom.visible = surfaceLoaded;
    }

    if (loadTrigger && bodyModelLoadTrigger && bottomModelLoadTrigger) {
        surfaceLoaded = true;
        if (!useCircle) {
            for (var i = 0; i < 101; i++)
                for (var j = 0; j < 101; j++) {
                    surfaceMeshBody.geometry.vertices[i * 101 + j].z = HeightMatrix[i][j] * 0.001;
                }
        }

        if (useCircle) {
            meshControl(surfaceMeshBody, bodyHeight * 1000, bottomLimit, 0);
            //meshControl(surfaceMeshBottom, bottomHeight * 1000, 0, bottomLimit);
        }

        surfaceMeshBody.geometry.verticesNeedUpdate = true;
        surfaceMeshBottom.geometry.verticesNeedUpdate = true;

        loadTrigger = false;
        bodyModelLoadTrigger = false;
        bottomModelLoadTrigger = false;
    }
}

function meshControl(mesh, height, bottomLimit, limit) {
    var len = mesh.geometry.vertices.length;
    var maxX, maxY, minX, minY;
    var range = 96.0;
    var maxrange = 100.0;

    for (var i = 0; i < len; i++) {
        var vert = mesh.geometry.vertices[i];
        if (i == 0) {
            maxX = vert.x;
            maxY = vert.y;
            minX = vert.x;
            minY = vert.y;
        }

        if (maxX < vert.x)
            maxX = vert.x;
        if (maxY < vert.y)
            maxY = vert.y;
        if (minX > vert.x)
            minX = vert.x;
        if (minY > vert.y)
            minY = vert.y;
    }

    var len = mesh.geometry.vertices.length;
    for (var i = 0; i < len; i++) {
        var vert = mesh.geometry.vertices[i];
        var vx = (vert.x - minX) / (maxX - minX) * range + (maxrange - range) / 2.0;
        var vy = (vert.y - minY) / (maxY - minY) * range + (maxrange - range) / 2.0;
        if (mesh.geometry.vertices[i].z >= (limit - 0.001)) {
            mesh.geometry.vertices[i].z = GetHeight(vx, vy) / height;

            var point = new THREE.Vector2(mesh.geometry.vertices[i].x, mesh.geometry.vertices[i].y);
            var length = point.length();

            var currentLimit = (bottomHeight / bodyHeight) * (length / (diameter / diameter / 2));

            if (mesh.geometry.vertices[i].z <= currentLimit) {
                mesh.geometry.vertices[i].z = currentLimit * 1.15 - bottomHeight / bodyHeight * 0.15;
            }
        } else
            mesh.geometry.vertices[i].z = (bottomHeight / bodyHeight);

        bodyModelZValueArray[i] = mesh.geometry.vertices[i].z;
    }
}

function animate() {
    requestAnimationFrame(animate);

    loadDataToSurface();
    retrive();

    showSwitch();

    prevAngleX = angleX;

    if (topMesh != null && surfaceMeshBody != null && surfaceMeshBottom != null) {
        //renderer.render(scene, camera);

        var topVisibility = topMesh.visible;
        var bodyVisibility = bodyMesh.visible;
        var bottomVisibility = bottomMesh.visible;

        surfaceMeshBody.visible = false;
        surfaceMeshBottom.visible = false;

        renderer.autoClear = true;

        renderer.autoClearColor = true;
        renderer.autoClearDeth = true;
        renderer.autoClearStencil = true;

        renderer.render(scene, camera);


        bodyMesh.visible = false;
        bottomMesh.visible = false;
        surfaceMeshBody.visible = surfaceLoaded;
        surfaceMeshBottom.visible = surfaceLoaded;

        renderer.autoClearColor = false;
        renderer.autoClearDeth = true;
        renderer.autoClearStencil = true;

        renderer.render(scene, camera);

        topMesh.visible = topVisibility;
        bodyMesh.visible = bodyVisibility;
        bottomMesh.visible = bottomVisibility;
    }
}