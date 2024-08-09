import svgSprite from "gulp-svg-sprite";

export const sprites = () => {
	return app.gulp
		.src(app.path.src.svg)
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: "../icons/sprite.svg",
					},
				},
			})
		)
		.pipe(app.gulp.dest(app.path.build.img));
};
