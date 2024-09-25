const cheerio = require('cheerio');
const logger = require('pino')()

/**
 * Takes a URL and returns the valid pages associated. 
 */
const explore = async (url) => {
    logger.info(`input to explore: ${JSON.stringify({ url })}`)

    // Parse the URL that is passed in. 
    if (!isValidUrl(url)) {
        throw new Error(`the url '${url}' is invalid.`)
    }

    let { origin: legalOrigin, pathname: initialPathname } = new URL(url);

    logger.info(`The origin and initial pathname of the passed URL: ${JSON.stringify({legalOrigin, initialPathname})}`);

    // All of the pathnames that we've seen. Keeping track of this prevents us from going in circles. 
    let seenPaths = new Set();

    // A stack. Could have used recursion, but went this route instead. 
    let pathsToProcess = [initialPathname];

    while (pathsToProcess.length > 0) {
        logger.info(`Starting at the top of the loop. The state of the stack is: ${pathsToProcess.toString()}`)
        logger.info(`And the state of the set is : ${[...seenPaths].toString()}`)

        let pathToProcess = pathsToProcess.shift();

        // Don't continue if we've seen this one. 
        if (seenPaths.has(pathToProcess)) continue;

        // Now that we have begun to process this path, we add it to what we've seen. 
        seenPaths.add(pathToProcess);

        // Now we get all URLs that can be reached from the page. 
        let hrefs = await getHrefs(legalOrigin + pathToProcess);

        for (let href of hrefs) {
            let pathname = getPathname(href, legalOrigin);

            // We don't leave the website.
            if (pathname) pathsToProcess.push(pathname);
        }
    }

    // Return all paths found as an array. 
    logger.info(`output to explore: ${[...seenPaths].toString()}`)
    return [...seenPaths];
}

/**
 * Given a URL, returns all href values from the page. 
 */
const getHrefs = async (url) => {
    console.log(`input to getHrefs: ${url}`)
    
    let res = await fetch(url);

    // If the page failed to load, the calling function doesn't need to know there was an error. Just return no URLs. 
    if (res.status !== 200) return [];
    
    // Parse the HTML. If an error, just don't return any URLs. 
    let $;
    try {
        $ = cheerio.load(await res.text());
    } catch (err) {
        console.log(err);
        return [];
    }
    
    // We iterate through all <a> tags on the page. 
    let hrefs = [];
    for (let foo of $('a')) {
        if (!foo.attribs.href) continue;

        hrefs.push(foo.attribs.href);
    }

    logger.info(`output of getHrefs: ${hrefs.toString()}`)
    return hrefs;
}

const getPathname = (href, legalOrigin) => {
    logger.info(`input to getPathname: ${JSON.stringify({ href, legalOrigin })}`)

    if (isPathname(href)) return href;

    if (isFilename(href)) return `/${href}`;

    // Is it a URL?
    let url;
    try {
        url = new URL(href);
    // If the URL fails to parse, then just return NULL. 
    } catch (err) {
        return null;
    }

    // Also, if the origin doesn't match, then we don't care about the pathname. 
    if (url.origin !== legalOrigin) return null;
    return url.pathname;
}

/**
 * TODO: Make this regex better!
 */
const isPathname = (href) => {
    return /^(\/)/.test(href);
} 

const isFilename = (href) => {
    return /^((\/)?([a-zA-Z0-9]|_|-)*)+.(html|pdf)/.test(href);
}

const isValidUrl = (url) => {
    try {
        new URL(url);
    } catch (err) {
        return false;
    }

    return true;
}

module.exports = { explore };