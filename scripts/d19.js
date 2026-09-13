/**
 * Curse of the D19
 * Target: Foundry VTT 14.367 + Dice So Nice 6.2.9
 *
 * Foundry owns the real d19 result. DSN is forced to animate the message,
 * then the visual-only roll is substituted with a supported d24 carrier.
 */

const MODULE_ID = "curse-of-the-d19";
const SYSTEM_ID = "curse-of-the-d19";

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

function messageD19Results(messageId) {
  const message = game.messages?.get(messageId);
  if (!message) return [];

  const rolls = Array.isArray(message.rolls) && message.rolls.length
    ? message.rolls
    : (message.roll ? [message.roll] : []);

  return rolls.flatMap(findD19Results);
}

Hooks.once("init", () => {
  console.info("Curse of the D19 | v0.3.1 module loaded.");
});

Hooks.once("diceSoNiceReady", async (dice3d) => {
  if (!dice3d || typeof dice3d.addSystem !== "function" || typeof dice3d.addDicePreset !== "function") {
    console.warn("Curse of the D19 | Dice So Nice 6.2.9 API unavailable.");
    return;
  }

  dice3d.addSystem({ id: SYSTEM_ID, name: "Curse of the D19" }, "preferred");
  dice3d.addDicePreset({
    type: "d24",
    system: SYSTEM_ID,
    modelFile: `modules/${MODULE_ID}/models/d19.glb`
  });

  if (typeof dice3d.preloadPresets === "function") {
    await dice3d.preloadPresets(SYSTEM_ID);
  }

  console.info("Curse of the D19 | v0.3.1 DSN bridge ready.");
});

// DSN normally declines unsupported d19 messages before RollStart can fire.
// v6 exposes this hook specifically to force the animation decision earlier.
Hooks.on("diceSoNiceMessagePreProcess", (messageId, interception) => {
  const results = messageD19Results(messageId);
  if (!results.length) return;

  interception.willTrigger3DRoll = true;
  console.info(`Curse of the D19 | forcing DSN animation for d19 message ${messageId}: ${results.join(",")}`);
});

// Once DSN has accepted the message, replace only the animation Roll object.
// The ChatMessage and its real 1-19 result are never modified.
Hooks.on("diceSoNiceRollStart", (messageId, context) => {
  const d19Results = findD19Results(context?.roll);
  if (!d19Results.length) return;

  const result = d19Results[0];
  const visualRoll = new Roll("1d24").evaluateSync();
  const visualDie = visualRoll.dice?.[0];

  if (!visualDie?.results?.[0]) {
    console.error("Curse of the D19 | could not construct d24 visual carrier.");
    return;
  }

  // Reuse the genuine d19 result as the visual landing value (1..19 is valid on d24).
  visualDie.results[0].result = result;
  visualDie.options = visualDie.options ?? {};
  visualDie.options.appearance = {
    ...(visualDie.options.appearance ?? {}),
    system: SYSTEM_ID
  };

  context.roll = visualRoll;
  console.info(`Curse of the D19 | visual substitution armed: d19=${result} -> d24 carrier=${result}`);

  if (result === 19) {
    ui.notifications?.info("A natural 19. You feel cursed.");
  }
});
