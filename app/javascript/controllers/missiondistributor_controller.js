import { Controller } from "stimulus"

export default class extends Controller {
    connect() {
        $(".mission-date-input").datepicker({
            todayHighlight: true,
            orientation: "bottom auto",
            language: "zh-CN",
            format: "yyyy-mm-dd",
            autoclose: true,
            weekStart: 1,
        })
    }

    onClick(event) {
        if ($(event.target).closest(".mission-member-menu").length === 0
            && $(event.target).closest(".mission-member-input").length === 0
            && $(event.target).closest(".mission-member-toggle-button").length === 0
           ) {
            $(".mission-member-menu").hide()
        }

        if ($(event.target).closest(".mission-distributor-menu").length === 0
            && $(event.target).closest(".mission-distributor-button").length === 0
            && $(event.target).closest(".mission-member-menu").length === 0
           ) {
            var missionDistributorMenu = $(".mission-distributor-menu")

            if (missionDistributorMenu.is(":visible")) {
                var missionMemberInput = $(missionDistributorMenu).find(".mission-member-input")
                var missionDateInput = $(missionDistributorMenu).find(".mission-date-input")
                var userid

                if (missionMemberInput.val().trim() == "") {
                    userid = ""
                } else {
                    userid = missionMemberInput.data("userid") || ""
                }

		// Just change distributor button attributables if missionid is empty (create mission form)
                if (missionDistributorMenu.data("missionid") == "") {
                    var missionDistributorButton = $("#" + missionDistributorMenu.data("buttonid"))
                    var username = missionMemberInput.val().trim()
                    var date = missionDateInput.val().trim()
                    var distributorInfo
                    var classInfo = "mission-distributor-button mission-distributor-confirm"

                    if (username == "" && date == "") {
                        distributorInfo = "未指派"
                        classInfo = "mission-distributor-button mission-distributor-empty"
                    } else if (username != "" && date != "") {
                        distributorInfo = username + " " + date
                    } else if (username != "") {
                        distributorInfo = username
                    } else if (date != "") {
                        distributorInfo = date
                    }

                    missionDistributorButton.text(distributorInfo)
                    missionDistributorButton.data("userid", userid)
                    missionDistributorButton.data("username", username)
                    missionDistributorButton.data("date", date)
                    missionDistributorButton.attr("class", classInfo)
                }
		// Post mission distributor information to server.
		else {
                    var url = $(location).attr('href')
                    var urlParams = url.split("/")

                    $.ajax({
                        type: "PATCH",
                        url: "/projects/" + urlParams[4] + "/missions/" + missionDistributorMenu.data("missionid"),
                        data: {
                            action_type: "update_mission_distributor",
                            user_id: userid,
                            finish_date: missionDateInput.val(),
                        },
                        success: function(result) {
                            var missionDistributorButton = $("#" + missionDistributorMenu.data("buttonid"))

                            missionDistributorButton.text(result["distributor_info"])
                            missionDistributorButton.data("userid", result["userid"])
                            missionDistributorButton.data("username", result["username"])
                            missionDistributorButton.data("date", result["date"])
                            missionDistributorButton.attr("class", result["css"])
                        }
                    })
                }

                // Hide distributor menu.
                missionDistributorMenu.hide()
            }
        }
    }

    clickMemberInput(event) {
        event.preventDefault()

        var missionMemberInput = $(".mission-member-input")
        var inputRect = missionMemberInput[0].getBoundingClientRect()
        var missionMemberMenu = $(".mission-member-menu")

        missionMemberMenu.css({
            top: inputRect.top + inputRect.height,
            left: inputRect.left,
            width: inputRect.width,
        })
        missionMemberMenu.show()
    }

    clickMemberMenuButton(event) {
        event.preventDefault()

        var missionMemberInput = $(".mission-member-menu")
        var inputRect = missionMemberInput[0].getBoundingClientRect()
        var missionMemberMenu = $(".mission-member-menu")

        missionMemberMenu.css({
            top: inputRect.top + inputRect.height,
            left: inputRect.left,
            width: inputRect.width,
        })

        missionMemberMenu.toggle()
    }

    changeMemberInput(event) {
        var missionMemberInput = $(".mission-member-input")
        var memberItems = $(".mission-member-menu .mission-member-menu-item")
        var memberNames = $(".mission-member-menu .mission-member-name")
        var memberPinyins = $(".mission-member-menu .mission-member-pinyin")

        var input = missionMemberInput.val()
        var memberName, memberPinyin, memberPinyinSimple, lastMatchMemberItem

        $.each(memberItems, function(i, val) {
            memberName = $(memberNames[i]).text().trim()
            memberPinyin = $(memberPinyins[i]).text().trim().replace(/\s+/g, "")
            memberPinyinSimple = $(memberPinyins[i]).text().trim().split(" ").map(pinyin => pinyin[0]).join("")

            if (memberName.includes(input) ||
                memberPinyin.includes(input) ||
                memberPinyinSimple.includes(input)) {
                $(memberItems[i]).show()
                $(memberItems[i]).find(".splitter").show()

                lastMatchMemberItem = memberItems[i]
            } else {
                $(memberItems[i]).hide()
            }
        })

        // Hide splitter line under last match item.
        if (lastMatchMemberItem) {
            $(lastMatchMemberItem).find(".splitter").hide()
        }
    }

    clickMemberName(event) {
        var missionMemberInput = $(".mission-member-input")
        var missionMemberMenu = $(".mission-member-menu")
        var currentTarget = event.currentTarget

        // Update name.
        missionMemberInput.val($(currentTarget).find(".mission-member-name").text().trim())

        // Hide member menu.
        missionMemberMenu.hide()

        // Save user id in member input
        missionMemberInput.data("userid", $(currentTarget).find(".mission-member-userid").text().trim())
    }

    clickDistributorButton(event) {
        event.preventDefault()

        var missionDistributorMenu = $(".mission-distributor-menu")
        var missionDateInput = $(missionDistributorMenu).find(".mission-date-input")
        var missionMemberInput = $(".mission-member-input")
        var currentTarget = event.currentTarget
        var rect = currentTarget.getBoundingClientRect()

        var missionDistributorButton = $(".mission-title-item .mission-distributor-button")

        var uniqueId = this.generateUniqueId()
        $(currentTarget).attr("id", uniqueId)

        missionMemberInput.data("userid", $(currentTarget).data("userid"))
        missionMemberInput.val($(currentTarget).data("username"))
        missionDateInput.val($(currentTarget).data("date"))

        missionDistributorMenu.css({
            left: rect.left + rect.width + 20,
            top: rect.top + rect.height / 2 - 30,
        })

        missionDistributorMenu.toggle()

        // Save mission id in mission distributor menu.
        if (missionDistributorMenu.is(":visible")) {
            missionDistributorMenu.data("buttonid", uniqueId)
            missionDistributorMenu.data("missionid", $(currentTarget).data("missionid"))
        }
    }

    generateUniqueId() {
        return 'id-' + Math.random().toString(36).substr(2, 16);
    }
}
