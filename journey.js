(() => {
const journeyCanvas = document.querySelector('.journey canvas');
const ctx = journeyCanvas.getContext('2d');
const control = document.querySelector('#travel');
const ink = '#263f32', shade = '#5b7651', grass = '#a6bf82', light = '#dce8b6';
let progress = 0, moving = false, previous = 0;
const end = 515;
function rect(x,y,w,h,color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x),Math.round(y),w,h);
}
function sprite(rows,x,y,colors) {
  rows.forEach((row,j) => [...row].forEach((c,i) => {
    if(colors[c]) rect(x+i,y+j,1,1,colors[c]);
  }));
}
function pine(x,y) {
  rect(x-1,y+12,3,5,ink);
  for(let i=0;i<13;i++){
    const half=Math.floor(i*.55);
    rect(x-half,y+i,2*half+1,1,ink);
    if(i>2) rect(x-half+1,y+i,half,1,shade);
  }
}
function paint(){
  const camera=Math.floor(progress);
  rect(0,0,192,128,grass);
  for(let x=-camera%12;x<192;x+=12) for(let y=4;y<128;y+=11){
    const shift=(Math.floor((x+camera)/12)*7+y)%9;
    rect(x+shift,y,1,2,shade); rect(x+shift+2,y-1,1,2,shade);
  }
  for(let x=0;x<192;x++){
    const mid=63+Math.round(7*Math.sin((x+camera)/45));
    rect(x,mid-11,1,23,light);
    if((x+camera)%13===0) rect(x,mid+5,2,1,grass);
  }
  for(let world=0;world<760;world+=16){
    const x=world-camera;
    if(x < -10 || x>204 || (world>250 && world<313) || world>535) continue;
    pine(x,6+(world*7%23)); pine(x+8,83+(world*3%18));
  }
  const river=266-camera;
  rect(river,0,34,128,shade);
  for(let y=0;y<128;y+=7) rect(river+((y*3+Math.floor(progress/5))%26),y,6,1,grass);
  rect(river-3,51,40,25,ink);
  for(let i=0;i<10;i++) rect(river-2+i*4,53,3,20,grass);
  rect(river-4,50,42,2,ink); rect(river-4,74,42,2,ink);
  const camp=585-camera;
  for(let i=0;i<22;i++) {
    rect(camp-i,38+i,2*i+1,1,ink);
    if(i>2) rect(camp-i+2,38+i,Math.max(1,i-2),1,light);
  }
  rect(camp-24,60,49,2,shade);
  const y=Math.round(63+7*Math.sin((camera+54)/45))+(moving && Math.floor(progress/4)%2 ? -1:0);
  sprite(['  x     x  ','   x   x   ','  xxxxxxx  ',' xgggggggx ','xgglgglggxx','xggggggooxx',' xxggxoooxo','  xxxooooox','   x x  x  '],50,y-8,{x:ink,g:shade,l:grass,o:light});
}
function frame(now){
  if(!moving)return;
  if(previous) progress=Math.min(end,progress+Math.min(now-previous,64)*.032);
  previous=now; paint();
  if(progress===end){moving=false;control.textContent='At camp · Play again ↻';return;}
  requestAnimationFrame(frame);
}
control.addEventListener('click',()=>{
  if(progress===end)progress=0;
  moving=!moving;
  control.textContent=moving?'Pause Ⅱ':'Continue ▸';
  previous=0;
  if(moving)requestAnimationFrame(frame);
});
paint();

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  moving = true;
  control.textContent = 'Pause Ⅱ';
  requestAnimationFrame(frame);
}
})();
