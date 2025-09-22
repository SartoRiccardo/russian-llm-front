# 2025/08/25 (02) Error toasts

Create a maintainable interface to create and manage toasts app-wide.

# Implementation

Create `ToastProvider` that will wrap the whole app. This provider will expose a context with the following properties:

- `createToast`: A function which returns the `id` of a toast that is created. Its parameters are:
  - `type`: Can be exactly `SUCCESS`, `ERROR`, `WARNING`. The type of this parameter should be declared with an alias as it will be reused often.
  - `title`: The title of the toast. Can be a string or JSX.
  - `content`: The content of the toast. Can be a string or JSX.
  - `duration`: The milliseconds to display the toast for. Defaults to 5 seconds. Optional.
  - `dataCy`: An optional value for the `data-cy` attribute of the toast. If not provided, the toast won't have it. If provided, the string `t-` will be automatically appended at the start. For example `wrong-credentials` becomes `t-wrong-credentials`.
  - `id`: Optional ID. If an active toast exists with the same ID, it updates that one and refreshes the duration instead of creating a new one, and places it at the top of the queue. If not provided, a random UUID is created. Use UUIDv7. Don't implement it yourself, use some library.

`ToastProvider` will be in charge of both providing this context and rendering the toasts. The toasts should be a separate component in its own file. You are free to create some basic rendering for the toast, as it will be deleted later. The `Toast` components should also have a button to dismiss the toast, which will delete it from the `ToastProvider`'s internal memory. Feel free to style the `Toast` component a little bit, it's for test purposes and it will be changed later, but it's good to have it styled to visualize it better a little bit.

# Integration

Integrate this component into the existing code as follows:

1. In the login page, when a user inputs the wrong credentials, show an error toast instead of an error message. This toast should have `data-cy="t-wrong-credentials"` (defined in @tasks/1_login.md).
2. If the initial authentication takes too long (slow connection), show a warning toast saying "slow connection?" (defined in @tasks/1_login.md, also this information can be gotten from the `AuthProvider`).
