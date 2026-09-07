/**
 * Curse of the D19
 * Foundry VTT v14 / Dice So Nice integration.
 *
 * Foundry remains responsible for evaluating the numerical 1d19 result.
 * Dice So Nice is only asked to render the custom d19 GLB when its API is ready.
 */
Hooks.once("diceSoNiceReady", (dice3d) => {
  if (!dice3d || typeof dice3d.addSystem !== "function" || typeof dice3d.addDicePreset !== "function") {
    console.warn("Curse of the D19 | Dice So Nice API unavailable; numerical d19 rolls remain untouched.");
    return;
  }

  dice3d.addSystem({ id: "curse-of-the-d19", name: "Curse of the D19" }, "preferred");

  dice3d.addDicePreset({
    type: "d19",
    system: "curse-of-the-d19",
    modelFile: "modules/curse-of-the-d19/models/d19.glb"
  }, "d24");

  console.info("Curse of the D19 | Registered d19 model using DSN d24 physics host for display testing.");
});
