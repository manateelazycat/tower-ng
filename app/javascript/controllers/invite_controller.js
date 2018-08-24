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

	console.log("*********")
    }
}
