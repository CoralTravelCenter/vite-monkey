declare const ym: (...args: unknown[]) => unknown;
declare const Vimeo: {
  Player: new (
    element: Element,
    options: Record<string, unknown>,
  ) => {
    element: Element;
    on(name: string, callback: (this: { element: Element }) => void): void;
    pause(): void;
    play(): void;
  };
};
