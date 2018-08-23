import { Controller } from "stimulus"

export default class extends Controller {
    onClick(event) {
	if ($(event.target).closest(".comment-edit-menu").length === 0
	    && $(event.target).closest(".comment-edit-button").length === 0) {
	    $(".comment-edit-menu").hide()
	}
    }

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

        var currentTarget = event.currentTarget
	var currentRect = currentTarget.getBoundingClientRect()

	var menuTriangleWidth = 10
	var commentEditMenu = $(".comment-edit-menu")

	commentEditMenu.css({
	    left: currentRect.left + currentRect.width / 2 - commentEditMenu.width() / 2,
	    top: currentRect.bottom + menuTriangleWidth
	})

	commentEditMenu.show()
    }

    editComment(event) {
	event.preventDefault()

	console.log("edit comment")
    }

    deleteComment(event) {
	event.preventDefault()
	
	console.log("delete comment")
    }
}
