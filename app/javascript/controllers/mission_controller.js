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

    enterMissionNew(event) {
	if (event.which == 13) {
	    this.clickMissionSubmitButton(event)
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
	    if (closestMissionListTitle.attr("id") == "mission-list-title-0") {
		var url = $(location).attr('href')
		var projectId = url.substring(url.lastIndexOf('/') + 1)

		var self = this

		$.ajax({
		    type: "POST",
		    url: "/mission_lists",
		    data: {
			name: "默认任务列表",
			project_id: projectId
		    },
		    success: function(result) {
			if (result["status"] == "created") {
			    // Update new mission list at mission list area.
			    $(".mission-list-scrollarea").append(result["mission_list_item_html"])
			    $(".mission-list-scrollarea").animate({scrollTop: $(".mission-list-scrollarea").prop("scrollHeight")}, 500)

			    // Update mission list title id.
			    closestMissionListTitle.attr("id", result["mission_list_id"])

			    // Add mission in mission list.
			    self.addMissionInMissionList(closestMissionListTitle.attr("id"), missionNewFormItem, missionNewInput)
			}
		    }
		})
	    } else {
		// Add mission in mission list.
		this.addMissionInMissionList(closestMissionListTitle.attr("id"), missionNewFormItem, missionNewInput)
	    }
	}
    }

    addMissionInMissionList(mission_list_id, missionNewFormItem, missionNewInput) {
	$.ajax({
	    type: "POST",
	    url: "/missions",
	    data: {
	    	mission_list_id: mission_list_id,
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

    enterMissionListAdd(event) {
	if (event.which == 13) {
	    this.clickMissionListAddButton(event)
	}
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

	    if ($(".mission-list").first().attr("id") == "mission-list-0") {
		$.ajax({
		    type: "POST",
		    url: "/mission_lists",
		    data: {
			name: missionListInput.val(),
			project_id: projectId
		    },
		    success: function(result) {
			if (result["status"] == "created") {
			    // Update default mission list id and text.
			    $(".mission-list").first().attr("id", result["mission_list_id"])
			    $(".mission-list").first().text(missionListInput.val())
			    $(".mission-list-scrollarea").animate({scrollTop: $(".mission-list-scrollarea").prop("scrollHeight")}, 500)

			    // Update default mission list id and text.
			    $($(".mission-list-title").children()[0]).text(missionListInput.val())
			    $(".mission-list-title").attr("id", result["mission_list_id"])

			    // Clean mission list input after add new mission list.
			    missionListInput.val('')
			}
		    }
		})
	    } else {
		$.ajax({
	    	    type: "POST",
	    	    url: "/mission_lists",
	    	    data: {
	    		name: missionListInput.val(),
	    		project_id: projectId
	    	    },
	    	    success: function(result) {
	    		if (result["status"] == "created") {
	    		    // Update new mission list at mission list area.
	    		    $(".mission-list-scrollarea").append(result["mission_list_item_html"])
	    		    $(".mission-list-scrollarea").animate({scrollTop: $(".mission-list-scrollarea").prop("scrollHeight")}, 500)

	    		    // Update new mission list at mission area.
	    		    $(".mission-list-title").last().append(result["mission_list_html"])

	    		    // Clean mission list input after add new mission list.
	    		    missionListInput.val('')
	    		} else {
	    		    var msg = "名字 '" + missionListInput.val() + "' 已经存在"
	    		    self.updateTooltip(self.createTooltip(msg), missionListInput)
	    		}
	    	    }
		})
	    }

	}
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
