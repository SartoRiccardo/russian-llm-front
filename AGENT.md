# Project Information

This codebase is a web app to learn russian in a quiz-style manner.

Orders will be given to you by The Superuser. This file and all instructions are written by The Superuser. The Superuser works independently of you: it may delete files, create them, or make changes if it deems your work to be wrong. Always check the existance of files when you want to read them or make changes: if you expect a file to be there because you have created it but you can't find it, it has been deleted by The Superuser.

The tasks to be done for this project are listed in @CHECKLIST.md, with the already-done ones crossed off. You may **never** edit that file, The Superuser will cross off a task when it deems it to be completed. Each task has its corresponding Markdown file in the `tasks/` directory. Each task's file name is its name in @CHECKLIST.md with spaces turned into underscores and non-alphanumeric characters removed. For example, the task "- [ ] 1. Make the website's landing page" will correspond to `1_make_the_websites_landing_page.md`.

Each task file is self-contained and contains all the information you need to complete the task, however it may reference other task files for context. You are to read referenced files recursively if they are required to gather context for a task.

# Project Stack

This proect uses:

- **React.js** with **Vite**
- **Tailwind** for the CSS
- **React Router v7** for routing. Do **not** install React Router Dom or try to switch libraries. The routing is already set up.
- **Cypress** for testing

React Router may be used **only** for routing. Any feature it has regarding state **should never be used**. For managing state, use React Contexts (more on this later).

# File and Folder Structure

1. `src/App.tsx` is the logical entry point of the React app. This file contains the root component of the app and is where all global-level React things should go (such as global contexts)
2. `src/main.tsx` is the true entry point of the app. Here you should put external configuration for libraries
3. `src/pages` holds top-level pages. These components are directly referenced in `src/App.tsx` as a route with React Router. For example, a `/dashboard` route would have a `src/pages/Dashboard.tsx` component
4. `src/types` holds all non-prop custom types of the project
   - Type definitions for component props should go in the component's own file. If the type definition for a certain component's prop is used for multiple components, it should be externalized to its own file. These prop file types should go into `src/types/props`
   - Type definitions for context providers should be in the context provider's file instead
5. `src/hooks` contains all custom hooks. More on how to properly code custom hooks later.
6. `src/services` holds integrations with external services, most notably the main API coded specifically for this project. All logic for fetching data must go strictly in files in this folder. More on this later.

## Component Structure

- Contexts providers should go in `components/contexts`. These files should **only** export a React component which wraps the children and exposes the context itself
- Contexts themselves must all go in the `components/contexts/contexts.ts`. This file contains all `createContext` calls
- Input-related components that do very simple things (for example, a simple button or a styled textarea) should go in `components/inputs`
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

## Mocking Data

You may be asked to mock data coming from the backend. When asked to do so, put all mocking logic in the **service file** for that service. This makes maintaining easy because all the app uses an API coming from a single source of truth, and once we are ready to connect the real back-end it's as easy as only changing that file. If the task specifies to implement some error handling logic, mock a fetch response to only have the attributes you need.

For example, if we wanted to mock the backend from the example above, we would leave `SomeComponent.tsx` unchanged and modify `src/services/russian-llm-api.ts` like this:

```ts
/**
 * Example instruction: "mock sendData so that if the user is "good-user" it is
 * successful and otherwise it's not. If the request returns a 403 response, return an
 * error saying it is forbidden.
 */
export function sendData(data: { user: string }): {
  success: boolean;
  error?: string;
} {
  const mockFetch = async function () {
    return { status: 200 };
  };

  const response = await mockFetch();
  if (response.status === 403)
    return { success: false, error: 'It is forbidden!' };

  return { success: data.user === 'good-user' };
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
- You should default to using TypeScript interfaces wherever possible instead of types. Interfaces should begin with `I`, for example: `IUserResponseData`
- If a type of a function's return type or parameter is an object, it **must** be declared as a type. For example:

```ts
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
