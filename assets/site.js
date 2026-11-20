(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // mobile menu
  var btn = document.querySelector('.plusbtn');
  if (btn) {
    btn.addEventListener('click', function(){
      var open = document.documentElement.classList.toggle('menu-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.mmenu a').forEach(function(a){
      a.addEventListener('click', function(){ document.documentElement.classList.remove('menu-open'); btn.setAttribute('aria-expanded','false'); });
    });
  }

  // desktop nav: close the dropdown after a click so it doesn't stay open on focus
  document.querySelectorAll('.pill a').forEach(function(a){
    a.addEventListener('click', function(){ a.blur(); });
  });

  // accordion with image swap and per-project photo strip
  document.querySelectorAll('[data-acc]').forEach(function(acc){
    var items = [].slice.call(acc.querySelectorAll('.item'));
    var media = [].slice.call(acc.querySelectorAll('.stage > *'));
    var sel = items.map(function(){ return 0; });
    function paint(i){
      media.forEach(function(m){ m.classList.toggle('on', +m.dataset.i === i && +m.dataset.k === sel[i]); });
      var it = items[i];
      if (it) it.querySelectorAll('.thumb').forEach(function(t){ t.classList.toggle('sel', +t.dataset.k === sel[i]); });
    }
    function openIdx(){ return items.findIndex(function(it){ return it.classList.contains('open'); }); }
    function show(i){
      items.forEach(function(it, j){
        var on = j === i;
        it.classList.toggle('open', on);
        it.querySelector('.hd').setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      paint(i < 0 ? 0 : i);
    }
    items.forEach(function(it, i){
      it.querySelector('.hd').addEventListener('click', function(){ show(it.classList.contains('open') ? -1 : i); });
      it.querySelectorAll('.thumb').forEach(function(t){
        t.addEventListener('click', function(){ sel[i] = +t.dataset.k; paint(i); });
      });
      it.addEventListener('mouseenter', function(){ if (openIdx() < 0) paint(i); });
    });
    acc.addEventListener('mouseleave', function(){ var o = openIdx(); paint(o < 0 ? 0 : o); });
  });

  // diagrams send a pulse once when they scroll into view
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('live'); io.unobserve(e.target); } });
    }, {threshold: .6});
    document.querySelectorAll('.fig').forEach(function(f){ io.observe(f); });
  }

  // lightbox
  var lb = document.getElementById('lb');
  if (lb) {
    var lbi = lb.querySelector('img'), lbp = lb.querySelector('p');
    document.querySelectorAll('.zoom').forEach(function(b){
      b.addEventListener('click', function(){
        var im = b.querySelector('img'), cap = b.parentNode.querySelector('figcaption');
        lbi.src = im.dataset.full || im.currentSrc || im.src; lbi.alt = im.alt; lbp.textContent = cap ? cap.textContent : ''; lb.showModal();
      });
    });
    lb.querySelector('button').addEventListener('click', function(){ lb.close(); });
    lb.addEventListener('click', function(e){ if (e.target === lb) lb.close(); });
  }
})();
