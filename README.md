# Fantasyball

Build a five, it plays an 82-game season against real NBA starting fives, the record is the score.
One HTML file, no server. Engine fitted to 450 real playoff series and 892 real seasons.

## Layout
- `src/app.js` — the game (views, draft, season, coach block)
- `src/style.css`, `src/fonts.css` — Barlow Condensed + Barlow, embedded (OFL)
- `src/engine.js` — rating engine v2 (Ridge offence, blended defence, usage tax)
- `data/bundle-full.json` — every player-season and team (from nba_api); `bundle-lite.json` — what ships
- `tools/bundle.py` — rebuilds bundle-full from raw pulls; `tools/lite.js` — makes bundle-lite (+ percentile tables)
- `tools/flow.js` — end-to-end test; `bot.js` / `tune.js` / `audit.js` / `fitgame.js` — calibration
- `build.py` — writes `index.html` (GitHub Pages serves it)

## Build & test
```
python3 build.py && node tools/flow.js
```

## Ship
```
python3 build.py && node tools/flow.js && git add -A && git commit -m "build" && git push
```
GitHub Pages: Settings → Pages → Deploy from branch → `main` / root. Then open the URL on the phone and Add to Home Screen.

## Data refresh
1. Pull with nba_api (see the collection notes in docs) → `tools/bundle.py` → `data/bundle-full.json`
2. `node tools/lite.js` → `data/bundle-lite.json`
3. `python3 build.py`
