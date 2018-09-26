import { Controller } from "stimulus"
import { exclueMenuElements } from "./utils"

export default class extends Controller {
    onClick(event) {
 	if (exclueMenuElements(event, [".top-header-menu", ".top-header-menu-button"])) {
	    $(".top-header-menu").hide()
	}

     	if (exclueMenuElements(event, [".top-header-bell", ".notification-menu"])) {
	    $(".notification-menu").hide()
	}
    }

    popMainMenu(event) {
	event.preventDefault()

        var currentTarget = event.currentTarget
	var currentRect = currentTarget.getBoundingClientRect()

	var menuTriangleWidth = 10
	var topHeaderMenu = $(".top-header-menu")

	topHeaderMenu
	    .css({
		left: currentRect.left + currentRect.width - topHeaderMenu.width() + menuTriangleWidth * 2,
		top: currentRect.bottom + menuTriangleWidth
	    })
	    .show()
    }

    popNotificationMenu(event) {
	event.preventDefault()

        var currentTarget = event.currentTarget
	var currentRect = currentTarget.getBoundingClientRect()

	var menuTriangleWidth = 10
	var notificationMenu = $(".notification-menu")

	notificationMenu
	    .css({
		left: currentRect.left + currentRect.width - notificationMenu.width() + menuTriangleWidth * 10,
		top: currentRect.bottom + menuTriangleWidth
	    })
	    .show()
    }
}
