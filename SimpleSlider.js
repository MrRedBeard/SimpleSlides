class clsSimpleSlider
{
    constructor(options)
    {
        if (!options)
        {
            throw 'SimpleSlider.js - options must be defined';
        }
		
		if(!options.containerElement)
		{
			throw 'SimpleSlider.js - options.containerElement must be defined';
		}

        this.containerElement = options.containerElement;

        if (!this.containerElement)
        {
            throw 'SimpleSlider.js - options.containerElement must be the dom element object for your slider';
        }

        this.sliderEl;
        this.slidesEl;
        this.slideTemplate;
        this.slideNavEl;

        this.navPrevEl;
        this.navNextEl;
        this.navSlideNumsEl;
        this.navPageNumEl;

        this.slideCounter = -1;
        this.currentSlide = 0;
        this.slides = [];

        this.scrollTimer;

        this.url = window.location.href;

        if (this.url.includes('#'))
        {
            this.url = this.url.split('#')[0];
        }

        this.init();
        this.createEvents();
        this.updateNav();

        this.noActivityTimeoutEnabled = (options.noActivityTimeoutEnabled === undefined) ? false : options.noActivityTimeoutEnabled;

        this.noActivityTimeoutTime = 180000;
        this.noActivityTimeoutTime = 2000;
        this.noActivityTimeout;

        this.noActivityTimer();

        this.autoSlideTimeoutTime = 5000;
        this.autoSlideShowTime = 10000;
        this.autoSlideTimeout;

        this.autoSlideshowFinished = options.autoSlideshowFinished || function () { };

        //this.monitorEvents(this.slidesEl); //For testing
    }

    init() {
        //console.log('clsSlider.js: init()');

        this.sliderEl = document.createElement('div');
        this.sliderEl.classList.add('slider');
        this.sliderEl.innerHTML = '<div class="slides"></div>';
        this.slidesEl = this.sliderEl.querySelector('.slides');

        this.slideNavEl = document.createElement('div');
        this.slideNavEl.classList.add('sliderNav');
        this.slideNavEl.innerHTML = '<span class="previous">Previous</span>&nbsp;<span class="slideNumbers"></span>&nbsp;<span class="next">Next</span> <span class="pageNum"></span>';
        this.navPrevEl = this.slideNavEl.querySelector('.previous');
        this.navNextEl = this.slideNavEl.querySelector('.next');
        this.navSlideNumsEl = this.slideNavEl.querySelector('.slideNumbers');
        this.navPageNumEl = this.slideNavEl.querySelector('.pageNum');

        this.containerElement.innerHTML = '';
        this.containerElement.appendChild(this.sliderEl);
        this.containerElement.appendChild(this.slideNavEl);

        this.slideTemplate = document.createElement('div');
        this.slideTemplate.classList.add('slide');
        //this.slideTemplate.innerHTML = '';

        //Add test slides
        //for (var i = 0; i < 30; i++)
        //{
        //    this.addSlide('Slide ' + (i + 1));
        //}
    }

    createEvents() {
        //console.log('clsSlider.js: createEvents()');

        //Prevent duplicate calls from scroll event && Slide navigation occured
        this.slidesEl.onscroll = () => {
            clearTimeout(this.scrollTimer);
            this.scrollTimer = setTimeout(() => {this.getCurrentSlide()}, 20);
        }
        this.navPrevEl.onclick = () => {this.gotoPreviousSlide()};
        this.navNextEl.onclick = () => {this.gotoNextSlide()};
    }

    noActivityTimer() {
        clearTimeout(this.noActivityTimeout);
        if (this.noActivityTimeoutEnabled) {
            //Call automation 
            this.noActivityTimeout = setTimeout(() => {this.autoSlideTimer()}, this.noActivityTimeoutTime);
        }
    }

    startAuto() {
        this.autoSlideTimer();
    }

    stopAuto() {
        clearTimeout(this.autoSlideTimeout);
    }
    autoSlideTimer() {
        this.autoSlideTimeout = setTimeout(() => {
            const nextSlide = this.currentSlide + 1;
            if (nextSlide > (this.slides.length - 1))
            {
                //nextSlide = 0;
                this.stopAuto();
                this.autoSlideshowFinished();
                return;
            }

            this.gotoSlide(nextSlide);

            setTimeout(() => {this.autoSlideTimer()}, this.autoSlideShowTime);

        }, this.autoSlideTimeoutTime);
    }

    addSlide(html) {
        const slide = this.slideTemplate.cloneNode(true);
        if (typeof html === 'object')
        {
            slide.appendChild(html);
        }
        else
        {
            slide.innerHTML = html;
        }

        //console.log('clsSlider.js: addSlide(html)');

        this.slideCounter++;
        slide.id = 'slide-' + this.slideCounter;
        this.slidesEl.appendChild(slide);

        this.updateNav();
    }

    gotoSlide(num) {
        //console.log('clsSlider.js: gotoSlide(num)');

        const slidenum = this.url + '#slide-' + num;
        this.currentSlide = num;
        location.href = slidenum;
        window.history.pushState(null, null, this.url);
    }

    gotoPreviousSlide() {
        let nextSlide = this.currentSlide - 1;

        if (nextSlide < 0) {
            nextSlide = this.slides.length - 1;
        }
        this.gotoSlide(nextSlide);
    }

    gotoNextSlide() {
        let nextSlide = this.currentSlide + 1;

        if (nextSlide > (this.slides.length - 1))
        {
            nextSlide = 0;
        }
        this.gotoSlide(nextSlide);
    }

    updateNav() {
        //console.log('clsSlider.js: updateNav()');

        this.slides = document.querySelectorAll('.slide');

        this.navPageNumEl.innerHTML = 'Page ' + (this.currentSlide + 1) + "/" + this.slides.length;

        let numBullets = 0;
        if (this.slides.length > 10) {
            numBullets = 10;
        }
        else if (this.slides.length > 5) {
            numBullets = 5;
        }

        const numArray = [];
        numArray.push(0); //First
        numArray.push((this.slides.length - 1)); //Last

        let ictr = 0
        while (ictr <= (numBullets / 2)) {
            let down = this.currentSlide - ictr;
            if (down > 0 && down < this.slides.length && !numArray.includes(down)) {
                numArray.push(down);
            }
            let up = this.currentSlide + ictr;
            if (up > 0 && up < this.slides.length && !numArray.includes(up)) {
                numArray.push(up);
            }
            ictr++;
        }
        numArray.sort((a,b) => a-b);

        this.navSlideNumsEl.innerHTML = '';

        for (var i = 0; i < numArray.length; i++) {
            let nums = document.createElement('span');
            nums.innerHTML = (numArray[i] + 1);
            if (numArray[i] === this.currentSlide)
            {
                nums.classList.add('current');
            }
            let x = numArray[i];
            nums.onclick = () => {this.gotoSlide(x)};

            this.navSlideNumsEl.appendChild(nums);
        }
    }

    getCurrentSlide() {
        //console.log('clsSlider.js: getCurrentSlide()');

        for (var i = 0; i < this.slides.length; i++) {
            if (this.inView(this.slides[i])) {
                this.currentSlide = i; //May not match id if a slide is removed
            }
        }
        this.updateNav();
    }

    inView(slide) {
        //console.log('clsSlider.js: inView(slide)');

        let viewRec = this.slidesEl.getBoundingClientRect();

        //let slideRec = document.querySelector('#slide-30').getBoundingClientRect();
        let slideRec = slide.getBoundingClientRect();

        let slideCenterX = ((slideRec.width - slideRec.x) / 2) + slideRec.x;
        let slideCenterY = ((slideRec.height - slideRec.y) / 2) + slideRec.y;

        return slideCenterX >= viewRec.left && slideCenterX <= viewRec.right && slideCenterY >= viewRec.top && slideCenterY <= viewRec.bottom;
    }

    //Debug only
    monitorEvents(element) {
        var log = function (e) { console.log(e); };
        var events = [];

        for (var i in element) {
            if (i.startsWith("on")) events.push(i.substr(2));
        }
        events.forEach(function (eventName) {
            console.log(eventName);
            if (!eventName.includes('pointer') && !eventName.includes('mouse'))
            {
                element.addEventListener(eventName, log);
            }
        });
    }
}

/*
<div class="slider">
    <div class="slides">
        <div class="slide" id="slide-1">Slide 1</div>
        <div class="slide" id="slide-2">Slide 2</div>
        <div class="slide" id="slide-3">Slide 3</div>
    </div>
</div>
<div class="sliderNav">
    <a href="#">Previous</a>
    <a href="#slide-1">1</a>
    <a href="#slide-2">2</a>
    <a href="#slide-3">3</a>
    <a href="#">Next</a>
</div>
*/

/*
window.addEventListener("wheel", function (e)
{
    //console.log(e);
    if (e.deltaY > 0)
    {
        console.log('down');
    }
    else
    {
        console.log('up');
    }
}, false);
*/