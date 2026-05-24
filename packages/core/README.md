# @cohensive/select-core

Headless select/tokenfield engine used by the Vue 2 and Vue 3 UI packages.

## Install

```bash
npm i @cohensive/select-core
```

## Exports

```ts
import Select, { theme, defaults, utils } from '@cohensive/select-core';
```

- `default` export: `Select` class
- `theme`: default class map used by UI packages
- `defaults`: default config values
- `utils`: helper utilities (filtering, debounce, throttle, etc.)

## Data formats

```ts
type Option = {
  label?: string;
  value?: any;
  disabled?: boolean;
  __isNew__?: boolean;
  [name: string]: any;
};

type Group = {
  label?: string;
  options: Option[];
  [name: string]: any;
};

type OptionsOrGroups = Array<Option | Group>;
```

## Typical usage

```ts
import Select from '@cohensive/select-core';

const select = new Select({
  options: [
    { value: 1, label: 'red' },
    { value: 2, label: 'orange' },
  ],
  multiple: true,
});

select.on('change', (value, actionMeta) => {
  console.log(value, actionMeta);
});
```

## Select config props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `autoFocus` | `boolean` | `false` | Focus control on mount. |
| `backspaceFocusesValue` | `boolean` | `true` | Focus previous token on backspace in multi mode. |
| `backspaceRemovesValue` | `boolean` | `true` | Remove selected token/value on backspace. |
| `blurInputOnSelect` | `boolean` | `isTouchCapable()` | Blur input after selecting an option. |
| `captureMenuScroll` | `boolean` | `!isTouchCapable()` | Trap menu scroll at edges. |
| `className` | `string \| null` | `null` | Outer container class name. |
| `classNamePrefix` | `string \| null` | `null` | Prefix for generated inner class names. |
| `clearable` | `boolean` | `true` | Allow clearing selected value(s). |
| `clearInputOnClose` | `boolean` | `undefined` | Clear search input when menu closes. |
| `clipboardOptionProperty` | `string` | `'label'` | Option property used for copy/paste text. |
| `closeMenuOnSelect` | `boolean` | `true` | Close menu after selection. |
| `closeMenuOnScroll` | `boolean \| ScrollHandler` | `false` | Close menu on scroll (or custom handler). |
| `controlShouldRenderValue` | `boolean` | `true` | Render selected value in control. |
| `copyOptionDelimiter` | `string` | `', '` | Delimiter for copied multi-values. |
| `creatable` | `boolean` | `false` | Enable create-new-option behavior. |
| `delimiters` | `string[]` | `[]` | Input delimiters that trigger selection. |
| `disabeld` | `boolean` | `false` | Disable control (spelling preserved from API). |
| `escapeClearsValue` | `boolean` | `false` | Clear selection on Escape when menu is closed. |
| `filterOption` | `FilterOption \| null` | `createFilter()` | Option filtering implementation. |
| `formatGroupLabel` | `(group) => any \| null` | `null` | Custom group label formatter. |
| `formatOptionLabel` | `(option, meta) => any \| null` | `null` | Custom option label formatter. |
| `focused` | `boolean` | `undefined` | Controlled focus state. |
| `getGroupLabel` | `(group) => string` | built-in | Group label accessor. |
| `getOptionLabel` | `(option) => string` | built-in | Option label accessor. |
| `getOptionValue` | `(option) => any` | built-in | Option value accessor. |
| `hideSelectedOptions` | `boolean` | `undefined` | Hide selected options in menu. |
| `id` | `string \| null` | `null` | Root id attribute. |
| `instanceId` | `number \| string \| null` | `null` | Prefix id for internal elements. |
| `inputId` | `string` | `''` | Input element id. |
| `inputType` | `string` | `'text'` | Input type (`text`, `email`, etc.). |
| `inputValue` | `string` | `undefined` | Controlled search value. |
| `isOptionDisabled` | `(option, value) => boolean` | built-in | Disabled-state predicate. |
| `isOptionSelected` | `(option, value) => boolean \| null` | `null` | Selected-state predicate override. |
| `keyMap` | `Record<string,string>` | built-in map | Keyboard action mapping. |
| `loading` | `boolean` | `false` | Loading state flag. |
| `loadingMessage` | `string \| fn` | `'Loading...'` | Message while loading options. |
| `maxValues` | `number` | `undefined` | Max selected values (multi mode). |
| `maxOptions` | `number` | `undefined` | Max rendered options. |
| `maxMenuHeight` | `number` | `300` | Max menu height before scroll. |
| `menuPlacement` | `'auto' \| 'bottom' \| 'top'` | `'auto'` | Menu placement preference. |
| `menuPosition` | `'absolute' \| 'fixed'` | `'absolute'` | CSS positioning mode. |
| `menuShouldBlockScroll` | `boolean` | `false` | Block page scroll when menu is open. |
| `menuShouldScrollIntoView` | `boolean` | `isMobileDevice()` | Auto-scroll menu into viewport on open. |
| `minInputLength` | `number` | `0` | Min chars before menu/results. |
| `minMenuHeight` | `number` | `140` | Minimum menu height. |
| `multiple` | `boolean` | `false` | Enable multi-value mode. |
| `name` | `string` | `undefined` | Hidden input name for forms. |
| `noOptionsMessage` | `string \| () => string` | `() => 'No options'` | Message with empty results. |
| `open` | `boolean` | `undefined` | Controlled menu open state. |
| `options` | `OptionsOrGroups` | `[]` | Option/group source list. |
| `onBlur` | `(event) => void` | `undefined` | Blur handler. |
| `onChange` | `(newValue, actionMeta) => void` | internal state update | Change handler. |
| `onFocus` | `(event) => void` | `undefined` | Focus handler. |
| `onInputChange` | `(newValue, actionMeta) => void` | `undefined` | Input-change handler. |
| `onKeyDown` | `(event) => void` | `undefined` | Keydown handler. |
| `onMenuOpen` | `() => void` | `undefined` | Menu-open callback. |
| `onMenuClose` | `() => void` | `undefined` | Menu-close callback. |
| `onMenuScrollToTop` | `(event) => void` | `undefined` | Callback when menu reaches top. |
| `onMenuScrollToBottom` | `(event) => void` | `undefined` | Callback when menu reaches bottom. |
| `openMenuOnFocus` | `boolean` | `false` | Open menu on input focus. |
| `openMenuOnClick` | `boolean` | `true` | Open menu on control click. |
| `placeholder` | `string` | `'Select...'` | Placeholder text. |
| `pageSize` | `number` | `5` | Jump size for PageUp/PageDown. |
| `rtl` | `boolean` | `false` | Right-to-left behavior. |
| `screenReaderStatus` | `({count}) => string` | built-in | Accessibility status text. |
| `searchable` | `boolean` | `false` | Enable search input behavior. |
| `setValueOnBlur` | `boolean` | `false` | Apply input as value on blur when valid. |
| `setValueOnPaste` | `boolean` | `true` | Parse pasted values into selections. |
| `spacing` | `{ baseUnit, controlHeight, menuGutter }` | `{4,38,8}` | Spacing tokens used by UI layers. |
| `tabIndex` | `string` | `'0'` | Input tab index. |
| `theme` | `Theme \| null` | `null` | Class-based theme map. |
| `value` | `Option[]` | `[]` | Controlled selected values. |

