// Main module
import gulp from "gulp";
// Import path
import { path } from "./gulp/config/path.js";
// Import general plugins
import { plugins } from "./gulp/config/plugins.js";

// Get values in global variable
global.app = {
	isBuild: process.argv.includes("--build"),
	isDev: !process.argv.includes("--build"),
	path: path,
	gulp: gulp,
	plugins: plugins,
};

// Import tasks
import { copy } from "./gulp/tasks/copy.js";
import { img } from "./gulp/tasks/img.js";
import { sprites } from "./gulp/tasks/sprites.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { js } from "./gulp/tasks/js.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";
import { zip } from "./gulp/tasks/zip.js";
import { ftp } from "./gulp/tasks/ftp.js";

// File editing watcher
function watcher() {
	gulp.watch(path.watch.files, copy);
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.scss, scss);
	gulp.watch(path.watch.img, img);
	gulp.watch(path.watch.js, js);
}

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

const mainTasks = gulp.series(
	fonts,
	gulp.parallel(copy, img, sprites, html, scss, js)
);

// Build tasks
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

// Export scenarios
export { dev };
export { build };
export { deployZIP };
export { deployFTP };

// Run default tasks
gulp.task("default", dev);
