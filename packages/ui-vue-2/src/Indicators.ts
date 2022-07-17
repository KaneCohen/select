import { CreateElement, VNode } from 'vue';
import { CommonProps } from './types';
import { keyframes } from '@emotion/css';

const loadingDotAnimations = keyframes`
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
`;

export function renderCross(h: CreateElement, size: number): VNode {
  return h('svg', {
    attrs: {
      height: size,
      width: size,
      viewBox: `0 0 20 20`,
      ariaHidden: 'true',
      focusable: false,
    }
  }, [
    h('path', {
      attrs: {
        d: 'M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z'
      }
    })
  ]);
}

function renderLoadingDot(h: CreateElement, classes: string[], delay: number): VNode {
  return h(
    'span',
    {
      class: [...classes].filter((v: string) => v.length),
      style: {
        animation: `${loadingDotAnimations} 1s ease-in-out ${delay}ms infinite`,
      }
    },
  );
}

function renderDropdown(h: CreateElement, size: number) {
  return h('svg', {
    attrs: {
      height: size,
      width: size,
      viewBox: '0 0 20 20',
      ariaHidden: 'true',
      focusable: false,
    }
  }, [
    h('path', {
      attrs: {
        d: 'M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z'
      }
    })
  ]);
}

function renderLoadingIndicator(h: CreateElement, props: CommonProps): VNode {
  const { select } = props;

  let classes = [
    select.getThemeClass('loadingIndicator'),
    select.getClass('loading-indicator'),
  ];

  let loadingClasses = [
    select.getThemeClass('loadingIndicatorDot'),
    select.getClass('loading-indicator-dot'),
  ];

  let children = [];

  if (props.slots['loading-indicator']) {
    children = [
      props.slots['loading-indicator']({props})
    ];
  } else {
    children = [
      renderLoadingDot(h, loadingClasses, 0),
      renderLoadingDot(h, loadingClasses, 160),
      renderLoadingDot(h, loadingClasses, 320),
    ];
  }

  return h(
    'div',
    {
      class: [...classes].filter((v: string) => v.length)
    },
    [children]
  );
}

function renderClearIndicator(h: CreateElement, props: CommonProps): VNode {
  const { select } = props;

  let classes = [
    select.getThemeClass('clearIndicator', {focused: select.state.isFocused}),
    select.getClass('clear-indicator')
  ];

  if (select.state.isFocused) {
    classes.push(select.getClass('clear-indicator--is-focused'));
  }

  let child = props.slots['clear-indicator'] ? props.slots['clear-indicator']({props}) : renderCross(h, 20);

  return h(
    'div',
    {
      class: [...classes].filter((v: string) => v.length),
      on: {
        mousedown(e: MouseEvent) {
          select.onClearIndicatorMouseDown(e);
        },
        touchend(e: MouseEvent) {
          select.onClearIndicatorTouchEnd(e);
        },
      },
    },
    [child]
  );
}

function renderIndicatorSeparator(h: CreateElement, props: CommonProps): VNode {
  const { select } = props;

  let classes = [
    select.getThemeClass('indicatorSeparator'),
    select.getClass('indicator-separator')
  ];

  return h(
    'div',
    {
      class: [...classes].filter((v: string) => v.length),
    },
  );
}

function renderDropdownIndicator(h: CreateElement, props: CommonProps): VNode {
  const { select } = props;

  let classes = [
    select.getThemeClass('dropdownIndicator', {focused: select.state.isFocused}),
    select.getClass('dropdown-indicator')
  ];

  if (select.state.isFocused) {
    classes.push(select.getClass('dropdown-indicator--is-focused'));
  }

  let child = props.slots['dropdown-indicator'] ? props.slots['dropdown-indicator']({props}) : renderDropdown(h, 20);

  return h(
    'div',
    {
      class: [...classes].filter((v: string) => v.length),
      on: {
        mousedown(e: MouseEvent) {
          select.onDropdownIndicatorMouseDown(e);
        },
        touchend(e: MouseEvent) {
          select.onDropdownIndicatorTouchEnd(e);
        },
      }
    },
    [child]
  );
}

export default {
  name: 'Indicators',

  functional: true,

  render(h: CreateElement, { props }: { props: CommonProps }): VNode {
    const { select } = props;
    const { clearable } = select.props;
    const { value, isLoading } = select.state;

    let classes = [
      select.getThemeClass('indicators'),
      select.getClass('indicators'),
    ];

    let children: (VNode | null)[] = [
      isLoading ? renderLoadingIndicator(h, props) : null,
      value.length && clearable ? renderClearIndicator(h, props) : null,
      renderIndicatorSeparator(h, props),
      renderDropdownIndicator(h, props),
    ];

    return h(
      'div',
      {
        class: [...classes].filter((v: string) => v.length),
      },
      [children]
    );
  }
}
