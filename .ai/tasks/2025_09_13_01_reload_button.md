# Reload Button

Right now, when the word list (in 25083103 words page) fails to load due to a server error, the loader stays visible and there's an error message below. Change it so that, when this happens, the error message _replaces_ the loader and a "retry" button becomes visible to retry loading.

## Implementation

- When that retry button is pressed, call the function the loader was calling previously. This will set the loading state to `true`, restoring everything to what it was before the state

## Testing

The button will have a `data-cy=btn-retry-words` attribute. Use it to select it and click it and check if the request is correctly done again. Once you click it, mock a correct request. Modify the test "displays an error message on server errors".
