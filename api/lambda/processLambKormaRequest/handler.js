const logger = require('pino')();
const haversine = require('haversine-distance');

const { explore } = require('./explore');
const { getRestaurants } = require('./getRestaurants');
const { hasLambKorma } = require('./hasLambKorma');

const handler = async (event) => {
    logger.info(`input to handler: ${JSON.stringify(event)}`);
    
    const { userPosition } = event.body;

    // TODO: This needs to be replaced with a call to the Google Places API. For now, just hardcoding some data. 
    const restaurants = await getRestaurants(userPosition);

    // We sort by distance.
    restaurants.sort((a, b) => {
        if (haversine(a, userPosition) <= haversine(b, userPosition)) return -1;
        return 1;
    })

    for (let restaurant of restaurants) {
        let urls = await explore(restaurant.url);

        for (let url of urls) {
            if (await hasLambKorma(url)) return restaurant;
        }
    }

    return null;
}

module.exports = handler;