(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
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

  // contadores: o HTML já traz o valor final (nunca fica em 0); a contagem é só enfeite
  if (!reduceMotion) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target.dataset.done) return;
        entry.target.dataset.done = 'true';
        const target = Number(entry.target.dataset.target || 0);
        const duration = 900;
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
  }

  // "Cadastrar grátis": escolher aluno ou personal antes de ir para o cadastro
  const abrirCadastro = document.getElementById('abrir-cadastro-escolha');
  const menuCadastro = document.getElementById('cadastro-menu');
  if (abrirCadastro && menuCadastro) {
    abrirCadastro.addEventListener('click', () => {
      const aberto = !menuCadastro.hidden;
      menuCadastro.hidden = aberto;
      abrirCadastro.setAttribute('aria-expanded', String(!aberto));
    });
    document.addEventListener('click', event => {
      if (!menuCadastro.hidden && !event.target.closest('.cadastro-escolha')) {
        menuCadastro.hidden = true;
        abrirCadastro.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menuCadastro.hidden) {
        menuCadastro.hidden = true;
        abrirCadastro.setAttribute('aria-expanded', 'false');
        abrirCadastro.focus();
      }
    });
  }

  // menu de navegação no celular (hambúrguer): a .main-nav some <=960px e este assume
  const abrirMenuCelular = document.getElementById('abrir-menu-celular');
  const menuCelular = document.getElementById('menu-celular');
  if (abrirMenuCelular && menuCelular) {
    const definirMenu = aberto => {
      menuCelular.hidden = !aberto;
      abrirMenuCelular.setAttribute('aria-expanded', String(aberto));
      abrirMenuCelular.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
      header.classList.toggle('menu-aberto', aberto);
    };
    abrirMenuCelular.addEventListener('click', () => definirMenu(menuCelular.hidden));
    menuCelular.addEventListener('click', event => {
      if (event.target.closest('a')) definirMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menuCelular.hidden) {
        definirMenu(false);
        abrirMenuCelular.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!menuCelular.hidden && !event.target.closest('.site-header')) definirMenu(false);
    });
  }

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

/* Abertura curta (até 3s): frase 1 (~1,2s) → morph → frase 2 (~1s) → fade para a landing.
   Pula automaticamente para quem prefere menos movimento ou já viu nesta sessão. */
(() => {
  const abertura = document.getElementById('intro-abertura');
  if (!abertura) return;

  const frase1 = document.getElementById('intro-frase-1');
  const frase2 = document.getElementById('intro-frase-2');
  const botaoPular = document.getElementById('intro-pular');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const jaViu = sessionStorage.getItem('personalaqui-intro') === 'vista';

  let encerrada = false;
  const encerrar = (imediato = false, comViagem = false) => {
    if (encerrada) return;
    encerrada = true;
    sessionStorage.setItem('personalaqui-intro', 'vista');
    abertura.setAttribute('aria-hidden', 'true');

    if (imediato) {
      document.body.classList.remove('intro-ativa');
      abertura.remove();
      return;
    }

    if (comViagem) {
      // transporte: frase voa, portal abre, hero aterrissa
      abertura.classList.add('viajando');
      setTimeout(() => {
        document.body.classList.remove('intro-ativa');
        document.body.classList.add('chegando');
        abertura.classList.add('saindo');
        setTimeout(() => {
          abertura.remove();
          document.body.classList.remove('chegando');
        }, 900);
      }, 560);
      return;
    }

    document.body.classList.remove('intro-ativa');
    abertura.classList.add('saindo');
    setTimeout(() => abertura.remove(), 750);
  };

  if (jaViu || reduceMotion) {
    encerrar(true);
    return;
  }

  document.body.classList.add('intro-ativa');
  botaoPular.addEventListener('click', () => encerrar());

  // cena 1: frase 1 entra suave e segura ~1,2s; morph rápido para a cena 2
  frase1.style.opacity = '0';
  requestAnimationFrame(() => {
    frase1.style.transition = 'opacity .35s ease';
    frase1.style.opacity = '1';
  });

  const DURACAO_MORPH = 380;
  const PAUSA_FRASE_1 = 1200;
  const PAUSA_FRASE_2 = 1000;

  setTimeout(() => {
    frase1.style.transition = '';
    const inicio = performance.now();

    const morph = (agora) => {
      if (encerrada) return;
      const fracao = Math.min((agora - inicio) / DURACAO_MORPH, 1);
      frase2.style.filter = `blur(${Math.min(8 / Math.max(fracao, 0.001) - 8, 100)}px)`;
      frase2.style.opacity = `${Math.pow(fracao, 0.4) * 100}%`;
      const inversa = 1 - fracao;
      frase1.style.filter = `blur(${Math.min(8 / Math.max(inversa, 0.001) - 8, 100)}px)`;
      frase1.style.opacity = `${Math.pow(inversa, 0.4) * 100}%`;

      if (fracao < 1) {
        requestAnimationFrame(morph);
      } else {
        frase1.style.opacity = '0';
        frase2.style.filter = '';
        frase2.style.opacity = '1';
        // cena 2: segura a frase final ~1s e sai em fade suave para a landing
        setTimeout(() => encerrar(false, false), PAUSA_FRASE_2);
      }
    };
    requestAnimationFrame(morph);
  }, PAUSA_FRASE_1);
})();

// Dúvidas: só uma resposta aberta por vez
document.querySelectorAll('.faq-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    item.parentElement.querySelectorAll('details[open]').forEach((outra) => {
      if (outra !== item) outra.open = false;
    });
  });
});
