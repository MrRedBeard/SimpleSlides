# SimpleSlides
SimpleSlides css and native javascript based slides and controls

SimpleSlides is css based but uses a js class to build the timeline from data and to provide navigation/controls.

```javascript
<script>
        let sliderOptions =
        {
            noActivityTimeoutEnabled: false,
			containerElement: document.querySelector('.simpleSliderExample'),
            autoSlideshowFinished: function ()
            {

            }
        };
        let slider = new clsSimpleSlider(sliderOptions);
		
		let slide1 = document.createElement('div');
		slide1.innerHTML = '<H1>Slide 1</H1>'
        slider.addSlide(slide1);
		
		let slide2 = document.createElement('div');
		slide2.innerHTML = '<H1>Slide 2</H1>'
        slider.addSlide(slide2);		
</script>
```
