# Distill submission repository

## Submission document

The submission document is located at [`public/index.html`](public/index.html).

## Previewing the submission

Load [`public/index.html`](public/index.html) in your web browser.

## Working with the Distill web framework

Distill provides [documentation](https://distill.pub/guide/) on how to create a
submission using its web framework.

## Making a change

To avoid stepping on each other's toes, please use the following workflow to
make changes:

1. Create a uniquely named branch (suggestion: `[first name]_[purpose]`, e.g.
   `vincent_survey`)
2. Commit your changes in that branch.
3. Push the branch to GitHub.
4. Open a pull request to have the branch merged into the `master` branch. Most
   of the time you will get a quick LGTM ("looks good to me") and be able to
   merge right away, but sometimes a more thorough discussion is required, which
   is what this step of the workflow enables.
5. Upon receiving an LGTM from someone else in the team, merge onto the `master`
   branch.
6. Pull from the GitHub `master` branch onto your local clone.
6. Delete your branch locally (`git branch -d [branch_name]`) and on GitHub.
