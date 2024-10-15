/* Mouse Event */
function onDocumentMouseDown(event) {
    /*var infoDiv = document.getElementById("_7");
    infoDiv.style.pointerEvents = "none";*/
    event.preventDefault();
    OnInputStart(event.clientX, event.clientY)
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    OnInputMove(event.clientX, event.clientY)
}

function onDocumentMouseUp(event) {
    /*var infoDiv = document.getElementById("_7");
    infoDiv.style.pointerEvents = "auto";*/
    OnInputEnd(event)
}

function onDocumentDoubleClick(event) {}

function onDocumentMouseOut(event) {}

function onDocumentMouseWheel(event) {
    OnInputScroll(event)
}