# 250831. Exercises Page

The exercises page should display the exercises the user can do. Upon clicking an exercise, you will be taken to the exercise's page. Some exercises might be disabled.

# Implementation

**Mock all API calls as specified by the project code style.**

The exercises page, which should be both `/exercises` and whatever we currently have set as the default pages, should do the following:

On load, it should fetch a route with a GET request in the Russian LLM API (you invent the url) which returns a list of exercises with the following schema. Replace the interface name if you deem it necessary:

```ts
// Schema for explanatory purposes only. Do not copy this code as-is.

interface IExerciseOverview {
  id: string;
  name: string;
  description: string | null;
  type: 'alphabet' | 'grammar' | 'vocabulary';
  mastery: number; // Guaranteed to be between 0 and 4, both included
  locked: boolean;
  sort_order: number;
}

interface ITypes {
  id: 'alphabet' | 'grammar' | 'vocabulary';
  name: string;
  description: string | null;
}

interface IRequestReturnType {
  types: ITypes[];
  exercises: IExerciseOverview[];
}
```

These exercises should be first grouped by `type`, and then be sorted per-group by their `sort_order` (lowest first). Then they should be displayed to the user. The groups displayed are those in `types`, and are already sorted.

There should be a component which, given props that extend the exercise type and a list of exercises, renders some basic information about the type and a list of all its children exercises.

There should be a component which, given props that match or extend the exercise overview schema given above, renders the exercise overview like explained below:

An exercise should display its name big and its description small at the bottom. At the right of every exercise, display its mastery (for now, just display the number itself). Clicking on an exercise takes you to its respective page, which is `/exercises/${id}`, which for now we will leave unimplemented.

If the exercise is `locked`, it must not be clickable. Clicking it must display a tooltip which says that the component is locked.

## Error Handling

If the GET request specified above fails due to a network error, continue trying to fetch it with a 2 second interval.

If the GET request specified above fails due to a `5xx` status code, display a component that shows an error message like "Something went wrong on the server". This message is a placeholder for now.

If the GET request is unauthorized, log the user out. When the user is logged out. When the user is logged out due to this reason, include a `redirect` query param in the login page. Once the user logs back in, if the `redirect` parameter is set, they will be immediately redirected to that page instead of going to the default page.

This redirect logic is a side effect of the task that ties into the @tasks/1_login.md checkpoint. Read very well that file too to study the implementation and how to change it accordingly. For starters, the logout function should take an optional `redirect` parameter which will be appended as a query param. Additionally, after logging in, the actual redirection logic should go in the `login` function which should also take a `redirect` parameter and use React Router to do the redirection after successfully changing state.

# Tests

In a `exercises-page.cy.ts` page, you should test the following.

1. **Page loads correctly**
   - Mock a successful API call to fetch the exercises. Use a fixture.
   - Check that every exercise is there, that the count is correct, and the disabled ones are correctly rendered. Every exercise component will have a `data-cy=exercise` attribute and will therefore be easily selectable.
2. **Clicking an exercise takes you to the exercise's page**
   - Check that clicking an exercise takes you to its page.
3. **Unauthorized while fetching an exercise**
   - Check that if the user becomes unauthorized while fetching the exercise list (for example, if the token has expired), they are redirected to the login page.
   - Log in with sample credentials (use one of the fixtures that already exist in @cypress/e2e/login.cy.ts)
   - Check that the page you are in corresponds to the one you were previously logged out on.
4. **Server Error**
   - Check that if there is a server error (error code is `5xx`) the error page shows up, which you should be able to check with the `data-cy=page-error` selector.
5. **Network Error**
   - Simulate a network error for 3 seconds and make sure the browser requests the endpoint twice. After the second time, stop simulating the network error and test that the page renders as expected. Use the same fixture you used for the test specified in point 1.

**Note on Selectors:**

- The parent container for all exercise groups should have `data-cy="exercise-container"`.
- Each individual exercise component should have both `data-cy="exercise-${id}"` (e.g., `exercise-1`) and `data-cy-type="${type}"` (e.g., `alphabet`).
- Group containers have a `data-cy="exercise-container"` attribute
