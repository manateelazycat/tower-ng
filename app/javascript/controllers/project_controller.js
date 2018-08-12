import { Controller } from "stimulus"
import deleteAndRedirect from "./delete_and_redirect"

export default class extends Controller {
    deleteProject(event) {
	event.preventDefault()

        var url = $(location).attr('href')
        var urlParams = url.split("/")

	deleteAndRedirect("/projects/" + urlParams[4])
    }
}
