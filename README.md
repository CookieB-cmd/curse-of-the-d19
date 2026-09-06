# Curse of the D19

A tiny Foundry VTT v14 module for the truly cursed adventurer: roll a **real d19** with Dice So Nice.

## Actual mesh preview

![Actual d19 mesh preview](docs/d19-mesh-preview.svg)

The v0.2 runtime mesh is reconstructed from the physical outer faces of the deep-engraved D19 from **dAny - parametric Any Number Dice**. It is a lightweight, watertight GLB intended for Dice So Nice physics/rendering.

## Status

**v0.2.0 runtime test build**

This build replaces the old prototype geometry with the dAny-derived D19 shape. The immediate test is whether Dice So Nice accepts and animates the custom `d19` GLB when Foundry rolls `/r 1d19`.

The runtime GLB currently uses the clean physical envelope of the source die. Its engraved numerals are **not yet baked into this lightweight GLB** because Dice So Nice custom GLB models replace its normal label-generation path. Once the geometry is confirmed working in a live Foundry + Dice So Nice session, the next step is numbered face artwork/geometry plus verified result-to-face orientation.

## Requirements

- Foundry Virtual Tabletop v14
- Dice So Nice 6.2.x or another v14-compatible release

## Install for testing

Place the module folder at:

```text
Data/modules/curse-of-the-d19/
```

Restart Foundry, enable **Dice So Nice** and **Curse of the D19**, then enter:

```text
/r 1d19
```

### What to check

1. The module enables without errors.
2. `/r 1d19` returns a numerical result from 1 through 19.
3. A 3D die appears.
4. Whether the custom D19 shape appears or Dice So Nice falls back/rejects it.
5. If anything fails, copy the relevant browser-console error.

The console should contain:

```text
Curse of the D19 | Registered custom d19 model with Dice So Nice.
```

if registration reaches Dice So Nice successfully.

## Design rule

No fake d20. No remapped d24. 💀

## Model source and licensing

The D19 geometry is adapted from **dAny - parametric Any Number Dice (d19 d7 d13 d21 d20 d9 d100)** by **dunaevai135**:

https://www.printables.com/model/769247-dany-parametric-any-number-dice-d19-d7-d13-d21-d20

The adapted model remains under **CC BY-SA**. See [ATTRIBUTION.md](ATTRIBUTION.md) and [models/README.md](models/README.md).

The Foundry module code is licensed separately under the MIT License.
