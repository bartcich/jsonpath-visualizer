import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

const webpackConfig = (): webpack.Configuration => {
  return {
    entry: {
      main: "./src/index",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      modules: ["node_modules"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "babel-loader",
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
    devServer: {
      contentBase: path.join(__dirname, "dist"),
    },
  };
};

export default webpackConfig;
