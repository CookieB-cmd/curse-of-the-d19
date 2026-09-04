# Curse of the D19

A tiny Foundry VTT v14 module for the truly cursed adventurer: roll a **real d19** with Dice So Nice.

## Goal

Once installed alongside Dice So Nice, ordinary Foundry rolls such as:

```text
/r 1d19
```

should use a dedicated 19-sided visual die while Foundry handles the numerical result from 1–19.

## Status

**v0.1.0 prototype**

The module scaffold, manifest, custom model asset, tests, and packaging are in place. The remaining validation step is a live Foundry v14 + Dice So Nice runtime test to verify the custom model is accepted by Dice So Nice physics/rendering and that visible face orientation matches the reported result.

## Requirements

- Foundry Virtual Tabletop v14
- Dice So Nice 6.2.x or another v14-compatible release

## Install

For the current prototype, place the module folder at:

```text
Data/modules/curse-of-the-d19/
```

Then restart Foundry and enable both **Dice So Nice** and **Curse of the D19**.

## Usage

```text
/r 1d19
```

No special macro should be required.

## Design rule

No fake d20. No remapped d24. The project is intentionally aiming for a dedicated d19 model.

## Development

Run the JavaScript tests with:

```bash
node --test tests/manifest.test.mjs tests/integration.test.mjs
```

Run the model test with:

```bash
python -m pytest tests/model_test.py -q
```

Build the installable ZIP with:

```bash
python tools/package.py
```

## License

MIT
