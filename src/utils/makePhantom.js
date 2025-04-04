export function makePhantom(event, el, onDrop) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let clonedElement = null;

  return startDrag(event);

  function startDrag(e) {
    // Prevent default to stop text selection, etc.
    e.preventDefault();

    isDragging = true;

    const bbox = el.getBoundingClientRect();
    // Calculate the offset between the cursor and the target element's top-left corner
    offsetX = e.clientX - bbox.left;
    offsetY = e.clientY - bbox.top;

    // Clone the element and style it
    clonedElement = el.cloneNode(true);

    clonedElement.style.width = `${bbox.width}px`;

    clonedElement.style.zIndex = "10000";
    clonedElement.style.position = "absolute";
    clonedElement.style.pointerEvents = "none"; // Make it non-interactive
    document.body.appendChild(clonedElement);

    // Update its initial position
    updateElementPosition(e);

    // Listen for mousemove and mouseup events
    document.addEventListener("mousemove", updateElementPosition);
    document.addEventListener("mouseup", stopDrag);

    return clonedElement;
  }

  function updateElementPosition(e) {
    if (!isDragging || !clonedElement) return;

    clonedElement.style.left = e.clientX - offsetX + "px";
    clonedElement.style.top = e.clientY - offsetY + "px";
  }

  function stopDrag(e) {
    onDrop(e);
    isDragging = false;

    if (clonedElement) {
      document.body.removeChild(clonedElement);
      clonedElement = null;
    }

    document.removeEventListener("mousemove", updateElementPosition);
    document.removeEventListener("mouseup", stopDrag);
  }
}
