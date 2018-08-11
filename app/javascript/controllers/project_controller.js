import { Controller } from "stimulus"

export default class extends Controller {

    deleteProject(event) {
	event.preventDefault()

        var url = $(location).attr('href')
        var urlParams = url.split("/")

        // Hide confirm dialog.
        $("#confirm-dialog").modal("hide")

        // Show loading dialog.
        $("#loading-dialog").modal("show")

        var startDate = new Date()
        var startTime = startDate.getTime()

	$.ajax({
	    type: "DELETE",
            url: "/projects/" + urlParams[4],
	    success: function(result) {
                var endDate = new Date()
                var endTime = endDate.getTime()

                // Add some delay for better user experience.
                if (endTime - startTime < 2000) {
                    setTimeout(function () {
                        window.location.href = result["redirect"]
                    }, 200)
                } else {
                    window.location.href = result["redirect"]
                }
	    }
	})

	console.log("************", urlParams)
    }
}
