import { effect } from '@preact/signals-core';
import {
    ComponentInterface,
    forceUpdate,
}                 from '@stencil/core';

/**
 * Assert that the given property which is decorated
 * is actually a function (method) and name is "render".
 *
 * {@internal}
 */
function assertRenderMethodIsDecorated(target: ComponentInterface, name: string | symbol): void {
    let isFunction: boolean = 'function' === typeof target[name as any];
    let isRender: boolean   = 'render' === name.toString();

    if (isFunction && isRender) {
        return;
    }

    throw new Error(`"@Preactive()" decorator can only be used on "render()" method.`);
}

/**
 * Here we store the effect dispose callback for each component.
 *
 * {@internal}
 */
let disposeCallback: WeakMap<ComponentInterface, () => void> = new WeakMap();

/**
 * Here we store the last render result of effect in order to
 * prevent double rendering.
 *
 * {@internal}
 */
let lastRender: WeakMap<ComponentInterface, any> = new WeakMap();

/**
 * Check if the given component has an effect already running.
 *
 * {@internal}
 */
function hasEffect(target: ComponentInterface): boolean {
    return disposeCallback.has(target);
}

/**
 * Set the dispose callback for the given component.
 *
 * {@internal}
 */
function setDisposeCallback(target: ComponentInterface, disposeFn: () => void): void {
    if (disposeCallback.has(target)) {
        // invoke previous dispose callback
        disposeCallback.get(target)();
    }

    disposeCallback.set(target, disposeFn);
}

/**
 * Get the last render result of the given component. If there is no
 * result, the given render function will be invoked and the result
 * will be returned.
 *
 * {@internal}
 */
function getLastRender(target: ComponentInterface, renderFn: () => any): any {
    if (!lastRender.has(target)) {
        return renderFn();
    }

    let result: any = lastRender.get(target);

    // clear previous result
    lastRender.delete(target);

    return result;
}

/**
 * Set the last render result of the given component.
 */
function setLastRender(target: ComponentInterface, result: any): void {
    lastRender.set(target, result);
}

/**
 * Clear effect on disconnect.
 */
function clearOnDisconnect(target: ComponentInterface): void {
    let originalDisconnectedCallback: () => void = target.disconnectedCallback;

    target.disconnectedCallback = function (): void {
        let disposeFn: () => void | undefined = disposeCallback.get(this);

        if (disposeFn) {
            disposeFn();
        }

        lastRender.delete(this);
        disposeCallback.delete(this);

        originalDisconnectedCallback.call(this);

        target.disconnectedCallback = originalDisconnectedCallback;
    };
}

/**
 * Decorate "render()" method to react to value change of signals
 * from "preact/signals-core" package.
 */
export function Preactive(): MethodDecorator {
    return function methodEffectDecorator(target: ComponentInterface, propertyKey: string | symbol): TypedPropertyDescriptor<any> {
        assertRenderMethodIsDecorated(target, propertyKey);

        let descriptor: PropertyDescriptor     = Object.getOwnPropertyDescriptor(target, propertyKey);
        let previousFn: (...arg: any[]) => any = descriptor.value;

        descriptor.value = function decoratedOriginalFunction(...arg: any[]): any {
            // effect is already running, so we just call the original function,
            // or we will use last result if invocation comes from the effect.
            if (hasEffect(this)) {
                getLastRender(this, (): any => previousFn.call(this, ...arg));
            }

            // set effect dispose callback
            setDisposeCallback(this, effect((): void => {
                setLastRender(this, previousFn.call(this, ...arg));
                forceUpdate(this);
            }));
            
            // clear effect on disconnect
            clearOnDisconnect(this);

            // invoke original function
            return getLastRender(this, (): any => previousFn.call(this, ...arg));
        };

        return descriptor;
    };
}
