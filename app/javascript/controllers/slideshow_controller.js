// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction
//
// This example controller works with specially annotated HTML like:
//
// <div data-controller="hello">
//   <h1 data-target="hello.output"></h1>
// </div>

import { Controller } from "stimulus"

export default class extends Controller {
    static targets = [ "slide" ]

    initialize() {
	this.showCurrentSlide()
    }

    next() {
	this.index++
    }

    previous() {
	this.index--
    }

    showCurrentSlide() {
	this.slideTargets.forEach((el, i) => {
	    el.classList.toggle("slide--current", this.index == i)
	})
    }

    get index() {
	return parseInt(this.data.get("index"))
    }

    set index(value) {
	this.data.set("index", value)
	this.showCurrentSlide()
    }
}
