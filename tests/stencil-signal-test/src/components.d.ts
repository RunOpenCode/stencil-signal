/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface SignalComponent {
    }
}
declare global {
    interface HTMLSignalComponentElement extends Components.SignalComponent, HTMLStencilElement {
    }
    var HTMLSignalComponentElement: {
        prototype: HTMLSignalComponentElement;
        new (): HTMLSignalComponentElement;
    };
    interface HTMLElementTagNameMap {
        "signal-component": HTMLSignalComponentElement;
    }
}
declare namespace LocalJSX {
    interface SignalComponent {
    }
    interface IntrinsicElements {
        "signal-component": SignalComponent;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "signal-component": LocalJSX.SignalComponent & JSXBase.HTMLAttributes<HTMLSignalComponentElement>;
        }
    }
}
