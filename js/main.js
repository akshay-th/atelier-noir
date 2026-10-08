/* ============================================================
   ATELIER NOIR — main.js
   GSAP + ScrollTrigger (cdnjs) + Lenis (jsdelivr). No build step.
   Every motion effect is gated behind motionOK + library checks;
   the page is fully readable with none of it.
   ============================================================ */

(function () {
  'use strict';

  var doc = document.documentElement;

  /* ---------- Local-time clock (runs regardless of motion) ---------- */

  var clockEl = document.getElementById('clock');

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function tick() {
    if (!clockEl) return;
    var d = new Date();
    clockEl.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  tick();
  window.setInterval(tick, 1000);

  /* ---------- Capability gates ---------- */

  var motionOK = true;
  try {
    motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    motionOK = true;
  }

  var hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  var preloader = document.getElementById('preloader');

  function removePreloader() {
    if (preloader && preloader.parentNode) {
      preloader.parentNode.removeChild(preloader);
      preloader = null;
    }
  }

  if (!hasGSAP || !motionOK) {
    // Static mode: no hidden states were ever applied (html.anim absent).
    removePreloader();
    return;
  }

  /* ---------- Animated mode ---------- */

  doc.classList.add('anim');

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  // Safety net: whatever happens below, never trap the user behind the preloader.
  window.setTimeout(removePreloader, 5000);

  /* ---------- Lenis smooth scroll ---------- */

  var lenis = null;
  if (typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ lerp: 0.11 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Text splitting ---------- */

  function splitChars(el) {
    var text = el.textContent;
    el.textContent = '';
    var frag = document.createDocumentFragment();
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'char';
      span.textContent = text.charAt(i);
      frag.appendChild(span);
    }
    el.appendChild(frag);
  }

  function splitWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    var frag = document.createDocumentFragment();
    for (var i = 0; i < words.length; i++) {
      var span = document.createElement('span');
      span.className = 'word';
      span.textContent = words[i];
      frag.appendChild(span);
      if (i < words.length - 1) {
        frag.appendChild(document.createTextNode(' '));
      }
    }
    el.appendChild(frag);
  }

  var splitEls = document.querySelectorAll('[data-split]');
  for (var s = 0; s < splitEls.length; s++) splitChars(splitEls[s]);

  var manifestoText = document.getElementById('manifestoText');
  if (manifestoText) splitWords(manifestoText);

  /* ---------- Preloader -> hero entrance ---------- */

  var heroChars = gsap.utils.toArray('.hero__line .char');
  var strokeEl = document.querySelector('.split--stroke');

  gsap.set(heroChars, { yPercent: 115, rotation: 4 });

  var intro = gsap.timeline({ defaults: { ease: 'power4.out' } });

  if (preloader) {
    gsap.set('.preloader__letter', { yPercent: 120 });
    gsap.set(preloader, { clipPath: 'inset(0% 0% 0% 0%)' });

    intro
      .to('.preloader__letter', {
        yPercent: 0,
        duration: 0.85,
        stagger: 0.08
      }, 0.15)
      .to(preloader, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.85,
        ease: 'power4.inOut'
      }, '+=0.4')
      .add(removePreloader);
  }

  intro.to(heroChars, {
    yPercent: 0,
    rotation: 0,
    duration: 1.1,
    stagger: 0.045
  }, preloader ? '-=0.55' : 0.2);

  intro.add(function () {
    if (strokeEl) strokeEl.classList.add('is-filled');
  }, '-=0.4');

  /* ---------- Scroll-velocity bus: skew + marquee direction ---------- */

  var skewTargets = gsap.utils.toArray(['.hero__line', '.work']);
  var clampSkew = gsap.utils.clamp(-6, 6);
  var skewProxy = { skew: 0 };

  function applySkew() {
    for (var i = 0; i < skewTargets.length; i++) {
      gsap.set(skewTargets[i], { skewX: skewProxy.skew });
    }
  }

  var marqueeTween = gsap.to('#marqueeTrack', {
    xPercent: -50,
    ease: 'none',
    duration: 22,
    repeat: -1
  });

  // Park the infinite tween deep into its repeats so it can also play
  // backwards indefinitely (negative timeScale) without hitting time 0.
  marqueeTween.totalTime(marqueeTween.duration() * 5000);

  var marqueeDir = 1;

  ScrollTrigger.create({
    onUpdate: function (self) {
      var velocity = self.getVelocity();

      // Skew: only grab bigger impulses, then ease back to zero.
      var skew = clampSkew(velocity / -280);
      if (Math.abs(skew) > Math.abs(skewProxy.skew)) {
        skewProxy.skew = skew;
        gsap.to(skewProxy, {
          skew: 0,
          duration: 0.85,
          ease: 'power3.out',
          overwrite: true,
          onUpdate: applySkew
        });
      }

      // Marquee: direction follows scroll direction, speed follows |velocity|.
      if (Math.abs(velocity) > 1) {
        marqueeDir = velocity > 0 ? 1 : -1;
      }
      var boost = Math.min(Math.abs(velocity) / 350, 3);
      gsap.to(marqueeTween, {
        timeScale: marqueeDir * (1 + boost),
        duration: 0.45,
        ease: 'power2.out',
        overwrite: true
      });
    }
  });

  /* ---------- Section reveals ---------- */

  gsap.utils.toArray('.reveal').forEach(function (el) {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  /* ---------- Manifesto word-by-word scrub ---------- */

  if (manifestoText) {
    gsap.to('.manifesto__text .word', {
      opacity: 1,
      ease: 'none',
      stagger: 0.06,
      scrollTrigger: {
        trigger: '.manifesto',
        start: 'top 78%',
        end: 'center 42%',
        scrub: true
      }
    });
  }

  /* ---------- Works: cursor-following preview panel ---------- */

  var hoverOK = false;
  try {
    hoverOK = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  } catch (e) {
    hoverOK = false;
  }

  var preview = document.getElementById('preview');
  var worksList = document.querySelector('.works__list');

  if (hoverOK && preview && worksList) {
    gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.85, autoAlpha: 0 });

    var xTo = gsap.quickTo(preview, 'x', { duration: 0.55, ease: 'expo.out' });
    var yTo = gsap.quickTo(preview, 'y', { duration: 0.55, ease: 'expo.out' });
    var placed = false;

    var panels = {};
    var panelEls = preview.querySelectorAll('[data-art-panel]');
    for (var p = 0; p < panelEls.length; p++) {
      panels[panelEls[p].getAttribute('data-art-panel')] = panelEls[p];
    }

    function setArt(name) {
      for (var key in panels) {
        if (Object.prototype.hasOwnProperty.call(panels, key)) {
          panels[key].classList.toggle('is-active', key === name);
        }
      }
    }

    worksList.addEventListener('mousemove', function (e) {
      if (!placed) {
        // First contact: jump straight to the cursor, no fly-in from a corner.
        gsap.set(preview, { x: e.clientX, y: e.clientY });
        placed = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    });

    var rows = worksList.querySelectorAll('.work');
    for (var r = 0; r < rows.length; r++) {
      (function (row) {
        row.addEventListener('mouseenter', function () {
          setArt(row.getAttribute('data-art'));
          gsap.to(preview, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.45,
            ease: 'expo.out',
            overwrite: 'auto'
          });
        });
      })(rows[r]);
    }

    worksList.addEventListener('mouseleave', function () {
      gsap.to(preview, {
        autoAlpha: 0,
        scale: 0.85,
        duration: 0.35,
        ease: 'expo.out',
        overwrite: 'auto'
      });
    });
  }

  /* ---------- Keep triggers honest once webfonts land ---------- */

  if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
    document.fonts.ready.then(function () {
      ScrollTrigger.refresh();
    });
  }
})();
