const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('nav');

menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});

document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: .12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

const motionButton = document.querySelector('#motion-toggle');
let motionOff = matchMedia('(prefers-reduced-motion: reduce)').matches;
function setMotion(){document.documentElement.classList.toggle('motion-off',motionOff);motionButton.setAttribute('aria-pressed',String(motionOff));motionButton.textContent=motionOff?'Ativar movimento':'Pausar movimento';}
motionButton.addEventListener('click',()=>{motionOff=!motionOff;setMotion();});setMotion();
const questions=[
 ['O que você quer transformar?',['Apresentar minha marca ou serviço','Mostrar produtos e receber pedidos','Organizar uma plataforma ou processo']],
 ['O que seu visitante precisa fazer?',['Conhecer meu trabalho e entrar em contato','Explorar um catálogo e escolher produtos','Criar uma conta e usar funcionalidades']],
 ['Em que ponto sua ideia está?',['Estou começando a explorar','Já tenho referências e conteúdo','Tenho um site que precisa evoluir']],
 ['Quando você gostaria de começar?',['Assim que possível','Nos próximos meses','Ainda estou planejando']]
];
let answers=[],step=-1;
const quizContent=document.querySelector('#quiz-content');
const escapeHTML=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function resultType(){if(answers[0]===2||answers[1]===2)return 'Plataforma personalizada';if(answers[0]===1||answers[1]===1)return 'Catálogo digital';return 'Site institucional ou portfólio';}
function briefing(){return 'Olá, Jamila! Explorei seu portfólio e quero conversar sobre um projeto.\n\nPonto de partida: '+resultType()+'\n'+questions.map((q,i)=>q[0]+' '+q[1][answers[i]]).join('\n');}
function renderQuiz(){
 const completed=Math.max(0,step);document.querySelector('#quiz-progress').value=completed;
 document.querySelector('#map-progress').textContent=completed+' / 4 ETAPAS';
 document.querySelector('#quiz-step').textContent=step<0?'INÍCIO':step<4?'ETAPA '+(step+1)+' / 4':'EXPLORAÇÃO CONCLUÍDA';
 if(step<0){quizContent.innerHTML='<h3>Toda construção começa com uma pergunta.</h3><p>Em cerca de um minuto, transforme sua ideia em um briefing inicial.</p><button class="button primary" id="quiz-start" type="button">Explorar minha ideia →</button>';document.querySelector('#quiz-start').onclick=()=>{step=0;renderQuiz();};return;}
 if(step<4){quizContent.innerHTML='<h3>'+questions[step][0]+'</h3><div class="quiz-options">'+questions[step][1].map((s,i)=>'<button type="button" data-option="'+i+'">0'+(i+1)+' / '+s+'</button>').join('')+'</div>'+(step>0?'<button class="quiz-back" type="button">← Voltar uma etapa</button>':'');quizContent.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>{answers[step]=Number(b.dataset.option);step++;renderQuiz();});const back=quizContent.querySelector('.quiz-back');if(back)back.onclick=()=>{step--;renderQuiz();};return;}
 quizContent.innerHTML='<h3>'+resultType()+'</h3><p>Este é um ponto de partida. Vamos conversar para definir o escopo da sua ideia.</p><div class="quiz-summary">'+questions.map((q,i)=>'<p><strong>'+q[0]+'</strong><br>'+q[1][answers[i]]+'</p>').join('')+'</div><p><a class="button primary" id="brief-whatsapp" target="_blank" rel="noopener noreferrer">Conversar sobre minha ideia ↗</a></p><button class="quiz-back" type="button">← Revisar respostas</button><form class="lead-form"><h4>Prefere deixar um contato?</h4><p>Envie seu nome e e-mail para receber uma resposta sobre este projeto.</p><label>Nome<input name="name" autocomplete="name" maxlength="100" required></label><label>E-mail<input name="email" type="email" autocomplete="email" maxlength="254" required></label><label class="honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><label class="consent"><input type="checkbox" required name="consent"><span>Autorizo o uso do meu nome, e-mail e respostas para contato sobre este projeto. Para solicitar a exclusão, escreva para jamilask2018@hotmail.com.</span></label><button class="button secondary" type="submit">Enviar meu briefing</button><p class="form-status" role="status"></p></form>';
 document.querySelector('#brief-whatsapp').href='https://wa.me/5561995962642?text='+encodeURIComponent(briefing());
 quizContent.querySelector('.quiz-back').onclick=()=>{step=3;renderQuiz();};
 quizContent.querySelector('form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget,status=form.querySelector('.form-status'),button=form.querySelector('[type=submit]');button.disabled=true;status.textContent='Enviando…';try{const res=await fetch('/.netlify/functions/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:form.elements.name.value.trim(),email:form.elements.email.value.trim(),website:form.elements.website.value,consent:form.elements.consent.checked,answers:questions.map((q,i)=>({question:q[0],answer:q[1][answers[i]]})),recommendation:resultType()})});if(!res.ok)throw new Error();status.textContent='Briefing recebido! Obrigada por compartilhar sua ideia.';form.reset();}catch{status.textContent='O formulário está indisponível no momento. Use “Conversar sobre minha ideia” para enviar seu briefing pelo WhatsApp.';}finally{button.disabled=false;}};
}
document.querySelector('#quiz-reset').onclick=()=>{answers=[];step=-1;renderQuiz();};renderQuiz();

