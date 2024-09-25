const { explore } = require('../utils');

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('explore', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    
    test('The URL is invalid', async () => {        
        expect(async () => await explore('bad-url')).rejects.toThrow('the url \'bad-url\' is invalid.');
    });

    test('A webpage with no outgoing links', async () => {
        const webpage = `
        <div>Some content, but no other links!</div>
        `

        mockFetch.mockImplementation(async () => ({ status: 200, text: async () => webpage }));

        await expect(explore('https://www.a-fake-website.com')).resolves.toEqual(['/'])
    })

    test('A wepage with links to different pages on the same site', async () => {
        const webpageOne = `
        <div>
            <a href="/second-page">The second page!</a>
        </div>
        `

        const webpageTwo = `
        <div>
            <a href="/third-page">The third page!</a>
        </div>
        `

        const webpageThree = `
        <div>Just content here!</div>
        `

        mockFetch.mockImplementation(async (url) => {
            switch (url) {
                case 'https://www.a-fake-website.com/':
                  return ({ status: 200, text: async () => webpageOne });
                case 'https://www.a-fake-website.com/second-page':
                    return ({ status: 200, text: async () => webpageTwo });
                case 'https://www.a-fake-website.com/third-page':
                  return ({ status: 200, text: async () => webpageThree });
                default:
                  return { status: 404, text: async () => 'Content not found!' };
            } 
        });

        await expect(explore('https://www.a-fake-website.com')).resolves.toEqual(['/', '/second-page', '/third-page'])       
    })

    test('The links in the set of pages form a cycle', async () => {
        const webpageOne = `
        <div>
            <a href="/away-from-home">We are home...</a>
        </div>
        `

        const webpageTwo = `
        <div>
            <a href="/">This link takes you home...</a>
        </div>
        `

        mockFetch.mockImplementation(async (url) => {
            switch (url) {
                case 'https://www.a-fake-website.com/':
                  return ({ status: 200, text: async () => webpageOne });
                case 'https://www.a-fake-website.com/away-from-home':
                    return ({ status: 200, text: async () => webpageTwo });
                default:
                  return { status: 404, text: async () => 'Content not found!' };
            } 
        });

        await expect(explore('https://www.a-fake-website.com')).resolves.toEqual(['/', '/away-from-home'])       
    })
    
    test('There is a link to a different site', async () => {
        const webpage = `
        <div>
            <a href="https://www.a-real-website.com">This takes us to a different website</a>
        </div>
        `

        mockFetch.mockImplementation(async (url) => ({ status: 200, text: async () => webpage }));

        await expect(explore('https://www.a-fake-website.com')).resolves.toEqual(['/'])       
    })
})