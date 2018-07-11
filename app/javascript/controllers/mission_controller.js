import { Controller } from "stimulus"

export default class extends Controller {
    static targets = [ "missionListArea",
		       "missionNewForm", "missionNewButton", "missionCancelButton",
		       "missionListNewForm", "missionListNewButton", "missionListCancelButton",
		     ]

    connect() {
    }

    onScroll() {
	var scrollOffset = window.scrollY
	var topBlankOffset = 190
	var missionListAreaMarginTop = 22
	var areaOffset = Math.max(topBlankOffset + missionListAreaMarginTop - scrollOffset, missionListAreaMarginTop)
	var areaAttributes = "top: " + areaOffset.toString() + "px;"

	this.missionListAreaTarget.setAttribute("style", areaAttributes)
    }

    clickMissionNewButton(event) {
	event.preventDefault()

	this.missionNewFormTarget.setAttribute("style", "display: block;")
	this.missionNewButtonTarget.setAttribute("style", "display: none;")
    }

    clickMissionCancelButton(event) {
	event.preventDefault()

	this.missionNewFormTarget.setAttribute("style", "display: none;")
	this.missionNewButtonTarget.setAttribute("style", "display: block;")
    }

    clickMissionListNewButton(event) {
	event.preventDefault()

	this.missionListNewFormTarget.setAttribute("style", "display: block;")
	this.missionListNewButtonTarget.setAttribute("style", "display: none;")
    }

    clickMissionListCancelButton(event) {
	event.preventDefault()

	this.missionListNewFormTarget.setAttribute("style", "display: none;")
	this.missionListNewButtonTarget.setAttribute("style", "display: block;")
    }
}
