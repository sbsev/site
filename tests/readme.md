## Tests for the Student and Pupil Signup Forms

The tests are run by a GitHub Action on every push and PR (see `.github/workflows/test.yml`) but can also be called locally with `yarn test` (dev server must be already running on `localhost:3000`) or `yarn ci` (starts the dev server automatically).

`testStudentSignupForm.js` and `testPupilFoSignuprm.js` can be also called with `node` for manual testing of form submissions. If the dev server is running, both will automatically fill out every required field in the student/pupil forms allowing for immediate manual form submission afterwards.
