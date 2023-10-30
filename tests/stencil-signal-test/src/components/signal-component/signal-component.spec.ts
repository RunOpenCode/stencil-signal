import {
    newSpecPage,
    SpecPage,
}                          from '@stencil/core/testing';
import { SignalComponent } from './signal-component';

describe('signal-component', (): void => {

    it('renders with initial values.', async (): Promise<void> => {
        let page: SpecPage = await newSpecPage({
            components: [SignalComponent],
            html:       `<signal-component></signal-component>`,
        });

        expect(page.root).toEqualHtml(`
            <signal-component>
                <mock:shadow-root>
                    <div>
                        Counter: 0, double: 0
                    </div>
                </mock:shadow-root>
            </signal-component>
        `);

        page.root.shadowRoot.querySelector('div').click();

        await page.waitForChanges();

        expect(page.root).toEqualHtml(`
            <signal-component>
                <mock:shadow-root>
                    <div>
                        Counter: 1, double: 2
                    </div>
                </mock:shadow-root>
            </signal-component>
        `);
    });
});
