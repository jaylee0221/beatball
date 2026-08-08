# BeatBall

A fast, contested NBA all-time draft game. A wheel lands on a legendary team-season; you and a rival each sign one player from it — take his guy and he's gone. Fill a starting five under a salary cap, then a matchup sim reveals who wins and *why*.

The point of the game isn't collecting the most talent — it's understanding how players fit together. Cap and usage are two budgets you spend at once, so the skill is finding underpriced, low-usage producers, not hoarding stars.

## Play

Open `beatball.html` in a browser. No build step, no server needed.

## Files

**Game**
- `beatball.html` — the game (self-contained; team data lives in a block at the top)
- `beatball-data.js` / `beatball-data.json` — team/player data (the `.json` is the clean, validatable source of truth)

**Tools** (used during design; not part of the shipped game)
- `beatball-tuner.html` — live sliders for tuning the scoring-model weights
- `beatball-validator.html` — checks the data for errors/typos before a big fill
- `beatball-usage.html` — isolated bench for the usage-redistribution math
- `beatball-engine.html` — bare scoring-model readout

**Style explorations**
- `beatball-showcase.html`, `beatball-matchup.html`, `beatball-lineups.html`

## How it works (design decisions)

- **Engine / data separation.** The game is pure logic; teams live in a data file. Adding a team = editing data, never touching the game.
- **Scoring model.** Each player's 8 stats (PTS, 3PM, REB, AST, STL, BLK, FG%, TO) are normalized against fixed anchors, then weighted (weights were hand-tuned by feel). Turnovers count against; FG% is weighted low because it's a rate that overrates low-usage bigs.
- **Cap-share pricing.** Price is a *real fact* — a player's salary as a share of that season's cap — stored per player, never derived from talent. The gap between talent (OVR) and price is where the game lives.
- **Position fit.** Soft positions: you can play anyone anywhere, but value drops with distance from a player's nearest eligible slot (multi-position eligibility, Yahoo-style). No dead-ends, only priced-in compromises.
- **Usage redistribution.** A second budget. Ball-dependent stats (scoring, playmaking, threes, turnovers) scale down when a team's usage exceeds 100%; rebounds, defense, and efficiency don't. Five ball-dominant stars cannibalize each other; specialists never get taxed.
- **Sim + reveal.** Deterministic team-strength comparison mapped to a scoreline, plus a radar of each team's profile so you see *how* the teams differ, not just who won.

## Status

- **Built & working:** the full single-device (hot-seat) game — draft, cap, fit, usage, reveal.
- **Demo, not real:** the data. Seven teams, mostly approximate stats/salaries (only the 2015-16 Cavs starters are verified). Real rosters need to be sourced from a dataset and checked with the validator.
- **Not built yet:** the multiplayer link (rooms + join + sync) so friends can draft against each other remotely.

## Next

1. Fill real data: source stats + salaries + usage for the curated 32 team-seasons (1979-80 floor), validate, drop into the data file.
2. Build the joinable multiplayer link (turn-based → trust-the-clients keeps it simple for a friend group).
