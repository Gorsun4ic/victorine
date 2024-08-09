import Slider from "./slider.js";

export default class Victorine extends Slider {
	constructor(
		{
			url = null,
			option = null,
			question = null,
			title = null,
			progressBar = null,
			mainContainer = null,
			slider,
			slide,
			prevButton,
			nextButton,
			pagination,
		} = null
	) {
		super({ slider, slide, prevButton, nextButton, pagination });
		this.url = url;
		this.option = option;
		this.question = question;
		this.title = title;
		this.correctAnswers = 0;
		this.answeredQuestions = 0;
		this.markElement = null;
		this.progressBar = document.querySelector(progressBar);
		this.totalTime = 0;
		this.timeIntervalID = null;
		this.mainContainer = document.querySelector(mainContainer);
	}
	// Function for connect to server
	async getResource(url) {
		try {
			let res = await fetch(url);

			if (!res.ok) {
				throw new Error(`Could not fetch ${url}, status: ${res.status}`);
			}

			return await res.json();
		} catch (e) {
			this.handleError(e);

			if (this.slider) {
				this.setText(
					this.slider,
					"Sorry, but we can't connect to database. Try again!"
				);
			}
		}
	}

	setText(container, text) {
		try {
			container.innerText = text;
		} catch (e) {
			this.handleError(e);
		}
	}

	generateProgressHTML(progressMargin, progressText) {
		return `
				<p>Прогрес</p>
				<div class="progress__bar">
					<span style="margin-left: ${progressMargin}%">${progressText}%</span>
					<div class="progress__success-bar" style="width: ${progressText}%;"></div>
				</div>
			`;
	}

	// Function to show user in progression form how much questions he did answer
	progressionBar() {
		if (this.progressBar) {

			// Margin and text is different cuz text should be on the progression side, not background
			let progressMargin =
				this.answeredQuestions === 0
					? 2
					: Math.floor((this.answeredQuestions / this.slide.length) * 100) - 10;
			let progressText =
				this.answeredQuestions === 0
					? 0
					: Math.floor((this.answeredQuestions / this.slide.length) * 100);

			// Create progress bar layout with dynamic margins and text
			this.progressBar.innerHTML = this.generateProgressHTML(
				progressMargin,
				progressText
			);
		}
	}

	// Function to count seconds while user pass test
	countTotalTime() {
		this.timeIntervalID = setInterval(() => {
			this.totalTime++;
		}, 1000);
	}

	// If question includes hint this function gonna show user hint if user had wrong answer
	createHint(question, text) {
		const hint = this.createElement("div", ["hint"], "Пояснення");

		// If user didn't click this block gonna have text "Explain". If user click on that - default text gonna replace by right explanation
		hint.addEventListener(
			"click",
			() => {
				hint.classList.add("active");
				hint.innerText = `Пояснення: ${text}`;
			},
			{ once: true }
		);

		question.appendChild(hint);
	}

	hideControls() {
		if (this.paginationContainer) {
			this.paginationContainer.style.display = "none";
		}
		if (this.prevButton) {
			this.prevButton.style.display = "none";
		}
		if (this.nextButton) {
			this.nextButton.style.display = "none";
		}
		if (this.progressBar) {
			this.progressBar.style.display = "none";
		}
	}

	generateMarkHTML(percentage) {
		return `
      		<div class="mark__questions-number">
      		    <span>${this.slide.length}</span>
      		    <p>ЗАПИТАНЬ</p>
      		</div>
      		<div class="mark__summary">
      		    <p>СУМА БАЛІВ</p>
      		    <span>${this.correctAnswers} / ${this.slide.length}</span>
      		</div>
      		<div class="mark__result">
      		    <p>РЕЗУЛЬТАТ</p>
      		    <span>${percentage}%</span>
      		</div>
      		<div class="mark__precision">
      		    <p>ТОЧНІСТЬ</p>
      		    <div class="mark__precision-bar">
      		        <span style="margin-left: ${
										percentage === 0 ? 2 : percentage - 15
									}%">${percentage}%</span>
      		        <div class="mark__precision-success" style="width: ${percentage}%;"></div>
      		    </div>
      		</div>
      		<div class="mark__correct">
      		    <p>${this.correctAnswers} ПРАВИЛЬНИХ</p>
      		</div> 
      		<div class="mark__incorrect">
      		    <p>${this.slide.length - this.correctAnswers} НЕПРАВИЛЬНИХ</p>
      		</div>
      		<div class="mark__global-time">
      		    <p>ВСЬОГО ЧАСУ ${this.totalTime} СЕК</p>
      		</div>
      		<div class="mark__avarage-time">
      		    <p>СР. ЧАС / ЗАПИТАННЯ ${this.totalTime / this.slide.length} СЕК</p>
      		</div>
      		<button class="mark__again">СПРОБУВАТИ ЩЕ РАЗ</button>
					<div class="mark__answered-questions">
						<h3>Ваші відповіді: </h3>
					</div>
			`;
	}

