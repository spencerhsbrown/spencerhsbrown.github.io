document.addEventListener('DOMContentLoaded', function() {
    const cursorBall = document.getElementById('cursor-ball');
    const centeredText = document.getElementById('centered-text');

    // Constants for physics simulation
    const friction = 0.1;
    const spring = 0.05;

    // Initial position of the ball
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    // Initial velocity
    let vx = 0;
    let vy = 0;

    // Initial mouse coordinates
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    function updateBallPosition() {
        // Calculate the force towards the cursor position
        const targetX = mouseX;
        const targetY = mouseY;

        const forceX = (targetX - x) * spring;
        const forceY = (targetY - y) * spring;

        // Apply the force to the velocity
        vx += forceX;
        vy += forceY;

        // Apply friction to slow down the velocity
        vx *= 1 - friction;
        vy *= 1 - friction;

        // Update the position
        x += vx;
        y += vy;

        // Update the ball position
        cursorBall.style.left = `${x}px`;
        cursorBall.style.top = `${y}px`;

        // Update centered text based on cursor position
        const offsetX = x - targetX;
        const offsetY = y - targetY;
        console.log(`Offset from cursor: (${offsetX.toFixed(2)}, ${offsetY.toFixed(2)})`);

        // Request the next animation frame
        requestAnimationFrame(updateBallPosition);
    }

    // Function to update mouse coordinates
    function updateMousePosition(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    // Event listener to update mouse coordinates on mouse move
    document.addEventListener('mousemove', updateMousePosition);

    // Initial call to start the animation loop
    updateBallPosition();
});