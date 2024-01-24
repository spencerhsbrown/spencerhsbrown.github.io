const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
const particles = [];
let frameCount = 0;

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.03;
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

// Create particles at regular intervals
function createParticles(x, y) {
    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(x, y));
    }
}

// Track mouse position
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Update mouse position on mousemove
window.addEventListener('mousemove', (e) => {
    mouseX = e.x;
    mouseY = e.y;
});

//rezises the canvas if the window has been resized
window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frameCount++;

    if (frameCount % 5 === 0) {
        // Create particles every 60 frames (adjust as needed)
        createParticles(mouseX, mouseY);
    }

    for (let i = 0; i < particles.length; i++) {
        // Update particle position based on mouse position
        particles[i].update(mouseX, mouseY);
        particles[i].draw();

        if (particles[i].size <= 0.2) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}

animate();