# Primeiros Passos

O **SolverMOTD** é um plugin de MOTD leve e multiplataforma. Como é compilado de forma universal, o exato mesmo arquivo `.jar` pode ser colocado na pasta `plugins/` de qualquer servidor Bukkit, Spigot, BungeeCord ou Velocity!

## Instalação
1. Baixe o `SolverMOTD.jar` mais recente no Modrinth.
2. Coloque o `.jar` no diretório `plugins/` do seu servidor.
3. Reinicie o servidor.

## Configuração
Assim que o servidor iniciar, ele vai gerar um `config.yml` na pasta `plugins/SolverMOTD/`.

Você pode editar o texto do seu MOTD na seção `motd:`:

```yaml
motd:
  line1: "      <white><obf>!</obf> <bold><yellow>Solver</yellow><red>Motd</red> <aqua>Plugin</aqua></bold>"
  line2: "         <green>Setup your <yellow>Config.yml</yellow> file!</green>"
```

### Formatação
Recomendamos fortemente usar o formato **MiniMessage** (ex.: `<red>Texto</red>`) em vez de códigos legados com "e comercial" (`&cTexto`). O MiniMessage é muito mais robusto para clientes modernos e suporta gradientes e cores hexadecimais sem esforço.

> [!NOTE]
> Se você tiver o **PlaceholderAPI** instalado no seu servidor, o SolverMOTD vai processar automaticamente os placeholders no seu MOTD!

## Recarregando
Depois de fazer alterações na sua configuração, você não precisa reiniciar o servidor. Basta rodar o comando `/smotd reload` para aplicar seu novo MOTD instantaneamente!
