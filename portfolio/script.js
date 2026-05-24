// Particle background
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0, mouseY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 200) {
      this.x -= dx * 0.002;
      this.y -= dy * 0.002;
    }
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 212, 255, ' + this.opacity + ')';
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor(canvas.width * 0.04), 80);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
initParticles();

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = 'rgba(0, 212, 255, ' + (0.08 * (1 - dist / 180)) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(function(p) {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Navbar
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', function() {
  const current = window.scrollY;
  navbar.classList.toggle('scrolled', current > 50);
  if (current > lastScroll && current > 100) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScroll = current;
});

// Burger menu
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', function() {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(function(link) {
  link.addEventListener('click', function() { navLinks.classList.remove('open'); });
});

// Typewriter
(function() {
  const el = document.querySelector('.typewrite');
  if (!el) return;
  var words = ["3D Artist", "Low Poly Artist", "Mid Poly Artist"];
  var wordIndex = 0;
  var charIndex = 0;
  var isDeleting = false;

  function type() {
    var currentWord = words[wordIndex];
    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex--);
    } else {
      el.textContent = currentWord.substring(0, charIndex++);
    }

    if (!isDeleting && charIndex > currentWord.length) {
      isDeleting = true;
      setTimeout(type, 1500);
      return;
    }
    if (isDeleting && charIndex < 0) {
      isDeleting = false;
      charIndex = 0;
      wordIndex = (wordIndex + 1) % words.length;
    }
    setTimeout(type, isDeleting ? 40 : 100);
  }
  type();
})();

// Stats counter
function animateCounter(el) {
  var target = parseInt(el.getAttribute('data-target'), 10);
  var duration = 1500;
  var start = performance.now();
  function update(now) {
    var elapsed = now - start;
    var progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

var statsObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.num').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

var statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);

// Scroll reveal
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(function(el) {
  revealObserver.observe(el);
});

// 3D tilt on gallery
document.querySelectorAll('[data-tilt]').forEach(function(item) {
  item.addEventListener('mousemove', function(e) {
    var rect = item.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var centerX = rect.width / 2;
    var centerY = rect.height / 2;
    var rotateY = ((x - centerX) / centerX) * 8;
    var rotateX = ((centerY - y) / centerY) * 8;
    item.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02,1.02,1.02)';
  });
  item.addEventListener('mouseleave', function() {
    item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('.gallery-item').forEach(function(item) {
  item.addEventListener('click', function() {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightbox.classList.add('active');
  });
});
lightbox.addEventListener('click', function(e) {
  if (e.target === lightbox || e.target.classList.contains('close')) {
    lightbox.classList.remove('active');
  }
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') lightbox.classList.remove('active');
});
