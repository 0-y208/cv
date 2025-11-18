// Digital Canvas — app interactions (vanilla JS, no external libs)
// Added: social-links open in new tab behavior (safety), profile image lazy load handled by existing lazy loader

(() => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Reuse previous helpers and functionality (cursor, typing, parallax, gallery, lazy-loading, theme toggle, CTA ripple)
  // ... existing code follows (kept from previous implementation) ...

  // ---------- minimal extract of previous app code for clarity (cursor, typing, lazy load, gallery, theme toggle, CTA ripple) ----------
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (isTouch) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  } else {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    const lerp = (a,b,t) => a + (b-a)*t;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });

    function animateRing(){
      ringX = lerp(ringX, mouseX, 0.14);
      ringY = lerp(ringY, mouseY, 0.14);
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    window.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.width = ripple.style.height = '12px';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(0,246,255,0.14)';
      ripple.style.transform = 'translate(-50%,-50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = 9998;
      ripple.style.transition = 'all 700ms cubic-bezier(.2,.9,.25,1)';
      document.body.appendChild(ripple);
      requestAnimationFrame(()=> {
        ripple.style.width = ripple.style.height = '260px';
        ripple.style.opacity = '0';
      });
      setTimeout(()=> ripple.remove(), 800);
    });
  }

  // Typing effect
  const phrases = [
    'Interactive gallery.', 'Minimal systems.', 'Motion that matters.', 'Performance-first design.'
  ];
  const typeEl = $('#typewriter');
  let tIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = phrases[tIndex];
    if (!deleting) {
      charIndex++;
      typeEl.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        deleting = true;
        setTimeout(tick, 1200);
        return;
      }
    } else {
      charIndex--;
      typeEl.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        tIndex = (tIndex + 1) % phrases.length;
      }
    }
    const delay = deleting ? 40 + Math.random()*40 : 80 + Math.random()*60;
    setTimeout(tick, delay);
  }
  tick();

  // Parallax hero
  const heroBg = $('#heroBg');
  if (heroBg) {
    window.addEventListener('mousemove', (e) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      heroBg.style.transform = `translate(${cx * 8}px, ${cy * 8}px) scale(1.02)`;
    });
  }

  // Section overlay transition
  const navLinks = $$('.nav-links a');
  let isTransitioning = false;

  function animateToSection(id){
    const target = document.getElementById(id);
    if (!target || isTransitioning) return;
    isTransitioning = true;

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = 0;
    overlay.style.background = 'linear-gradient(90deg, rgba(0,0,0,0.9), rgba(0,0,0,0.98))';
    overlay.style.zIndex = 9997;
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = 'opacity .42s ease';
    document.body.appendChild(overlay);

    requestAnimationFrame(()=> overlay.style.opacity = '1');

    setTimeout(() => {
      target.scrollIntoView({behavior:'instant', block:'center'});
      overlay.style.opacity = '0';
      setTimeout(()=> {
        overlay.remove();
        isTransitioning = false;
      }, 420);
    }, 420);
  }

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('data-target') || a.getAttribute('href').replace('#','');
      animateToSection(id);
    });
  });

  // Gallery drag (kept same)
  const gallery = $('#gallery');
  if(gallery){
    let isDown = false, startX, scrollLeft, lastTime, velocity = 0;
    gallery.addEventListener('mousedown', (e) => {
      isDown = true;
      gallery.classList.add('dragging');
      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
      lastTime = Date.now();
      velocity = 0;
      e.preventDefault();
    });
    gallery.addEventListener('mouseleave', () => isDown = false);
    gallery.addEventListener('mouseup', () => {
      isDown = false;
      gallery.classList.remove('dragging');
      momentum();
    });
    gallery.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      const x = e.pageX - gallery.offsetLeft;
      const walk = (x - startX) * 1.4;
      const now = Date.now();
      velocity = (walk - (gallery._lastWalk || 0)) / Math.max(1, now - lastTime);
      lastTime = now;
      gallery._lastWalk = walk;
      gallery.scrollLeft = scrollLeft - walk;
    });

    // touch
    gallery.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
    });
    gallery.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - gallery.offsetLeft;
      const walk = (x - startX) * 1.4;
      gallery.scrollLeft = scrollLeft - walk;
    });

    function momentum(){
      let v = velocity * 30;
      const decel = 0.95;
      function step(){
        if(Math.abs(v) < 0.5) return;
        gallery.scrollLeft -= v;
        v *= decel;
        requestAnimationFrame(step);
      }
      step();
    }

    $('#prev')?.addEventListener('click', () => {
      gallery.scrollBy({left:-360, behavior:'smooth'});
    });
    $('#next')?.addEventListener('click', () => {
      gallery.scrollBy({left:360, behavior:'smooth'});
    });

    gallery.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowRight') gallery.scrollBy({left:360, behavior:'smooth'});
      if(e.key === 'ArrowLeft') gallery.scrollBy({left:-360, behavior:'smooth'});
    });
  }

  // Lazy loading (includes profile and project images)
  const lazyImages = Array.from(document.querySelectorAll('img.lazy'));
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const img = entry.target;
          const wrapper = img.closest('.img-wrap');
          const src = img.getAttribute('data-src');
          if(src){
            img.src = src;
            img.onload = () => {
              if(wrapper) wrapper.classList.add('loaded');
            };
            img.removeAttribute('data-src');
          }
          io.unobserve(img);
        }
      });
    }, {rootMargin:'200px 0px', threshold:0.01});
    lazyImages.forEach(img => io.observe(img));
  } else {
    lazyImages.forEach(img => {
      const src = img.getAttribute('data-src');
      if(src) img.src = src;
      const wrapper = img.closest('.img-wrap');
      img.onload = () => wrapper && wrapper.classList.add('loaded');
    });
  }

  // Theme toggle
  $('#themeToggle')?.addEventListener('click', () => {
    const doc = document.documentElement;
    const current = doc.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    doc.setAttribute('data-theme', next);
    $('#themeToggle').setAttribute('aria-pressed', String(next === 'light'));
    $('#themeToggle').animate([{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}], {duration:520, easing:'cubic-bezier(.2,.9,.25,1)'});
  });

  // CTA ripple
  $$('.btn.primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = ripple.style.height = '8px';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%,-50%)';
      ripple.style.background = 'rgba(255,255,255,0.14)';
      ripple.style.pointerEvents = 'none';
      ripple.style.transition = 'all 520ms cubic-bezier(.2,.9,.25,1)';
      ripple.style.zIndex = 20;
      btn.style.position = 'relative';
      btn.appendChild(ripple);
      requestAnimationFrame(()=> {
        ripple.style.width = '320px';
        ripple.style.height = '320px';
        ripple.style.opacity = '0';
      });
      setTimeout(()=> ripple.remove(), 560);
    });
  });

  // Contact form submit micro-feedback
  const contactForm = $('#contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submit = contactForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Sending...';
    setTimeout(()=> {
      submit.textContent = 'Sent ✓';
      submit.style.background = 'linear-gradient(90deg,var(--accent), #00d0ff)';
      setTimeout(()=> {
        submit.disabled = false;
        submit.textContent = 'Send message';
      }, 1800);
    }, 900);
  });

  // Safety: ensure social links with target _blank have rel noopener (they already do in markup)
  const socialAnchors = Array.from(document.querySelectorAll('a[target="_blank"]'));
  socialAnchors.forEach(a => {
    if(!a.getAttribute('rel')?.includes('noopener')) {
      a.setAttribute('rel', (a.getAttribute('rel') || '') + ' noopener');
    }
  });

  // preconnect hint (performance)
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://images.unsplash.com';
  document.head.appendChild(link);

})();