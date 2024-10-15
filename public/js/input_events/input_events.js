function initMouseEvents() {
    var glView = renderer.domElement;
    glView.addEventListener('mousedown', onDocumentMouseDown, false);
    glView.addEventListener('mousemove', onDocumentMouseMove, false);
    glView.addEventListener('mouseup', onDocumentMouseUp, false);

    glView.addEventListener('touchstart', onDocumentTouchStart, {
        passive: false
    });
    glView.addEventListener('touchcancel', onDocumentTouchCancel, false);
    glView.addEventListener('touchend', onDocumentTouchEnd, false);
    glView.addEventListener('touchmove', onDocumentTouchMove, false);

    glView.addEventListener('mousewheel', onDocumentMouseWheel, false);

    var infoDiv = document.getElementById("infoTable");
    infoDiv.onmousemove = function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }

    /*var infoDiv = document.getElementById("_7");
    infoDiv.onclick = function(event){
    	event.preventDefault();
    	event.stopPropagation();
    	event.stopImmediatePropagation();
    }
				
    infoDiv.onmousedown = function(event){
    	event.preventDefault();
    	event.stopPropagation();
    	event.stopImmediatePropagation();
    }
				
    infoDiv.onmouseup = function(event){
    	event.preventDefault();
    	event.stopPropagation();
    	event.stopImmediatePropagation();
    }
				
    infoDiv.ontouchstart = function(event){
    	event.preventDefault();
    	event.stopPropagation();
    	event.stopImmediatePropagation();
    }
				
    infoDiv.ontouchend = function(event){
    	event.preventDefault();
    	event.stopPropagation();
    	event.stopImmediatePropagation();
    }
				
    infoDiv.ontouchcancel = function(event){
    	event.preventDefault();
    	event.stopPropagation();
    	event.stopImmediatePropagation();
    }
				
    infoDiv.ontouchmove = function(event){
    	event.preventDefault();
    	event.stopPropagation();
    	event.stopImmediatePropagation();
    }*/

    /*infoDiv.addEventListener( 'mousedown', onDocumentMouseDown, false );
				infoDiv.addEventListener( 'mousemove', onDocumentMouseMove, false );
				infoDiv.addEventListener( 'mouseup', onDocumentMouseUp, false );
			
				infoDiv.addEventListener( 'touchstart', onDocumentTouchStart, {passive: false} );
				infoDiv.addEventListener( 'touchcancel', onDocumentTouchCancel, false );
				infoDiv.addEventListener( 'touchend', onDocumentTouchEnd, false );
				infoDiv.addEventListener( 'touchmove', onDocumentTouchMove, false );
				
				infoDiv.addEventListener( 'mousewheel', onDocumentMouseWheel, false );*/
}

/* Input Function */
function OnInputStart(clientX, clientY) {
    IsClicked = true;
    PrevMouseX = clientX;
    PrevMouseY = clientY;
    //console.log("X : " + clientX);
    //console.log("Y : " + clientY);

    retriveTriggerY = false;
    retriveTriggerX = false;
}

function OnInputMove(clientX, clientY) {
    //console.log("Move");
    if (IsClicked == true && dragSwitch == true) {
        /*console.log("X : " + clientX);
        console.log("Y : " + clientY);
        console.log("PrevX : " + PrevMouseX);
        console.log("PrevY : " + PrevMouseY);*/
        angleY += ((clientX - PrevMouseX) * moveSpeed);
        angleX += ((PrevMouseY - clientY) * moveSpeed);

        //siloMesh.rotation.y = angleY * Math.PI / 180;
        //siloMesh.rotateOnAxis(axisZ, angleY * Math.PI / 180);

        /* angleY *= (retriveSpeed * 0.5);
        angleX *= (retriveSpeed * 0.5); */

        meshGroup.rotation.y = angleY * Math.PI / 180;
        //meshGroup.rotateOnAxis(axisZ, angleY * Math.PI / 180);

        directionViewer.rotation.y = angleY * Math.PI / 180;

        //console.log("AngleY : " + angleY);

        if (angleY >= 360)
            angleY -= 360;

        if (angleY < 0)
            angleY += 360;

        if (angleX >= 90)
            angleX = 90;

        if (angleX <= -90)
            angleX = -90;
        meshGroup.rotation.x = angleX * Math.PI / 180;

        directionViewer.rotation.x = angleX * Math.PI / 180;

        PrevMouseX = clientX;
        PrevMouseY = clientY;

        showSwitch();

        prevAngleX = angleX;
    }
}

