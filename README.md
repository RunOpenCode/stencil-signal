# @runopencode/stencil-signal

[![npm version](https://badge.fury.io/js/%40runopencode%2Fstencil-signal.svg)](https://badge.fury.io/js/%40runopencode%2Fstencil-signal)

Lit (Google's web component framework)
started [experimental support](https://github.com/lit/lit/tree/3.0/packages/labs/preact-signals)
for signals from `@preact\signal-core` library. As they stated in
their [blog](https://lit.dev/blog/2023-09-27-lit-3.0-prerelease-2):

> ...we think signals promise to offer a convenient and relatively simple option for shared observable state, a 
> recurring need in our community. So we are starting to explore what it would look like to integrate signals with Lit 
> with a new @lit-labs/preact-signals package.

So, if Lit has it, why Stencil shouldn't?

![signals.jpg](docs/signals.jpg)

So this library brings exactly that - integration with `@preact\signal-core` library which allows you to use signals in
your Stencil components. Only requirement is to decorate `render()` method of your component with `@Preactive()`
decorator and for each value change of signal/computed value used in your `render()` method, DOM will be updated.

Why? Because we can! Do you need it? Well, probably not, Stencil already has a decent reactivity system. What we believe 
that Stencil is missing in terms of reactivity is better integration with [RxJS](https://rxjs.dev/) library. However, we
have compiled some of our commonly used functions in experimental library 
[@runopencode/rx-stencil](https://github.com/RunOpenCode/rx-stencil) which you can use to tackle more advanced tasks.

## Example

```typescript jsx
import { Component, ComponentInterface, h } from '@stencil/core';
import { Preactive }                        from '@runopencode/stencil-signal';
import { Signal, signal}                    from '@preact/signals-core';

let counter: Signal<number> = signal<number>('counter', 0);

@Component({
    tag: 'my-component',
    shadow: true
})
export class MyComponent implements ComponentInterface {

    @Preactive()
    render(): any {
        return <div onClick={(): void => { counter.value++; }}>{counter.value}</div>;
    }
}
```

## Caveats

In order to avoid memory leaks, and considering that method `render()` of each component is registered as "effect",
cleanup is required which is executed when component is disconnected from DOM. However, Stencil is not consistent in
invoking `disconnectedCallback()` method of components - if your library doesn't have any component which defines this
method, Stencil will not invoke it for any component. So, in order to avoid this, you should define this method in at
least one component.

For this inconvenience, we intend to open RFC which would address this issue.

## TODO:

- [ ] Write tests.