declare module '*.svg?component' {
  import type { FunctionalComponent } from 'preact';
  const Component: FunctionalComponent<any>;
  export default Component;
}