// Graphics replace Unicode arrows, including content rendered by the quiz.
const arrowSVG='<svg class="link-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg>';
function replaceGlyphs(root){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())if(/[↗→←↺]/.test(walker.currentNode.nodeValue))nodes.push(walker.currentNode);nodes.forEach(node=>{const span=document.createElement('span');span.innerHTML=node.nodeValue.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])).replace(/[↗→]/g,arrowSVG).replace(/←/g,arrowSVG.replace('link-icon','link-icon icon-back')).replace(/↺/g,'<svg class="link-icon icon-reset" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/></svg>');node.replaceWith(span);});}
replaceGlyphs(document.body);
const quizObserver=new MutationObserver(()=>{quizObserver.disconnect();replaceGlyphs(quizContent);updateQuizShape();quizObserver.observe(quizContent,{childList:true,subtree:true});});quizObserver.observe(quizContent,{childList:true,subtree:true});
function updateQuizShape(){const shape=document.querySelector('.quiz-shape');shape.style.setProperty('--quiz-scale',String(1+Math.max(0,step)*.05));shape.style.setProperty('--quiz-round',Math.max(0,step)*12+'%');}
const spread=document.querySelector('#exp-spread'),angle=document.querySelector('#exp-angle'),expObject=document.querySelector('.experiment-object');
function updateExperiment(){expObject.style.setProperty('--spread',spread.value+'px');expObject.style.setProperty('--angle',angle.value+'deg');}
spread.addEventListener('input',updateExperiment);angle.addEventListener('input',updateExperiment);document.querySelector('#exp-reset').onclick=()=>{spread.value=25;angle.value=15;updateExperiment();};updateExperiment();
const finePointer=matchMedia('(hover:hover) and (pointer:fine)'),ring=document.querySelector('.cursor-ring');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function motionAllowed(){return !motionOff&&!reduced.matches;}
const art=document.querySelector('.laboratory-art');
document.addEventListener('pointermove',e=>{if(!finePointer.matches||!motionAllowed()){ring.classList.remove('enabled');return;}ring.classList.add('enabled');ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';ring.style.transform='translate(-50%,-50%)';const project=e.target.closest('.case-details summary');ring.classList.toggle('active',!!project);ring.classList.toggle('over-control',!!e.target.closest('a,button,input,summary'));ring.querySelector('span').textContent=project?'Explorar':'';});
document.addEventListener('pointerout',e=>{if(!e.relatedTarget)ring.classList.remove('enabled');});
art.addEventListener('pointermove',e=>{if(!finePointer.matches||!motionAllowed())return;const r=art.getBoundingClientRect();art.style.setProperty('--art-x',((e.clientX-r.left)/r.width-.5)*18+'px');art.style.setProperty('--art-y',((e.clientY-r.top)/r.height-.5)*18+'px');});art.addEventListener('pointerleave',()=>{art.style.setProperty('--art-x','0px');art.style.setProperty('--art-y','0px');});
document.querySelectorAll('.interactive-preview').forEach(el=>{el.addEventListener('pointermove',e=>{if(!finePointer.matches||!motionAllowed())return;const r=el.getBoundingClientRect();el.style.setProperty('--tilt-x',((e.clientX-r.left)/r.width-.5)*7+'deg');el.style.setProperty('--tilt-y',-((e.clientY-r.top)/r.height-.5)*7+'deg');});el.addEventListener('pointerleave',()=>{el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');});const caption=document.createElement('small');caption.className='preview-caption';caption.textContent='Representação gráfica / abra o projeto para ver o site';el.append(caption);});
const portrait=document.querySelector('.about-portrait');portrait.addEventListener('pointermove',e=>{if(!finePointer.matches||!motionAllowed())return;const r=portrait.getBoundingClientRect();portrait.style.translate=((e.clientX-r.left)/r.width-.5)*8+'px 0';});portrait.addEventListener('pointerleave',()=>portrait.style.translate='0 0');
const fragments=[];document.querySelectorAll('main>.section').forEach((section,i)=>{const f=document.createElement('span');f.className='scroll-fragment'+(i%2?' round':'');f.setAttribute('aria-hidden','true');section.append(f);fragments.push({section,f});});
let queued=false;function updateScroll(){queued=false;fragments.forEach(({section,f})=>{const r=section.getBoundingClientRect(),ratio=Math.max(-1,Math.min(1,(innerHeight/2-r.top)/innerHeight));f.style.setProperty('--scroll-x',motionAllowed()?ratio*30+'px':'0px');f.style.setProperty('--scroll-angle',motionAllowed()?ratio*240+'deg':'0deg');});}
addEventListener('resize',updateScroll);
addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateScroll);}},{passive:true});updateScroll();
motionButton.addEventListener('click',()=>{ring.classList.remove('enabled');portrait.style.translate='0 0';updateScroll();});
reduced.addEventListener('change',()=>{motionOff=reduced.matches;setMotion();portrait.style.translate='0 0';ring.classList.remove('enabled');updateScroll();});
