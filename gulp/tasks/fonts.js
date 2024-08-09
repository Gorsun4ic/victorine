import fs from "fs";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";

// Convert from .otf to .ttf
export const otfToTtf = () => {
	// Searching .otf file
	return (
		app.gulp
			.src(`${app.path.srcFolder}/fonts/*.otf`, {})
			.pipe(
				app.plugins.plumber(
					app.plugins.notify.onError({
						title: "FONTS",
						message: "Error: <%= error.message %>",
					})
				)
			)
			// Convert to .ttf
			.pipe(
				fonter({
					formats: ["ttf"],
				})
			)
			// Download in dist
			.pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
	);
};

// Convert from .ttf to .woff
export const ttfToWoff = () => {
	// Searching .otf file
	return (
		app.gulp
			.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
			.pipe(
				app.plugins.plumber(
					app.plugins.notify.onError({
						title: "FONTS",
						message: "Error: <%= error.message %>",
					})
				)
			)
			// Convert to .woff
			.pipe(
				fonter({
					formats: ["woff"],
				})
			)
			.pipe(app.gulp.dest(`${app.path.build.fonts}`))
			.pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/*.ttf`))
			// Convert to .woff2
			.pipe(ttf2woff2())
			.pipe(app.gulp.dest(`${app.path.build.fonts}`))
	);
};

// Import fonts to css
export const fontsStyle = () => {
	// File for import fonts
	let fontsStyle = `${app.path.srcFolder}/scss/fonts.scss`;
	// Check exist fonts files
	fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
		if (fontsFiles) {
			// Check if exist file for import styles
			if (!fs.existsSync(fontsFiles)) {
				// If not exist - create it
				fs.writeFile(fontsFile, "", cb);
				let newFileOnly;
				for (var i = 0; i < fontsFiles.length; i++) {
					let fontFileName = fontsFiles[i].split(".")[0];
					if (newFileOnly !== fontFileName) {
						let fontName = fontFileName.split("-")[0]
							? fontFileName.split("-")[0]
							: fontFileName;
						let fontWeight = fontFileName.split("-")[1]
							? fontFileName.split("-")[1]
							: fontFileName;
						if (fontWeight.toLowerCase() == "thin") {
							fontWeight = 100;
						}
						if (fontWeight.toLowerCase() == "extralight") {
							fontWeight = 200;
						}
						if (fontWeight.toLowerCase() == "light") {
							fontWeight = 300;
						}
						if (fontWeight.toLowerCase() == "medium") {
							fontWeight = 500;
						}
						if (fontWeight.toLowerCase() == "semibold") {
							fontWeight = 600;
						}
						if (fontWeight.toLowerCase() == "bold") {
							fontWeight = 700;
						}
						if (
							fontWeight.toLowerCase() == "extrabold" ||
							fontWeight.toLowerCase() === "heavy"
						) {
							fontWeight = 800;
						}
						if (fontWeight.toLowerCase() == "black") {
							fontWeight = 900;
						} else {
							fontWeight = 400;
						}
						fs.appendFile(
							fontsFile,
							`@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`,
							cb
						);

						newFileOnly = fontFileName;
					}
				}
			} else {
				// If file already exist
				console.log("File scss/fonts.scss is exist.");
			}
		}
	});

	return app.gulp.src(`${app.path.srcFolder}`);
	function cb() {}
};
