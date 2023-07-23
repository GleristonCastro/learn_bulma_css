document.addEventListener('DOMContentLoaded', () => {
	const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
	$navbarBurgers.forEach(el => {
		el.addEventListener('click', () => {
			const target = el.dataset.target;
			const $target = document.getElementById(target);
			el.classList.toggle('is-active');
			$target.classList.toggle('is-active');

		});
	});

});

{
	class SliderClip {
		constructor(el) {
			this.el = el;
			this.Slides = Array.from(this.el.querySelectorAll('li'));
			this.Nav = Array.from(this.el.querySelectorAll('nav a'));
			this.totalSlides = this.Slides.length;
			this.current = 0;
			this.autoPlay = true; //true or false
			this.timeTrans = 4000; //transition time in milliseconds
			this.IndexElements = [];

			for (let i = 0; i < this.totalSlides; i++) {
				this.IndexElements.push(i);
			}

			this.setCurret();
			this.initEvents();
		}
		setCurret() {
			this.Slides[this.current].classList.add('current');
			this.Nav[this.current].classList.add('current_dot');
		}
		initEvents() {
			const self = this;

			this.Nav.forEach((dot) => {
				dot.addEventListener('click', (ele) => {
					ele.preventDefault();
					this.changeSlide(this.Nav.indexOf(dot));
				})
			})

			this.el.addEventListener('mouseenter', () => self.autoPlay = false);
			this.el.addEventListener('mouseleave', () => self.autoPlay = true);

			setInterval(function () {
				if (self.autoPlay) {
					self.current = self.current < self.Slides.length - 1 ? self.current + 1 : 0;
					self.changeSlide(self.current);
				}
			}, this.timeTrans);

		}
		changeSlide(index) {

			this.Nav.forEach((allDot) => allDot.classList.remove('current_dot'));

			this.Slides.forEach((allSlides) => allSlides.classList.remove('prev', 'current'));

			const getAllPrev = value => value < index;

			const prevElements = this.IndexElements.filter(getAllPrev);

			prevElements.forEach((indexPrevEle) => this.Slides[indexPrevEle].classList.add('prev'));

			this.Slides[index].classList.add('current');
			this.Nav[index].classList.add('current_dot');
		}
	}

	const slider = new SliderClip(document.querySelector('.slider'));
}

const labels = document.querySelectorAll(".accordion-item__label");
const tabs = document.querySelectorAll(".accordion-tab");

function toggleShow() {
	const target = this;
	const item = target.classList.contains("accordion-tab")
		? target
		: target.parentElement;
	const group = item.dataset.actabGroup;
	const id = item.dataset.actabId;

	tabs.forEach(function (tab) {
		if (tab.dataset.actabGroup === group) {
			if (tab.dataset.actabId === id) {
				tab.classList.add("accordion-active");
			} else {
				tab.classList.remove("accordion-active");
			}
		}
	});

	labels.forEach(function (label) {
		const tabItem = label.parentElement;

		if (tabItem.dataset.actabGroup === group) {
			if (tabItem.dataset.actabId === id) {
				tabItem.classList.add("accordion-active");
			} else {
				tabItem.classList.remove("accordion-active");
			}
		}
	});
}

labels.forEach(function (label) {
	label.addEventListener("click", toggleShow);
});

tabs.forEach(function (tab) {
	tab.addEventListener("click", toggleShow);
});

