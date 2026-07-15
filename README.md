# landing-page

Página pública do PersonalAqui (HTML/CSS/JS puro, sem build). **Fonte única**: o frontend espelha esta pasta em `frontend/public/` no `predev`/`prebuild` (script `infrastructure/scripts/sync-landing-web.mjs`) e a serve como home (`/`).

- Publicação externa (GitHub Pages): só via `npm run deploy:landing` na raiz
- Identidade visual: tokens em `tokens.css` (copiados para o CSS da plataforma pelo sync)
- Imagens compartilhadas com a plataforma ficam em `imagens/` (nunca em `frontend/public/`, que é apagado a cada sync)
