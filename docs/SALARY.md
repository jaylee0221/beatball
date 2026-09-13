# Salaries

`capPct` = a player's salary that season ÷ that season's salary cap. The game's price is `max(1, round(capPct*100))` in $M of a $100M cap.

## Sources
- **Old** (`data/salary-old.json`, merged by `tools/bundle.py`): hand-built file, keyed `nbaId:season`.
- **New** (`data/salary-new.json`, `tools/salary.py`): basketball-reference team pages (the "Salaries" table) and the salary-cap history page. It only fills a `capPct` that is still null; it never overwrites the old file.
  - Seasons scraped: 1996-97 – 1999-00, 2002-03 – 2004-05, 2020-21 – 2025-26 (13 seasons, 384 team pages, 4s apart, cached in `tools/.cache/bbref/`, gitignored).
  - Matching (bbref has no nbaId), in order:
    1. name + team + season (4,054)
    2. name + season, when only one player with that name played that season (traded players; the highest figure wins) (166)
    3. surname + first initial + team + season, when exactly one player on each side (Steven/Steve Smith, Mo/Mohamed Bamba, GG/Gregory Jackson) (32; all checked by hand)
  - Names are compared without accents, punctuation, or Jr/II/III suffixes.
  - Unmatched: `data/salary-unmatched.csv` (105 player-seasons, 9 of them starters). In every case bbref's table has no row for the player.

## Rebuild
```
~/.venvs/beatball/bin/python tools/salary.py fetch   # only fetches what isn't cached
~/.venvs/beatball/bin/python tools/salary.py build   # -> data/salary-new.json, data/salary-unmatched.csv
~/.venvs/beatball/bin/python tools/salary.py apply   # fill data/bundle-full.json (tools/bundle.py does the same when rebuilding from raw pulls)
node tools/lite.js
```

## Salary caps used
| Season | Cap |
|---|---:|
| 1996-97 | $24,363,000 |
| 1997-98 | $26,900,000 |
| 1998-99 | $30,000,000 |
| 1999-00 | $34,000,000 |
| 2002-03 | $40,271,000 |
| 2003-04 | $43,840,000 |
| 2004-05 | $43,870,000 |
| 2020-21 | $109,140,000 |
| 2021-22 | $112,414,000 |
| 2022-23 | $123,655,000 |
| 2023-24 | $136,021,000 |
| 2024-25 | $140,588,000 |
| 2025-26 | $154,647,000 |

## Players with a salary, by season
"Before" is `bundle-full.json` before this merge. "Lite" is `bundle-lite.json`, which keeps every starter plus everyone with a salary.

| Season | Before (full) | After (full) | Coverage | Lite players | Lite with salary |
|---|---:|---:|---:|---:|---:|
| 1996-97 | 0 | 304 / 313 | 97% | 305 | 304 |
| 1997-98 | 0 | 302 / 312 | 97% | 305 | 302 |
| 1998-99 | 0 | 280 / 295 | 95% | 284 | 280 |
| 1999-00 | 21 | 312 / 314 | 99% | 312 | 312 |
| 2000-01 | 175 | 175 / 314 | 56% | 242 | 175 |
| 2001-02 | 193 | 193 / 311 | 62% | 257 | 193 |
| 2002-03 | 101 | 318 / 319 | 100% | 318 | 318 |
| 2003-04 | 27 | 320 / 325 | 98% | 320 | 320 |
| 2004-05 | 27 | 331 / 340 | 97% | 331 | 331 |
| 2005-06 | 186 | 186 / 321 | 58% | 257 | 186 |
| 2006-07 | 173 | 173 / 313 | 55% | 252 | 173 |
| 2007-08 | 186 | 186 / 320 | 58% | 250 | 186 |
| 2008-09 | 191 | 191 / 327 | 58% | 261 | 191 |
| 2009-10 | 193 | 193 / 332 | 58% | 263 | 193 |
| 2010-11 | 195 | 195 / 344 | 57% | 271 | 195 |
| 2011-12 | 217 | 217 / 357 | 61% | 281 | 217 |
| 2012-13 | 190 | 190 / 349 | 54% | 264 | 190 |
| 2013-14 | 172 | 172 / 343 | 50% | 249 | 172 |
| 2014-15 | 200 | 200 / 376 | 53% | 275 | 200 |
| 2015-16 | 203 | 203 / 352 | 58% | 268 | 203 |
| 2016-17 | 208 | 208 / 360 | 58% | 274 | 208 |
| 2017-18 | 180 | 180 / 381 | 47% | 251 | 180 |
| 2018-19 | 217 | 217 / 379 | 57% | 282 | 217 |
| 2019-20 | 197 | 197 / 371 | 53% | 272 | 197 |
| 2020-21 | 0 | 384 / 384 | 100% | 384 | 384 |
| 2021-22 | 0 | 393 / 393 | 100% | 393 | 393 |
| 2022-23 | 8 | 372 / 381 | 98% | 372 | 372 |
| 2023-24 | 0 | 365 / 374 | 98% | 365 | 365 |
| 2024-25 | 0 | 377 / 394 | 96% | 377 | 377 |
| 2025-26 | 0 | 378 / 397 | 95% | 379 | 378 |
| **Total** | 3460 | 7712 / 10391 | 74% | 8914 | 7712 |

Coverage is still 47–62% in the seasons that weren't scraped (2000-01, 2001-02, 2005-06 – 2019-20); the old file only covered about half of each roster.

## Notes
- capPct above 1 is real: Michael Jordan 1996-97 $30.14M on a $24.36M cap (1.24), 1997-98 $33.14M (1.23). Ewing, Garnett, O'Neal, and Grant Hill are 0.51–0.76 in the late '90s.
- 258 new player-seasons are under 1% of the cap: 10-day, two-way, or waived deals where bbref lists the prorated amount paid (e.g. Mo Bamba 2024-25 $119,972). The game prices them at the $1M floor.
