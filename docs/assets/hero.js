'use strict';

// Story: a reader's eye trips through text set in the wrong paragraph direction.
// RTRTL sets the direction, every word moves to its place and the eye reads straight through.
// The paragraphs stay native text in logical Unicode order; only `dir` changes.
const NS = 'http://www.w3.org/2000/svg';
let demoCount = 0;

for (const demo of document.querySelectorAll('[data-rtl-demo]')) {
  const paper = demo.querySelector('.rtl-motion-paper');
  const page = demo.querySelector('.rtl-motion-page');
  const state = demo.querySelector('.rtl-state');
  const count = demo.querySelector('.rtl-count');
  const tally = count.querySelector('b');
  const tail = count.querySelector('.rtl-count-tail');
  const pause = demo.querySelector('.rtl-pause');
  const replay = demo.querySelector('.rtl-replay');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const glowId = `rtl-glow-${++demoCount}`;
  const docs = {[page.lang]: page.innerHTML};
  for (const template of demo.querySelectorAll('template[data-lang]')) docs[template.dataset.lang] = template.innerHTML;
  // Every label variant shares one grid cell, so the card keeps the size of the longest one.
  const labels = Object.fromEntries(['broken', 'fixing', 'fixed'].map(key => {
    const label = document.createElement('span');
    label.textContent = state.dataset[key];
    return [key, label];
  }));
  state.replaceChildren(...Object.values(labels));
  labels.fixed.classList.add('is-on');
  tail.textContent = tail.dataset.tail;
  const sweep = document.createElement('span');
  sweep.className = 'rtl-sweep';
  paper.append(sweep);

  let run = 0;
  let svg;
  let segments = [];
  let eye = [];
  let pausedAt = null;
  let offset = 0;
  let started = false;
  let observer;

  // A pausable clock drives every frame loop and wait.
  const clock = () => (pausedAt ?? performance.now()) - offset;
  const live = id => id === run;
  const frames = (ms, draw, id) => new Promise(resolve => {
    const start = clock();
    const step = () => {
      if (!live(id)) return resolve(false);
      const t = ms ? Math.min(1, (clock() - start) / ms) : 1;
      draw?.(t);
      if (t < 1) requestAnimationFrame(step); else resolve(true);
    };
    requestAnimationFrame(step);
  });
  const wait = (ms, id) => frames(ms, null, id);
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const rows = () => [...page.querySelectorAll('p')];
  const words = () => rows().map(row => [...row.querySelectorAll('.w')]);
  function setDirection(broken) {
    page.classList.toggle('is-broken', broken);
    for (const row of rows()) row.dir = broken ? 'ltr' : 'rtl';
  }
  function points() {
    const base = paper.getBoundingClientRect();
    return words().map(line => line.map(word => {
      const box = word.getBoundingClientRect();
      return {x: box.left + box.width / 2 - base.left, y: box.bottom - base.top + 2, code: word.closest('bdi')};
    }));
  }
  // Reading moves right to left between words and left to right inside one Latin code.
  function judge(a, b) {
    const island = Boolean(a.code) && a.code === b.code;
    const dx = b.x - a.x;
    return {island, wrong: island ? dx < -1 : dx > 1};
  }
  function arc(a, b, wrong) {
    const lift = Math.min(wrong ? 26 : 16, 6 + Math.abs(b.x - a.x) * (wrong ? .16 : .09));
    return `M${a.x} ${a.y} Q${(a.x + b.x) / 2} ${a.y + lift} ${b.x} ${b.y}`;
  }
  function buildPath() {
    svg?.remove();
    svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'rtl-path');
    svg.setAttribute('aria-hidden', 'true');
    const defs = document.createElementNS(NS, 'defs');
    const filter = document.createElementNS(NS, 'filter');
    filter.id = glowId;
    for (const [name, value] of [['x', '-200%'], ['y', '-200%'], ['width', '500%'], ['height', '500%']]) filter.setAttribute(name, value);
    const blur = document.createElementNS(NS, 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '4');
    filter.append(blur);
    defs.append(filter);
    svg.append(defs);
    segments = words().map(line => line.slice(1).map(() => {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('class', 'seg');
      path.style.opacity = '0';
      svg.append(path);
      return path;
    }));
    eye = [['halo', 11], ['eye', 4.5]].map(([name, radius]) => {
      const circle = document.createElementNS(NS, 'circle');
      circle.setAttribute('class', name);
      circle.setAttribute('r', radius);
      circle.style.opacity = '0';
      svg.append(circle);
      return circle;
    });
    eye[0].setAttribute('filter', `url(#${glowId})`);
    paper.append(svg);
  }
  // Redraws the thread from the words' live positions and returns the backward jumps.
  function update(pts) {
    let wrong = 0;
    pts.forEach((line, li) => line.slice(1).forEach((b, i) => {
      const a = line[i];
      const verdict = judge(a, b);
      const path = segments[li][i];
      if (verdict.wrong) wrong++;
      path.setAttribute('d', arc(a, b, verdict.wrong));
      path.setAttribute('class', `seg ${verdict.wrong ? 'back' : verdict.island ? 'isl' : 'fwd'}`);
    }));
    return wrong;
  }
  function setTally(n, pop) {
    if (tally.textContent !== String(n)) {
      tally.textContent = n;
      if (pop) tally.animate([{transform: 'scale(1.7)'}, {transform: 'none'}], {duration: 300, easing: 'ease-out'});
    }
    count.classList.toggle('is-zero', n === 0);
  }
  function moveEye(x, y) {
    for (const circle of eye) {
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.style.opacity = '1';
    }
  }
  function flash(x, y) {
    const ring = document.createElementNS(NS, 'circle');
    ring.setAttribute('class', 'flash');
    ring.setAttribute('cx', x);
    ring.setAttribute('cy', y);
    svg.append(ring);
    ring.animate([{r: 3, opacity: 1}, {r: 18, opacity: 0}], {duration: 520, easing: 'ease-out'}).finished.then(() => ring.remove(), () => ring.remove());
  }
  function setState(key, ok) {
    for (const [name, label] of Object.entries(labels)) label.classList.toggle('is-on', name === key);
    state.classList.toggle('is-ok', ok);
  }

  // The eye reads each line in logical order and draws the thread behind it.
  async function read(id, stumble) {
    let backtracks = 0;
    const pts = points();
    update(pts);
    const lines = rows();
    for (const [li, line] of pts.entries()) {
      moveEye(line[0].x, line[0].y);
      if (!stumble && line[0].code) line[0].code.classList.add('is-lit');
      if (!await wait(li ? 120 : 220, id)) return false;
      for (let i = 1; i < line.length; i++) {
        const path = segments[li][i - 1];
        const length = path.getTotalLength();
        const wrong = path.classList.contains('back');
        path.style.opacity = '1';
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        const ok = await frames(wrong && stumble ? 300 : stumble ? 190 : 150, t => {
          const point = path.getPointAtLength(length * ease(t));
          moveEye(point.x, point.y);
          path.style.strokeDashoffset = length * (1 - ease(t));
        }, id);
        if (!ok) return false;
        path.style.strokeDasharray = '';
        path.style.strokeDashoffset = '';
        // On the clean read, each Latin code lights up as the eye enters it.
        if (!stumble && line[i].code) line[i].code.classList.add('is-lit');
        if (wrong && stumble) {
          flash(line[i].x, line[i].y);
          setTally(++backtracks, true);
          lines[li].animate([{transform: 'none'}, {transform: 'translateX(-3px)'}, {transform: 'translateX(3px)'}, {transform: 'none'}], {duration: 220});
          if (!await wait(140, id)) return false;
        }
      }
    }
    for (const circle of eye) circle.animate([{opacity: 1}, {opacity: 0}], {duration: 300, fill: 'forwards'});
    return true;
  }

  // A right-to-left wave: each word lifts as it passes and lands in place while the thread pulls straight.
  async function untangle(id) {
    const from = words().flat().map(word => word.getBoundingClientRect());
    setDirection(false);
    const to = words().flat();
    const base = paper.getBoundingClientRect();
    const width = paper.clientWidth;
    setState('fixing', false);
    sweep.animate([{left: '100%', opacity: 0}, {opacity: 1, offset: .15}, {opacity: 1, offset: .8}, {left: '-38%', opacity: 0}], {duration: 1150, easing: 'cubic-bezier(.45,0,.3,1)'});
    const flights = to.map((word, i) => {
      const box = word.getBoundingClientRect();
      const dx = from[i].left - box.left;
      const dy = from[i].top - box.top;
      // The wave reaches words on the right first.
      const delay = Math.max(0, (width - (Math.max(from[i].right, box.right) - base.left)) / width) * 620 + 60;
      return word.animate([
        {transform: `translate(${dx}px,${dy}px)`},
        {transform: `translate(${dx}px,${dy - 16}px) scale(1.07)`, offset: .22},
        {transform: `translate(${dx * .2}px,-6px) scale(1.04)`, offset: .75},
        {transform: 'none'}
      ], {duration: 820, delay, easing: 'cubic-bezier(.55,0,.25,1)', fill: 'backwards'});
    });
    let landed = false;
    Promise.all(flights.map(flight => flight.finished)).then(() => { landed = true; }, () => {});
    // Follow the flying words every frame; the tally falls as segments turn forward.
    return new Promise(resolve => {
      const step = () => {
        if (!live(id)) return resolve(false);
        setTally(update(points()), false);
        if (landed) resolve(true); else requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  function resetMotion() {
    for (const animation of demo.getAnimations({subtree: true})) animation.cancel();
    pausedAt = null;
    pause.hidden = true;
    pause.textContent = pause.dataset.pause;
    page.classList.remove('is-lit');
    for (const code of page.querySelectorAll('bdi')) code.classList.remove('is-lit');
  }
  function settled() {
    resetMotion();
    setDirection(false);
    buildPath();
    setTally(update(points()), false);
    for (const path of segments.flat()) path.style.opacity = '';
    svg.classList.add('is-resting');
    page.classList.add('is-lit');
    count.classList.add('is-done');
    setState('fixed', true);
    demo.dataset.phase = 'done';
  }
  async function play() {
    started = true;
    observer?.disconnect();
    const id = ++run;
    resetMotion();
    if (reduced.matches || !page.animate) { settled(); return; }
    setDirection(true);
    buildPath();
    setTally(0, false);
    count.classList.remove('is-done');
    setState('broken', false);
    pause.hidden = false;
    demo.dataset.phase = 'stumble';
    try {
      if (!await wait(500, id)) return;
      if (!await read(id, true)) return;
      if (!await wait(700, id)) return;
      demo.dataset.phase = 'untangle';
      if (!await untangle(id)) return;
      setState('fixed', true);
      demo.dataset.phase = 'read';
      for (const path of segments.flat()) path.style.opacity = '.35';
      if (!await wait(350, id)) return;
      if (!await read(id, false)) return;
      if (!await wait(500, id)) return;
      settled();
    } catch (error) {
      if (!live(id)) return;
      console.error(error);
      settled();
    }
  }

  pause.addEventListener('click', () => {
    const animations = demo.getAnimations({subtree: true});
    if (pausedAt === null) {
      pausedAt = performance.now();
      for (const animation of animations) animation.pause();
      pause.textContent = pause.dataset.resume;
    } else {
      offset += performance.now() - pausedAt;
      pausedAt = null;
      for (const animation of animations) animation.play();
      pause.textContent = pause.dataset.pause;
    }
  });
  replay.addEventListener('click', play);
  for (const button of demo.querySelectorAll('.rtl-langs button')) {
    button.addEventListener('click', () => {
      ++run;
      for (const other of demo.querySelectorAll('.rtl-langs button')) other.setAttribute('aria-pressed', String(other === button));
      page.lang = button.dataset.lang;
      page.innerHTML = docs[button.dataset.lang];
      play();
    });
  }
  reduced.addEventListener('change', () => { ++run; settled(); });
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (!started) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { ++run; settled(); }, 150);
  }, {passive: true});
  document.fonts.ready.then(() => {
    if (started) return;
    if (reduced.matches || !('IntersectionObserver' in window)) { play(); return; }
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) play();
    }, {threshold: .5});
    observer.observe(demo);
  });
}
