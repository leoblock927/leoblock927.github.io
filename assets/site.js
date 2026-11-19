(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var loom=document.querySelector('.loom');
  if(loom){(function(){
  var svg=loom.querySelector('svg'), list=loom.querySelector('.ends');
  var plugs=[].slice.call(loom.querySelectorAll('.ends .plug'));
  var cols=['--hv','--can','--batt','--sig','--auto'];
  var NS='http://www.w3.org/2000/svg';
  var first=true;

  function el(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);(parent||svg).appendChild(e);return e}
  function clean(pts){return pts.filter(function(p,i){return i===0||p[0]!==pts[i-1][0]||p[1]!==pts[i-1][1]})}
  function rounded(pts,r){
    pts=clean(pts);
    var d='M'+pts[0][0]+','+pts[0][1];
    for(var i=1;i<pts.length-1;i++){
      var a=pts[i-1],b=pts[i],c=pts[i+1];
      var d1=Math.hypot(b[0]-a[0],b[1]-a[1]),d2=Math.hypot(c[0]-b[0],c[1]-b[1]);
      var rr=Math.min(r,d1/2,d2/2);
      var p1=[b[0]+(a[0]-b[0])/d1*rr,b[1]+(a[1]-b[1])/d1*rr],p2=[b[0]+(c[0]-b[0])/d2*rr,b[1]+(c[1]-b[1])/d2*rr];
      d+=' L'+p1[0].toFixed(1)+','+p1[1].toFixed(1)+' Q'+b[0]+','+b[1]+' '+p2[0].toFixed(1)+','+p2[1].toFixed(1);
    }
    var l=pts[pts.length-1];return d+' L'+l[0]+','+l[1];
  }

  function draw(){
    var box=loom.getBoundingClientRect(); if(!box.width) return;
    var W=box.width, small=W<820;
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var t=plugs.map(function(p){var r=p.getBoundingClientRect();return [r.left-box.left+3, r.top-box.top+r.height/2]});
    var s=small?10:14, sw=small?6:9, R=small?14:22;
    var N=t.length, trunkY=t[(N-1)/2|0][1]-((N-1)/2)*s;
    var minX=Math.min.apply(null,t.map(function(p){return p[0]}));
    var bx=Math.max(minX*0.5, minX-(small?70:240)), g=s*2.2;
    var turns=t.map(function(p,i){return bx+g*Math.min(i,N-1-i)});
    var startX=-20;

    // pegs and tape along trunk
    var fx=el('g',{'class':'fx'});
    var step=small?70:110;
    for(var x=step*0.6;x+step/2<bx-R-24;x+=step){
      el('rect',{'class':'tape',x:x-11,y:trunkY-8,width:small?14:20,height:(N-1)*s+16,rx:3},fx);
      el('circle',{'class':'peg',cx:x+step/2,cy:trunkY-s-2,r:small?4:6},fx);
      el('circle',{'class':'peg',cx:x+step/2,cy:trunkY+N*s+2,r:small?4:6},fx);
    }

    for(var i=0;i<N;i++){
      var y=trunkY+i*s, ty=t[i][1], tx=t[i][0];
      var pts=[[startX,y],[turns[i],y],[turns[i],ty],[tx,ty]];
      var d=rounded(pts,R);
      var grp=el('g',{'class':'grp g'+i});
      el('path',{'class':'wire',d:d,pathLength:1,stroke:'var('+cols[i]+')','stroke-width':sw},grp);
      el('path',{'class':'sheen',d:d,pathLength:1,transform:'translate(0,-'+(sw/4)+')'},grp);
      el('path',{'class':'pulse',d:d,pathLength:1},grp);
      if(!small){
        var lx=turns[i]+R+16;
        el('text',{'class':'wid fx',x:lx,y:ty-sw/2-6},grp).textContent='W'+(i+1);
      }
      // peg on outside of final bend
      var up=ty<y;
      if(Math.abs(ty-y)>4) el('circle',{'class':'peg fx',cx:turns[i]-(small?9:13),cy:ty+(up?-(small?9:13):(small?9:13)),r:small?4:6},grp);
    }

    if(first){
      first=false;
      if(!reduce) loom.classList.add('anim');
      requestAnimationFrame(function(){loom.classList.add('drawn')});
    }
  }

  // hover/focus highlights a wire
  [].forEach.call(list.querySelectorAll('li'),function(li){
    var i=li.getAttribute('data-i'), a=li.querySelector('a');
    function on(){loom.setAttribute('data-active',i)}
    function off(){loom.removeAttribute('data-active')}
    a.addEventListener('mouseenter',on); a.addEventListener('mouseleave',off);
    a.addEventListener('focus',on); a.addEventListener('blur',off);
  });

  var rafId; function sched(){cancelAnimationFrame(rafId);rafId=requestAnimationFrame(draw)}
  if('ResizeObserver' in window) new ResizeObserver(sched).observe(loom); else window.addEventListener('resize',sched);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(sched);
  draw();
  })();}

  // figures send a pulse once when they scroll into view
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('live');io.unobserve(e.target)}})},{threshold:.6});
    [].forEach.call(document.querySelectorAll('.fig'),function(f){io.observe(f)});
  }
  // lightbox
  var lb=document.getElementById('lb'); if(!lb) return;
  var lbi=lb.querySelector('img'), lbp=lb.querySelector('p');
  [].forEach.call(document.querySelectorAll('.zoom'),function(b){b.addEventListener('click',function(){
    var im=b.querySelector('img'), cap=b.parentNode.querySelector('figcaption');
    lbi.src=im.src; lbi.alt=im.alt; lbp.textContent=cap?cap.textContent:''; lb.showModal();
  })});
  lb.querySelector('button').addEventListener('click',function(){lb.close()});
  lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});
})();
