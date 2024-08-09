import replace from "gulp-replace"; // Search and change
import plumber from "gulp-plumber"; // Show errors
import notify from "gulp-notify"; // Tips
import browsersync from "browser-sync"; // Local server
import ifPlugin from "gulp-if";

// Exported object
export const plugins = {
	replace: replace,
	plumber: plumber,
	notify: notify,
	browsersync: browsersync,
	if: ifPlugin,
};
