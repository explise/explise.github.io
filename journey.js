(() => {
  const canvas = document.querySelector('.journey canvas');
  canvas.width = 224;
  canvas.height = 152;
  const g = canvas.getContext('2d');
  const button = document.querySelector('#travel');
  const ink='#293d3e', pine='#406054', leaf='#70885c', mint='#aabe82', sun='#eddfaa', soil='#ab906c';
  function box(x,y,w,h,c){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);}
  function poly(points,c){g.fillStyle=c;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();}
  function tile(x,y,rows,palette){
    rows.forEach((row,j)=>[...row].forEach((key,i)=>{if(palette[key])box(x+i,y+j,1,1,palette[key]);}));
  }
  function tree(x,y,size){
    g.save();g.translate(x,y);g.scale(size,size);
    box(-9,-1,21,3,'#809467');box(-3,-11,6,12,ink);box(-2,-8,2,8,soil);
    const crown=[[-14,-13],[-14,-23],[-10,-23],[-10,-30],[-5,-30],[-5,-34],[4,-34],[4,-31],[10,-31],[10,-26],[14,-26],[14,-15],[11,-15],[11,-10],[-8,-10],[-8,-13]];
    poly(crown,ink);g.translate(-1,-2);g.scale(.88,.91);poly(crown,pine);
    poly([[-12,-22],[-8,-27],[-4,-27],[-4,-31],[3,-31],[7,-27],[3,-24],[-2,-24],[-2,-21],[-8,-18],[-12,-18]],leaf);
    box(-7,-25,4,2,mint);box(-2,-29,5,2,mint);box(3,-18,4,2,leaf);g.restore();
  }
  function house(x,y,door){
    box(x+4,y+2,58,6,'#869569');box(x,y-28,56,32,ink);box(x+2,y-26,52,28,'#dfc79b');
    box(x+41,y-26,12,28,'#b69e76');box(x+2,y-6,51,2,soil);
    box(x+32,y-54,8,17,ink);box(x+33,y-53,5,14,'#ad7258');
    poly([[x-5,y-28],[x+6,y-49],[x+47,y-49],[x+61,y-29],[x+61,y-24],[x-5,y-24]],ink);
    poly([[x-2,y-29],[x+8,y-47],[x+46,y-47],[x+57,y-29]],'#a75948');
    for(let r=0;r<4;r++){const left=x+8-r*2;box(left,y-46+r*5,37+r*5,1,'#d99268');for(let j=left+5+(r%2)*4;j<x+46+r*2;j+=9)box(j,y-45+r*5,1,3,'#814f43');}
    box(x+22,y-18,12,22,ink);const width=Math.max(1,Math.round(8*(1-door)));box(x+24,y-16,width,17,'#795b49');box(x+22+width,y-8,1,2,sun);
    for(const dx of [5,37]){box(x+dx,y-18,12,11,ink);box(x+dx+2,y-16,8,7,'#93b6ad');box(x+dx+5,y-16,1,7,ink);box(x+dx+1,y-7,11,2,soil);}
    box(x+19,y+3,18,3,'#b5a282');
  }
  const pathY=x=>85+Math.round(9*Math.sin((x-40)/47));
  function flower(x,y,kind,t){
    const sway=Math.sin(t*2+x*.3)>.7?1:0;
    box(x,y-3,1,5,pine);box(x-2,y,2,1,leaf);box(x+1,y-1,2,1,leaf);
    x+=sway;
    const petals=['#cf7883','#a287b2','#f2cf76','#efe5be'][kind];
    box(x-2,y-5,5,2,petals);box(x-1,y-6,3,4,petals);box(x,y-5,1,1,'#8e6747');
  }
  function garden(t){
    for(const [x,y,w] of [[302,53,36],[350,48,45],[408,53,39],[316,108,45],[381,113,55]]){
      box(x-3,y-1,w+6,12,'#98aa77');box(x,y-3,w,13,'#73875c');
      box(x,y+9,w,2,'#c3ad84');
      for(let j=0;j<2;j++)for(let k=0;k<w-3;k+=5){
        flower(x+k+2+(j%2)*2,y+j*5+1+(k%3),(Math.floor(k/10)+j+x)%4,t);
      }
    }
    const gate=292,base=pathY(gate);
    for(const y of [base-12,base+12]){
      box(gate-2,y-17,4,19,'#795f49');box(gate-1,y-17,1,18,sun);
      for(let j=0;j<5;j++)flower(gate+(j%2)*2,y-4-j*3,j%4,t);
    }
    for(let j=0;j<4;j++){
      const x=346+j*18+Math.round(4*Math.sin(t*1.6+j));
      const y=59+Math.round(4*Math.cos(t*2+j))+j%2*7;
      box(x,y,1,2,ink);box(x-2,y-1,2,2,'#f9d987');box(x+1,y-2,2,2,'#e8a97a');
    }
  }
  function draw(t){
    const walk=Math.min(1,Math.max(0,(t-3.8)/17));
    const wx=52+Math.round(walk*340);
    const camera=Math.max(0,wx-85);
    const emerge=Math.max(0,Math.min(1,(t-1.15)/2.65));
    const wy=Math.round(62+(pathY(wx)-62)*emerge);
    const stride=Math.floor(t*5)%2;
    g.save();g.translate(-camera,0);
    box(camera,0,224,152,'#b7c88a');
    for(let x=0;x<550;x+=7)for(let y=2;y<153;y+=9){
      const n=(x*31+y*17)%23;if(n>14){box(x+n%4,y,2,1,'#98ad76');box(x+3,y-1,1,2,'#98ad76');}
    }
    for(let x=camera;x<camera+225;x++){
      const y=pathY(x);box(x,y-8,1,21,'#a99c73');box(x,y-7,1,18,'#e5d3a3');
      if(x%11===0)box(x,y+(x%7)-3,2,1,'#c8b58a');
    }
    for(let x=-10;x<560;x+=19) tree(x,23+(x+10)%8,1);
    for(let x=110;x<540;x+=21)tree(x,41+(x%17),1);
    house(24,65,Math.max(0,Math.min(1,(t-.65)*2,(4.2-t)*2)));
    for(let x=3;x<102;x+=8){if(x>40&&x<66)continue;box(x,72,9,2,soil);box(x,69,3,8,'#725f4e');box(x,69,2,2,sun);}
    for(let y=0;y<153;y++){const x=217+Math.round(4*Math.sin(y/15));box(x-2,y,27,1,'#627b62');box(x,y,23,1,'#73a7a1');if(y%6===0)box(x+2+(Math.floor(t*2)+y)%13,y,5,1,'#b2d2bd');}
    const by=pathY(229);box(211,by-10,36,24,ink);
    for(let j=0;j<8;j++){box(212+j*4,by-9,3,21,'#c7a579');box(212+j*4,by-9,1,21,'#e0c08d');}
    for(const y of [by-11,by+11]){box(209,y,40,2,'#735c49');for(const x of [210,228,246])box(x,y-2,3,5,ink);}
    for(let x=77;x<450;x+=29){let y=pathY(x)+18+(x%9);box(x,y,1,4,pine);box(x-1,y-1,4,2,'#bb7462');box(x,y-2,2,3,'#f1d097');}
    garden(t);
    const bob=(walk>0&&walk<1)?stride:0;
    const bx=wx-11-Math.round(6*Math.sin(Math.min(t,2)*1.6));
    box(bx-3,wy+1,9,2,'#89966e');
    tile(bx-4,wy-6-bob,['  i   i  ','   iii   ',' iggggii ','igllggggi','igggggisi',' iiiiissi','  i  i   '],{i:ink,g:leaf,l:mint,s:sun});
    g.save();
    if(t<3.8){g.beginPath();g.rect(wx-8,48,16,Math.max(0,wy-48+4));g.clip();}
    if(t>=1.15){
    box(wx-5,wy+1,12,2,'#89966e');
    tile(wx-5,wy-17-bob,['   iiii    ','  iaaaai   ',' iaaaaaai  ','iaaallaaai ',' iiiiiissi ','  ihssissi ','  ihssssi  ','   ihhii   ','  ibbbci   ',' ibbblcci  ',' ibbbcisi  ',' iibbcisi  ','  icccii   ','  iiiiii   ','  ittiti   '],{i:ink,a:'#ad604c',l:'#e9b77c',s:'#e2be90',h:'#795e48',b:'#a68054',c:'#64857b',t:'#526660'});
    box(wx-3,wy-2+bob,3,3,ink);box(wx+1,wy-1-bob,3,3,ink);
    }
    g.restore();
    for(let x=-15;x<560;x+=25)tree(x,151+(x+15)%12,1.2);
    if(t>20.8){tile(wx+7,wy-27,[' rr rr ','rrrrrrr',' rrrrr ','  rrr  ','   r   '],{r:'#b85f70'});}
    g.restore();
  }
  let elapsed=0,prior=0,id=0,playing=false;
  function tick(now){if(prior)elapsed+=Math.min(80,now-prior)/1000;prior=now;draw(elapsed);
    if(elapsed>=24){playing=false;button.textContent='Replay walk ↻';return;}id=requestAnimationFrame(tick);}
  function toggle(){if(playing){cancelAnimationFrame(id);playing=false;button.textContent='Continue ▸';return;}
    if(elapsed>=24)elapsed=0;prior=0;playing=true;button.textContent='Pause Ⅱ';id=requestAnimationFrame(tick);}
  button.addEventListener('click',toggle);draw(0);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)toggle();
})();
