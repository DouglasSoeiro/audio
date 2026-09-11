# Sementinha
Aplicativo web estático de histórias infantis cristãs, em português. Interface responsiva, quatro ilustrações originais, mapa de seis etapas, calendário de escuta, temas claro e escuro, biblioteca por categoria, busca, favoritos locais, player contínuo e expandido, velocidade, volume e temporizador.

## Executar
`python3 -m http.server 4173 --directory dist`

## Substituir os áudios
Troque os arquivos `dist/assets/{noah,david,night,promise,shepherd,thanks}.m4a` pelas gravações finais. A duração é lida dos próprios arquivos. Edite títulos, descrições e capas na lista `stories` em `dist/app.js`. Remova os avisos de demonstração após substituir as narrações sintéticas. Os roteiros de demonstração estão em `scripts/create-demo-audio.py`.

Não há cadastro ou servidor de dados. Favoritos são mantidos neste navegador. As fontes Nunito e DM Sans são carregadas pelo Google Fonts com fallback local.

## Jornada e movimento
As etapas se abrem em sequência após ouvir 90% dos segundos distintos de cada áudio. Saltos de reprodução não contam. Um dia entra no calendário após 15 segundos de escuta. Progresso, favoritos e tema ficam no localStorage deste navegador; não há sincronização entre dispositivos.

O player combina movimento de câmera na ilustração, partículas de luz e barras que respondem à energia do áudio via Web Audio, com animação ilustrativa de fallback. A animação pausa com o áudio e respeita prefers-reduced-motion.

## Verificação
`node scripts/test-app.cjs` verifica desbloqueio, saltos, conclusão, dias, persistência, busca, tema e estrutura do player.
