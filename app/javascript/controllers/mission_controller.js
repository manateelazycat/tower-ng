import { Controller } from "stimulus"
import deleteAndRedirect from "./delete_and_redirect"
import { createTooltip, updateTooltip, hideTooltip } from "./show_tooltip"
import { getUrlParams, pressEnter } from "./utils"

export default class extends Controller {
    static targets = [
        "missionListNewForm", "missionListNewButton",
        "missionNewForm", "missionNewButton",
    ]

    onScroll() {
        // Hide tooltip element if it exists.
        hideTooltip()
    }

    enterMissionNew(event) {
        if (pressEnter(event)) {
            this.clickMissionSubmitButton(event)
        }
    }

    clickMissionNewButton(event) {
        event.preventDefault()

        $(this.missionNewFormTarget).show()
        $(this.missionNewButtonTarget).hide()
    }

    clickMissionSubmitButton(event) {
        event.preventDefault()

        var currentTarget = event.currentTarget
        var titleAndNewForm = this.missionFindTitleAndNewForm(currentTarget)
        var closestMissionListTitle = titleAndNewForm.listTitle
        var missionNewInput = closestMissionListTitle.find(".mission-edit-input")
        var missionName = missionNewInput.val().trim()

        if (missionName == "") {
            updateTooltip("请输入任务标题", missionNewInput)
        } else {
            if (closestMissionListTitle.attr("id") == "mission-list-title-default") {
                var url = $(location).attr('href')
                var projectId = url.substring(url.lastIndexOf('/') + 1)

                $.ajax({
                    type: "POST",
                    url: "/projects/" + projectId + "/mission_lists",
                    data: {
                        name: "默认任务列表",
                        project_id: projectId
                    },
                    context: this,
                    success: function(result) {
                        if (result["status"] == "created") {
                            var scrollArea = $(".right-float-menu-scrollarea")
                            var editInput = $(".edit-input")

                            // Replace new mission list in scroll area and scroll to bottom.
                            $("#mission-list-default").replaceWith(result["mission_list_item_html"])
                            scrollArea.animate({scrollTop: scrollArea.prop("scrollHeight")}, 500)

                            // Replace new mission list in mission list area.
                            $("#mission-list-title-default").replaceWith(result["mission_list_html"])

                            // Add new mission.
                            editInput.val(missionName)
                            this.addMissionInMissionList($(".mission-list-title").attr("id"), $(".mission-new-form-item"), editInput)

                            // Show mission new form.
                            $(this.missionNewFormTarget).show()
                            $(this.missionNewButtonTarget).hide()

                            // Focus input.
                            editInput.focus()
                        }
                    }
                })
            } else {
                // Add mission in mission list.
                this.addMissionInMissionList(closestMissionListTitle.attr("id"), titleAndNewForm.newFormItem, missionNewInput)
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

        $(this.missionNewFormTarget).hide()
        $(this.missionNewButtonTarget).show()
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
        if (pressEnter(event)) {
            this.clickMissionListAddButton(event)
        }
    }

    clickMissionListAddButton(event) {
        event.preventDefault()

        var missionListInput = $(".mission-list-new-input")

        var url = $(location).attr('href')
        var projectId = url.substring(url.lastIndexOf('/') + 1)

        if (missionListInput.val().trim() == "") {
            updateTooltip("请输入任务清单名字", missionListInput)
        } else {
            if ($(".right-float-menu-item").first().attr("id") == "mission-list-default") {
                $.ajax({
                    type: "POST",
                    url: "/projects/" + projectId + "/mission_lists",
                    data: {
                        name: missionListInput.val(),
                        project_id: projectId
                    },
                    context: this,
                    success: function(result) {
                        if (result["status"] == "created") {
                            var scrollArea = $(".right-float-menu-scrollarea")
                            var menuItem = $(".right-float-menu-item")

                            // Update default mission list id and text.
                            menuItem
                                .first().attr("id", result["mission_list_id"])
                                .first().text(missionListInput.val())

                            scrollArea.animate({scrollTop: scrollArea.prop("scrollHeight")}, 500)

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
                            var scrollArea = $(".right-float-menu-scrollarea")

                            // Update new mission list at mission list area.
                            scrollArea
                                .append(result["mission_list_item_html"])
                                .animate({scrollTop: scrollArea.prop("scrollHeight")}, 500)

                            // Update new mission list at mission area.
                            $(".mission-list-title").last().append(result["mission_list_html"])

                            // Clean mission list input after add new mission list.
                            missionListInput.val('')
                        } else {
                            var msg = "名字 '" + missionListInput.val() + "' 已经存在"
                            updateTooltip(msg, missionListInput)
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
        if (pressEnter(event)) {
            this.clickEditMissionListSubmitButton(event)
        }
    }

    clickEditMissionListSubmitButton(event) {
        event.preventDefault()

        var missionSaveInput = $(".mission-save-input")

        if (missionSaveInput.val().trim() == "") {
            updateTooltip("请输入任务清单名称", missionSaveInput)
        } else {
            var urlParams = getUrlParams()

            $.ajax({
                type: "GET",
                url: "/projects/" + urlParams[4] + "/mission_lists/" + urlParams[6] + "/edit",
                data: {
                    name: missionSaveInput.val().trim(),
                },
                success: function(result) {
                    $(".mission-list-title span")
                        .show()
                        .text(missionSaveInput.val().trim())

                    $(".mission-save-form").hide()
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

        var urlParams = getUrlParams()

        deleteAndRedirect("/projects/" + urlParams[4] + "/mission_lists/" + urlParams[6])
    }

    clickDeleteMissionButton(event) {
        event.preventDefault()

        var currentTarget = event.currentTarget
        var toolbarDialog = "#" + $(currentTarget).data("dialog-id")

        var missionToolbar = $(".mission-toolbar")
        missionToolbar.attr("missionid", missionToolbar.attr("hover_missionid"))
        missionToolbar.attr("toolbar_dialog", toolbarDialog)

        missionToolbar.hide()
        $(toolbarDialog).modal("show")
    }

    deleteMission(event) {
        var missionToolbar = $(".mission-toolbar")

        var urlParams = getUrlParams()


        $.ajax({
            type: "DELETE",
            url: "/projects/" + urlParams[4] + "/missions/" + missionToolbar.attr("missionid"),
            success: function(result) {
                $($(".mission-toolbar").attr("toolbar_dialog")).modal("hide")
                $("#" + missionToolbar.attr("missionid") + ".mission-title-link").parents("li").fadeOut(500)
            }
        })
    }

    deleteMissionPage(event) {
        event.preventDefault()

        var urlParams = getUrlParams()

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
        if (pressEnter(event)) {
            this.clickMissionEditSubmitButton(event)
        }
    }

    clickMissionEditSubmitButton(event) {
        event.preventDefault()

        var currentTarget = event.currentTarget
        var missionEditInput = $(currentTarget).parents("li").find(".edit-input")
        var missionName = missionEditInput.val().trim()

        if (missionName == "") {
            updateTooltip("请输入任务标题", missionEditInput)
        } else {
            var urlParams = getUrlParams()

            var missionToolbar = $(".mission-toolbar")
            var missionTitleLink = $("#" + missionToolbar.attr("missionid") + ".mission-title-link")
            var mission = missionTitleLink.parents("li")

            $.ajax({
                type: "GET",
                url: "/projects/" + urlParams[4] + "/missions/" + missionToolbar.attr("missionid") + "/edit",
                data: {
                    name: missionName,
                },
                context: this,
                success: function(result) {
                    this.updateDistributorButtonInfo(mission.find(".mission-distributor-button"))

                    mission
                        .fadeIn(0)
                        .next()
                        .hide()

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

        missionToolbar
            .css({ left: toolbarX,
                   top: toolbarY })
            .show()
            .attr("hover_missionid", $(currentTarget).attr("id"))
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

    clickMissionPageEditButton(event) {
        event.preventDefault()

        $(".mission-edit-form-header").show()
        $(".mission-title-item").hide()
        $(".mission-summary").hide()
        $(".mission-add-summary-button").hide()
        $(".mission-edit-form-header input").val($(".mission-title-item span").text().trim())

        missionSummary.data("summary", $(".mission-edit-form-header textarea").val().trim())
    }

    enterMissionPageEdit(event) {
        if (pressEnter(event)) {
            this.clickMissionPageEditSubmitButton(event)
        }
    }

    clickMissionPageEditSubmitButton(event) {
        event.preventDefault()

        var currentTarget = event.currentTarget
        var missionEditInput = $(currentTarget).parents("li").find(".edit-input")
        var missionName = missionEditInput.val().trim()

        if (missionName == "") {
            updateTooltip("请输入任务标题", missionEditInput)
        } else {
            var urlParams = getUrlParams()

            var summary = $(".mission-edit-form-header textarea").val().trim()

            $.ajax({
                type: "GET",
                url: "/projects/" + urlParams[4] + "/missions/" + urlParams[6] + "/edit",
                data: {
                    name: missionName,
                    summary: summary
                },
                context: this,
                success: function(result) {
                    var missionSummary = $(".mission-summary")

                    this.updateDistributorButtonInfo($(".mission-title-item").find("button"))

                    $(".mission-edit-form-header").hide()
                    $(".mission-title-item").show()
                    missionSummary.show()

                    if (summary.length == 0) {
                        $(".mission-add-summary-button").show()
                    } else {
                        $(".mission-add-summary-button").hide()
                    }

                    $(".mission-title-item span").text(missionName)
                    missionSummary.text(summary)
                }
            })
        }
    }

    clickMissionPageEditCancelButton(event) {
        event.preventDefault()

        var missionTitleItem = $(".mission-title-item")

        this.updateDistributorButtonInfo(missionTitleItem.find("button"))

        $(".mission-edit-form-header").hide()
        missionTitleItem.show()
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

        var urlParams = getUrlParams()

        $.ajax({
            type: "POST",
            url: "/projects/" + urlParams[4] + "/missions/" + urlParams[6] + "/comments",
            data: {
                mission_id: urlParams[6],
                content: $(".mission-comment-textarea").val(),
            },
            success: function(result) {
                // Shark comment area.
                $(".mission-comment-textarea")
                    .val("")
                    .attr("rows", 1)

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
        var syncButtonText = syncButton.text().trim()
        if (syncButtonText == "") {
            syncButtonText = "未指派"
        }

        missionDistributorButton
            .text(syncButtonText)
            .data("userid", syncButton.data("userid"))
            .data("username", syncButton.data("username"))
            .data("date", syncButton.data("date"))
            .attr("class", syncButton.attr("class"))
    }

    closeMission(event) {
        var currentTarget = event.currentTarget
        var mission = $(currentTarget).parents("li")

        var urlParams = getUrlParams()

        $.ajax({
            type: "PATCH",
            url: "/projects/" + mission.data("project-hashid") + "/missions/" + mission.attr("id"),
            data: {
                action_type: "close_mission",
            },
	    context: this,
            success: function(result) {
                // Remove open status mission after fade out animation.
                mission.fadeOut(300, function() {
                    mission.remove()
                })

		// Find closestMissionListTitle with different page.
		var closestMissionListTitle
		if (urlParams.length == 6 && urlParams[3] == "users" && urlParams[5] == "created_missions") {
		    closestMissionListTitle = $(".created_missions_splitter")
		} else {
		    closestMissionListTitle = this.missionFindTitleAndNewForm(currentTarget).listTitle
		}

                // Add closed status mission at last.
                $(result).appendTo(closestMissionListTitle).show(300)
            }
        })
    }

    reopenMission(event) {
        var currentTarget = event.currentTarget
        var mission = $(currentTarget).parents("li")

        var urlParams = getUrlParams()
	var atUserPage = urlParams.length == 6 && urlParams[3] == "users" && urlParams[5] == "created_missions"

        $.ajax({
            type: "PATCH",
            url: "/projects/" + urlParams[4] + "/missions/" + mission.attr("id"),
            data: {
                action_type: "reopen_mission",
		at_user_page: atUserPage,
            },
            context: this,
            success: function(result) {
                // Remove closed status mission after fade out animation.
                mission.fadeOut(300, function() {
                    mission.remove()
                })

                // Insert open status mission before new form.
                var resultTarget = $(result)
                var missionTarget = $($(resultTarget)[0]) // first is mission li, second is mission-edit-form

		// Find closestNewFormItem with different page.
		var closestNewFormItem
		if (atUserPage) {
		    closestNewFormItem = $(".created_missions_splitter")
		} else {
                    closestNewFormItem = this.missionFindTitleAndNewForm(currentTarget).newFormItem
		}

                // Hide mision.
                missionTarget.hide()

                // Insert mission and mission edit form.
                resultTarget.insertBefore(closestNewFormItem)

                // Show mission.
                missionTarget.fadeIn(300)
            }
        })
    }

    missionFindTitleAndNewForm(element) {
        var missionListTitle = $(element).closest(".mission-list-title")

        return {
            listTitle: missionListTitle,
            newFormItem: missionListTitle.find(".mission-new-form-item")
        }
    }
}
