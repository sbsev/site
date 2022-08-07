## Tests for the Student and Pupil Signup Forms

The tests are run by a GitHub Action on every push and PR (see `.github/workflows/test.yml`) but can also be called locally with `npm/yarn run test`.

To see the tests running in real time in a UI, add the `--headed` flag to `@playwright/test`, i.e. `npm/yarn run test --headed`. Useful for debugging.
