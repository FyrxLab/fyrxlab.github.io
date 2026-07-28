# Changelog

Tutte le modifiche rilevanti alla mod **Absolute Furnace** verranno documentate qui.

## v1.2.7 (NeoForge 26.2)
- Port di Absolute Furnace a NeoForge 26.2.

## v1.2.6 (Forge 1.20.1)
*Absolute Furnace 1.2.6 è qui, e questa volta è un aggiornamento di correzioni: il forno stava fondendo molto meno di quanto dovesse, quindi lo abbiamo rintracciato e sistemato.*

* **[Correzione di Bug]** Corretto un bug importante per cui la GUI e la sua fusione automatica non leggevano mai l'inventario reale del blocco. Caricare combustibile e minerali manualmente non fondeva mai nulla da solo (prima funzionava solo l'automazione con tramogge/tubi).
* **[Ottimizzazione]** Ottimizzata la logica dei tick del forno per risolvere il suo inventario una volta per tick invece che una volta per accesso a ogni slot.
* **[Pulizia]** Rimosso codice morto residuo della vecchia GUI e della procedura di tick generate da MCreator.

*Con affetto, da jeamcube.*
