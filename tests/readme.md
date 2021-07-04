## Tests for the Student and Pupil Signup Forms

`signupForm.js` is run by a GitHub action on every push and PR(see `.github/workflows/ci.yml`) but can also be called locally with `yarn test` (dev server already running) or `yarn ci` (starts dev server itself).

`helpers/fillStudentForm.js` and `helpers/fillPupilForm.js` can be called with `node` for manual testing of form submissions. While the dev server is running on `localhost:3000`, both will automatically fill out every required field in the student/pupil form allowing for immediate manual form submission afterwards.
