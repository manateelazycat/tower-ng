import { Controller } from "stimulus"
import { createTooltip, updateTooltip } from "./show_tooltip"
import { getUrlParams } from "./utils"

export default class extends Controller {
    addNewInviteItem(event) {
        event.preventDefault()

        var lastEmailItem = $(".margin-vertical-15px").last()
        var newEmailItem = lastEmailItem.clone()

        newEmailItem
            .appendTo(lastEmailItem)
            .find(".edit-input").val("")
    }

    clickSubmitButton(event) {
        event.preventDefault()

        var members = []
        var inviteEmailItems = $(".margin-vertical-15px")

        $.each(inviteEmailItems, function(index, item) {
            var email = $(item).find(".edit-input").val().trim()

            if (email.length > 0) {
                members.push([email, $(item).find("select").val()])
            }
        })

        if (members.length > 0) {
            var urlParams = getUrlParams()

            $.ajax({
                type: "POST",
                url: "/teams/" + urlParams[4] + "/members",
                data: {
                    members: members,
                },
                success: function(result) {

                }
            })
        } else {
            updateTooltip("请输入邮箱", inviteEmailItems.first())
        }
    }

    resendActivationMail(event) {
        event.preventDefault()

        var urlParams = getUrlParams()

        $.ajax({
            type: "GET",
            url: "/members/" + urlParams[4] + "/edit",
            data: {
                action_type: "resend_invite_email",
            },
            success: function(result) {
                var inviteButton = $("#resend-inivite-button")

                inviteButton
                    .text("激活邮件已经重新发送")
                    .css({
                        color: "#aaa",
                        border: "1px solid #aaa",
                    })
            }
        })
    }

    cancelInivte(event) {
        event.preventDefault()

        var urlParams = getUrlParams()

        $.ajax({
            type: "GET",
            url: "/members/" + urlParams[4] + "/edit",
            data: {
                action_type: "cancel_invite",
            },
            success: function(result) {
                window.location.href = result["redirect"]
            }
        })
    }
}
