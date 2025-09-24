# Project Information

This codebase is a web app to learn russian in a quiz-style manner.

Orders will be given to you by The Superuser. This file and all instructions are written by The Superuser. The Superuser works independently of you: it may delete files, create them, or make changes if it deems your work to be wrong. Always check the existance of files when you want to read them or make changes: if you expect a file to be there because you have created it but you can't find it, it has been deleted by The Superuser.

The tasks to be done for this project are listed in @.ai/CHECKLIST.md with the already-done ones crossed off. You may **never** edit that file, The Superuser will cross off a task when it deems it to be completed. Each task has its corresponding Markdown file in the `.ai/tasks/` directory. Each task's file name is its name in @.ai/CHECKLIST.md with spaces turned into underscores and non-alphanumeric characters removed. For example, the task "- [ ] 1. Make the website's landing page" will correspond to `1_make_the_websites_landing_page.md`.

Each task file is self-contained and contains all the information you need to complete the task, however it may reference other task files for context. You **must** read referenced files recursively if they are mentioned, this is the only way to have all context needed to complete a task.

To validate if the project works after making changes, run `npm run lint && npm run build` and resolve the errors raised. Once both commands return without generating errors, you can return from the task.

# Project Stack

This proect uses:

- **React.js** with **Vite**
- **Tailwind** for the CSS
- **React Router v7** for routing. Do **not** install React Router Dom or try to switch libraries. The routing is already set up.
  - Use React Router's `Link` tag for navigation wherever possible, as it semantically translates to an `a` tag.
- **Formik** for form validation
- **Cypress** for testing

React Router may be used **only** for routing. Any feature it has regarding state **should never be used**. For managing state, use React Contexts (more on this later).

# File and Folder Structure

1. `src/App.tsx` is the logical entry point of the React app. This file contains the root component of the app and is where all global-level React things should go (such as global contexts)
2. `src/main.tsx` is the true entry point of the app. Here you should put external configuration for libraries
3. `src/pages` holds top-level pages. These components are directly referenced in `src/App.tsx` as a route with React Router. For example, a `/dashboard` route would have a `src/pages/Dashboard.tsx` component
4. `src/types` holds all non-prop custom types of the project
   - Type definitions for component props should go in the component's own file. If the type definition for a certain component's prop is used for multiple components, it should be externalized to its own file. These prop file types should go into `src/types/props`
5. `src/hooks` contains all custom hooks. More on how to properly code custom hooks later.
6. `src/services` holds integrations with external services, most notably the main API coded specifically for this project. All logic for fetching data must go strictly in files in this folder. More on this later.
7. `src/errors` contains custom, user-defined errors. Useful in conjunction with the APIs in `src/services` to throw errors whenever something with the request goes wrong.

## Component Structure

- Contexts providers should go in `components/contexts`. These files should **only** export a React component which wraps the children and exposes the context itself
- Multi-route context wrappers should have their own route file in `src/components/contexts/route-groups`.
- Contexts themselves must all go in the `components/contexts/contexts.ts`. This file contains all `createContext` calls
- Input-related components that do very simple things (for example, a simple button or a styled textarea) should go in `components/inputs`
- Simple UI components such as toasts, panels, containers, and similar should go in `components/ui`
- Other components should go in `components/other`

# Services

This project is a frontend and obviously interfaces itself with external services. The logic for these requests must be in a file in `src/services` named like the service it is requesting. The main backend of this project is called "Russian LLM API", so for example the file for it would be called `russian-llm-api.ts`.

There must be no API calls in the project to external services outside of these files. For example, if a component must use an API, it would be coded like the following:

`SomeComponent.tsx`

```jsx
import { sendData } from '@/path/to/src/services/russian-llm-api';

export default function SomeComponent(props: SomeComponentProps) {
  const sendRequest = async () => {
    data = {
      /* real data... */
    };
    await sendData(data);
  };

  return (
    <div>
      <button onClick={sendRequest} />
    </div>
  );
}
```

`russian-llm-api.ts`

