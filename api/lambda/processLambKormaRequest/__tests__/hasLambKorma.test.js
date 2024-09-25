const { hasLambKorma } = require('../hasLambKorma');

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
    jest.resetAllMocks();
});

test('The URL points to a file that is not HTML', async () => {
    mockFetch.mockResolvedValue({ status: 200, headers: new Headers({ "content-type": "image/jpeg" }) });

    await expect(hasLambKorma('https://not-html.com')).resolves.toEqual(false);
    expect(mockFetch).toHaveBeenCalledTimes(1);
})

test('The URL points to a file that is HTML but does not contain the string "lamb korma"', async () => {
    mockFetch.mockResolvedValueOnce({ status: 200, headers: new Headers({ "content-type": "text/html" }) });
    mockFetch.mockResolvedValueOnce({ status: 200, text: async () => 'this is a website' });

    await expect(hasLambKorma('https://html-without-lamb-korma.com')).resolves.toEqual(false);
    expect(mockFetch).toHaveBeenCalledTimes(2);
})

test('The URL points to a file that is HTML but does not contain the string "lamb korma"', async () => {
    mockFetch.mockResolvedValueOnce({ status: 200, headers: new Headers({ "content-type": "text/html" }) });
    mockFetch.mockResolvedValueOnce({ status: 200, text: async () => 'this is a website, with Lamb Korma' });

    await expect(hasLambKorma('https://html-with-lamb-korma.com')).resolves.toEqual(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
})