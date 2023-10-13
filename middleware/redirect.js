import isHTTPS from "is-https";
export default function(req, res, next) {
  const host = req.headers.host;
  const url = req.url;
  const env = process.env.NODE_ENV;
  const forceDomain = "https://sennari-app.com";
  if (
    (env === "production" && host === "www.sennari-app.com") ||
    host === "https://sennnari-front-970c8fdd8060.herokuapp.com" ||
    isHTTPS(req) === false
  ) {
    res.writeHead(301, { Location: forceDomain + url });
    return res.end();
  }

  return next();
}
