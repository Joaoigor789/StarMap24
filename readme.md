# StarMap 24/7 

[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange)](https://github.com/seuusuario/starmap)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-blue)](https://leafletjs.com/)
[![Starlink](https://img.shields.io/badge/Satélites-Starlink-blueviolet)](https://www.starlink.com/)

## Descrição
**StarMap 24/7** é um rastreador interativo de satélites Starlink em tempo real, mostrando também as posições do Sol e da Lua no globo.  
Permite visualizar órbitas, monitorar posições geográficas e acompanhar movimentos ao longo de 24 horas. Ideal para entusiastas de astronomia, telecomunicações e observação espacial.

## Funcionalidades
- Rastreamento de satélites Starlink (atualizado a cada segundo)
- Visualização dinâmica do Sol e da Lua com base na hora e data do Brasil
- Órbitas dos satélites com opção de ativar/desativar
- Informações de latitude e longitude em tempo real
- Lista de satélites exibida via alerta
- Centralização do mapa em qualquer momento

## Tecnologias
- Node.js
- Express
- Leaflet.js
- Satellite.js
- SunCalc
- OpenStreetMap

----------------------------

Seu server.js funciona, mas não tem proteção contra excesso de requisições nem segurança HTTP básica. Como você usa CommonJS (require) e node-fetch dinâmico, é necessário adicionar rate limiter e cabeçalhos de segurança (como o helmet) para proteger o servidor e o endpoint de TLE. bash 

----------------------------

![Visualização do StarMap](public/img/starmap_preview.png)

## Como Executar
1. Clone este repositório:

```bash
git clone https://github.com/seuusuario/starmap.git
cd starmap
Instale as dependências:

npm install

Inicie o servidor:

node server.js

Abra no navegador:

http://localhost:3000

```

Licença
Este projeto está licenciado sob a licença MIT.

## Criador

# João igor
---

Se quiser, posso **gerar uma versão ainda mais “profissional”**, com **GIF ou imagens de preview do mapa**, e **mais badges**, tipo GitHub Actions, downloads ou versão Node.  

Quer que eu faça essa versão avançada também?