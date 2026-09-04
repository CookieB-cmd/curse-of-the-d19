/**
 * Curse of the D19
 * Foundry VTT v14 / Dice So Nice integration.
 *
 * Numerical d19 evaluation remains Foundry's responsibility.
 * This module only registers the visual preset when Dice So Nice is ready.
 */
Hooks.once("diceSoNiceReady", (dice3d) => {
  if (!dice3d || typeof dice3d.addSystem !== "function" || typeof dice3d.addDicePreset !== "function") {
    console.warn("Curse of the D19 | Dice So Nice API unavailable; numerical d19 rolls remain untouched.");
    return;
  }

  dice3d.addSystem({ id: "curse-of-the-d19", name: "Curse of the D19" }, "preferred");

  dice3d.addDicePreset({
    type: "d19",
    labels: Array.from({ length: 19 }, (_, i) => String(i + 1)),
    system: "curse-of-the-d19",
    modelFile: "modules/curse-of-the-d19/models/d19.glb"
  }, "d19");
});
