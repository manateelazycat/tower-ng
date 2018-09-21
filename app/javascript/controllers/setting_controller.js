import { Controller } from "stimulus"

export default class extends Controller {
    static = [ "submit" ]

    finishUpload(event) {
	this.submitTarget.click()
    }
}
