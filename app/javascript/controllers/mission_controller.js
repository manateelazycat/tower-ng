import { Controller } from "stimulus"

export default class extends Controller {
    static targets = [ "missionNewForm", "missionNewButton", "missionCancelButton",
                       "missionListNewForm", "missionListNewButton", "missionListCancelButton",
                     ]

    connect() {
    }

    onScroll() {
        // Hide tooltip element if it exists.
        if ($(".input-tooltip").length) {
            var tooltip = $(".input-tooltip")
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
        var missionName = missionNewInput.val().trim()

        if (missionName == "") {
            this.updateTooltip(this.createTooltip("请输入任务标题"), missionNewInput)
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
                            $(".mission-new-input").val(missionName)
                            self.addMissionInMissionList($(".mission-list-title").attr("id"), $(".mission-new-form-item"), $(".mission-new-input"))

                            // Show mission new form.
                            $(".mission-new-form").show()
                            $(".mission-add-button").hide()

			    // Focus input.
			    $(".mission-new-input").focus()
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

        $.ajax({
            type: "POST",
            url: "/projects/" + projectId + "/missions",
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

        var url = $(location).attr('href')
        var projectId = url.substring(url.lastIndexOf('/') + 1)

        if (missionListInput.val().trim() == "") {
            this.updateTooltip(this.createTooltip("请输入任务清单名字"), missionListInput)
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
        if ($(".input-tooltip").length) {
            tooltip = $(".input-tooltip")
            tooltip.text(text)
            tooltip.fadeIn(0)
        }
        // Otherwise create tooltip element.
        else {
            tooltip = $("<div />")
            tooltip.attr({class: "input-tooltip"});
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

    editMissionList(event) {
        event.preventDefault()

        var missionListTitle = $(".mission-list-title span")

        console.log(missionListTitle.text())

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
            this.updateTooltip(this.createTooltip("请输入任务清单名称"), missionSaveInput)
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

            console.log(missionSaveInput.val().trim())
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

        // Hide confirm dialog.
        $("#confirm-dialog").modal("hide")

        // Show loading dialog.
        $("#loading-dialog").modal("show")

        var startDate = new Date()
        var startTime = startDate.getTime()

        $.ajax({
            type: "DELETE",
            url: "/projects/" + urlParams[4] + "/mission_lists/" + urlParams[6],
            success: function(result) {
                var endDate = new Date()
                var endTime = endDate.getTime()

                // Add some delay for better user experience.
                if (endTime - startTime < 2000) {
                    setTimeout(function () {
                        window.location.href = result["redirect"]
                    }, 200)
                } else {
                    window.location.href = result["redirect"]
                }
            }
        })
    }
}
