# Sementinha
Aplicativo web estático de histórias infantis cristãs, em português. Interface responsiva, três ilustrações originais, biblioteca por categoria, busca, favoritos locais, player contínuo e expandido, velocidade, volume e temporizador.

## Executar
`python3 -m http.server 4173 --directory dist`

## Substituir os áudios
Troque `dist/assets/noah.m4a`, `david.m4a` e `night.m4a` pelas gravações finais. A duração é lida dos próprios arquivos. Edite títulos, descrições e capas na lista `stories` em `dist/app.js`. Remova os avisos de demonstração após substituir as narrações sintéticas. Os roteiros de demonstração estão em `scripts/create-demo-audio.py`.

Não há cadastro ou servidor de dados. Favoritos são mantidos neste navegador. As fontes Nunito e DM Sans são carregadas pelo Google Fonts com fallback local.