function OnInputEnd(event) {
    //console.log("Up");
    IsClicked = false;

    if (angleY != 0)
        retriveTriggerY = true;

    if (angleX != 0)
        retriveTriggerX = true;
    //console.log("Angle : " + angleX);
}

function OnInputScroll(event) {
    var delta = 0;
    if (!event)
        event = window.event;

    event.preventDefault();
    event.stopPropagation();

    if (event.wheelDelta) {
        delta = event.wheelDelta / 120;
    } else if (event.detail) {
        delta = -event.detail / 3;
    }

    cameraPos.x += cameraDirection.x * delta * wheelSpeed;
    cameraPos.y += cameraDirection.y * delta * wheelSpeed;
    cameraPos.z += cameraDirection.z * delta * wheelSpeed;
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);

    /*var length = 10.0;
    var dir = new THREE.Vector3(0, 1, -2.5);
    cameraPos.x = dir.x * length;
    cameraPos.y = dir.y * length;
    cameraPos.z = dir.z * length;
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);*/

    /*console.log("x : " + cameraDirection.x);
    console.log("y : " + cameraDirection.y);
    console.log("z : " + cameraDirection.z);

    console.log("cam x : " + cameraPos.x);
    console.log("cam y : " + cameraPos.y);
    console.log("cam z : " + cameraPos.z);
	
    console.log("value : " + (cameraPos.y / cameraPos.z));*/

    temporaryCameraDirection = new THREE.Vector3(cameraLookAt.x - cameraPos.x, cameraLookAt.y - cameraPos.y, cameraLookAt.z - cameraPos.z);
    temporaryLength = temporaryCameraDirection.length();
    lengthRatio = temporaryLength / cameraLength;

    directionViewer.position.y = ((cameraPos.y + cameraLookAt.y) * 0.5) + 0.65 * lengthRatio;
    directionViewer.scale.set(lengthRatio, lengthRatio, lengthRatio);
}

function onDocumentKeyDown(event) {

}

function OnZoomInStart(event) {
    var touch0 = new THREE.Vector2(event.touches[0].clientX, event.touches[0].clientY);
    var touch1 = new THREE.Vector2(event.touches[1].clientX, event.touches[1].clientY);
    prevMultiTouchLength = touch0.distanceTo(touch1);
}

function OnZoomIn(event) {
    var touch0 = new THREE.Vector2(event.touches[0].clientX, event.touches[0].clientY);
    var touch1 = new THREE.Vector2(event.touches[1].clientX, event.touches[1].clientY);

    var length = touch0.distanceTo(touch1);

    if (prevMultiTouchLength != 0.0) {
        length -= prevMultiTouchLength;

        var tempDir = cameraDirection;
        tempPos.x = tempDir.x * length * 0.01;
        tempPos.y = tempDir.y * length * 0.01;
        tempPos.z = tempDir.z * length * 0.01;

        camera.position.set(cameraPos.x + tempPos.x, cameraPos.y + tempPos.y, cameraPos.z + tempPos.z);

        temporaryCameraDirection = new THREE.Vector3(cameraLookAt.x - (cameraPos.x + tempPos.x), cameraLookAt.y - (cameraPos.y + tempPos.y), cameraLookAt.z - (cameraPos.z + tempPos.z));
        temporaryLength = temporaryCameraDirection.length();
        lengthRatio = temporaryLength / cameraLength;

        directionViewer.position.y = (((cameraPos.y + tempPos.y) + cameraLookAt.y) * 0.5) + 0.65 * lengthRatio;
        directionViewer.scale.set(lengthRatio, lengthRatio, lengthRatio);
    }
}