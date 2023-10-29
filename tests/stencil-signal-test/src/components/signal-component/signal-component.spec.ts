import { newSpecPage }     from '@stencil/core/testing';
import { SignalComponent } from './signal-component';

describe('signal-component', (): void => {

    it('renders with values', async (): Promise<void> => {
        let {root} = await newSpecPage({
            components: [SignalComponent],
            html:       `<signal-component first="Stencil" last="'Don't call me a framework' JS"></signal-component>`,
        });

        expect(root).toEqualHtml(`
            <signal-component first="Stencil" last="'Don't call me a framework' JS">
                <mock:shadow-root>
                    <div>
                        Hello, World! I'm Stencil 'Don't call me a framework' JS
                    </div>
                </mock:shadow-root>
            </signal-component>
        `);
    });
});
