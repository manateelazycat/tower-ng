import { Controller } from "stimulus"
import { clickOnElements } from "./utils"

export default class extends Controller {
    onClick(event) {
 	if (clickOnElements(event, [".top-header-menu", ".top-header-menu-button"])) {
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

	topHeaderMenu.show()
    }
}
