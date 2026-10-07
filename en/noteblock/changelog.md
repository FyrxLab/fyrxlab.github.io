# Changelog

All notable changes to the **Noteblock** mod are documented here.

## v1.2.0 — One Jar, Every Loader

> Released: October 2026

### New

- **One jar for Fabric, Forge and NeoForge.** The same file loads on all three loaders and picks the right code for the Minecraft version it finds, from **1.18 up to 26.3** (NeoForge from 1.20.1). No more separate downloads per loader.
- **All 11 discs on every loader.** Storm Eagle, previously Fabric-only, is now on Forge and NeoForge too.
- **Creeper drops everywhere.** A creeper killed by a skeleton can drop any Noteblock disc on every loader (this used to be Fabric-only).
- **Tools & Utilities tab.** Besides the Noteblock tab, the discs are also listed in the vanilla Tools & Utilities creative tab, next to the vanilla discs.
- **Translations:** Spanish (Spain and Mexico), Brazilian Portuguese and Italian.

### Changed

- Discs now look like vanilla ones: the item is called **Music Disc** and the song appears in the tooltip as "JEAMCube - *song*". The Forge build used to name each item "*song* Disc".
- On Minecraft 1.21 and newer the songs are registered as data-driven jukebox songs, so they behave exactly like vanilla discs (tooltips, jukebox playback, comparator output).

### Fixed

- **Song lengths now match the audio**, so jukeboxes and comparators stop exactly when a song ends. Howl Moving Castle was declared as 3:57 but is 3:27.
- The Fabric build declared the wrong license in its metadata. Noteblock is All Rights Reserved on every loader.

## v1.1.2 (Fabric 1.20.1)

- New song: **Storm Eagle**.

## v1.1.1 (Forge 1.20.1)

- Brought the Fabric songs to Forge: Hyrule Castle, Pandora Palace, Attack of the Killer Queen, Studiopolis Zone, Howl Moving Castle, Lumiose City, Gravity Falls, The Painful Way, No Escape and Super Mario Maker.

Earlier releases are listed on [Modrinth](https://modrinth.com/mod/noteblock/versions).