(function (global) {
	function Wallop(selector, options) {
		if (!selector) { throw new Error('Missing selector. Refer to Usage documentation: https://github.com/peduarte/wallop#javascript'); }

		for (var i = 0; i < selectorPool.length; i++) {
			if (selectorPool[i] === selector) {
				throw new Error('An instance of Wallop with this selector already exists.');
			}
		}

		this.options = {
			buttonPreviousClass: 'Wallop-buttonPrevious',
			buttonNextClass: 'Wallop-buttonNext',
			itemClass: 'Wallop-item',
			currentItemClass: 'Wallop-item--current',
			showPreviousClass: 'Wallop-item--showPrevious',
			showNextClass: 'Wallop-item--showNext',
			hidePreviousClass: 'Wallop-item--hidePrevious',
			hideNextClass: 'Wallop-item--hideNext',
			carousel: true
		};

		this.whitelist = {
			'form': true
		};

		if (selector.length > 0 && !this.whitelist[selector]) {
			throw new Error('Selector cannot be an array, Refer to Usage documentation: https://github.com/peduarte/wallop#javascript');
		} else {
			this.$selector = selector;
		}

		this.options = extend(this.options, options);
		this.event = null;

		this.reset();
		this.buttonPrevious = this.$selector.querySelector(' .' + this.options.buttonPreviousClass);
		this.buttonNext = this.$selector.querySelector(' .' + this.options.buttonNextClass);

		this.bindEvents();
		this.createCustomEvent();

		if (this.currentItemIndex === -1) {
			this.currentItemIndex = 0;
			addClass(this.allItemsArray[this.currentItemIndex], this.options.currentItemClass);
		}

		this.updateButtonStates();

		var _this = this;
		setTimeout(function () {
			_this.event.detail.currentItemIndex = _this.currentItemIndex;
			_this.$selector.dispatchEvent(_this.event);
		}, 0);
	}

	var selectorPool = [];

	var WS = Wallop.prototype;

	WS.updateButtonStates = function () {
		if ((!this.buttonPrevious && !this.buttonNext) || this.options.carousel) { return; }

		if (this.currentItemIndex === this.lastItemIndex) {
			this.buttonNext.setAttribute('disabled', 'disabled');
		} else if (this.currentItemIndex === 0) {
			this.buttonPrevious.setAttribute('disabled', 'disabled');
		}
	};

	WS.removeAllHelperSettings = function () {
		removeClass(this.allItemsArray[this.currentItemIndex], this.options.currentItemClass);
		removeClass($$(this.options.hidePreviousClass, this.$selector), this.options.hidePreviousClass);
		removeClass($$(this.options.hideNextClass, this.$selector), this.options.hideNextClass);
		removeClass($$(this.options.showPreviousClass, this.$selector), this.options.showPreviousClass);
		removeClass($$(this.options.showNextClass, this.$selector), this.options.showNextClass);

		if (!this.buttonPrevious && !this.buttonNext) { return; }

		this.buttonPrevious.removeAttribute('disabled');
		this.buttonNext.removeAttribute('disabled');
	};

	WS.goTo = function (index) {
		if (index === this.currentItemIndex) { return; }

		index = index === -1 && this.options.carousel ? this.lastItemIndex : index;
		index = index === this.lastItemIndex + 1 && this.options.carousel ? 0 : index;

		if (index < 0 || index > this.lastItemIndex) { return; }

		this.removeAllHelperSettings();

		var isForwards = (index > this.currentItemIndex || index === 0 && this.currentItemIndex === this.lastItemIndex) && !(index === this.lastItemIndex && this.currentItemIndex === 0);
		addClass(this.allItemsArray[this.currentItemIndex], isForwards ? this.options.hidePreviousClass : this.options.hideNextClass);
		addClass(this.allItemsArray[index], this.options.currentItemClass + ' ' + (isForwards ? this.options.showNextClass : this.options.showPreviousClass));

		this.currentItemIndex = index;

		this.updateButtonStates();

		this.event.detail.currentItemIndex = this.currentItemIndex;
		this.$selector.dispatchEvent(this.event);
	};

	WS.previous = function () {
		this.goTo(this.currentItemIndex - 1);
	};

	WS.next = function () {
		this.goTo(this.currentItemIndex + 1);
	};

	WS.reset = function () {
		this.allItemsArray = Array.prototype.slice.call(this.$selector.querySelectorAll(' .' + this.options.itemClass));
		this.currentItemIndex = this.allItemsArray.indexOf(this.$selector.querySelector(' .' + this.options.currentItemClass));
		this.lastItemIndex = this.allItemsArray.length - 1;
	};

	WS.bindEvents = function () {
		selectorPool.push(this.$selector);

		var _this = this;

		if (this.buttonPrevious) {
			this.buttonPrevious.addEventListener('click', function (event) {
				event.preventDefault();
				_this.previous();
			});
		}

		if (this.buttonNext) {
			this.buttonNext.addEventListener('click', function (event) {
				event.preventDefault();
				_this.next();
			});
		}

	};

	WS.on = function (eventName, callback) {
		this.$selector.addEventListener(eventName, callback, false);
	};

	WS.off = function (eventName, callback) {
		this.$selector.removeEventListener(eventName, callback, false);
	};

	WS.createCustomEvent = function () {
		var _this = this;
		this.event = new CustomEvent('change', {
			detail: {
				wallopEl: _this.$selector,
				currentItemIndex: Number(_this.currentItemIndex)
			},
			bubbles: true,
			cancelable: true
		});
	};

	function $$(element, container) {
		if (!element) { return; }
		if (!container) {
			container = document;
		}
		return container.querySelector('.' + element);
	}

	function addClass(element, className) {
		if (!element) { return; }
		element.className = (element.className + ' ' + className).trim();
	}

	function removeClass(element, className) {
		if (!element) { return; }
		element.className = element.className.replace(className, '').trim();
	}

	function extend(origOptions, userOptions) {
		var extendOptions = {}, attrname;
		for (attrname in origOptions) { extendOptions[attrname] = origOptions[attrname]; }
		for (attrname in userOptions) { extendOptions[attrname] = userOptions[attrname]; }
		return extendOptions;
	}

	function CustomEvent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}

	CustomEvent.prototype = window.CustomEvent ? window.CustomEvent.prototype : {};
	window.CustomEvent = CustomEvent;

	if (typeof define === 'function' && define.amd) {
		define(function () { return Wallop; });
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Wallop;
	} else { 
		global['Wallop'] = Wallop;
	}
}(this));

const slider = document.querySelector('[data-carousel]');
const slides = [...document.querySelectorAll('.Wallop-item')]
this.wallop = new Wallop(slider);

let prev = 0

const removePrevClasses = (index) => {
	let prevClass
	if (slides[index].classList.contains('Wallop-item--hidePrevious')) {
		prevClass = 'Wallop-item--hidePrevious'
	} else if (slides[index].classList.contains('Wallop-item--hideNext')) {
		prevClass = 'Wallop-item--hideNext'
	}

	if (prevClass) {
		setTimeout(() => {
			slides[index].classList.remove(prevClass)
		}, 600)
	}
}

const onChange = () => {
	removePrevClasses(prev)
	prev = this.wallop.currentItemIndex
}

this.wallop.on('change', onChange);

(function() {
	const now = new Date();
	const spanYear = document.getElementById('year');
	spanYear.innerText = now.getFullYear();
})();

let prevScrollpos = window.scrollY;
window.onscroll = function() {
	const navMain = document.getElementById('navbarMain').className;
	if (navMain != 'navbar-menu is-active') {
		let currentScrollPos = window.scrollY;
		if (prevScrollpos > currentScrollPos) {
			document.getElementById("navbarnav").style.top = "0";
		} else {
			document.getElementById("navbarnav").style.top = "-76px";
		}
		prevScrollpos = currentScrollPos;

	}
}