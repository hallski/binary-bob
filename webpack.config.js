var path = require("path");

module.exports = {
  entry: "./src/main.ts",
  output: {
    path: path.resolve(__dirname),
    filename: "main.js",
    libraryTarget: "var",
    library: "bob"
  },
  resolve: {
    modules: [path.resolve("./src"), "node_modules"]
  },
  externals: {
    "gi/meta": "imports.gi.Meta",
    "gi/shell": "imports.gi.Shell"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};
