(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  document.getElementById('current-year').textContent = new Date().getFullYear();

  const updateScrollUI = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = `${value}%`;
    header.classList.toggle('is-scrolled', scrollTop > 18);

    const activeSection = sections
      .filter(section => section.getBoundingClientRect().top <= 130)
      .pop();

    navLinks.forEach(link => {
      const target = link.getAttribute('href');
      link.classList.toggle('active', activeSection && target === `#${activeSection.id}`);
    });
  };

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  document.addEventListener('click', event => {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.querySelectorAll('.reveal').forEach(element => {
    const delay = element.dataset.delay || '0';
    element.style.setProperty('--delay', `${delay}ms`);
  });

  if (!reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px' });

    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
  }

  const phone = document.getElementById('phone-tilt');
  const heroVisual = document.querySelector('.hero-visual');

  if (phone && heroVisual && !reduceMotion) {
    heroVisual.addEventListener('mousemove', event => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      phone.style.transform = `rotateY(${(-10 + x * 12).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg) rotateZ(${(4 + x * 2).toFixed(2)}deg)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      phone.style.transform = 'rotateY(-10deg) rotateZ(4deg)';
    });
  }

  document.querySelectorAll('.heart').forEach(button => {
    button.addEventListener('click', () => {
      const liked = button.classList.toggle('is-liked');
      button.textContent = liked ? '♥' : '♡';
      button.setAttribute('aria-pressed', String(liked));
    });
  });

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = 'true';
      const target = Number(entry.target.dataset.target || 0);
      const duration = reduceMotion ? 1 : 900;
      const start = performance.now();

      const tick = now => {
        const progressValue = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progressValue, 3);
        entry.target.textContent = Math.floor(target * eased);
        if (progressValue < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: .6 });

  document.querySelectorAll('.counter').forEach(counter => counterObserver.observe(counter));

  document.querySelectorAll('.magnetic').forEach(button => {
    if (reduceMotion) return;
    button.addEventListener('mousemove', event => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * .06}px, ${y * .08 - 2}px)`;
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });

  document.querySelectorAll('.week-row button, .time-grid button').forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.parentElement;
      parent.querySelectorAll('button').forEach(item => item.classList.remove('selected'));
      button.classList.add('selected');
    });
  });
})();
