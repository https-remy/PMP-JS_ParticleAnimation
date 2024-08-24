const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
	constructor(x, y, directionX, directionY, size, color) {
		this.x = x;
		this.y = y;
		this.directionX = directionX;
		this.directionY = directionY;
		this.size = size;
		this.color = color;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill(); 
	}

	update() {
		if (this.x > canvas.width || this.x < 0) {
			this.directionX = -this.directionX;
		} else if (this.y > canvas.height || this.y < 0) {
			this.directionY = -this.directionY;
		}

		this.x += this.directionX;
		this.y += this.directionY;

		this.draw();
	}
}

let particlesArray;

function init() {
	particlesArray = [];
	const numberOfParticles = (canvas.width * canvas.height) / 9000;

	for (let i = 0; i < numberOfParticles; i++) {
		const size = (Math.random() * 3) + 1;
		const x = (Math.random() * ((innerWidth - 10) - 10 + 1)) + 10;
		const y = (Math.random() * ((innerHeight - 10) - 10 + 1)) + 10;
		const directionX = cleanDirection();
		const directionY = cleanDirection();
		const color = 'white';

		particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
	}
}

function cleanDirection() {
	const random = Math.trunc(Math.random() * 2);
	if (random) {
		return (Math.random() * 0.5) + 0.1;
	} else {
		return (Math.random() * -0.5) - 0.1;
	}
}

init();

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	particlesArray.forEach(particle => {
		particle.update();
	});

	connectParticles();

	requestAnimationFrame(animate);
}

animate();

function connectParticles() {
	for (let i = 0; i < particlesArray.length; i++) {
		for (let j = i + 1; j < particlesArray.length; j++) {
			const sqrDistanceX = (particlesArray[i].x - particlesArray[j].x) ** 2;
			const sqrDistanceY = (particlesArray[i].y - particlesArray[j].y) ** 2;

			const hypothenuse = sqrDistanceX + sqrDistanceY;

			if (hypothenuse < 135 ** 2) {
				ctx.strokeStyle = `rgba(240, 240, 240, ${1 - hypothenuse / 135 ** 2})`;
				ctx.lineWidth = 0.5;
				ctx.beginPath();
				ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
				ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
				ctx.stroke();
			}
		}
	}
}

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	init();
});
