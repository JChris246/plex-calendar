const convertDuration = (duration) => {
    if (!duration)
        return "unknown";

    duration = Number(duration);
    if (String(duration) === "NaN")
        return "unknown";

    duration /= 1000;
    if (duration < 60)
        return duration + " seconds";
    else if (duration < 60 * 60)
        return Math.floor(duration / 60) + " minutes";
    else return Math.floor(duration / 60 / 60) + " hours";
};


export { convertDuration }