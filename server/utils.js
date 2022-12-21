const http = require("http");
const https = require("https");
const convert = require("xml-js");
const logger = require("./logger").setup();

const getRequest = url => {
    return new Promise((resolve, reject) => {
        logger.debug("getting url " + url);

        const requester = url.startsWith("https") ? https : http;
        logger.debug("using " + (url.startsWith("https") ? "https" : "http"));

        requester.get(url, (response) => {
            let chunks = [];

            logger.debug(response.statusCode);

            response.on("data", fragments => chunks.push(fragments));
            response.on("end", () => resolve({ data: Buffer.concat(chunks).toString(), statusCode: response.statusCode }));
            response.on("error", (error) => reject(error));
        });
    });
};


/**
 * Remove that _attributes field added by xml-js lib (I don't like it) and add its
 * children as children of the _attributes's parent
 * @param {*} obj json object to traverse and remove _attributes field
 * @returns object free of _attributes fields
 */
const pullOutAttr = (obj) => {
    if (!obj)
        return;

    if (Object.keys(obj).length < 1)
        return;

    Object.keys(obj).forEach(key => {
        if (obj[key]._attributes) {
            obj[key] = {
                ...obj[key],
                ...obj[key]._attributes
            };
            delete obj[key]._attributes;
        }
        if (typeof obj[key] === "object")
            obj[key] = pullOutAttr(obj[key]);
    });

    return obj;
};

const transformToJson = xml => {
    const json = convert.xml2json(xml, { compact: true, spaces: 4 });
    return pullOutAttr(JSON.parse(json));
};

module.exports = { getRequest, transformToJson };