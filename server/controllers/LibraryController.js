const logger = require("../logger").setup();
const { getRequest, transformToJson } = require("../utils");

module.exports.getLibraries = async (_, res) => {
    const { data } = await getRequest(global.plexUrl + "/library/sections/");
    const json = transformToJson(data);

    const list = json.MediaContainer.Directory.map(({ type, title, key }) => ({ type, title, key }));

    return res.status(200).send(list);
};

module.exports.getMediaOnDate = async (req, res) => {
    const { library, date_stamp } = req.params;

    if (!library && library !== 0) {
        logger.warn("Request made to 'getMediaOnDate' with an invalid library id: " + library);
        return res.status(400).send({ msg: "Parameter library is missing or invalid" });
    }

    if (!date_stamp) {
        logger.warn("Request made to 'getMediaOnDate' with an invalid date stamp: " + date_stamp);
        return res.status(400).send({ msg: "Parameter date stamp is missing or invalid" });
    }

    const date = new Date(Number(date_stamp));
    if (String(date) === "Invalid Date") {
        logger.warn("Could not create a date from the date stamp sent " + date_stamp);
        return res.status(400).send({ msg: "Could not construct a date from the date stamp sent" });
    }

    const { data, statusCode } = await getRequest(global.plexUrl + "/library/sections/" + library + "/all");

    if (statusCode === 404) {
        logger.warn("Request made to 'getMediaOnDate' with a library id that plex could not find: " + library);
        return res.status(404).send({ msg: "Library with id: " + library + " not found" });
    }

    const json = transformToJson(data);
    logger.debug("response: " + JSON.stringify(json));

    const array = json.MediaContainer.viewGroup === "show" ? "Directory" : "Video";
    const results = json.MediaContainer[array].filter(({ addedAt }) => {
        const addedAtDate = new Date(addedAt * 1000);
        if (addedAtDate.getDate() !== date.getDate())
            return false;
        return addedAtDate.getMonth() === date.getMonth();
    }).map(({ title, thumb, duration, ratingKey }) => ({ title, thumb: global.plexUrl + thumb, duration, ratingKey }));

    return res.status(200).send(results);
};

module.exports.getMediaDetails = async (req, res) => {
    const { library, id } = req.params;

    if (!library && library !== 0) {
        logger.warn("Request made to 'getMediaDetails' with an invalid library id: " + library);
        return res.status(400).send({ msg: "Parameter library is missing or invalid" });
    }

    if (!id) {
        logger.warn("Request made to 'getMediaDetails' with an invalid id: " + id);
        return res.status(400).send({ msg: "Parameter id is missing or invalid" });
    }

    const { data, statusCode } = await getRequest(global.plexUrl + "/library/sections/" + library + "/all");

    if (statusCode === 404) {
        logger.warn("Request made to 'getMediaOnDate' with a library id that plex could not find: " + library);
        return res.status(404).send({ msg: "Library with id: " + library + " not found" });
    }

    const json = transformToJson(data);
    logger.debug("response: " + JSON.stringify(json));

    const array = json.MediaContainer.viewGroup === "show" ? "Directory" : "Video";
    const results = json.MediaContainer[array]
        .filter(({ ratingKey }) => ratingKey === id)
        .map(({ title, thumb, duration, art, viewCount, lastViewedAt, ratingKey, Media, Genre }) => {
            let details = { title, duration, viewCount, lastViewedAt };
            details.thumb = global.plexUrl + thumb;
            details.art = global.plexUrl + art;

            if (Media) {
                details.resolution = Media.videoResolution;
                details.fps = Media.videoFrameRate;
            }

            if (Genre) {
                details.genreTags = Genre.length ? Genre.map(({ tag }) => tag) : [Genre.tag];
            }

            details.link = global.plexUrl + "/web/index.html#!/server/" + global.serverId  + "/details?key=%2Flibrary%2Fmetadata%2F" + ratingKey;

            return details;
        });

    return res.status(200).send(results[0]);
};