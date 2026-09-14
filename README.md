# Sementinha da Fé
Aplicativo web estático de histórias infantis cristãs, em português. Interface responsiva, jornada de 40 histórias em cinco jardins, calendário de escuta, temas claro e escuro, biblioteca por categoria, busca, favoritos locais, player contínuo e expandido, velocidade, volume e temporizador.

## Executar
`node scripts/serve.cjs`

O servidor local aceita requisições parciais de áudio (`Range`), necessárias para que a barra de reprodução e os botões de avançar/voltar funcionem corretamente no navegador.

## Áudios
As 40 narrações finais estão em `dist/assets/audio`, separadas nos mesmos cinco módulos do catálogo. Os arquivos são MP3 mono, 44,1 kHz e 128 kbps, gerados a partir dos WAV originais da Cartesia. O vínculo explícito entre cada história e seu áudio fica em `dist/story-catalog.js`.

Os arquivos-fonte permanecem localmente em `cartesia_audio`, que é ignorada pelo Git para não acrescentar cerca de 1 GB ao repositório. Para confirmar que numeração, módulo, título e arquivo continuam alinhados, execute `node scripts/verify-audio-catalog.cjs`.

Não há cadastro ou servidor de dados. Favoritos são mantidos neste navegador. As fontes Nunito e DM Sans são carregadas pelo Google Fonts com fallback local.

## Jornada e movimento
As etapas se abrem em sequência após ouvir 90% dos segundos distintos de cada áudio. Saltos de reprodução não contam. Um dia entra no calendário após 15 segundos de escuta. Progresso, favoritos e tema ficam no localStorage deste navegador; não há sincronização entre dispositivos.

O player combina movimento de câmera na ilustração, partículas de luz e barras que respondem à energia do áudio via Web Audio, com animação ilustrativa de fallback. A animação pausa com o áudio e respeita prefers-reduced-motion.

## Verificação
`node scripts/test-app.cjs` verifica desbloqueio, saltos, conclusão, dias, persistência, busca, tema e estrutura do player. `node scripts/verify-audio-catalog.cjs` verifica os 40 vínculos de áudio.
