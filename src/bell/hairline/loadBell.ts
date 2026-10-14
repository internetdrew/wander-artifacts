import kernelUrl from './kernel.js?url';
import figureUrl from '../../../bell.js?url';

export type HairlineBellHandle = {
  ring: (onSettled?: () => void) => void;
  destroy: () => void;
};
type BellDefinition = {
  mount: (
    elements: {
      stage: HTMLElement;
      svg: SVGSVGElement;
      read: HTMLElement;
      onSurfacePath?: (path: string) => void;
      animatePlunger?: (from: number, to: number, update: (value: number) => void, complete: () => void) => { stop: () => void };
    },
    value: number,
  ) => HairlineBellHandle;
};
type HairlineRuntime = {
  inject: (root: Document) => void;
  mk: (tag: string, attributes: Record<string, string>, parent: HTMLElement) => SVGSVGElement;
};

declare global {
  interface Window {
    HL: HairlineRuntime;
    hairline: (definition: BellDefinition) => void;
  }
}

let loading: Promise<{ definition: BellDefinition; runtime: HairlineRuntime }> | undefined;

function loadScript(url: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(new Error('Could not load the Hairline bell.'));
    };
    document.head.append(script);
  });
}

export function loadBell() {
  loading ??= (async () => {
    await loadScript(kernelUrl);
    let definition: BellDefinition | undefined;
    window.hairline = next => { definition = next; };
    await loadScript(figureUrl);
    if (!definition) throw new Error('The Hairline bell did not register.');
    window.HL.inject(document);
    return { definition, runtime: window.HL };
  })();
  return loading;
}