```ts
export function sendData(data: DataSend): void {
  await fetch(/* Actual API call to the backend */);
}
```

# Coding Style

- Comments should be reserved only for complex parts
- The following items should **always have docstrings or comments detailing what they are**, which should be kept updated:
  - TypeScript types, especially ones detailing return types from HTTP requests
  - React components
- Use React State only for things which actually require a state: variables that are only a product of the state do not actually require a state! If a variable is a result of operations on other variables, it's not a state variable
- The second return value of `useState` (the setter function) is stable, so it should not be included in hook dependencies
- Some components should be easily selectable for testing in Cypress. These components will be explicitely pointed out in the checklist descriptions, if any. These selections happen through the `data-cy` attribute
  - The `data-cy` attribute should **always** be present in forms, and it should begin with `f-`. For example, a form to submit a support ticket will have `data-cy="f-submit-support-ticket"`
  - If the `data-cy` attribute is not written in the specifications, you can invent one. It should be descriptive and unique across the application
  - For Formik error validation messages, `data-cy` attributes must start with `err-`
- You should default to using TypeScript interfaces wherever possible instead of types. Interfaces should begin with `I`, for example: `IUserResponseData`
- If a type of a function's return type or parameter is an object, it **must** be declared as a type. For example:

```typescript
// Wrong
function someWrongFunction(someParam: {
  someProp: string;
}): Promise<{ someRetVal: number }> {
  // Some code...
}

// Correct
function someCorrectFunction(
  someParam: IFunctionParams,
): Promise<IFunctionReturnType> {
  // Some code...
}
```

- There is a custom `useOnMount` hook that executes a function only on component mount and never again. It has an API identical to that of `useEffect`, but without the dependency array at the end. It is useful for things such as fetching on page load. Below is an example on how to use it.

```jsx
import { useLoadTodos } from '@/hooks/useLoadTodos'; // Example hook
import { useOnMount } from '@/hooks/useOnMount';

export const SomeComponent = ({ children }) => {
  const [todoCount, setTodoCount] = useState(-1);
  const loadTodos = useLoadTodos();

  useOnMount(() => {
    const load = async () => {
      await loadTodos();
    };
    load();

    return () => {
      /* Cleanup function on unmount */
    };
  });

  return <div>{/* ...the component... */}</div>;
};
```

# Testing

You do not write tests on your own. You will be instructed to make tests if necessary by pointing to a file which will have the tests already defined and commented, you will only have to write the code inside of them. Leave the comments when you write tests, don't delete them!

You **never** test if the tests work for yourself. That's up to The Superuser to do.

## Selection Rules

Test files **always mention the file they are testing**. Reading that file (and, if needed, components/contexts they import recursively). is **critical** to understanding how selectors should be constructed. Not doing so will result in failure.

Use aliases when referring to elements more than once.

- When testing elements in forms, you will have to first select the form via its `data-cy` attribute, then you can grab inputs inside the form via their `name` attribute. There will never be multiple items with the same `name` in the same form.
- Submit forms with the `submit()` function, not clicking a button.
- When testing if a toast exists, check if a `data-cy` attribute exists
- There will never be any element in this projec with an `id` field. Never use that for a selection
- If you are unsure on how an element is selectable, prompt The Superuser
- **Never** use class names as selectors, they are volatile and always change

## API Fixtures in tests

**Every call to APIs should be done through fixtures**. Inside the `cypress/fixtures` file you should have one subfolder for every external service requireed (for example, using the YouTube API would need `cypress/fixtures/youtube`). That folder will contain all the fixtures for the YouTube API. You will only understand what needs fixtures by reading the code you are writing tests for!

Each folder (unless it doesn't exist and you are making it) always contains a `FIXTURES.md`, which documents each fixture file, describes its purpose, and where it's used. **Always** read that file before making changes to fixtures, as it will tell you in detail all you need to know about the current context. Whenever you make a new fixture or update an existing one, **you can edit this file**.

You don't need fixtures for requests which don't have a response body. Simply omit the response body field!
