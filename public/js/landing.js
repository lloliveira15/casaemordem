(function() {
  'use strict';

  // Navbar scroll
  const nav = document.getElementById('landingNav');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function() {
    navLinks.classList.toggle('open');
    const icon = navToggle.querySelector('i');
    icon.className = navLinks.classList.contains('open') ? 'ph ph-x' : 'ph ph-list';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      navLinks.classList.remove('open');
      navToggle.querySelector('i').className = 'ph ph-list';
    });
  });

  // Animated counter
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    if (!target) return;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (target === 98) {
        element.textContent = current + '%';
      } else {
        element.textContent = current.toLocaleString('pt-BR') + (target === 500 ? '+' : '+');
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Intersection Observer for stats
  const statsSection = document.querySelector('.stats');
  let statsAnimated = false;

  if (statsSection) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          document.querySelectorAll('.stat-number').forEach(function(el) {
            animateCounter(el);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }

  // Carousel
  let currentSlide = 0;
  const carousel = document.getElementById('testimonialsCarousel');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (carousel && dotsContainer) {
    const cards = carousel.querySelectorAll('.testimonial-card');
    const totalSlides = Math.max(1, cards.length - 1);

    // Create dots
    for (let i = 0; i <= totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function() { goToSlide(i); });
      dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
      currentSlide = Math.max(0, Math.min(index, totalSlides));
      const offset = -(currentSlide * (100 / 2));
      if (window.innerWidth <= 768) {
        carousel.style.transform = 'translateX(' + (-currentSlide * 100) + '%)';
      } else {
        carousel.style.transform = 'translateX(' + offset + '%)';
      }
      carousel.style.transition = 'transform 0.3s ease';

      document.querySelectorAll('.carousel-dot').forEach(function(d, i) {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { goToSlide(currentSlide - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goToSlide(currentSlide + 1); });

    // Handle resize
    window.addEventListener('resize', function() {
      goToSlide(currentSlide);
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
      }
    }, { passive: true });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
