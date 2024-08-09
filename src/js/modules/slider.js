export default class Slider {
	constructor(
		{
			slider = null,
			slide = null,
			pagination = {
				el: null,
				clickable: true,
			},
			prevButton = null,
			nextButton = null,
		} = null
	) {
		this.slider = slider ? document.querySelector(slider) : null;
		this.slideSelector = slide;
		this.slide = document.querySelectorAll(slide);
		this.pagination = pagination;
		this.paginationContainer = document.querySelector(pagination.el);
		this.paginationElement = [];
		this.paginationClickable = pagination.clickable;
		this.prevButton = document.querySelector(prevButton);
		this.nextButton = document.querySelector(nextButton);
		this.slideIndex = 0;
	}

	createElement(tag, classes = [], text = "") {
		const element = document.createElement(tag);
		classes.forEach((item) => {
			element.classList.add(item);
		});
		if (text) {
			element.innerText = text;
		}
		return element;
	}

	// Function for update slides cuz can be trouble with virtual slides
	updateSlides() {
		this.slide = document.querySelectorAll(this.slideSelector);
	}

	// Add n to slide index
	addCounter(n) {
		if (n < this.slide.length - 1) {
			this.slideIndex += n;
			this.changeSlide(this.slideIndex);
		}
	}

	changeSlide(n = 0) {
		this.updateSlides();
		this.bindPagination();

		this.slide.forEach((slide) => {
			slide.classList.remove("active");
		});

		// Set active class to current slide
		if (this.slide[n]) {
			this.slide[n].classList.add("active");
		}

		this.slideIndex = n;

		try {
			this.prevButton.classList.remove("active");
		} catch (e) {
			handleError(e);
		}
		try {
			this.nextButton.classList.remove("active");
		} catch (e) {
			handleError(e);
		}
		// If it's not a first slide add active class to prev button
		if (this.slideIndex > 0) {
			this.prevButton.classList.add("active");
		}
		// If it's not last slide add active class to next button
		if (this.slideIndex < this.slide.length - 1) {
			this.nextButton.classList.add("active");
		}

		// If pagination exist add active class to current pagination number
		if (this.paginationContainer) {
			this.paginationElement.forEach((item) => {
				item.classList.remove("active");
			});

			if (this.paginationElement[n]) {
				this.paginationElement[n].classList.add("active");
			}
		}
	}

	// Console error
	handleError(e, message = "An error occurred") {
		console.error(message, e);
	}

	// Function for handle event after click on button
	setupButtonClickHandler(button, callback) {
		if (button) {
			button.addEventListener("click", callback);
		}
	}

	// Function for create pagination
	bindPagination() {
		// If pagination container was correct setted by user
		if (this.paginationContainer) {
			// If pagination elements don't exist
			if (this.paginationElement.length === 0) {
				// Getting number
				this.slide.forEach((slide, i) => {
					const paginationElement = this.createElement("li", ["pagination__element"], i + 1);
					paginationElement.classList.remove("active");
					this.paginationContainer.appendChild(paginationElement);
					// Giving opportunity to set active class
					this.paginationElement = this.paginationContainer.querySelectorAll(
						".pagination__element"
					);
					// If pagination didn't disable click function
					if (this.pagination.clickable !== false) {
						paginationElement.style.cursor = "pointer";
						paginationElement.addEventListener("click", () => {
							this.changeSlide(i);
						});
					}
				});
			}
		}
	}

	// Set control buttons
	bindButtons() {
		this.setupButtonClickHandler(this.prevButton, () => {
			if (this.slideIndex > 0) {
				this.addCounter(-1);
			}
		});

		this.setupButtonClickHandler(this.nextButton, () => {
			if (this.slideIndex < this.slide.length - 1) {
				this.addCounter(1);
			}
		});
	}

	render() {
		this.bindButtons();
		this.changeSlide();
	}
}
