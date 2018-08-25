import { Controller } from "stimulus"
import { hideTooltip } from "./show_tooltip"

export default class extends Controller {
    static targets = [ "rightMenuArea"]

    connect() {
	var rightFloatMenuTopRect = $(".right-float-menu-top")[0].getBoundingClientRect()
	this.rightFloatMenuTopY = rightFloatMenuTopRect.y + rightFloatMenuTopRect.height
	this.topOffset = parseInt(this.data.get("top-offset"))

	this.rightMenuAreaTarget.style.top = (this.rightFloatMenuTopY + this.topOffset).toString() + "px"
    }

    onScroll() {
	var scrollOffset = window.scrollY
	var areaOffset = Math.max(this.rightFloatMenuTopY + this.topOffset - scrollOffset, this.topOffset)

	this.rightMenuAreaTarget.style.top = areaOffset.toString() + "px"

	hideTooltip()
    }
}
