const createError = require("http-errors");
const express = require("express");

// environment variables configuration
require("dotenv").config();

global.env = process.env.NODE_ENV || "development";

global.LOG_DIR = __dirname + "/logs";
const morganLogger = require("./logger/morganLogger");
const logger = require("./logger").setup();

const app = express();
app.use(morganLogger);
app.use(express.json());
app.use(express.static("static"));

app.use("/api/library", require("./routes/libraryRoute"));

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res) => {
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = val => {
    let port = parseInt(val, 10);

    // named pipe
    if (isNaN(port)) return val;

    // port number
    if (port >= 0) return port;
    return false;
};

/**
 * Event listener for HTTP server "error" event.
 */
const onError = error => {
    if (error.syscall !== "listen") throw error;

    let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
    let addr = server.address();
    let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

    let plexUrl = process.env.PLEX_HOSTNAME + ":" + process.env.PLEX_PORT;
    global.plexUrl = !plexUrl.startsWith("http") ? "http://" + plexUrl : plexUrl;
    const { getRequest, transformToJson } = require("./utils");

    getRequest(global.plexUrl + "/identity").then(({ statusCode, data }) => {
        if (statusCode !== 200) {
            logger.error("Unable to identify the plex media server");
            process.exit(1);
        }

        const json = transformToJson(data);
        logger.debug(JSON.stringify(json));
        global.serverId = json.MediaContainer.machineIdentifier;
        logger.debug("plex id: " + global.serverId);

        logger.info("Listening on " + bind);
    });

};

// Get port from environment (or 5000) and store in Express.
const port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

// Create HTTP server.
const http = require("http");
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port); // TODO: don't open the port until the plex indentity has been established