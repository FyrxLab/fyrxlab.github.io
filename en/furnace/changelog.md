# Changelog

All notable changes to the **Absolute Furnace** mod will be documented here.

## v1.2.7 (NeoForge 26.2)
- Ported Absolute Furnace to NeoForge 26.2.

## v1.2.6 (Forge 1.20.1)
*Absolute Furnace 1.2.6 is here, and this time it's a fix-it update: the furnace was smelting a lot less than it should've been, so we tracked it down and put it right.*

* **[Bug Fix]** Fixed a major bug where the GUI and its automatic smelting never actually read the block's real inventory. Loading fuel and ore manually never smelted anything on its own (only hopper/pipe automation worked before).
* **[Optimization]** Optimized the furnace's tick logic to resolve its inventory once per tick instead of once per slot access.
* **[Cleanup]** Removed leftover dead code from the old MCreator-generated GUI and tick procedure.

*With love, from jeamcube.*
