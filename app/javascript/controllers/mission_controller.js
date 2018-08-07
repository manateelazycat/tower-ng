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

    clickMissionSubmitButton(event) {
	event.preventDefault()

	var currentTarget = event.currentTarget
	var closestMissionListTitle = $(currentTarget).closest(".mission-list-title")
	var missionNewInput = closestMissionListTitle.find(".mission-new-input")
	var missionNewFormItem = closestMissionListTitle.find(".mission-new-form-item")

	if (missionNewInput.val().trim() == "") {
	    this.updateTooltip(this.createTooltip("请输入任务标题"), missionNewInput)
	} else {
	    var self = this

	    $.ajax({
	    	type: "POST",
	    	url: "/missions",
	    	data: {
		    mission_list_id: closestMissionListTitle.attr("id"),
	    	    name: missionNewInput.val()
	    	},
	    	success: function(result) {
		    // Insert mission template.
		    missionNewFormItem.before(result)

		    // Clean new mission input content.
		    missionNewInput.val('')
	    	}
	    })
	}
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
	    this.updateTooltip(this.createTooltip("请输入任务清单名字"), missionListInput)
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
		success: function(result) {
		    if (result["status"] == "created") {
			self.handleMissionListCreated(result["html"])
		    } else {
			self.handleMissionListFailed()
		    }
		}
	    })
	}
    }

    handleMissionListCreated(mission_list_html) {
	// Get mission list input.
	var missionListInput = $(".mission-list-new-input")

	// Update new mission list at mission list area.
	var missionList = $("<li />")
	missionList.attr({class: 'mission-list'})
	missionList.text(missionListInput.val())

	$(".mission-list-scrollarea")[0].append(missionList[0])
	$(".mission-list-scrollarea").animate({scrollTop: $(".mission-list-scrollarea").prop("scrollHeight")}, 500)

	// Update new mission list at mission area.
	$(".mission-list-title").last().append(mission_list_html)

	// Clean mission list input after add new mission list.
	missionListInput.val('')
    }

    handleMissionListFailed() {
	var missionListInput = $(".mission-list-new-input")
	var msg = "名字 '" + missionListInput.val() + "' 已经存在"
	this.updateTooltip(this.createTooltip(msg), missionListInput)
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

    updateTooltip(tooltip, input) {
	var scrollOffset = window.scrollY
	var tooltipHideTimeout = 3000
	var tooltipHideDuration = 400
	var tooltipArrowWidth = 20

	// Adjust tooltip coordinate.
	tooltip.css({
	    top: scrollOffset + input[0].getBoundingClientRect().top,
	    left: input[0].getBoundingClientRect().left - tooltip.outerWidth(true) - tooltipArrowWidth
	})

	// Hide tooltip after duration.
	tooltip.delay(tooltipHideTimeout).fadeOut(tooltipHideDuration)
    }
}
