import { Controller } from "stimulus"

export default class extends Controller {
    onClick(event) {
 	if ($(event.target).closest(".comment-edit-menu").length === 0
	    && $(event.target).closest(".comment-edit-button").length === 0) {
	    $(".comment-edit-menu").hide()
	}
    }

    mouseEnterComment(event) {
	if (!$(".comment-edit-menu").is(":visible")) {
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

	    commentEditButton.attr("data-comment-id", $(currentTarget).closest(".mission-comment").attr("id"))
	}
    }

    mouseLeaveComment(event) {
	if (!$(".comment-edit-menu").is(":visible")) {
	    if (event.relatedTarget && $(event.relatedTarget).attr("class").indexOf("comment-edit-button") == -1) {
		$(".comment-edit-button").hide()
	    }
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

	var commentId = $(".comment-edit-button").data("comment-id")
	var commentEditForm = $("#" + commentId + ".comment-edit-form-item")
	var comment = $("#" + commentId + ".mission-comment")

	$(".comment-edit-button").hide()
	$(".comment-edit-menu").hide()
	comment.hide()
	commentEditForm.show()

	commentEditForm.find(".comment-edit-textarea").val(comment.find(".mission-comment-content").text().trim())
    }

    deleteComment(event) {
	event.preventDefault()

	$(".comment-edit-button").hide()
	$(".comment-edit-menu").hide()
	$("#comment-confirm-dialog").modal("show")
    }

    confirmDeleteComment(event) {
	var url = $(location).attr('href')
	var urlParams = url.split("/")

	var commentId = $(".comment-edit-button").data("comment-id")

	$.ajax({
	    type: "DELETE",
	    url: "/projects/" + urlParams[4] + "/missions/" + urlParams[6] + "/comments/" + commentId,
	    success: function(result) {
		$("#comment-confirm-dialog").modal("hide")
		$("#" + commentId).fadeOut(800)
	    }
	})
    }

    clickCommentEditSubmitButton(event) {
	event.preventDefault()

        var currentTarget = event.currentTarget
	var commentEditForm = $(currentTarget).parents(".comment-edit-form-item")
	var commentId = commentEditForm.attr("id")
	var comment = $("#" + commentId + ".mission-comment")
	var commentTextarea = commentEditForm.find(".comment-edit-textarea")

	var url = $(location).attr('href')
	var urlParams = url.split("/")

	$.ajax({
	    type: "GET",
	    url: "/projects/" + urlParams[4] + "/missions/" + urlParams[6] + "/comments/" + commentId + "/edit",
	    data: {
		content: commentTextarea.val(),
	    },
	    success: function(result) {
		commentEditForm.hide()
		comment.find(".mission-comment-content").text(commentTextarea.val())

		comment.show()
	    }
	})
    }

    clickCommentEditCancelButton(event) {
	event.preventDefault()

        var currentTarget = event.currentTarget
	var commentEditForm = $(currentTarget).parents(".comment-edit-form-item")
	var comment = $("#" + commentEditForm.attr("id") + ".mission-comment")

	commentEditForm.hide()
	comment.show()
    }
}
