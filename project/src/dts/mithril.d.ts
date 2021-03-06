
declare namespace Mithril {
  interface ChildArray extends Array<Children> {}
  type Child = string | BaseNode | BaseComponent;
  type Children = Child | ChildArray;
  type BaseNode = Vnode<any>;

  interface Attributes {
    key?: string;
    [key: string]: any;
  }

  interface Static {

    (
      selector: string | BaseComponent,
      ...children: Children[]
    ): BaseNode;

    <T>(
      selector: string | BaseComponent,
      attributes: T & Attributes,
      ...children: Children[]
    ): BaseNode;

    prop<T>(value: T): BasicProperty<T>;

    prop<T>(): BasicProperty<T>;

    withAttr(
      property: string,
      callback: (value: any) => any,
      callbackThis?: any
    ): (e: Event) => void;

    trust(html: string): any;

    render(
      rootElement: HTMLElement,
      children: Children
    ): void;

    request(options: any): any;
  }

  interface Vnode<T> {
    tag: string;
    key?: string | number;
    attrs?: T;
    children: Children[];
    text: string | number | boolean;
    dom?: HTMLElement;
    domSize?: number;
    state: any;
  }

  interface VnodeFactory {
    (tag: string, key: string | number, attrs: Attributes, children: Array<BaseNode>, text: string, dom: HTMLElement): BaseNode
    <T>(tag: Component<T>, key: string | number, attrs: T, children: Array<BaseNode>, text: string, dom: HTMLElement): BaseNode
  }

  interface BaseComponent {
    view(vnode: BaseNode): BaseNode;

    // initial state
    [data: string]: any;
  }

  interface Component<T> extends BaseComponent {
    view(vnode: Vnode<T>): BaseNode;

    oninit?(vnode: Vnode<T>): void;
    oncreate?(vnode: Vnode<T>): void;
    onupdate?(vnode: Vnode<T>): void;
    onbeforeremove?(vnode: Vnode<T>, done: () => void): void;
    onremove?(vnode: Vnode<T>): void;
    onbeforeupdate?(vnode: Vnode<T>, old: Vnode<T>): boolean;
  }

  interface Property<T> {
    (): T;

    (value: T): T;
  }

  interface BasicProperty<T> extends Property<T> {
    toJSON(): T;
  }
}

declare namespace JSX {
  import __Mithril = Mithril;

  type Element = any;
  interface IntrinsicElements {
    [type: string]: Element;
  }

  interface ElementClass {
    view: (vnode: __Mithril.BaseNode) => __Mithril.BaseNode;
  }
}

declare const m: Mithril.Static;
declare const Vnode: Mithril.VnodeFactory;

declare module 'mithril' {
  export = m;
}

declare module 'mithril/render/vnode' {
  export = Vnode;
}
