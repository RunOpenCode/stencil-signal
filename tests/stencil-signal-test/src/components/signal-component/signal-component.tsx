import {
    computed,
    signal,
    Signal,
}                    from '@preact/signals-core';
import { Preactive } from '@runopencode/stencil-signal';
import {
    Component,
    ComponentInterface,
    h,
}                    from '@stencil/core';

@Component({
    tag:    'signal-component',
    shadow: true,
})
export class SignalComponent implements ComponentInterface {

    private readonly counter: Signal<number> = signal<number>(0);

    private readonly double: Signal<number> = computed((): number => {
        return this.counter.value * 2;
    });

    @Preactive()
    public render(): any {
        return (
            <div onClick={(): void => {
                this.counter.value++;
            }}>
                Counter: {this.counter.value}, double: {this.double.value}
            </div>
        );
    }
}
