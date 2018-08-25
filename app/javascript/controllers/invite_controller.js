import { Controller } from "stimulus"

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
            this.updateTooltip(this.createTooltip("请输入邮箱"), inviteEmailItems.first())
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
}
