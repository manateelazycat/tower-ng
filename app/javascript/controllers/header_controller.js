import { Controller } from "stimulus"

export default class extends Controller {
    onClick(event) {
 	if ($(event.target).closest(".top-header-menu").length === 0
	    && $(event.target).closest(".top-header-menu-button").length === 0) {
	    $(".top-header-menu").hide()
	}
    }

    popMenu(event) {
	event.preventDefault()

        var currentTarget = event.currentTarget
	var currentRect = currentTarget.getBoundingClientRect()

	var menuTriangleWidth = 10
	var topHeaderMenu = $(".top-header-menu")

	topHeaderMenu.css({
	    left: currentRect.left + currentRect.width - topHeaderMenu.width() + menuTriangleWidth * 2,
	    top: currentRect.bottom + menuTriangleWidth
	})

	console.log(currentRect)

	topHeaderMenu.show()
    }
}
