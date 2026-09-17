# rainrace

Type fast, drive fast. A Monkeytype-style typing racer on a rain-soaked night track.

Your speed moves a neon car through the rain. Three rivals race beside you. Finish the word count, read the results, and chase a personal best.

## How to play

Open `index.html` in a browser (double-click the file), or serve this folder as static files. GitHub Pages works with no build step.

1. Pick a word list and a length.
2. Press **Enter** or start typing.
3. Type the highlighted word. Correct letters light up; mistakes skid the car.
4. Cross the line when the words are done. Tab or Enter races again.

### Lists

- **starter** — 100 most common English words
- **common** — top 300 (default)
- **steady** — top 1000

Lengths: **10 / 25 / 50 / 100** (default 25).

### Keys

- letters and space to type
- Backspace inside the current word
- **Tab** or **Enter** to restart
- **Esc** for the menu
- mute button (top right) — remembered

Sound is synthesized in the browser and starts on your first click or key. Everything stays local: no accounts, no network, no analytics. Personal bests are stored per list × length in `localStorage`.

## Files

- `index.html` — page shell
- `style.css` — night-rain theme
- `game.js` — typing engine, race, audio, scoring
- `words.js` — embedded English word lists
