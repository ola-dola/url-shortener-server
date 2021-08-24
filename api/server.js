const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const authRouter = require("./auth/authRouter");
const linksRouter = require("./links/linksRouter");

const {
  validateAccessToken,
  findFullUrl,
  validateShortLink,
} = require("./middlewares");

const server = express();

Sentry.init({
  dsn:
    "https://0ef578038e254aaa96a47780534c4182@o965258.ingest.sentry.io/5916008",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ server }),
  ],
  tracesSampleRate: 1.0,
});

server.use(Sentry.Handlers.requestHandler());
server.use(Sentry.Handlers.tracingHandler());

server.use(cors());
server.use(helmet());
server.use(express.json());

server.use("/api/v1/auth", authRouter);
server.use("/api/v1/users/:userId/links", validateAccessToken, linksRouter);

server.get("/", (req, res) => {
  res.send(`<h1>API is alive</h1>`);
});

server.get("/debug-sentry", () => {
  throw new Error("Just debugging sentry!");
});

// Redirect handller
server.get("*", validateShortLink, findFullUrl, async (req, res) => {
  res.redirect(req.fullUrl);
});

// error handler
server.use(Sentry.Handlers.errorHandler());

module.exports = server;
