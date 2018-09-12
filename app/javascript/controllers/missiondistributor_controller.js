import { Controller } from "stimulus"

export default class extends Controller {
    connect() {
        $(".mission-distributor-datepicker").datepicker({
            todayHighlight: true,
            orientation: "bottom auto",
            language: "zh-CN",
            format: "yyyy/mm/dd",
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

        var missionMemberInput = $(".mission-member-input")
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

	missionMemberInput.val($(currentTarget).find(".mission-member-name").text().trim())

	missionMemberMenu.hide()
    }
}
