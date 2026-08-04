const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "azure-maps-control$": path.resolve(
        __dirname,
        "node_modules/azure-maps-control/dist/atlas.min.js"
      )
    }
  }
};
