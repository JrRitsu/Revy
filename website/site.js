const bodyParser = require("body-parser");
const cookies = require("cookies");
const express = require("express");
const methodOverride = require("method-override");
const middleware = require("./modules/middleware");
const rateLimit = require("./modules/rate-limiter");
const { sendError } = require("./modules/api-utils");

const authRoutes = require("./routes/auth-routes");
const dashboardRoutes = require("./routes/dashboard-routes");
const rootRoutes = require("./routes/root-routes");

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.use(rateLimit);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookies.express("a", "b", "c"));

app.use(express.static(`${__dirname}/assets`));
app.locals.basedir = `${__dirname}/assets`;

app.use("/api", (req, res) => res.json({ hello: "earth" }));
app.use("/api/*", (req, res) =>
  sendError(res, { code: 404, message: "Not found." })
);

app.use(
  "/",
  middleware.updateUser,
  rootRoutes,
  authRoutes,
  middleware.validateUser,
  middleware.updateGuilds,
  dashboardRoutes
);
app.all("*", (req, res) => res.render("errors/404"));

const port = 80;
app.listen(port, () =>
  console.log(
    `[RevyBot.fun]: [ WEBSITE ]    >>>   Uruchomiono serwer strony na porcie: 80`
  )
);
