import { Controller } from "stimulus"

export default class extends Controller {
    static targets = [ "missionListArea",
		       "missionNewForm", "missionNewButton", "missionCancelButton",
		       "missionListNewForm", "missionListNewButton", "missionListCancelButton",
		     ]

    connect() {
	var projectSplitterRect = $(".project-splitter")[0].getBoundingClientRect();
	this.projectSplitterY = projectSplitterRect.y + projectSplitterRect.height;
	this.missionListTop = parseInt(this.data.get("mission-list-top"));

	this.missionListAreaTarget.style.top = (this.projectSplitterY + this.missionListTop).toString() + "px";
    }

    onScroll() {
	var scrollOffset = window.scrollY
	var areaOffset = Math.max(this.projectSplitterY + this.missionListTop - scrollOffset, this.missionListTop)

	this.missionListAreaTarget.style.top = areaOffset.toString() + "px";
    }

    clickMissionNewButton(event) {
	event.preventDefault()

	var currentTarget = event.currentTarget;
	var closestMissionListTitle = $(currentTarget).closest(".mission-list-title");
	var closestNewFormTargets = closestMissionListTitle.find(".mission-new-form");
	var closestAddButtonTargets = closestMissionListTitle.find(".mission-add-button");

	$(closestNewFormTargets[0]).show();
	$(closestAddButtonTargets[0]).hide();
    }

    clickMissionCancelButton(event) {
	event.preventDefault()

	var currentTarget = event.currentTarget;
	var closestMissionListTitle = $(currentTarget).closest(".mission-list-title");
	var closestNewFormTargets = closestMissionListTitle.find(".mission-new-form");
	var closestAddButtonTargets = closestMissionListTitle.find(".mission-add-button");

	$(closestNewFormTargets[0]).hide();
	$(closestAddButtonTargets[0]).show();
    }

    clickMissionListNewButton(event) {
	event.preventDefault()

	$(this.missionListNewFormTarget).show();
	$(this.missionListNewButtonTarget).hide();
    }

    clickMissionListCancelButton(event) {
	event.preventDefault()

	$(this.missionListNewFormTarget).hide();
	$(this.missionListNewButtonTarget).show();
    }
}
