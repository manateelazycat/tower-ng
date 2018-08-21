import { Controller } from "stimulus"

export default class extends Controller {
    mouseEnterComment(event) {
        var currentTarget = event.currentTarget
	var currentRect = currentTarget.getBoundingClientRect()
	var commentEditButton = $(".comment-edit-button")
	var commentSplitter = $(".mission-comment-splitter")[0]
	var commentRect = commentSplitter.getBoundingClientRect()
	var offsetY = 40
	var offsetX = 10

	commentEditButton.css({
	    left: commentRect.left + commentRect.width - commentEditButton.outerWidth(true) - offsetX,
	    top: currentRect.top,
	})

	commentEditButton.show()
    }

    mouseLeaveComment(event) {
	if (event.relatedTarget && $(event.relatedTarget).attr("class").indexOf("comment-edit-button") == -1) {
	    $(".comment-edit-button").hide()
	}
    }

    clickEditButton(event) {
	event.preventDefault()

	console.log("*************")
    }
}
