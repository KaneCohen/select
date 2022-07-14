export default function(
  container: HTMLElement,
  el: HTMLElement
): void {
  const menuRect = container.getBoundingClientRect();
  const focusedRect = el.getBoundingClientRect();
  const overScroll = el.offsetHeight / 3;

  if (focusedRect.bottom + overScroll > menuRect.bottom) {
    container.scrollTo(
      0,
      Math.min(
        (el.offsetTop + el.clientHeight - container.offsetHeight + overScroll),
        container.scrollHeight
      )
    );
  } else if (focusedRect.top - overScroll < menuRect.top) {
    container.scrollTo(0, Math.max(el.offsetTop - overScroll, 0));
  }
}
