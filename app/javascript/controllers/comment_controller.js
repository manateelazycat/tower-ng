import { Controller } from "stimulus"

export default class extends Controller {
    mouseOverComment(event) {
        var currentTarget = event.currentTarget
	var currentRect = currentTarget.getBoundingClientRect()
	var commentEditButton = $(".comment-edit-button")
	var commentSplitter = $(".mission-comment-splitter")[0]
	var commentRect = commentSplitter.getBoundingClientRect()
	var offsetY = 40
	var offsetX = 10

	console.log("over", $(currentTarget).index())

	var toolbarX = commentRect.left + commentRect.width - commentEditButton.outerWidth(true) - offsetX
	var toolbarY

	if ($(currentTarget).index() == 0) {
	    toolbarY = currentRect.top
	} else {
	    toolbarY = currentRect.top + offsetY
	}

	commentEditButton.css({
	    left: toolbarX,
	    top: toolbarY,
	})

	commentEditButton.show()


    }

    mouseOutComment(event) {
	console.log("out")
    }

    clickEditButton(event) {
	event.preventDefault()

	console.log("*************")
    }
}
