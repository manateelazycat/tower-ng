import { Controller } from "stimulus"

export default class extends Controller {
    static targets = [ "area" ]

    connect() {
    }

    onScroll() {
	var scrollOffset = window.scrollY
	var topBlankOffset = 190
	var missionListAreaMarginTop = 22
	var areaOffset = Math.max(topBlankOffset + missionListAreaMarginTop - scrollOffset, missionListAreaMarginTop)
	var areaAttributes = "top: " + areaOffset.toString() + "px;"

	this.areaTarget.setAttribute("style", areaAttributes)
    }
}
