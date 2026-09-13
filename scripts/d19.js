/**
 * Curse of the D19
 * Target: Foundry VTT 14.367 + Dice So Nice 6.2.9
 *
 * Foundry remains the source of truth for the real d19 result.
 * DSN does not natively render d19 terms, so we suppress only the d19 visual
 * term and ask DSN to animate a supported d24 carrier with the same result.
 */

const MODULE_ID = "curse-of-the-d19";
const SYSTEM_ID = "curse-of-the-d19";
let dice3dApi = null;
let bridgeActive = false;

Hooks.once("diceSoNiceReady", (dice3d) => {
  dice3dApi = dice3d;

  if (!dice3d || typeof dice3d.addSystem !== "function" || typeof dice3d.addDicePreset !== "function") {
    console.warn("Curse of the D19 | Dice So Nice API unavailable; numerical d19 rolls remain untouched.");
    return;
  }

  dice3d.addSystem({ id: SYSTEM_ID, name: "Curse of the D19" }, false);

  // DSN knows d24 physics. The GLB replaces the visible model while Foundry
  // continues to calculate the real d19 result independently.
  dice3d.addDicePreset({
    type: "d24",
    labels: "",
    system: SYSTEM_ID,
    modelFile: `modules/${MODULE_ID}/models/d19.glb`
  });

  console.info("Curse of the D19 | v0.3 bridge armed for Foundry 14.367 / DSN 6.2.9.");
});

function findD19Results(roll) {
  const results = [];
  for (const die of roll?.dice ?? []) {
    if (Number(die.faces) !== 19) continue;
    for (const result of die.results ?? []) {
      if (result.active === false || result.discarded === true) continue;
      const value = Number(result.result);
      if (Number.isInteger(value) && value >= 1 && value <= 19) results.push(value);
    }
  }
  return results;
}

/**
 * Dice So Nice exposes this hook specifically so modules may substitute the
 * visual roll without changing the original Foundry Roll reference.
 */
Hooks.on("diceSoNiceRollStart", async (messageId, context) => {
  if (bridgeActive || !dice3dApi) return;

  const originalRoll = context?.roll ?? context;
  const d19Results = findD19Results(originalRoll);
  if (!d19Results.length) return;

  bridgeActive = true;
  try {
    for (const result of d19Results) {
      // The carrier has 24 sides only because DSN has no d19 physics type.
      // The forced result is always the already-evaluated Foundry d19 value.
      const carrierResult = Math.min(24, result);
      const visualRoll = await new Roll("1d24").evaluate();
      const die = visualRoll.dice?.[0];
      if (die?.results?.[0]) die.results[0].result = carrierResult;

      visualRoll.options = visualRoll.options ?? {};
      visualRoll.options.appearance = {
        ...(visualRoll.options.appearance ?? {}),
        system: SYSTEM_ID
      };

      const displayed = await dice3dApi.showForRoll(visualRoll, game.user, false, null, false);
      console.info(`Curse of the D19 | d19=${result}; carrier=d24; displayed=${displayed}`);

      if (result === 19) {
        ui.notifications?.info("A natural 19. You feel cursed.");
      }
    }
  } catch (error) {
    console.error("Curse of the D19 | d19 render bridge failed", error);
  } finally {
    bridgeActive = false;
  }
});
