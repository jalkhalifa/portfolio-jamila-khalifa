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
