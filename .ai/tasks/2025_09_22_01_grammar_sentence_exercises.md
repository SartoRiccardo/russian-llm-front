# 2025/09/22 (01) Grammar/Sentence exercises

Grammar/Sentence exercises are a type of exercise that appears in the exercise select page. Once you begin, you have to do a quiz-like game where you try to either write a whole sentence or specific parts of it.

At the top, a sentence is shown with some words optionally highlighted. At the bottom is the part the user must fill in, either completely or partially. There is also an audio button to optionally respond with speech-to-text.

Below these sections, there is a "Help" button and the "Submit" button. The Help button pulls up a modal with the grammar rules relevant to the exercise. The submit button submits the answer to the exercise.

Below this section, a text that says how many irregular words are in the exercise.

Below, a progress bar that shows how many questions have been completed (for example, 8/10).

Even more below, a keyboard with cyrillic characters and the space bar. Lay them in QWERTY fashion.

There should also be a button which takes you back to the /exercises page

## Technical implementation

These exercises' routes will be `/exercise/{exercise-slug}`. The slug does **not** correspond to the exercise ID. In the GET request to get all the exercises, you will also get the following information now:

```typescript
interface {
    exercise_slug: string
    /* ...other fields... */
}
```

Once the exercise has started and the page has been rendered, make a POST `/exercises/{id}` request which will have the following schema:

```typescript
interface {
    type: 'alphabet' | 'grammar' | 'vocabulary'
    questions: Array<{
        id: string
        question: string
        answer_template?: string
        expected_answers: string[]
        irregular_word_count: number
    }>
}
```

`questions.*.question` and `questions.*.answer_template` is a string written in a special markup language. This language has the following rules:

- `{word}[n]`: means the word is _grouped_. The group ID is `n`. For example, "The (brown fox)[1] jumped over the (dog)[2]" has the group "brown fox" with ID 1, and the group "dog" with ID 2.
- `_{word}[n]_`: means there is a _blank_. The blank ID is `n`. `word` is the hint for the blank. For example, `The pen _(to be)[1]_ on the table` has the blank with ID 1 and the hint `to be` for that blank.
- `_[n]_`: is the same as `_{word}[n]_`, however there is no hint.
- `|>word<|`: means the word is *back-highlighted*.
All other standard markdown syntax applies, but for convenience only implement bold, strikethrough, and italic for now.

Make a React component for these syntax types: a `HighlightedWord`, `BackHighlighted` and `BlankAnswer` component.

- `HighlightedWord` must also color the word differently based on the passed ID
- `BackHighlighted` is just a span with a background color.
- `BlankAnswer` renders to a span. This component displays the placeholder (if any) in a color dictated by its ID (same algorithm/process as `HighlightedWord`).

The answer field itself is just textarea. There are special rules for this textarea and its rendering, but we'll hold these off for another task.

### Submitting

When submitting, you should make a **POST `/exercises/{id}/questions/{id}/answer`** call with the given answer. The call should follow the following schema:
```typescript
interface {
    user_answer: string
}
```

The response is a content stream which will return exactly one or two messages.

The response schema of the first message is:
```typescript
interface {
    status: 'correct' | 'wrong'
    correct_answer: string
}
```

The response schema of the second message is:
```typescript
interface {
    correction_explanation: string
}
```

While submitting, you can check the answers in `expected_answers` and, if it is already there, you can directly assume the user's answer is correct. Otherwise, wait for the request to resolve. Obviously, the "full user answer" is the `answer_template` with the blanks filled in correctly. Make the comparison forgiving (no spaces, case insensitive, etc).

If the question is correct, the full user answer becomes green. The second response chunk will not be present.

If the question is incorrect, `correct_answer` will be displayed below the user-given answer. The second response chunk will arrive, and when it does you should display, instead of the "Help" button, a "Why" button. Clicking it displays the content received from `correction_explanation`. Display a loading state on that button while the stream arrives.

In any case, the "submit" button becomes a button to go on to the next question.

### Audio button

There should be an audio button. For now, it does nothing, but just add it to the interface.

### Initial ID check

If the user navigates directly to the exercise's page, they won't have the ID of the exercise to make the request with, but only the slug. Fetch the exercise list first, get the exercise with the matching slug, and make the other request. We will refactor this later to use Redux but for now just make the request.

## End screen

Once there are no more questions, the user should be taken to a recap page. For now, leave this empty with an "In Progress" message, but include a link to the /exercises page.

## Testing

These elements should have the following `data-cy` attributes to help select them:
- Help button: `btn-ex-help`
- Submit button: `btn-ex-submit`
- Next exercise button (submit button after the answer is submitted): `btn-ex-next`
- Irregular word counter: `label-ex-irregular`
- Keyboard buttons: `btn-ex-keyboard`
    - To select these, query for the element `btn-ex-keyboard` and get the child whose content is one exact cyrillic letter
- Whole answer form: `f-sentence-exercise`
    - Inside the form, elements can be queried by their `name`. The selector would be `[data-cy=f-sentence-exercise] [name=...]`
- Some element should have a `data-cy-result` be equal to `status`, or `none` if the question is unanswered yet.
- correct_answer label when the answer is wrong: `label-ex-correct-answer`
- Current question count: `label-ex-cur-question`
- Total question count: `label-ex-tot-question`
- Audio button: `btn-ex-audio`
- Link to /exercises (both end screen and exercises): `a-exercises`

You should perform the following tests:
1. Navigating to an exercise page that exists unauthorized redirects to login
2. Navigating to an exercise page that doesn't exist unauthorized redirects to login
3. Navigating to an exercise that doesn't exist redirects to /exercises
4. Successfully display an exercise. Once displayed, successfully complete the question and check if everything is successful. Check the "correct_answer" isn't there, and the data-cy-result is correct.
5. Successfully display an exercise. Once displayed, fail the question and check if everything works as expected. Check the "correct_answer" is displayed, and the data-cy-result is "wrong".
6. Successfully complete all questions of the exercise (mock 3 questions). Assert that the end screen appears, and clicking it redirects you to /exercises.
7. Enter an exercise and press the link to go back to /exercises

In all of these tests you should mock the necessary routes you expect to be called with fixtures, and check if those routes are actually called.