## Creatable config props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `allowCreateWhileLoading` | `boolean` | `false` | Permit creating while async loading. |
| `createOptionPosition` | `'first' \| 'last'` | `'last'` | Position of create-option in menu. |
| `formatCreateLabel` | `(input) => string` | built-in | Label text for create option. |
| `isValidNewOption` | `(input, value, options, accessors) => boolean` | built-in | Validation for whether creation is allowed. |
| `getNewOptionData` | `(input, optionLabel) => Option` | built-in | Shape builder for created option object. |
| `onCreateOption` | `(input) => void` | `undefined` | Custom create flow hook. |

## Async config props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `async` | `boolean` | `false` | Enable async option loading mode. |
| `cacheOptions` | `boolean` | `true` | Cache async results by input value. |
| `defaultOptions` | `OptionsOrGroups \| boolean` | `undefined` | Options shown for empty input in async mode. |
| `loadOptions` | `(inputValue, props, abortController, callback?) => Promise\|void` | `undefined` | Async options resolver. |
| `isLoading` | `boolean` | `undefined` | Loading-state override. |
| `asyncOptions.url` | `string \| null` | `null` | Default async fetch URL. |
| `asyncOptions.delay` | `number` | `300` | Debounce delay before async request. |
| `asyncOptions.queryParam` | `string` | `'q'` | Query parameter name for input value. |
| `asyncOptions.params` | `Record<string, any>` | `{}` | Extra query params. |
| `asyncOptions.requestOptions` | `Record<string, any>` | `{ method: 'GET', cache: 'no-cache', headers: { 'Content-Type': 'application/json' } }` | Fetch options for default async loader. |

## Notes

- This package is UI-framework agnostic, but optimized for companion Vue wrappers.
- For component-level usage, prefer `@cohensive/select-vue-2` or `@cohensive/select-vue-3`.
