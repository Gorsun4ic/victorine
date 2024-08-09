import Victorine from "./modules/victorine.js";

window.addEventListener("DOMContentLoaded", () => {

		new Victorine({
			slider: ".victorine__questions",
			slide: ".victorine__question",
			mainContainer: ".victorine",
			pagination: {
				el: ".pagination",
				clickable: true,
			},
			prevButton: ".victorine__button-prev",
			nextButton: ".victorine__button-next",
			url: "http://localhost:3000/test",
			option: "victorine__option",
			question: "victorine__question",
			progressBar: ".progress",
		}).render();

});