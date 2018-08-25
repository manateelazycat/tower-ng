import { Controller } from "stimulus"
import { createTooltip, updateTooltip } from "./show_tooltip"

export default class extends Controller {
    addNewInviteItem(event) {
	event.preventDefault()

	var lastEmailItem = $(".invite-email-item").last()
	var newEmailItem = lastEmailItem.clone()

	newEmailItem.appendTo(lastEmailItem)

	newEmailItem.find(".invite-edit-input").val("")
    }

    clickSubmitButton(event) {
	event.preventDefault()

	var members = []
	var inviteEmailItems = $(".invite-email-item")

	$.each(inviteEmailItems, function(index, item) {
	    var email = $(item).find(".invite-edit-input").val().trim()

	    if (email.length > 0) {
		members.push([email, $(item).find("select").val()])
	    }
	})

	if (members.length > 0) {
	    var url = $(location).attr('href')
	    var urlParams = url.split("/")

	    $.ajax({
		type: "POST",
		url: "/teams/" + urlParams[4] + "/invites",
		data: {
		    members: members,
		},
		success: function(result) {

		}
	    })
	} else {
            updateTooltip(createTooltip("请输入邮箱"), inviteEmailItems.first())
	}
    }
}
