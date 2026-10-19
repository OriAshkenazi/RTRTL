'use strict';

// Story: establish direction, preserve whole LTR scopes, inspect the result.
// The same native paragraphs remain editable and in logical Unicode order.
for (const demo of document.querySelectorAll('[data-rtl-demo]')) {
  const page = demo.querySelector('.rtl-motion-page');
  const rows = [...page.querySelectorAll('p')];
  const scopes = [...page.querySelectorAll('bdi')];
  const original = rows.map(row => row.textContent);
  const caption = demo.querySelector('.rtl-stage');
  const agent = demo.querySelector('.rtl-agent');
  const pause = demo.querySelector('.rtl-pause');
  const replay = demo.querySelector('.rtl-replay');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const frame = document.createElement('div');
  frame.className = 'rtl-paper-frame';
  page.append(frame);
  const guide = document.createElement('span');
  guide.className = 'rtl-reading-edge';
  page.append(guide);
  const scan = document.createElement('span');
  scan.className = 'rtl-inspection';
  page.append(scan);

  let sequence = 0;
  let active = [];
  let paused = false;
  let observer;
  let started = false;
  const agentY = 6;
  const marker = x => `translate(${Math.max(8,Math.min(page.clientWidth-agent.offsetWidth-8,x))}px,${agentY}px)`;

  async function motion(entries,duration) {
    active = entries.map(([element,frames]) => element.animate(frames,{duration,easing:'ease-in-out',fill:'both'}));
    if (paused) for (const animation of active) animation.pause();
    await Promise.all(active.map(animation => animation.finished));
    // Persist final values before releasing the animation, including pause state.
    for (const animation of active) animation.commitStyles();
    for (const animation of active) animation.cancel();
    active = [];
  }
  const hold = duration => motion([[agent,[{opacity:1},{opacity:1}]]],duration);
  function clearEffects() {
    for (const animation of active) animation.cancel();
    active = [];
    for (const element of [page,agent,frame,guide,scan,...rows,...scopes]) element.removeAttribute('style');
    for (const row of rows) row.classList.remove('is-focused','is-checked');
    for (const scope of scopes) scope.classList.remove('is-protected');
  }
  function settled() {
    clearEffects();
    paused = false;
    pause.hidden = true;
    pause.textContent = pause.dataset.pause;
    page.dir = 'rtl';
    page.classList.add('is-correct');
    for (const row of rows) { row.dir='rtl'; row.classList.remove('is-unresolved'); }
    demo.classList.remove('is-running');
    demo.classList.add('is-finished');
    demo.dataset.phase = 'done';
    caption.textContent = caption.dataset.done;
  }
  function preserved() {
    return rows.every((row,index) => row.textContent===original[index] && row.dir==='rtl') &&
      scopes.every(scope => getComputedStyle(scope).direction==='ltr' && getComputedStyle(scope).unicodeBidi==='isolate');
  }
  async function play() {
    started = true;
    observer?.disconnect();
    const current = ++sequence;
    settled();
    if (reduced.matches || !page.animate || !Animation.prototype.commitStyles) return;
    demo.classList.remove('is-finished');
    demo.classList.add('is-running');
    demo.dataset.phase = 'observe';
    pause.hidden = false;
    page.classList.remove('is-correct');
    // Deliberately wrong paragraph direction; source characters are unchanged.
    for (const row of rows) { row.dir='ltr'; row.classList.add('is-unresolved'); }
    caption.textContent = caption.dataset.direction;
    agent.style.transform = marker(8);
    agent.style.opacity = '0';
    const restingTop = getComputedStyle(page).paddingBlockStart;
    const workingTop = getComputedStyle(page).getPropertyValue('--working-top').trim();
    try {
      await motion([[agent,[{opacity:0},{opacity:0}]]],750);
      demo.dataset.phase = 'direction';
      // Card expansion, inner frame and agent share one timeline.
      const appear = [{opacity:0},{opacity:1}];
      await motion([
        [agent,appear.map((keyframe,index)=>({...keyframe,transform:marker(index ? page.clientWidth-60 : 8)}))],
        [frame,appear.map((keyframe,index)=>({...keyframe,top:`${Number.parseFloat(index ? workingTop : restingTop)-12}px`}))],
        [page,[{paddingBlockStart:restingTop},{paddingBlockStart:workingTop}]],
        [guide,[{transform:'scaleY(0)',opacity:0},{transform:'scaleY(1)',opacity:1}]]
      ],1250);
      await hold(450);
      demo.dataset.phase = 'scopes';
      caption.textContent = caption.dataset.scopes;
      // Each visit is one paragraph-level correction, preserving complete scopes.
      for (const row of rows) {
        if (current!==sequence) return;
        const scope = row.querySelector('bdi');
        const box = scope.getBoundingClientRect();
        const origin = page.getBoundingClientRect();
        const from = agent.style.transform;
        const to = marker(box.left-origin.left+box.width/2-agent.offsetWidth/2);
        await motion([[agent,[{transform:from},{transform:to}]]],550);
        row.classList.add('is-focused');
        for (const run of row.querySelectorAll('bdi')) run.classList.add('is-protected');
        await hold(350);
        // Resolve at zero opacity: old and new glyphs can never cross or overlap.
        await motion([[row,[{opacity:1},{opacity:0}]]],180);
        row.dir = 'rtl';
        row.classList.remove('is-unresolved');
        const finalBox = scope.getBoundingClientRect();
        const finalMarker = marker(finalBox.left-origin.left+finalBox.width/2-agent.offsetWidth/2);
        await motion([
          [row,[{opacity:0},{opacity:1}]],
          [agent,[{transform:agent.style.transform},{transform:finalMarker}]]
        ],420);
        await hold(350);
        row.classList.remove('is-focused');
      }
      demo.dataset.phase = 'inspect';
      caption.textContent = caption.dataset.check;
      // Scan the actual rendered page, then verify the actual native structure.
      await motion([
        [scan,[{left:'calc(100% - 16px)',opacity:0},{left:'calc(100% - 16px)',opacity:1,offset:.12},{left:'16px',opacity:1,offset:.88},{left:'16px',opacity:0}]],
        [agent,[{transform:agent.style.transform},{transform:marker(8)}]]
      ],1250);
      if (!preserved()) throw new Error('Hero demo did not preserve native text/direction');
      for (const row of rows) row.classList.add('is-checked');
      await hold(800);
      const disappear = [{opacity:1},{opacity:0}];
      await motion([
        [frame,disappear.map((keyframe,index)=>({...keyframe,top:`${Number.parseFloat(index ? restingTop : workingTop)-12}px`}))],
        [page,[{paddingBlockStart:workingTop},{paddingBlockStart:restingTop}]],
        [agent,disappear],
        [guide,[{opacity:1},{opacity:0}]],
        ...scopes.map(scope=>[scope,[{outlineColor:'#b6a2ed',backgroundColor:'#eee8fa'},{outlineColor:'transparent',backgroundColor:'transparent'}]])
      ],650);
      if (current===sequence) settled();
    } catch (error) {
      if (current!==sequence) return;
      // Cancellation is normal for replay, resize and reduced-motion changes.
      if (error.name!=='AbortError') console.error(error);
      settled();
    }
  }
  pause.addEventListener('click',()=>{
    paused=!paused;
    pause.textContent=paused ? pause.dataset.resume : pause.dataset.pause;
    for (const animation of active) paused ? animation.pause() : animation.play();
  });
  replay.addEventListener('click',play);
  reduced.addEventListener('change',()=>{++sequence;settled();});
  window.addEventListener('resize',()=>{++sequence;settled();},{passive:true});
  document.fonts.ready.then(()=>{
    if (started) return;
    if (!('IntersectionObserver' in window)) { play(); return; }
    observer=new IntersectionObserver(entries=>{
      if (entries.some(entry=>entry.isIntersecting)) play();
    },{threshold:.5});
    observer.observe(demo);
  });
}
