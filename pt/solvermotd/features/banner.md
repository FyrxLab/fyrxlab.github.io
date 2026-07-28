# Banners de Imagem 1.21.9+

A partir do Minecraft 1.21.9, a lista de servidores multijogador suporta a exibição de gráficos personalizados grandes em vez de apenas o ícone padrão do servidor e duas linhas de texto.

O **SolverMOTD** suporta totalmente esse recurso através de um sistema automatizado de conversão de imagem para skin.

## Como Funciona

Quando você fornece uma imagem PNG `264x16`, o SolverMOTD vai automaticamente fatiá-la em 66 skins de jogador separadas. Em seguida, ele envia essas skins para o [MineSkin](https://mineskin.org/) em segundo plano.

Depois de enviadas, o plugin armazena em cache os dados de textura em um arquivo `banner_cache.json`. Quando um jogador rodando Minecraft 1.21.9 ou mais novo dá ping no seu servidor, o plugin monta dinamicamente o banner usando essas texturas de skin.

> [!WARNING]
> O processo inicial de envio pode levar vários minutos devido aos limites de taxa da API do MineSkin. Isso só acontece **uma vez**, quando você ativa o banner pela primeira vez ou troca a imagem.

## Instruções de Configuração

1. Crie uma imagem PNG com exatamente **264 pixels de largura por 16 pixels de altura**.
2. Coloque a imagem (ex.: `banner.png`) dentro da pasta `plugins/SolverMOTD/`.
3. Abra o `config.yml` e ative o recurso de banner:

```yaml
banner:
  enabled: true
  file: "banner.png"
  # Fallback shown to players on versions older than 1.21.9.
  fallback-line1: "      &o! &lSolverMotd &o!"
  fallback-line2: "         &aCheck out our new server!"
```

4. Reinicie seu servidor ou rode `/smotd reload`.
5. Aguarde o plugin processar e enviar os tiles. Você vai ver o progresso no console do seu servidor.
6. Assim que terminar, seu servidor vai exibir o banner enorme para todos os clientes atualizados!
