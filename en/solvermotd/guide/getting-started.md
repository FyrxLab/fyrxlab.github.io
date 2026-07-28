# Getting Started

**SolverMOTD** is a lightweight, cross-platform MOTD plugin. Because it is compiled universally, the exact same `.jar` file can be placed into the `plugins/` folder of any Bukkit, Spigot, BungeeCord, or Velocity server!

## Installation
1. Download the latest `SolverMOTD.jar` from Modrinth.
2. Place the `.jar` into your server's `plugins/` directory.
3. Restart your server.

## Configuration
Once the server starts, it will generate a `config.yml` in the `plugins/SolverMOTD/` folder.

You can edit your MOTD text under the `motd:` section:

```yaml
motd:
  line1: "      <white><obf>!</obf> <bold><yellow>Solver</yellow><red>Motd</red> <aqua>Plugin</aqua></bold>"
  line2: "         <green>Setup your <yellow>Config.yml</yellow> file!</green>"
```

### Formatting
We highly recommend using **MiniMessage** format (e.g., `<red>Text</red>`) instead of legacy ampersand codes (`&cText`). MiniMessage is much more robust for modern clients and supports gradients and hex colors effortlessly. 

> [!NOTE]
> If you have **PlaceholderAPI** installed on your server, SolverMOTD will automatically parse placeholders in your MOTD!

## Reloading
After making changes to your configuration, you do not need to restart your server. Simply run the `/smotd reload` command to apply your new MOTD instantly!
