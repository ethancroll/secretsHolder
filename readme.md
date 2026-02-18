# secretsHolder

A small local-first tool for reading a `.env` file in the browser and copying variable values with one click.

No account, no backend, no database — just a simple interface for quickly finding and copying secrets you already manage in environment files.

## Why this exists

When you’re working across services, it’s common to keep API keys, tokens, and config values in `.env` files. This project gives you a faster way to:

- load an env file,
- scan variable names,
- copy values without opening editors or terminals.

## Features

- Local file parsing
- Supports common env syntax
- One-click copy for each variable value
- Drag-and-drop upload support
- Clean monochrome UI (black/gray/white)

## Security and privacy

- Files are read in your browser session.
- Nothing is uploaded by this app.
- Clipboard copy uses the browser Clipboard API.

That said: treat this as a convenience tool, not a security boundary. Use it only in environments you trust.

## Getting started

### 1) Clone the repo

```bash
git clone https://github.com/ethancroll/secretsHolder.git
cd secretsHolder
```

### 2) Run locally

You can open `index.html` directly, but clipboard support is more reliable on `http://localhost`.

Quick option with Python:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Usage

1. Click or drop a `.env` file.
2. Review parsed variable names.
3. Click **Copy** next to the variable you need.

## Project structure

```text
.
├─ index.html   # UI markup + Tailwind classes
├─ app.js       # parsing, rendering, clipboard interactions
└─ readme.md
```

## Contributing

Issues and pull requests are welcome.

If you contribute, keep changes focused and small. Prefer plain JavaScript and avoid adding build tooling unless it clearly improves maintainability.

## License

MIT — see `LICENSE`.
