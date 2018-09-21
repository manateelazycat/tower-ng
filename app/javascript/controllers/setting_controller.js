import { Controller } from "stimulus"

export default class extends Controller {
    static targets = [ "submit" ]

    finishUpload(event) {
	this.submitTarget.click()
    }

    updateUserPhoto(event) {
	let [data, status, xhr] = event.detail;
	var photo_url = $.parseJSON(xhr.response)["photo_url"]

	$(".setting-icon img").attr("src", photo_url)
	$(".top-header-icon img").attr("src", photo_url)
    }
}
