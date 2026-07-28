# 1.21.9+ Image Banners

Starting with Minecraft 1.21.9, the multiplayer server list supports displaying large custom graphics instead of just the standard server icon and two lines of text.

**SolverMOTD** fully supports this feature through an automated image-to-skin conversion system.

## How it works

When you provide a `264x16` PNG image, SolverMOTD will automatically slice it into 66 separate player skins. It then uploads these skins to [MineSkin](https://mineskin.org/) in the background.

Once uploaded, the plugin caches the texture data into a `banner_cache.json` file. When a player running Minecraft 1.21.9 or newer pings your server, the plugin dynamically constructs the banner using those skin textures.

> [!WARNING]
> The initial upload process can take several minutes due to MineSkin API rate limits. This only happens **once** when you first enable the banner or change the image.

## Setup Instructions

1. Create a PNG image that is exactly **264 pixels wide by 16 pixels high**.
2. Place the image (e.g., `banner.png`) inside your `plugins/SolverMOTD/` folder.
3. Open `config.yml` and enable the banner feature:

```yaml
banner:
  enabled: true
  file: "banner.png"
  # Fallback shown to players on versions older than 1.21.9.
  fallback-line1: "      &o! &lSolverMotd &o!"
  fallback-line2: "         &aCheck out our new server!"
```

4. Restart your server or run `/smotd reload`.
5. Wait for the plugin to process and upload the tiles. You will see progress in your server console.
6. Once complete, your server will display the massive banner to all updated clients!
