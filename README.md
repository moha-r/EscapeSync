# EscapeSync

Connected front-end prototype for a group travel planning and disruption-rescue experience.

## Run locally

From the project directory:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/EscapeSync%20Home.html`.

## Tests

```bash
node --test tests/app.test.js tests/pages.test.js
```

The prototype stores simulated trip state in browser `localStorage`. It does not require a backend.

