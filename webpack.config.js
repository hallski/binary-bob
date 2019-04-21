var path = require("path");

module.exports = {
  entry: "./src/main.ts",
  output: {
    path: path.join(__dirname, "extension"),
    filename: "main.js",
    libraryTarget: "var",
    library: "bob"
  },
  resolve: {
    extensions: [".ts", ".js"]
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
