## Tests for the Student and Pupil Signup Forms

The tests are run by a GitHub Action on every push and PR (see `.github/workflows/test.yml`) but can also be called locally with `yarn test` (dev server must be already running on `localhost:3000`).

To see the tests running in real time in a UI, change the `headless` argument on `puppeteer.launch()` to `false`.
