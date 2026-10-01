exports.handler=async(event)=>{
 const reply=(statusCode,message)=>({statusCode,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify({message})});
 if(event.httpMethod!=='POST')return reply(405,'Método não permitido');
 if(!process.env.SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY)return reply(503,'Formulário ainda não configurado');
 if(!event.body||Buffer.byteLength(event.body)>10000)return reply(413,'Requisição muito grande');
 let data;try{data=JSON.parse(event.body);}catch{return reply(400,'Dados inválidos');}
 if(data.website)return reply(200,'Recebido');
 if(typeof data.name!=='string'||data.name.trim().length<2||data.name.length>100||typeof data.email!=='string'||data.email.length>254||!/^\S+@\S+\.\S+$/.test(data.email)||data.consent!==true||!Array.isArray(data.answers)||data.answers.length!==4||data.answers.some(a=>typeof a.question!=='string'||typeof a.answer!=='string'||a.question.length>200||a.answer.length>200)||!['Plataforma personalizada','Catálogo digital','Site institucional ou portfólio'].includes(data.recommendation))return reply(400,'Verifique os campos');
 try{const res=await fetch(process.env.SUPABASE_URL.replace(/\/$/,'')+'/rest/v1/portfolio_leads',{method:'POST',headers:{apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({name:data.name.trim(),email:data.email.trim(),answers:data.answers,recommendation:data.recommendation,consent:true,consent_version:'portfolio-v1'})});return res.ok?reply(201,'Recebido'):reply(502,'Envio indisponível');}catch{return reply(502,'Envio indisponível');}
};

