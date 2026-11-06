interface Window {
  /** Resolves when the first-visit loader starts leaving (immediately when it is skipped). Set inline in index.html. */
  fellerLoader?: Promise<void>;
}
