# 3. Forgot Password Flow

This functionality adds a flow to reset the password without being logged in. The flow is as follows:

1. On the login page, clicking the "forgot password" link brings you to the `/forgot-password` route, where you can input an email in a form and click submit
2. Outside the application, the user receives an email and clicks a link inside (this is for the API to do, not you), and navigates to the `/password-reset` link which has a `token` in the query string
3. The user types the new password and retypes it, then if both passwords match the password is reset and the user is redirected to the login page.

# Implementation

**You must mock all API calls**.

If the user is already logged in, all of these routes redirect to `/settings` (which you should not create yet. Just implement the redirect for now). Check the login status with the existing Authentication context implemented in @tasks/1_login.md

## Forgot Password page

On submit, you must send a request to the Russian LLM API. This is a `POST` request passes the user's email as a body. This request returns a `204` code whenever the request is successful, no matter if the email exists or not, and a `422` on things such as validation errors. The request uses this schema:

```ts
{
  email: string;
}
```

On a successful response (`2xx`), hide the form and display the message "If the email exists, you will receive instructions on how to reset the password". A button with "Login" will take the user back to the login page.

On an unsuccessful response (`4xx`), display "That email has some issues" in an error toast. If it was a server error (`5xx`), the toast will display "Server error" instead.

## Password Reset page

### Initial Load

On load, the page should check via an API call if the token is valid. This is a `GET` request which passes the `token` in the querystring (the field is named `token`). It return the status code `204` if the token is valid and `422` if it's not. Handle `5xx`s with a toast. The response body of these requests, for now, is irrelevant. For testing/mocking purposes, if the token is exactly `valid-token` it is considered valid.

If the response is a `422`, display the message "This token is invalid or expired" on the page, and a button to return to the login.

If it's a `2xx`, display the Change Password form.

### Change Password form

Display a form with 2 password fields (Password and Repeat Password). If both passwords match, have at least 1 uppercase letter, 1 lowercase letter, 1 digit and 1 non-alphanumeric symbol and are at least 8 characters long, it's considered a valid password and a request can be made to the server to change it. This request is a `PUT` request and it has the following schema:

```ts
{
  token: string;
  password: string;
}
```

This request can return a `204` if it was modified correctly, a `422` on validation error or a `5xx` for server errors. Handle server errors wiht an error toast saying "Server Error".

On a `2xx` response, replace the form with a success message that says "Your password has been changed!" and a "Login" button which takes the user back to the login page. Use React Router's link tags for this, don't do it programmatically.

On a `422` response, display an error toast saying there was something wrong with the password.

Use Formik to validate the form. Display sensible error messages on submit attempts if the password doesn't fit the criteria above, or if the passwords don't match.
