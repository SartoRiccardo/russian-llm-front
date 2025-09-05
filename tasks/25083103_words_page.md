# 250831. Stats and Exercises Pages

In the vocabulary page, there should be actual words present.

# Implementation

**Mock all API calls as per project specifications**

When in the `/vocabulary` page, a GET request to a Russian LLM API endpoint (you make it up) returns a word list. It takes `page` as a query parameter, which is `1` by default. The word list schema is:

```ts
// Change the interface names in the actual code

interface _IWordVariant {
  name: string;
  group: string;
  word_ru: string; // It is a markdown formatted string
  word_ru_prefix: string;
  sort_order: number;
  win_percent: number; // Guaranteed to be between 0 and 1, included
  subcategory: string; // This matches the word subcategory ID in @tasks/25083101_stats_page.md
  rules: number[];
}

interface _WordReturnSchema {
  word_ru: string;
  word_en: string;
  category: string;
  locked: boolean;
  type: string; // This matches the word type ID in @tasks/25083101_stats_page.md
  variants: _IWordVariant[];
}

interface _IReturnType {
  words: _WordReturnSchema[];
  pages: number; // Total page count
}
```

The page loads page 1 by default, then when the user is scrolling at the end it loads the next page, and so on to make an infinite scrolling effect. You do this via a loading component which shows a loading state, and when it comes into view you fire off the GET request and load it + the next loader. The next loader does not appear if it would go over the max number of pages.

Store all loaded words in a state variable in a parent component that is rendered in the `/vocabulary` page. This component renders directly the loader component. The loader component exposes a `onWordsLoaded: (page: number, wordlist: _IReturnType): void` prop which is bound to a handler that updates that state and adds the words. It also takes a `page` prop which is the page to actually load.

For the rendering of the words themselves: They should first be grouped by `category`, preserving the order in which the categories are found, and within the categories they should be sorted by `locked` (`true` last), then by `win_percent` (highest first, this is a field that is calculated client-side by averaging the `win_percent`s of the children), and lastly alphabetically. Initially, only show the word category with a win percentage calculated as the average win percentage of the non-locked words. When the word category is clicked, expand the category with a section that appears and fades-in (like @tasks/25083101_stats_page.md) which actually shows the words.

The words have 3 columns: The first one shows the word in russian, the second one the word in english, the third shows the win percentage and a little info button. The info button will show a modal (reuse the component we have) which shows that word + every single variant. For every variant display the prefix + the word itself and, to the right, the win percentage and a question mark button. Group every word variant by group, and sort by `sort_order` within the group (ascending).

Clicking the question mark button replaces the contents of the modal (with a nice fade in and fade out animation that lasts .5 seconds total) with the rules for that word subcategory of word type (match the IDs as specified in the schema. The variants inherit word types). Add functionality to the rules component we already have: it should now accept an array of highlighted rule IDs as a prop (this is optional). If it is provided, any rule ID rendered and included in the array has a highlighted background, and is sorted so it goes to the top.

There is a "back" button in this modal which takes you back to the previous modal page with all the word variants.

Use the previously implemented `StatsContext` to access/load data for the Stats.

Note: locked words are UI only. All of their functionality is still available. "locked" here is just for CSS purposes.

## Handling errors in the GET request for the words

If, for any reason, the data from the GET in @tasks/25083101_stats_page.md is unavailable, do not show any buttons which depend on it (the question mark buttons and the info buttons).

`401` errors are handled like in @tasks/25083101_exercises_page.md.
`5xx` errors are handled with an error message.
Network errors are retried every 2 seconds.

## Mock data

To mock credible data, choose a few words (which can be verbs, adjectives, and nouns) for a sample of 3 categories (food, transport, tourism). For every word, make some locked and some not. The word variants are, for adjectives and nouns, the cases. For the verbs, it's all time conjugations. The verbs should also have the pronoun as a prefix, while cases should have a preposition for the prepositive.

# Tests

In a `vocabulary.cy.ts` file, you should test the following.

1.  **Page loads and infinite scroll works**

    - Mock successful API calls for page 1 and page 2 of the words list using separate fixtures.
    - Check that the initial word categories are rendered correctly, displaying their average win percentage. Give them a `data-cy=word-category` attribute.
    - Scroll to the loader component at the bottom of the page.
    - Check that the API call for page 2 is made.
    - Check that the new words from page 2 are correctly appended to the list.

2.  **Word category expands and shows sorted words**

    - Mock a successful API call for the words list. (Use a previously used fixture).
    - Click on a word category.
    - Check that the section expands and the words within it are now visible. Each word row should have a `data-cy=word-item` attribute. The Russian word itself should have a `data-cy=word-ru` attribute.

3.  **Info modal shows word variants**

    - Within a word item, click the info button (`data-cy=word-info-button`).
    - Check that the main modal (`data-cy=modal`) becomes visible.
    - Verify that the modal displays the base word's information and a list of its variants. Each variant should have a `data-cy=variant-item` attribute.
    - Check that the variants are correctly grouped by their `group` property and sorted by `sort_order`. Each group should be selectabley with a `data-cy=word-group` attribute.

4.  **Rules modal shows correct highlighted rules and back button works**

    - From the open info modal, click the question mark button on a variant (`data-cy=variant-rules-button`).
    - Verify that the modal's content is replaced by the rules component (`data-cy="grammar-rules"`).
    - Check that the rules associated with the variant are displayed and are highlighted (`data-cy=highlighted-rule`).
    - Click the "back" button (`data-cy=modal-back-button` inside the modal selector).
    - Check that the modal content reverts to showing the previous word variants list.

5.  **Buttons depending on stats data are hidden if it's unavailable**

    - Mock a failed GET to the stats to simulate a state where the stats data (rules, subcategories) failed to load. Keep in mind that the retry logic should make it keep retrying so it should consistently return a Network Error.
    - Mock a successful call to the words API. Use a previous fixture
    - Open the info modal for a word.
    - Verify that the question mark buttons (`data-cy=variant-rules-button`) on the variants are **not** visible.

6.  **Unauthorized error while fetching words**

    - Intercept the API call for the words list and return a 401 Unauthorized status.
    - Check that the user is redirected to the login page with a correct `redirect`.

7.  **Server error triggers an error**
    - Intercept the API call for the words list and make it fail with a 503 status.
    - Check if an element with `data-cy=words-error-message` exists
