# 2025/09/24 (01) Create Redux store

This task is a pretty big refactor over data we already have, as we need it over many routes. As such, a global state managed by Redux is the most flexible solution.

Refactor StatsProvider. Make a Redux store called `stats` with it which holds all the data.

- `loadStats` will become a custom hook called `useLoadStats` which only returns the `loadStats` function. 
- Other fields should be in the redux store. Expose them via the `useStats` hook. As a general rule of thumb, components should never access or modify redux directly, they should only do so via hooks.