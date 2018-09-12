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
	var memberItems = $(".mission-member-menu li")
	var memberNames = $(".mission-member-menu .mission-member-name")

	$.each(memberItems, function(i, val) {
	    console.log("******** ", i, $(memberNames[i]).text().trim())
	})
    }
}