	// Function for create block with user stats includes right answers, wrong answeres, total number of question and more
	createMark() {
		if (!this.markElement) {
			this.markElement = this.createElement("div", [
				"victorine__question",
				"mark",
			]);
			this.slider.appendChild(this.markElement);
		}

		// Stop counting second after user pass test
		clearInterval(this.timeIntervalID);

		const percentage = (this.correctAnswers / this.slide.length) * 100;

		// Mark layout with all stats
		this.markElement.innerHTML = this.generateMarkHTML(percentage);

		// Set container for all answered questions
		const markAnsweredQuestions = document.querySelector(
			".mark__answered-questions"
		);

		this.hideControls();

		// Move slides into mark
		setTimeout(() => {
			if (this.markElement.classList.contains("active")) {
				this.slide.forEach((item) => {
					if (!item.classList.contains("mark")) {
						markAnsweredQuestions.appendChild(item);
						item.classList.add("active");
					}
				});

				const tryAgainButton = this.createElement(
					"button",
					["mark__again"],
					"Спробувати ще раз"
				);
				markAnsweredQuestions.appendChild(tryAgainButton);
			}

			document.querySelectorAll(".mark__again").forEach((button) => {
				button.addEventListener("click", () => {
					location.reload();
				});
			});
		}, 100);
	}

	checkAnswer(arr, currentSlide) {
		for (let i = 0; i < arr.length; i++) {
			const index = (currentSlide + 1 + i) % arr.length;
			if (!arr[index].answered) {
				return index;
			}
		}
		return false;
	}

	// Create slides from server answer
	createQuestions(item, i) {
		const questionBlock = this.createElement("div", [this.question]); // Slide
		const titleBlock = this.createElement("h2", [], item.name); // Question into slide

		questionBlock.appendChild(titleBlock);
		this.slider.appendChild(questionBlock);

		// It's gotta help set correct option
		let correctOptionBlock = null;

		item.options.forEach(([optionText, isCorrect]) => {
			const optionBlock = this.createOptionBlock(optionText);

			if (isCorrect) {
				correctOptionBlock = optionBlock;
			}
			questionBlock.appendChild(optionBlock);

			questionBlock.answered = false;

			optionBlock.addEventListener(
				"click",
				(e) => {
					if (!questionBlock.answered) {
						this.handleOptionClick(e, isCorrect, questionBlock, i, item);
					}
				},
				// Block opportunity to change answer
				{ once: true }
			);
		});
	}

	createOptionBlock(optionText) {
		const optionBlock = this.createElement("div", [this.option]);
		optionBlock.innerHTML = `<span>${optionText}</span>`;
		return optionBlock;
	}

	handleOptionClick(e, isCorrect, questionBlock, i, item) {
		if (!questionBlock.answered) {
			questionBlock.answered = true;
			this.answeredQuestions++; // Додаємо `answeredQuestions` при обробці кліку

			this.updateAnswerCount(isCorrect);
			this.updatePagination(i, isCorrect);

			if (isCorrect) {
				e.target.classList.add("correct");
			} else {
				e.target.classList.add("incorrect");
			}

			this.scheduleSlideChange(i, item, questionBlock, isCorrect);

			this.progressionBar();
		}
	}

	scheduleSlideChange(i, item, questionBlock, isCorrect) {
		const isLastQuestion = this.answeredQuestions === this.slide.length;

		if (isLastQuestion) {
			this.createMark();
			this.scheduleNextSlide(1000, this.changeSlide(this.slide.length));
		} else if (isCorrect) {
			this.scheduleNextSlide(
				1000,
				this.changeSlide(this.checkAnswer(this.slide, i))
			);
		} else if (item.explain) {
			this.createHint(questionBlock, item.explain);
		}
	}

	updateAnswerCount(isCorrect) {
		if (isCorrect) {
			this.correctAnswers++;
		}
	}

	updatePagination(i, isCorrect) {
		try {
			const paginationClass = isCorrect ? "correct" : "incorrect";
			Array.from(this.paginationContainer.children)[i].classList.add(
				paginationClass
			);
		} catch (e) {
			this.handleError(e);
		}
	}

	// Function to change slide after delay
	scheduleNextSlide(delay, index) {
		const nextSlideTimer = setTimeout(() => super.addCounter(index), delay);
		// If prev button exist
		try {
			this.prevButton.addEventListener("click", () =>
				clearTimeout(nextSlideTimer)
			);
		} catch (e) {
			this.handleError(e);
		}
		// If next button exist
		try {
			this.nextButton.addEventListener("click", () =>
				clearTimeout(nextSlideTimer)
			);
		} catch (e) {
			this.handleError(e);
		}
		// If pagination exist
		try {
			Array.from(this.paginationContainer.children).forEach((item) => {
				item.addEventListener("click", () => clearTimeout(nextSlideTimer));
			});
		} catch (e) {
			this.handleError(e);
		}
	}

	// Show options in random variation
	shuffleData(array) {
		return array.sort(() => Math.random() - 0.5);
	}

	// Function to get answers from server
	async getQuestions() {
		return this.getResource(this.url).then((res) => {
			res.questions.forEach((item, i) => {
				item.options = this.shuffleData(item.options);
				this.createQuestions(item, i);
			});
		});
	}

	async render() {
		await this.getQuestions();
		this.countTotalTime();
		this.progressionBar();
		super.render();
	}
}
