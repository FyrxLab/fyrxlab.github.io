# Automation & Slots

One of the most powerful features of the **Absolute Furnace** is its ability to seamlessly integrate into automated systems using hoppers, pipes, or any other modded logistics system.

## Slot Layout & Access Sides
The furnace exposes specific slots depending on which face of the block you interact with. This makes hopper automation straightforward:

* **Top Face (Slots 0-5):** Only accepts items into the **Material Input** slots. Use this to feed ores or food.
* **Side Faces (North, South, East, West) (Slots 6-11):** Only accepts items into the **Energy Input** slots. Use these faces to feed coal, wood, or other fuels.
* **Bottom Face (Slots 12-17):** Only extracts items from the **Material Output** slots. Use this to pull out your freshly smelted ingots.

> [!TIP]
> Because there are 6 slots for each category, you can connect multiple hoppers or high-tier pipes to rapidly insert and extract items without creating a bottleneck.

## Internal Routing
The Absolute Furnace will automatically search for the first available slot when items are inserted, and will intelligently stack identical outputs together to maximize its 6 output slots.
