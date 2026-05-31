# @cohensive/select-vue-2

Vue 2 wrapper component for the select/tokenfield core.

## Install

```bash
npm i @cohensive/select-vue-2 @cohensive/select-core
```

## Tailwind integration

If your app uses Tailwind and you rely on `tailwind`/`theme` styling from this library, do both:

1. Import compiled theme CSS:

```js
import '@cohensive/select-core/dist/select.css';
```

2. Include library files in your Tailwind `content` so utility classes are not purged:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@cohensive/select-core/src/theme.ts',
  ],
};
```

## Basic usage

```js
import Vue from 'vue';
import { Select } from '@cohensive/select-vue-2';

new Vue({
  components: { Select },
  data() {
    return {
      value: [],
      options: [
        { value: 1, label: 'red' },
        { value: 2, label: 'orange' },
      ],
    };
  },
  template: `
    <Select
      :options="options"
      :value.sync="value"
      multiple
    />
  `,
}).$mount('#app');
```

## Option format

`options` accepts either plain options or grouped options.

```ts
// Option
{ value: any, label?: string, disabled?: boolean, ...extra }

// Group
{ type: 'group', label?: string, options: Option[], ...extra }

// Mixed list
type OptionsOrGroups = Array<Option | Group>
```

Example:

```js
const options = [
  { value: 1, label: 'Red' },
  { value: 2, label: 'Orange', disabled: true },
  {
    type: 'group',
    label: 'Greens',
    options: [
      { value: 3, label: 'Lime' },
      { value: 4, label: 'Olive' },
    ],
  },
];
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `Option[]` | `[]` | Selected value(s). Use with `@update:value`. |
| `options` | `Array<Option \| Group>` | `[]` | Menu data source. Supports flat and grouped options. |
| `multiple` | `boolean` | `false` | Enables tokenfield multi-select mode. |
| `searchable` | `boolean` | `false` | Enables text search/filter input behavior. |
| `clearable` | `boolean` | `true` | Allows clearing selected value(s). |
| `placeholder` | `string` | `'Select...'` | Placeholder text in control. |
| `creatable` | `boolean` | `false` | Allows creating new options from input. |
| `allowCreateWhileLoading` | `boolean` | `false` | Allows creating while async loading is active. |
| `createOptionPosition` | `'first' \| 'last'` | `'last'` | Insert position for created option in menu. |
| `formatCreateLabel` | `(input) => string` | built-in | Label for the “create” menu item. |
| `isValidNewOption` | `(input, value, options, accessors) => boolean` | built-in | Validation for new option creation. |
| `getNewOptionData` | `(input, optionLabel) => Option` | built-in | Maps input to created option object. |
| `onCreateOption` | `(input) => void` | `undefined` | Custom create handler; bypasses default `onChange`. |
| `async` | `boolean` | `false` | Enables async loading mode. |
| `loadOptions` | `(inputValue, props, abortController, callback?) => Promise\|void` | `undefined` | Async options loader. |
| `defaultOptions` | `boolean \| Array<Option \| Group>` | `undefined` | Initial options for empty input in async mode. |
| `cacheOptions` | `boolean` | `true` | Caches async results by input value. |
| `isLoading` | `boolean` | `undefined` | Manual loading state override. |
| `loading` | `boolean` | `false` | General loading flag. |
| `showLoadingMessage` | `boolean` | `true` | Whether to show loading message. |
| `showNoOptionsMessage` | `boolean` | `true` | Whether to show no options message. |
| `loadingMessage` | `string \| (input) => string` | `'Loading...'` | Message shown while loading options. |
| `noOptionsMessage` | `string \| () => string` | `() => 'No options'` | Message when no options are available. |
| `open` | `boolean` | `undefined` | Controlled menu open state. |
| `openMenuOnFocus` | `boolean` | `false` | Opens menu when input receives focus. |
| `openMenuOnClick` | `boolean` | `true` | Opens menu on control click. |
| `closeMenuOnSelect` | `boolean` | `true` | Closes menu after selection. |
| `closeMenuOnScroll` | `boolean \| (event) => boolean` | `false` | Close behavior on scroll events. |
| `menuPlacement` | `'auto' \| 'bottom' \| 'top'` | `'auto'` | Preferred menu placement. |
| `menuPosition` | `'absolute' \| 'fixed'` | `'absolute'` | CSS positioning mode of menu. |
| `maxMenuHeight` | `number` | `300` | Max menu height before scrolling. |
| `menuShouldBlockScroll` | `boolean` | `false` | Prevents page scroll while menu is open. |
| `menuShouldScrollIntoView` | `boolean` | device-based | Scrolls menu into viewport on open. |
| `maxOptions` | `number` | `undefined` | Maximum number of rendered options. |
| `maxValues` | `number` | `undefined` | Maximum selected values in multi mode. |
| `minInputLength` | `number` | `0` | Input length required before menu opens/results. |
| `delimiters` | `string[]` | `[]` | Keys/chars that trigger selection in multi mode. |
| `setValueOnPaste` | `boolean` | `true` | Converts pasted text into values when possible. |
| `setValueOnBlur` | `boolean` | `false` | Applies input as value on blur when valid. |
| `backspaceFocusesValue` | `boolean` | `true` | Focuses previous token on backspace. |
| `backspaceRemovesValue` | `boolean` | `true` | Removes token/value on backspace. |
| `escapeClearsValue` | `boolean` | `false` | Clears selection on Escape when menu is closed. |
| `hideSelectedOptions` | `boolean` | `undefined` | Hides selected options from menu. |
| `filterOption` | `(option, input) => boolean` | built-in | Custom option filtering logic. |
| `formatOptionLabel` | `(option, meta) => VNode\|string` | `null` | Custom renderer for menu/control labels. |
| `formatGroupLabel` | `(group) => VNode\|string` | `null` | Custom renderer for group labels. |
| `getOptionLabel` | `(option) => string` | built-in | Reads label from option objects. |
| `getOptionValue` | `(option) => any` | built-in | Reads value from option objects. |
| `getGroupLabel` | `(group) => string` | built-in | Reads label from group objects. |
| `isOptionDisabled` | `(option, value) => boolean` | built-in | Custom disabled option logic. |
| `isOptionSelected` | `(option, value) => boolean` | `null` | Custom selected-state logic. |
| `theme` | `Record<string, string \| (props)=>string>` | `null` | Class-based theme map. |
| `tailwind` | `boolean` | `false` | Applies built-in Tailwind-style theme classes. |
| `className` | `string \| null` | `null` | Class added to outer container. |
| `classNamePrefix` | `string` | `'vue-select'` | Prefix for internal CSS class names. |
| `id` | `string \| null` | `null` | Root element id. |
| `inputId` | `string` | `''` | Input element id. |
| `inputType` | `string` | `'text'` | Native input type (`text`, `email`, etc.). |
| `inputValue` | `string` | `undefined` | Controlled search input value. |
| `tabIndex` | `string` | `'0'` | Input tab index. |
| `name` | `string` | `undefined` | Hidden input name for forms. |
| `rtl` | `boolean` | `false` | Right-to-left layout behavior. |
| `pageSize` | `number` | `5` | Page-up/down option jump size. |
| `spacing` | `{ baseUnit, controlHeight, menuGutter }` | `{4,38,8}` | Layout spacing tokens. |
| `controlShouldRenderValue` | `boolean` | `true` | Controls rendering selected value in control. |
| `clipboardOptionProperty` | `string` | `'label'` | Option property used for copy/paste text. |
| `copyOptionDelimiter` | `string` | `', '` | Delimiter used when copying multiple values. |
| `blurInputOnSelect` | `boolean` | touch-based | Blurs input after selection (mobile friendly). |
| `captureMenuScroll` | `boolean` | touch-based | Captures scroll in menu boundaries. |
| `autoFocus` | `boolean` | `false` | Focuses component on mount. |
| `onBlur` | `(event) => void` | `undefined` | Blur callback. |
| `onFocus` | `(event) => void` | `undefined` | Focus callback. |
| `onChange` | `(newValue, actionMeta) => void` | internal | Change callback hook. |
| `onInputChange` | `(newValue, actionMeta) => void` | `undefined` | Input-change callback. |
| `onKeyDown` | `(event) => void` | `undefined` | Keydown callback. |
| `onMenuOpen` | `() => void` | `undefined` | Menu-open callback. |
| `onMenuClose` | `() => void` | `undefined` | Menu-close callback. |
| `onMenuScrollToTop` | `(event) => void` | `undefined` | Callback when menu hits top scroll edge. |
| `onMenuScrollToBottom` | `(event) => void` | `undefined` | Callback when menu hits bottom scroll edge. |

## Async loading example

```html
<Select
  :async="true"
  :load-options="loadOptions"
  :default-options="true"
/>
```

```js
methods: {
  loadOptions(inputValue) {
    return fetch('/options.json').then((r) => r.json());
  }
}
```

## Package export

```js
import { Select } from '@cohensive/select-vue-2';
```
