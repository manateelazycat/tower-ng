import { Controller } from "stimulus"
import deleteAndRedirect from "./delete_and_redirect"
import { getUrlParams } from "./utils"

export default class extends Controller {
    deleteProject(event) {
	event.preventDefault()

        var urlParams = getUrlParams()

	deleteAndRedirect("/projects/" + urlParams[4])
    }
}
