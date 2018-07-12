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

	this.missionListAreaTarget.style.top = areaOffset.toString() + "px";
    }

    clickMissionNewButton(event) {
	event.preventDefault()
	var currentTarget = event.currentTarget;
	var closestNewFormTargets = $(currentTarget).closest(".mission-list-title").find(".mission-new-form");
	var closestAddButtonTargets = $(currentTarget).closest(".mission-list-title").find(".mission-add-button");

	if (closestNewFormTargets.length > 0) {
	    closestNewFormTargets[0].style.display = "block";
	}

	if (closestAddButtonTargets.length > 0) {
	    closestAddButtonTargets[0].style.display = "none";
	}
    }

    clickMissionCancelButton(event) {
	event.preventDefault()
	var currentTarget = event.currentTarget;
	var closestNewFormTargets = $(currentTarget).closest(".mission-list-title").find(".mission-new-form");
	var closestAddButtonTargets = $(currentTarget).closest(".mission-list-title").find(".mission-add-button");

	if (closestNewFormTargets.length > 0) {
	    closestNewFormTargets[0].style.display = "none";
	}

	if (closestAddButtonTargets.length > 0) {
	    closestAddButtonTargets[0].style.display = "block";
	}
    }

    clickMissionListNewButton(event) {
	event.preventDefault()

	this.missionListNewFormTarget.style.display = "block";
	this.missionListNewButtonTarget.style.display = "none";
    }

    clickMissionListCancelButton(event) {
	event.preventDefault()

	this.missionListNewFormTarget.style.display = "none";
	this.missionListNewButtonTarget.style.display = "block";
    }
}
