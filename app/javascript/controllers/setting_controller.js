import { Controller } from "stimulus"

export default class extends Controller {
    finishUpload(event) {
	event.preventDefault()

	Rails.fire(document.querySelector("#user-photo-form"), "submit")
    }
}
