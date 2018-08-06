import { Controller } from "stimulus"

export default class extends Controller {
    static targets = [ "missionListArea",
		       "missionNewForm", "missionNewButton", "missionCancelButton",
		       "missionListNewForm", "missionListNewButton", "missionListCancelButton",
		     ]

    connect() {
	var projectSplitterRect = $(".project-splitter")[0].getBoundingClientRect()
	this.projectSplitterY = projectSplitterRect.y + projectSplitterRect.height
	this.missionListTop = parseInt(this.data.get("mission-list-top"))

	this.missionListAreaTarget.style.top = (this.projectSplitterY + this.missionListTop).toString() + "px"
    }

    onScroll() {
	var scrollOffset = window.scrollY
	var areaOffset = Math.max(this.projectSplitterY + this.missionListTop - scrollOffset, this.missionListTop)

	this.missionListAreaTarget.style.top = areaOffset.toString() + "px"

	// Hide tooltip element if it exists.
	if ($(".mission-list-input-tooltip").length) {
	    var tooltip = $(".mission-list-input-tooltip")
	    tooltip.hide()
	}
    }

    clickMissionNewButton(event) {
	event.preventDefault()

	var currentTarget = event.currentTarget
	var closestMissionListTitle = $(currentTarget).closest(".mission-list-title")
	var closestNewFormTargets = closestMissionListTitle.find(".mission-new-form")
	var closestAddButtonTargets = closestMissionListTitle.find(".mission-add-button")

	$(closestNewFormTargets[0]).show()
	$(closestAddButtonTargets[0]).hide()
    }

    clickMissionCancelButton(event) {
	event.preventDefault()

	var currentTarget = event.currentTarget
	var closestMissionListTitle = $(currentTarget).closest(".mission-list-title")
	var closestNewFormTargets = closestMissionListTitle.find(".mission-new-form")
	var closestAddButtonTargets = closestMissionListTitle.find(".mission-add-button")

	$(closestNewFormTargets[0]).hide()
	$(closestAddButtonTargets[0]).show()
    }

    clickMissionListNewButton(event) {
	event.preventDefault()

	$(this.missionListNewFormTarget).show()
	$(this.missionListNewButtonTarget).hide()
    }

    clickMissionListCancelButton(event) {
	event.preventDefault()

	$(this.missionListNewFormTarget).hide()
	$(this.missionListNewButtonTarget).show()
    }

    clickMissionListAddButton(event) {
	event.preventDefault()

	var missionListInput = $(".mission-list-new-input")


	if (missionListInput.val().trim() == "") {
	    this.updateTooltip(this.createTooltip("请输入任务清单名字"))
	} else {
	    var url = $(location).attr('href')
	    var projectId = url.substring(url.lastIndexOf('/') + 1)

	    var self = this

	    $.ajax({
		type: "POST",
		url: "/mission_lists",
		data: {
		    name: missionListInput.val(),
		    project_id: projectId
		},
		success: function() {
		    self.handleMissionListCreated()
		},
		error: function() {
		    self.handleMissionListFailed()
		}
	    })
	}
    }

    handleMissionListCreated() {
	var missionListInput = $(".mission-list-new-input")

	// Insert mission list.
	var missionList = $("<li />")
	missionList.attr({class: 'mission-list'})
	missionList.text(missionListInput.val())
	missionList.insertBefore(".mission-list-new-form-item")

	// Clean mission list input after add new mission list.
	missionListInput.val('')
    }

    handleMissionListFailed() {
	var missionListInput = $(".mission-list-new-input")
	var msg = "名字 '" + missionListInput.val() + "' 已经存在"
	this.updateTooltip(this.createTooltip(msg))
    }

    createTooltip(text) {
	var tooltip

	// Fade in tooltip element if it exists.
	if ($(".mission-list-input-tooltip").length) {
	    tooltip = $(".mission-list-input-tooltip")
	    tooltip.text(text)
	    tooltip.fadeIn(0)
	}
	// Otherwise create tooltip element.
	else {
	    tooltip = $("<div />")
	    tooltip.attr({class: 'mission-list-input-tooltip'});
	    tooltip.text(text)
	    $("body").append(tooltip)
	}

	return tooltip
    }

    updateTooltip(tooltip) {
	var missionListInput = $(".mission-list-new-input")
	var scrollOffset = window.scrollY
	var tooltipHideTimeout = 3000
	var tooltipHideDuration = 400
	var tooltipArrowWidth = 20

	// Adjust tooltip coordinate.
	tooltip.css({
	    top: scrollOffset + missionListInput[0].getBoundingClientRect().top,
	    left: missionListInput[0].getBoundingClientRect().left - tooltip.outerWidth(true) - tooltipArrowWidth
	})

	// Hide tooltip after duration.
	tooltip.delay(tooltipHideTimeout).fadeOut(tooltipHideDuration)
    }
}
