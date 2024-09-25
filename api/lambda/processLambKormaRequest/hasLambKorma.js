/**
 * 
 * @param {String} url - the URL of the page that will be checked. 
 * @returns 
 */
const hasLambKorma = async (url) => {
    let contentType = await getContentType(url);

    // For now, only looking at HTML files. 
    if (contentType !== 'text/html') return false;

    // Since it is an HTML file, fetch it. 
    let res = await fetch(url);

    if (res.status !== 200) return false;

    // Check to see if the text has lamb korma. 
    return (await res.text()).toLowerCase().search(/lamb korma/) !== -1;
}

const getContentType = async (url) => {
    let res = await fetch(url, {method: 'HEAD'});

    if (res.status !== 200) return '';

    // Remove any parameters and clean whitespace. 
    let [ contentType ] = res.headers.get('content-type').split(';').map(part => part.trim());

    return contentType;
}


module.exports = { hasLambKorma };