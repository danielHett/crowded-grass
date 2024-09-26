const handler = require('../handler');

const { getRestaurants: mockGetRestaurants } = require('../getRestaurants');
const { explore: mockExplore } = require('../explore');
const { hasLambKorma: mockHasLambKorma } = require('../hasLambKorma');

jest.mock('../getRestaurants');
jest.mock('../explore');
jest.mock('../hasLambKorma');



test('The handler returns the closest restaurant with lamb korma', async () => {
    mockGetRestaurants.mockResolvedValue([
        {
            name: 'Taste of Peru',
            url: 'https://taste-of-peru.com',
            lat: 42.0013377,
            lon: -87.6904115,
        },
        {
            name: 'Nepal House',
            url: 'https://the-nepal-house.com',
            lat: 41.9975385,
            long: -87.7160733,
        },
        {
            name: 'Oberoi\'s',
            url: 'https://oberoi.com',
            lat: 41.9978138,
            lon: -87.694494
        }
    ]);

    mockExplore.mockResolvedValueOnce(['https://this-url-does-not-matter/']).mockResolvedValueOnce(['https://taste-of-peru.com/']).mockResolvedValueOnce(['https://taste-of-peru.com/']);
    
    mockHasLambKorma.mockResolvedValueOnce(false).mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    await expect(handler({ body: { userPosition: { lon: 42.0053941, lat: -87.665884 } } })).resolves.toEqual({lat: 41.9978138, lon: -87.694494, name: "Oberoi's", url: "https://oberoi.com"});
})