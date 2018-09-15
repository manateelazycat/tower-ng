import { Controller } from "stimulus"
import deleteAndRedirect from "./delete_and_redirect"
import { createTooltip, updateTooltip, hideTooltip } from "./show_tooltip"

export default class extends Controller {
    static targets = [ "missionNewForm", "missionNewButton", "missionCancelButton",
                       "missionListNewForm", "missionListNewButton", "missionListCancelButton",
                     ]

    onScroll() {
        // Hide tooltip element if it exists.
	hideTooltip()
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
        var missionNewInput = closestMissionListTitle.find(".mission-edit-input")
        var missionNewFormItem = closestMissionListTitle.find(".mission-new-form-item")
        var missionName = missionNewInput.val().trim()

        if (missionName == "") {
            updateTooltip(createTooltip("请输入任务标题"), missionNewInput)
        } else {
            if (closestMissionListTitle.attr("id") == "mission-list-title-default") {
                var url = $(location).attr('href')
                var projectId = url.substring(url.lastIndexOf('/') + 1)

                var self = this

                $.ajax({
                    type: "POST",
                    url: "/projects/" + projectId + "/mission_lists",
                    data: {
                        name: "默认任务列表",
                        project_id: projectId
                    },
                    success: function(result) {
                        if (result["status"] == "created") {
                            // Replace new mission list in scroll area and scroll to bottom.
                            $("#mission-list-default").replaceWith(result["mission_list_item_html"])
                            $(".right-float-menu-scrollarea").animate({scrollTop: $(".right-float-menu-scrollarea").prop("scrollHeight")}, 500)

                            // Replace new mission list in mission list area.
                            $("#mission-list-title-default").replaceWith(result["mission_list_html"])

                            // Add new mission.
                            $(".edit-input").val(missionName)
                            self.addMissionInMissionList($(".mission-list-title").attr("id"), $(".mission-new-form-item"), $(".edit-input"))

                            // Show mission new form.
                            $(".mission-new-form").show()
                            $(".mission-add-button").hide()

			    // Focus input.
			    $(".edit-input").focus()
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
        var url = $(location).attr('href')
        var projectId = url.substring(url.lastIndexOf('/') + 1)

        var missionDistributorMenu = $(".mission-distributor-menu")
        var missionDistributorButton = $("#" + missionDistributorMenu.data("buttonid"))

        $.ajax({
            type: "POST",
            url: "/projects/" + projectId + "/missions",
            data: {
                mission_list_id: mission_list_id,
                name: missionNewInput.val(),
		user_id: missionDistributorButton.data("userid"),
		finish_date: missionDistributorButton.data("date"),
            },
            success: function(result) {
                // Insert mission template.
                missionNewFormItem.before(result)

                // Clean new mission input content.
                missionNewInput.val("")
		missionDistributorButton.text("未指派")
		missionDistributorButton.attr("class", "mission-distributor-button mission-distributor-empty")
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

        var url = $(location).attr('href')
        var projectId = url.substring(url.lastIndexOf('/') + 1)

        if (missionListInput.val().trim() == "") {
            updateTooltip(createTooltip("请输入任务清单名字"), missionListInput)
        } else {
            var self = this

            if ($(".right-float-menu-item").first().attr("id") == "mission-list-default") {
                $.ajax({
                    type: "POST",
                    url: "/projects/" + projectId + "/mission_lists",
                    data: {
                        name: missionListInput.val(),
                        project_id: projectId
                    },
                    success: function(result) {
                        if (result["status"] == "created") {
                            // Update default mission list id and text.
                            $(".right-float-menu-item").first().attr("id", result["mission_list_id"])
                            $(".right-float-menu-item").first().text(missionListInput.val())
                            $(".right-float-menu-scrollarea").animate({scrollTop: $(".right-float-menu-scrollarea").prop("scrollHeight")}, 500)

                            // Replace new mission list in mission list area.
                            $("#mission-list-title-default").replaceWith(result["mission_list_html"])

                            // Clean mission list input after add new mission list.
                            missionListInput.val('')
                        }
                    }
                })
            } else {
                $.ajax({
                    type: "POST",
                    url: "/projects/" + projectId + "/mission_lists",
                    data: {
                        name: missionListInput.val(),
                        project_id: projectId
                    },
                    success: function(result) {
                        if (result["status"] == "created") {
                            // Update new mission list at mission list area.
                            $(".right-float-menu-scrollarea").append(result["mission_list_item_html"])
                            $(".right-float-menu-scrollarea").animate({scrollTop: $(".right-float-menu-scrollarea").prop("scrollHeight")}, 500)

                            // Update new mission list at mission area.
                            $(".mission-list-title").last().append(result["mission_list_html"])

                            // Clean mission list input after add new mission list.
                            missionListInput.val('')
                        } else {
                            var msg = "名字 '" + missionListInput.val() + "' 已经存在"
                            updateTooltip(createTooltip(msg), missionListInput)
                        }
                    }
                })
            }

        }
    }

    editMissionList(event) {
        event.preventDefault()

        var missionListTitle = $(".mission-list-title span")

        $(".mission-save-form").show()
        $(".mission-save-input").val(missionListTitle.text().trim())
        missionListTitle.hide()
    }

    enterEditMissionList(event) {
        if (event.which == 13) {
            this.clickEditMissionListSubmitButton(event)
        }
    }

    clickEditMissionListSubmitButton(event) {
        event.preventDefault()

        var missionSaveInput = $(".mission-save-input")

        if (missionSaveInput.val().trim() == "") {
            updateTooltip(createTooltip("请输入任务清单名称"), missionSaveInput)
        } else {
            var url = $(location).attr('href')
            var urlParams = url.split("/")

            $.ajax({
                type: "GET",
                url: "/projects/" + urlParams[4] + "/mission_lists/" + urlParams[6] + "/edit",
                data: {
                    name: missionSaveInput.val().trim(),
                },
                success: function(result) {
                    $(".mission-list-title span").show()
                    $(".mission-save-form").hide()

                    $(".mission-list-title span").text(missionSaveInput.val().trim())
                }
            })
        }
    }

    cancelEditMissionList(event) {
        event.preventDefault()

        $(".mission-list-title span").show()
        $(".mission-save-form").hide()
    }

    deleteMissionList(event) {
        event.preventDefault()

        var url = $(location).attr('href')
        var urlParams = url.split("/")

	deleteAndRedirect("/projects/" + urlParams[4] + "/mission_lists/" + urlParams[6])
    }

    clickDeleteMissionButton(event) {
	event.preventDefault()

	$(".mission-toolbar").hide()
	$("#confirm-dialog").modal("show")
    }

    deleteMission(event) {
	var missionToolbar = $(".mission-toolbar")

	var url = $(location).attr('href')
	var urlParams = url.split("/")

	$.ajax({
	    type: "DELETE",
	    url: "/projects/" + urlParams[4] + "/missions/" + missionToolbar.attr("missionid"),
	    success: function(result) {
		$("#confirm-dialog").modal("hide")
		$("#" + missionToolbar.attr("missionid") + ".mission-title-link").parents("li").fadeOut(500)
	    }
	})
    }

    deleteMissionPage(event) {
        event.preventDefault()

        var url = $(location).attr('href')
        var urlParams = url.split("/")

	deleteAndRedirect("/projects/" + urlParams[4] + "/missions/" + urlParams[6])
    }

    clickEditMissionButton(event) {
	event.preventDefault()

	var missionToolbar = $(".mission-toolbar")
	missionToolbar.attr("missionid", missionToolbar.attr("hover_missionid"))

	var missionTitleLink = $("#" + missionToolbar.attr("missionid") + ".mission-title-link")
	var mission = missionTitleLink.parents("li")
	var missionEditInput = mission.next().find(".edit-input")

	missionToolbar.hide()
	mission.fadeOut(0)

	mission.next().show()
	missionEditInput.val(missionTitleLink.text().trim())
	missionEditInput.focus()
    }

    clickMissionEditCancelButton(event) {
	event.preventDefault()

	var missionToolbar = $(".mission-toolbar")
	var missionTitleLink = $("#" + missionToolbar.attr("missionid") + ".mission-title-link")
	var mission = missionTitleLink.parents("li")

	this.updateDistributorButtonInfo(mission.find(".mission-distributor-button"))

	mission.fadeIn(0)
	mission.next().hide()
    }

    enterMissionEdit(event) {
        if (event.which == 13) {
            this.clickMissionEditSubmitButton(event)
        }
    }

    clickMissionEditSubmitButton(event) {
	event.preventDefault()

        var currentTarget = event.currentTarget
	var missionEditInput = $(currentTarget).parents("li").find(".edit-input")
	var missionName = missionEditInput.val().trim()

	if (missionName == "") {
            updateTooltip(createTooltip("请输入任务标题"), missionEditInput)
	} else {
            var url = $(location).attr('href')
            var urlParams = url.split("/")

	    var missionToolbar = $(".mission-toolbar")
	    var missionTitleLink = $("#" + missionToolbar.attr("missionid") + ".mission-title-link")
	    var mission = missionTitleLink.parents("li")

	    var self = this

	    $.ajax({
                type: "GET",
                url: "/projects/" + urlParams[4] + "/missions/" + missionToolbar.attr("missionid") + "/edit",
                data: {
                    name: missionName,
                },
                success: function(result) {
		    self.test(mission.find(".mission-distributor-button"))

		    mission.fadeIn(0)
		    mission.next().hide()

		    missionTitleLink.text(missionName)
                }
            })
	}
    }

    mouseEnterMission(event) {
	// Show mission toolbar.
        var currentTarget = event.currentTarget
	var missionToolbar = $(".mission-toolbar")

	var toolbarX = currentTarget.getBoundingClientRect().left - missionToolbar.outerWidth(true)
	var toolbarY = currentTarget.getBoundingClientRect().top + currentTarget.getBoundingClientRect().height / 2 - missionToolbar.outerHeight(true) / 2

	missionToolbar.css({
	    left: toolbarX,
	    top: toolbarY,
	})

	missionToolbar.show()

	// Assgin mission id to mission toolbar.
	missionToolbar.attr("hover_missionid", $(currentTarget).attr("id"))
    }

    mouseLeaveMission(event) {
	// Just hide mission toolbar when mouse out of are with y direction.
	var missionToolbar = $(".mission-toolbar")
        var currentTarget = event.currentTarget

	if (!(event.pageY > currentTarget.getBoundingClientRect().top
	      && event.pageY < currentTarget.getBoundingClientRect().top + currentTarget.getBoundingClientRect().height)) {
	    missionToolbar.hide()
	}
    }

    mouseLeaveMissionToolbar(event) {
	// Just hide mission toolbar when mouse at left of mission toolbar.
	var missionToolbar = $(".mission-toolbar")

	if (event.pageX < missionToolbar[0].offsetLeft) {
	    missionToolbar.hide()
	}
    }

    jumpToMissionPage(event) {
	event.preventDefault()

        var currentTarget = event.currentTarget

        var url = $(location).attr('href')
        var urlParams = url.split("/")

	window.location.href = "/projects/" + urlParams[4] + "/missions/" + $(currentTarget).attr("id")
    }

    clickMissionPageEditButton(event) {
	event.preventDefault()

	$(".mission-edit-form-header").show()
	$(".mission-title-item").hide()
	$(".mission-summary").hide()
	$(".mission-add-summary-button").hide()

	$(".mission-edit-form-header input").val($(".mission-title-item span").text().trim())

	var missionSummary = $(".mission-edit-form-header textarea")
	missionSummary.data("summary", missionSummary.val().trim())
    }

    enterMissionPageEdit(event) {
        if (event.which == 13) {
            this.clickMissionPageEditSubmitButton(event)
        }
    }

    clickMissionPageEditSubmitButton(event) {
	event.preventDefault()

        var currentTarget = event.currentTarget
	var missionEditInput = $(currentTarget).parents("li").find(".edit-input")
	var missionName = missionEditInput.val().trim()

	if (missionName == "") {
            updateTooltip(createTooltip("请输入任务标题"), missionEditInput)
	} else {
            var url = $(location).attr('href')
            var urlParams = url.split("/")

	    var summary = $(".mission-edit-form-header textarea").val().trim()

	    var self = this

	    $.ajax({
                type: "GET",
                url: "/projects/" + urlParams[4] + "/missions/" + urlParams[6] + "/edit",
                data: {
                    name: missionName,
		    summary: summary
		},
                success: function(result) {
		    self.updateDistributorButtonInfo($(".mission-title-item").find("button"))

		    $(".mission-edit-form-header").hide()
		    $(".mission-title-item").show()
		    $(".mission-summary").show()

		    if (summary.length == 0) {
			$(".mission-add-summary-button").show()
		    } else {
			$(".mission-add-summary-button").hide()
		    }

		    $(".mission-title-item span").text(missionName)
		    $(".mission-summary").text(summary)
                }
            })
	}
    }

    clickMissionPageEditCancelButton(event) {
	event.preventDefault()

	this.updateDistributorButtonInfo($(".mission-title-item").find("button"))

	$(".mission-edit-form-header").hide()
	$(".mission-title-item").show()
	$(".mission-summary").show()

	var summary = $(".mission-edit-form-header textarea").data("summary")

	if (summary.length == 0) {
	    $(".mission-add-summary-button").show()
	}
    }

    clickCommentArea(event) {
	event.preventDefault()

	// Show comment button.
	$(".mission-comment-button-area").show()

	// Expand comment text area.
     	$(".mission-comment-textarea").attr("rows", 8)

	// Scroll to bottom of page.
	$("html, body").animate({ scrollTop: $(document).height()-$(window).height() }, 200);
    }

    clickCommentSubmitButton(event) {
	event.preventDefault()

        var url = $(location).attr('href')
        var urlParams = url.split("/")

	$.ajax({
	    type: "POST",
	    url: "/projects/" + urlParams[4] + "/missions/" + urlParams[6] + "/comments",
	    data: {
		mission_id: urlParams[6],
	       	content: $(".mission-comment-textarea").val(),
	    },
	    success: function(result) {
		// Shark comment area.
      		$(".mission-comment-textarea").val("")
      		$(".mission-comment-textarea").attr("rows", 1)

		// Hide comment first.
		var comment = $(result)
	      	comment.hide()

		// Add to comment list area and show comemnt with animation.
		$(".mission-comment-list").append(comment)

		// Just show comment, don't show comment edit form.
		$(comment[0]).fadeIn(500)
	    }
	})
    }

    clickCommentCancelButton(event) {
	event.preventDefault()

	$(".mission-comment-button-area").hide()
     	$(".mission-comment-textarea").attr("rows", 1)
    }

    updateDistributorButtonInfo(missionDistributorButton) {
	var missionDistributorMenu = $(".mission-distributor-menu")
	var syncButton = $("#" + missionDistributorMenu.data("buttonid"))

	missionDistributorButton.text(syncButton.text())
	missionDistributorButton.data("userid", syncButton.data("userid"))
	missionDistributorButton.data("username", syncButton.data("username"))
	missionDistributorButton.data("date", syncButton.data("date"))
	missionDistributorButton.attr("class", syncButton.attr("class"))
    }
}
