/* ==========================================================================
   PENELOPE-INSPIRED LUXURY CANDYCORE PORTFOLIO INTERACTIVITY ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. CANDY & SPRINKLE CANVAS PARTICLE SYSTEM
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('candy-canvas');
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  const particleCount = 45;

  const colors = [
    '#52D6B5', // Mint
    '#FF7597', // Pink
    '#9D84EC', // Lavender
    '#FF9B71', // Peach
    '#FFD166', // Yellow
    '#FFFFFF'  // White sparkle
  ];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class CandyParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 8 + 4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = -Math.random() * 0.5 - 0.2; // Float upwards
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.type = Math.floor(Math.random() * 3); // 0: Sprinkle pill, 1: Star/sparkle, 2: Dot
      this.opacity = Math.random() * 0.6 + 0.3;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      // Wrap around screen
      if (this.y < -20) {
        this.y = height + 20;
        this.x = Math.random() * width;
      }
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.type === 0) {
        // Sprinkle pill shape
        ctx.beginPath();
        ctx.roundRect(-this.size, -this.size / 3, this.size * 2, this.size / 1.5, this.size / 3);
        ctx.fill();
      } else if (this.type === 1) {
        // Star / Sparkle
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size, Math.sin((i * Math.PI) / 2) * this.size);
          ctx.lineTo(Math.cos(((i + 0.5) * Math.PI) / 2) * (this.size / 3), Math.sin(((i + 0.5) * Math.PI) / 2) * (this.size / 3));
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Soft glowing dot
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new CandyParticle());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();


  // --------------------------------------------------------------------------
  // 2. WEB AUDIO API SYNTH SOUND EFFECTS
  // --------------------------------------------------------------------------
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playCuteChime(freq = 523.25, type = 'sine') {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {
      console.warn("Audio context not allowed yet:", e);
    }
  }

  const soundBtn = document.getElementById('sound-toggle-btn');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.innerHTML = soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
    showToast(soundEnabled ? "Cute Sound Effects Enabled! 🎵" : "Sound Muted 🔇");
    if (soundEnabled) playCuteChime(659.25);
  });


  // --------------------------------------------------------------------------
  // 3. THEME TOGGLE (DARK / PASTEL LIGHT)
  // --------------------------------------------------------------------------
  const themeBtn = document.getElementById('theme-toggle-btn');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun" style="color: #FFD166;"></i>' : '<i class="fa-solid fa-moon"></i>';
    playCuteChime(isDark ? 783.99 : 440);
    showToast(isDark ? "Pastel Dark Mode Activated 🌙" : "Light Mode Activated ☀️");
  });


  // --------------------------------------------------------------------------
  // 4. MASCOT GUIDE INTERACTIVE WIDGET
  // --------------------------------------------------------------------------
  const mascotWidget = document.getElementById('mascot-widget');
  const mascotBubble = document.getElementById('mascot-bubble');
  const mascotAvatar = document.getElementById('mascot-avatar');

  const quotes = [
    "Hi there! Welcome to my sweet portfolio wonderland! 🍬",
    "Did you check out the featured projects below? They're super fresh! ✨",
    "Fun fact: I love pixel-perfect designs & glossy glassmorphism! 🎨",
    "Click the audio icon top-right for cute sound effects! 🎵",
    "Feel free to contact me for sweet collaborations! 🚀",
    "Stay creative & keep making amazing web experiences! 💖"
  ];

  let quoteIndex = 0;

  mascotAvatar.addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    mascotBubble.style.animation = 'none';
    mascotBubble.offsetHeight; // Trigger reflow
    mascotBubble.style.animation = 'float-bubble 3s ease-in-out infinite alternate';
    mascotBubble.textContent = quotes[quoteIndex];
    playCuteChime(880, 'triangle');
    triggerSprinkleConfetti(mascotWidget.getBoundingClientRect().left + 75, mascotWidget.getBoundingClientRect().top + 50);
  });


  // --------------------------------------------------------------------------
  // 5. BUTTON CONFETTI EXPLOSION EFFECT
  // --------------------------------------------------------------------------
  function triggerSprinkleConfetti(originX, originY) {
    for (let i = 0; i < 24; i++) {
      const p = new CandyParticle();
      p.x = originX || window.innerWidth / 2;
      p.y = originY || window.innerHeight / 2;
      p.speedX = (Math.random() - 0.5) * 8;
      p.speedY = (Math.random() - 0.5) * 8 - 3;
      p.opacity = 1;
      particles.push(p);
    }
  }

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      playCuteChime(587.33);
      triggerSprinkleConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });


  // --------------------------------------------------------------------------
  // 6. SKILLS FILTER & ANIMATED PROGRESS BARS
  // --------------------------------------------------------------------------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playCuteChime(493.88);

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Animate skill bars on scroll into view
  const observerOptions = { threshold: 0.2 };
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-bar-fill');
        if (fill) {
          fill.style.width = fill.getAttribute('data-progress');
        }
      }
    });
  }, observerOptions);

  skillCards.forEach(card => skillObserver.observe(card));


  // --------------------------------------------------------------------------
  // 7. PROJECT PREVIEW MODAL
  // --------------------------------------------------------------------------
  const modal = document.getElementById('project-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalDesc = document.getElementById('modal-desc');

  document.querySelectorAll('.open-project-modal').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      modalTitle.textContent = link.getAttribute('data-title');
      modalImg.src = link.getAttribute('data-img');
      modalDesc.textContent = link.getAttribute('data-desc');

      modal.style.display = 'block';
      modalOverlay.style.display = 'block';
      playCuteChime(698.46);
    });
  });

  function closeModal() {
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';
  }

  closeModalBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);


  // --------------------------------------------------------------------------
  // 8. CONTACT FORM SUBMISSION & TOAST SYSTEM
  // --------------------------------------------------------------------------
const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm(
        "service_umxs5ba",
        "template_quvf0bq",
        this,
        "cwG690Vs914ebRMo6"
    )
    .then(() => {
        playCuteChime(880);
        triggerSprinkleConfetti(window.innerWidth / 2, window.innerHeight / 2);
        showToast("✨ Thank you! Your message has been sent successfully!");
        contactForm.reset();
    })
    .catch((error) => {
        console.error(error);
        showToast("❌ Failed to send message.");
    });
});

  function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-sparkles" style="color: var(--pink-primary);"></i> ${msg}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
emailjs.init({
    publicKey: "cwG690Vs914ebRMo6",
});

  // --------------------------------------------------------------------------
  // 9. ACTIVE NAV LINK OBSERVER
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 180;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

});
