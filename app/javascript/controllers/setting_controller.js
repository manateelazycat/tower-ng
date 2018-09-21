import { Controller } from "stimulus"

export default class extends Controller {
    static targets = [ "submit" ]

    finishUpload(event) {
	this.submitTarget.click()
    }
}
