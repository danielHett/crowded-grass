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

    test('The basic case', async () => {
        const webpage = `
        <div>Some content, but no other links!</div>
        `

        mockFetch.mockImplementation(async () => ({ status: 200, text: async () => webpage }));

        await expect(explore('https://www.a-fake-website.com')).resolves.toEqual(['/'])
    })

    /**
    test("A circular reference", async () => {
        // This checks that we can get other pages. 
        const webpageOne = `
        <div>
            <a href="/two">Link to Webpage Two</a>
            <a href="/three">Link to Webpage Three</a>
            <a href="/four">Link to Webpage Four</a>
        </div>
        `

        // This makes sure that invalid pathnames don't break the code. 
        const webpageTwo = `
        <div>
            <a href="afake:://pathname">This link is invalid</a>
        </div>
        `

        // Ensures we can go back to a page we've seen. Also handling a filename. 
        const webpageThree = `
        <div>
            <a href="/">Link to Webpage One</a>
            <a href="thisIsAFile.pdf">This is a pdf file</a>
        </div>
        `

        // Ensures that a non-html file won't break the code. 
        const webpageFour = `
        {
            "littleMessage": "This isn't HTML, cheerio should throw an error when trying to parse this!"
        }
        `
    })
    */
})