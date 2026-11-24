(() => {
  const fa = n => Number(n).toLocaleString('fa-IR');
  const fd = s => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const products = [
    {n:'ولیعصر ۰۷',m:'رانینگ شهری · جیر و مش',p:2890000,c1:'#2f8f4e',c2:'#f4f4f0',c3:'#0a0a0a',bg:'#d9f99d',b:'تازه'},
    {n:'مولوی هایتاپ',m:'ساق‌بلند · چرم گیاهی',p:3450000,c1:'#b23a1e',c2:'#f2c14e',c3:'#3b1d12',bg:'#fde2d4'},
    {n:'تجریش وینتر',m:'ضدآب · یقه پشمی',p:3990000,c1:'#2a4aa8',c2:'#f4f4f0',c3:'#9ec5ff',bg:'#dbe7ff',b:'محدود'},
    {n:'نارمک لو',m:'اسکیت · زیره هندسی',p:2490000,c1:'#c6ff00',c2:'#0a0a0a',c3:'#ff3d00',bg:'#0a0a0a'},
    {n:'شوش کلاسیک',m:'کتانی روزمره · کتان',p:1990000,c1:'#f4f4f0',c2:'#ff3d00',c3:'#e4e4dc',bg:'#ffd6c7'},
    {n:'پونک نایت',m:'شبرنگ · رویه مشکی',p:3190000,c1:'#1b1b1b',c2:'#c6ff00',c3:'#3a3a3a',bg:'#c6ff00',b:'فقط ۴۰ جفت'}
  ];
  const track = document.getElementById('railTrack');
  track.innerHTML = products.map((p,i)=>`
    <article class="card">
      <span class="no">${fd(String(i+1).padStart(2,'0'))}</span>${p.b?`<span class="badge">${p.b}</span>`:''}
      <div class="art" style="--bg:${p.bg}"><svg viewBox="0 0 400 220" style="--c1:${p.c1};--c2:${p.c2};--c3:${p.c3}" role="img" aria-label="تصویر گرافیکی کتانی ${p.n}"><use href="#sneaker"/></svg></div>
      <div class="info"><h3>${p.n}</h3><p class="meta">${p.m}</p>
        <div class="row"><span class="price">${fa(p.p)} تومان</span><button class="add" type="button" aria-label="افزودن ${p.n} به سبد">+ سبد</button></div>
      </div>
    </article>`).join('');
  // cart (demo)
  let count = 0; const cc = document.getElementById('cartCount'), cartBtn = document.querySelector('.cart');
  track.addEventListener('click', e => {
    const b = e.target.closest('.add'); if(!b) return;
    cc.textContent = fa(++count); cartBtn.classList.remove('bump'); void cartBtn.offsetWidth; cartBtn.classList.add('bump');
    b.textContent = '✓ اضافه شد'; setTimeout(()=>b.textContent='+ سبد',1200);
  });
  // countdown to next Friday 20:00 (demo)
  const cd = document.getElementById('cd');
  const target = (()=>{const d=new Date();d.setDate(d.getDate()+((5-d.getDay()+7)%7||7));d.setHours(20,0,0,0);return d})();
  const tick = () => { let s=Math.max(0,(target-new Date())/1000|0); const d=s/86400|0; s%=86400; const h=s/3600|0; s%=3600; const m=s/60|0; s%=60;
    const p2 = x => fd(String(x).padStart(2,'0'));
    cd.textContent = `${fd(d)} روز  ${p2(h)}:${p2(m)}:${p2(s)}`; };
  tick(); setInterval(tick,1000);
  // scroll-driven horizontal rail (desktop, motion OK)
  const wrap = document.querySelector('.rail-wrap');
  const mqWide = matchMedia('(min-width:760px)');
  let maxX = 0;
  const setup = () => {
    if (reduce || !mqWide.matches) { wrap.classList.remove('pin'); track.style.transform=''; return; }
    wrap.classList.add('pin');
    maxX = Math.max(0, track.scrollWidth - innerWidth + 80);
    wrap.style.setProperty('--pin-h', (innerHeight + maxX) + 'px');
    onScroll();
  };
  const onScroll = () => {
    if (!wrap.classList.contains('pin')) return;
    const r = wrap.getBoundingClientRect();
    const prog = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    track.style.transform = `translateX(${prog * maxX}px)`;
  };
  addEventListener('scroll', onScroll, {passive:true}); addEventListener('resize', setup); setup();
  // size finder: EU ≈ (cm + 1.5) * 1.5
  const foot = document.getElementById('foot'), fv = document.getElementById('footVal'), out = document.querySelector('#sizeOut b');
  const calc = () => { const fit = +document.querySelector('input[name=fit]:checked').value;
    const eu = Math.round(((+foot.value + 1.5) * 1.5 + fit) * 2) / 2;
    fv.textContent = fa(foot.value).replace('.', '٫'); out.textContent = fa(eu).replace('.', '٫'); };
  document.getElementById('sizeForm').addEventListener('input', calc); calc();
  // join form (front-end only)
  const f = document.getElementById('joinForm'), ph = document.getElementById('jPhone'), err = document.getElementById('jErr'), ok = document.getElementById('jOk');
  f.addEventListener('submit', e => { e.preventDefault();
    const digits = ph.value.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    if (!f.name.value.trim()) { f.name.focus(); f.name.setAttribute('aria-invalid','true'); return; } f.name.removeAttribute('aria-invalid');
    if (!/^09\d{9}$/.test(digits)) { err.textContent = 'شماره باید ۱۱ رقم و با ۰۹ شروع شود.'; ph.setAttribute('aria-invalid','true'); ph.focus(); return; }
    err.textContent=''; ph.removeAttribute('aria-invalid'); ok.textContent = `${f.name.value.trim()}، اسمت توی لیست رفت ✦ (نمایشی؛ چیزی ارسال نشد)`; f.reset(); });
  // custom cursor
  const cur = document.querySelector('.cursor');
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => { cur.style.left = e.clientX+'px'; cur.style.top = e.clientY+'px'; cur.classList.add('on'); }, {passive:true});
    document.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a,button,.card,.cell,input')));
  }
})();
