# Overnight — 2026-09-13

Branch `overnight` (not merged into main). One commit per step.

| Step | Result | Commit |
|---|---|---|
| 1. Salary backfill | Done: 4,252 player-seasons filled | `3965d77` |
| 2. Today pipeline draft | Done: tested on 2026-04-10 | `de7689d` |
| 3. Tests | `build.py` and `flow.js` pass; the fantasy commands fail because the files don't exist | this commit |

---

## 1. Salary backfill

**Done**
- `tools/salary.py` (`fetch` / `build` / `apply`):
  - Fetched 384 basketball-reference team pages plus the salary-cap page, one every 4s. Cached in `tools/.cache/bbref/` (gitignored).
  - capPct = salary ÷ that season's cap. The cap values match the known figures (1996-97 $24.363M … 2025-26 $154.647M).
- Matched 4,252 of 4,357 null player-seasons:
  - name+team+season: 4,054
  - name+season for traded players: 166
  - surname+initial+team for nicknames: 32, all checked by hand
- Unmatched: `data/salary-unmatched.csv`, 105 rows, 9 of them starters. In every case bbref's table simply has no row.
- `tools/bundle.py` merges `data/salary-new.json` too, and fills only null values.
- Filled `bundle-full.json` with the same rule and rebuilt `bundle-lite.json` (`node tools/lite.js`).
- Per-season table: `docs/SALARY.md`.

**Not done / changed from the plan**
- **`tools/bundle.py` wasn't run.** It reads raw pulls that aren't in the repo (`v2.json`, `bio.json`, `old-cap.json`, …). I added the merge code but couldn't run it, so `bundle-full.json` was filled with `salary.py apply`, which uses the same rule.
- **Seasons in scope:** I added 1999-00 (21/314 covered) and 2002-03 (101/319) because they were almost empty too.
- **Wait between requests:** 4s instead of 3s, because Sports-Reference's limit is 20 requests a minute.
- **Encoding bug:** bbref sends no charset, and the first pass broke accented names (Jokić, Dončić, …). Fixed in code, and old cache files are repaired when read. That brought unmatched down from 190 to 105.

**Decisions for you**
1. **Other seasons are still only half covered.** 2000-01, 2001-02 and 2005-06 to 2019-20 sit at 47–62%. The old file only had about half of each roster. Running the same script on those 18 seasons is about 520 pages, roughly 50 minutes. Add them?
2. **The bundle got heavier.** `lite.js` keeps everyone with a salary, so lite went from 2.99MB to 3.87MB (+2,250 players). `index.html` went from 3.89MB to 4.88MB. Tighten the lite rule (e.g. only players over 15 minutes)?
3. **Michael Jordan 1996-97 and 1997-98 cost $124M / $123M.** That's more than the $100M cap, so he can never be signed. Cap his price, keep it that way on purpose, or leave him out of the draft?
4. **258 player-seasons are under 1% of the cap** (prorated 10-day and two-way deals). They get the $1M floor price. Fine as is?
5. `data/salary-new.json` is 858KB, committed with indent=1. Should it be compact?

---

## 2. Today pipeline draft

**Done**
- `tools/today.py [YYYY-MM-DD]` writes `data/today.json`. With no date it uses today in US Eastern.
  - (a) Schedule: `ScoreboardV3`
  - (b) Each team's latest starting five: last game before the date from `LeagueGameLog` (Regular Season, PlayIn, Playoffs), then the players with a position listed in `BoxScoreTraditionalV3`. The bundle `id` is attached when found.
  - (c) Yesterday's results: from `LeagueGameLog` rows dated the day before.
- Test on 2026-04-10:
  - 15 games
  - A five for all 30 teams, with last games dated 04-07 to 04-09
  - 6 results for 04-09
  - The committed `data/today.json` is that output.
- `.github/workflows/today.yml`: manual `workflow_dispatch` only. The `schedule` is commented out.

**Decisions for you**
1. **stats.nba.com often blocks GitHub Actions IPs.** It worked locally, but it may time out on a runner. Try a few manual runs first. If it's blocked, the options are the `cdn.nba.com` live endpoints (today's games only), a proxy, or running it on your Mac.
2. **Cron has no DST.** ET 6am is 10:00 UTC during EDT and 11:00 UTC during EST. The draft has `0 10 * * *` commented out, which lands at 5am in winter.
3. **Manual runs only appear in the Actions tab once the workflow file is on main.** While it's only on this branch, you can't press the Run button.
4. Does the app need all 30 teams' starters, or only the teams playing that day? Right now it's all 30, about 15–30 box score requests.

---

## 3. Tests

| Command | Result |
|---|---|
| `python3 build.py` | ✅ exit 0 (`index.html` rebuilt with the new salaries, included in this commit) |
| `node tools/flow.js` | ✅ 14 ok, 0 fail, ALL PASS |
| `python3 build_fantasy.py` | ❌ exit 2: the file doesn't exist |
| `node tools/flow-fantasy.js` | ❌ exit 1: the file doesn't exist |

Neither `build_fantasy.py` nor `tools/flow-fantasy.js` is in the repo, on any branch in git history, or in `~/Downloads`. As instructed, I didn't fix or create anything. If they're on another machine, or in a `repo N` folder that hasn't been copied over yet, they need to be added.

<details><summary>Logs</summary>

```
$ python3 build_fantasy.py
/opt/homebrew/Cellar/python@3.13/3.13.4/Frameworks/Python.framework/Versions/3.13/Resources/Python.app/Contents/MacOS/Python: can't open file '/Users/jaylee/beatball/build_fantasy.py': [Errno 2] No such file or directory

$ node tools/flow-fantasy.js
node:internal/modules/cjs/loader:1424
  throw err;
  ^

Error: Cannot find module '/Users/jaylee/beatball/tools/flow-fantasy.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1421:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1059:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1064:22)

$ node tools/flow.js
ok   start: Build a five, 73-9, no daily
ok   draft: wheel landed, board + dock
ok   five signed → best line-up → season: 38-44
ok   line-up is the five picked
ok   82 games
ok   ladder with your rank
ok   loss lessons header
ok   build again + share
ok   share button
ok   player sheet from the five strip (no footer outside the draft)
ok   you: best + history
ok   build tab shows your best
ok   reset
ok   no NaN/undefined
ALL PASS
```
</details>

---

## Other notes
- Python deps are in `~/.venvs/beatball` (requests, beautifulsoup4, lxml, nba_api), outside the repo. Homebrew Python blocks `pip install` (PEP 668).
- GitHub Pages serves main, so none of this is live.
