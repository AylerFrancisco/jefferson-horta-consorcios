# Jefferson Horta — Consórcios & Investimentos

Landing page institucional e de captação de leads do consultor **Jefferson Horta**,
especialista em consórcios das maiores administradoras do Brasil (Embracon, Magalu,
Santander, Porto, Itaú, Banco do Brasil e Volkswagen).

🔗 **Site no ar:** https://jeffersonconsorcio.com.br

---

## Sobre o projeto

O objetivo do site é apresentar o trabalho do consultor e **gerar contato qualificado**
via WhatsApp. O visitante faz uma simulação rápida e o pedido chega pronto para o
consultor dar sequência na negociação.

### Funcionalidades

- **Simulador de consórcio em 3 passos**
  1. Escolha do tipo (Imóveis, Veículos, Serviços, Investimento, Reformas)
  2. Valor do crédito (carta) por meio de slider
  3. Valor da parcela que cabe no orçamento — com campo extra de **lance** quando o
     objetivo é contemplação imediata
- **Envio direto para o WhatsApp** do consultor, com todos os dados do pedido já
  formatados na mensagem
- **Seção de administradoras parceiras** em cards, com os segmentos que cada uma atende
- **Identidade visual própria**: paleta navy + dourado, logo, selo "0% de juros" e
  ícones desenhados sob medida
- **100% responsivo** (desktop, tablet e celular) e otimizado para carregamento rápido

---

## Tecnologia

Site **estático**, sem framework e sem etapa de build — apenas HTML, CSS e JavaScript
puro (vanilla). Isso o torna leve, rápido e simples de hospedar em qualquer serviço.

- HTML5 semântico
- CSS3 (design system com variáveis, grid e flexbox)
- JavaScript (ES6) sem dependências externas
- Hospedagem: **GitHub Pages** com domínio próprio e HTTPS

## Estrutura

```
.
├── index.html      # marcação e conteúdo de todas as seções
├── styles.css      # design system e estilos responsivos
├── app.js          # lógica do simulador e integração com o WhatsApp
├── assets/         # imagens, logos das administradoras e ícones
├── CNAME           # domínio personalizado (GitHub Pages)
└── .nojekyll       # desativa o processamento Jekyll
```

---

## Rodar localmente

Por ser estático, basta abrir o `index.html` no navegador. Para uma prévia mais fiel
(com servidor local), use qualquer servidor estático, por exemplo:

```bash
# Python
python -m http.server 5500

# ou Node
npx serve .
```

E acesse `http://localhost:5500`.

## Publicar atualizações

O site é publicado automaticamente pelo GitHub Pages a cada envio para a branch `main`:

```bash
git add -A
git commit -m "descrição da alteração"
git push origin main
```

A nova versão fica no ar em cerca de 1 minuto, mantendo domínio e HTTPS.

---

## Contato do consultor

**Jefferson Horta** — Consórcios & Investimentos
📱 (27) 99850-3271 · ✉️ jeffersonnuneshorta@gmail.com

---

<sub>Desenvolvido por **Ayler Francisco** · WhatsApp (27) 99864-6574</sub>
