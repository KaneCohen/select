export default function<T>(item: T | null | undefined): item is T {
  return item != null;
}
