/**
 * Takes the user's location and returns all restaurants within five miles. At the moment, this is returning some mocked data. 
 * 
 * @param {Float} lat the user's latitude. 
 * @param {Flat} lon the user's longitude. 
 * @returns an array of restaurant objects. 
 */
const getRestaurants = async ({lat, lon}) => {
    return [
        {
            name: 'Taste of Peru',
            url: 'https://img1.wsimg.com/blobby/go/08864a87-53de-4993-8afd-b92453dbab71/downloads/1ciob10v6_269572.pdf',
            lat: 42.0013377,
            lon: -87.6904115,
        },
        {
            name: 'Nepal House',
            url: 'https://thenepalhouse.net/',
            lat: 41.9975385,
            long: -87.7160733,
        },
        {
            name: 'Oberoi\'s',
            url: 'https://www.oberoisindianfoodil.com/?utm_source=gmb&utm_medium=website',
            lat: 41.9978138,
            lon: -87.694494
        }
    ]
}

module.exports = { getRestaurants };