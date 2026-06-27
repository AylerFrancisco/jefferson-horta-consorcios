# Landing Page — Jefferson Horta (Consórcios)

Site estático (HTML + CSS + JavaScript puro). **Sem build, sem dependências, sem backend.**
É só subir a pasta `site/` em qualquer hospedagem.

## Arquivos
```
site/
├─ index.html      → estrutura e conteúdo
├─ styles.css      → design (navy + dourado, responsivo)
├─ app.js          → simulador + integração WhatsApp
└─ assets/         → fotos do consultor
```

## Como publicar (escolha 1)

- **Netlify / Vercel:** arraste a pasta `site/` em app.netlify.com/drop (publica na hora, grátis, com HTTPS).
- **GitHub Pages:** suba a pasta num repositório e ative Pages nas configurações.
- **Hostinger / cPanel / qualquer host:** envie o conteúdo de `site/` para a pasta `public_html` via FTP.

> Não precisa de Node, PHP nem banco de dados em produção. (O PHP foi usado só para testar localmente.)

## Como funciona o simulador
- Cálculo com a fórmula real do consórcio:
  `Parcela = Crédito × (1 + Taxa de Administração + Fundo de Reserva) ÷ Prazo`
- Opção de **parcela reduzida em 50%** até a contemplação (só o fundo comum é reduzido).
- Taxas calibradas com as tabelas reais das administradoras dos insumos
  (Magalu 18%, veículos, pesados 20%/132m) e referências de mercado.
- Ao final, monta uma mensagem com todos os dados (crédito, taxa, prazo, parcela, custo total)
  e abre o **WhatsApp do consultor** (`wa.me/5527998503271`) já preenchida.

## O que editar facilmente
- **Telefone do WhatsApp:** constante `WHATS_NUMBER` no topo de `app.js`.
- **Taxas / prazos / tipos:** objetos `TIPOS` e `ADMINS` em `app.js`.
- **Textos e fotos:** `index.html` e pasta `assets/`.
- **Cores:** variáveis `:root` no topo de `styles.css`.

Contato: Jefferson Horta — (27) 99850-3271 — Jeffersonnuneshorta@gmail.com
