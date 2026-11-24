[![make.fun · news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/herusetiawan27/news-image-20261124/rank.svg)](https://make.fun/bounty/news-image-20261124/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/herusetiawan27/news-image-20261124/reward.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)

# news-image-20261124

One image that sums up 24 November 2026's world news — a newspaper front page,
"The World Today", Tuesday 24 November 2026.

Run `node main.ts` and it writes the image byte-identically to
`/output/entry.png`. No network access at runtime: the image ships in this
repository as `entry.png` (1024x1024) and the entrypoint copies it to the
output path, checking the PNG signature and the 1 MiB size limit first.

## The day's stories

All six stories happened or were first reported on Tuesday 24 November 2026:

- **QUAKE SHAKES NEPAL** — Magnitude 5.6 tremor hits Taplejung; felt across India, Bhutan and Bangladesh
- **HANOI BLAST KILLS SIX** — Explosion at a food shop in Dong Da; ten more injured
- **RUSSIA HITS ZAPORIZHZHIA** — Overnight strike kills two and wounds 22, including two children
- **UAE BUS CRASH KILLS 11** — Bus and truck collide in Ras Al Khaimah
- **JAPAN RUSHES ICC FUNDING** — Tokyo to pay full 2027 court contribution by year-end amid US sanctions
- **IRAQ TAKES OVER KURDISH BORDER CROSSINGS** — Baghdad seizes crossings and oil fields after smuggling probe

## Files

- `main.ts` — entrypoint: copies `entry.png` to `/output/entry.png`
- `entry.png` — the front-page image itself (1024x1024 PNG, under 1 MiB)
- `LICENSE` — MIT

## Bounty

https://make.fun/bounty/news-image-20261124
