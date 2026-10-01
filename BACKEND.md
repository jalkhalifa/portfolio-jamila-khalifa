# Ativar o formulário

O quiz e o briefing pelo WhatsApp funcionam sem backend, inclusive no GitHub Pages. O formulário só registra contatos depois destas etapas:

1. Em seu projeto Supabase, execute backend.sql no SQL Editor.
2. Publique a pasta site no Netlify. O arquivo netlify.toml configura a função.
3. No Netlify, cadastre SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente das funções e faça um novo deploy. A chave service_role deve ficar somente no servidor; nunca a coloque em HTML, JavaScript público ou GitHub.
4. Faça um envio real e confira a tabela portfolio_leads no painel privado do Supabase.

No GitHub Pages, a função Netlify não é executada: use o WhatsApp ou hospede o site no Netlify para ativar o formulário. Não existe painel administrativo próprio nesta versão; os contatos são consultados no Supabase.

Dados enviados: nome, e-mail, quatro respostas, indicação inicial e registro da autorização. Nenhum dado é salvo durante as perguntas. Não há cookies analíticos nem armazenamento local das respostas. Há validação no servidor e campo anti-bot básico; para divulgação ampla, configure proteção adicional contra automação no provedor.

A exclusão de um contato deve ser feita por você na tabela quando solicitada. Esta versão não manda e-mails automáticos.
