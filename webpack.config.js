import path from "path";

module.exports = {
	entry: "src/js/index.js",
	output: {
		filename: "app.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
};
