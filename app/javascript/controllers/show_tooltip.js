export function updateTooltip(text, input) {
    var tooltip = $("#input-tooltip")
    var scrollOffset = window.scrollY
    var tooltipHideTimeout = 3000
    var tooltipHideDuration = 400
    var tooltipArrowWidth = 20

    tooltip
	.text(text)
	.show()
	.css({
	    top: scrollOffset + input[0].getBoundingClientRect().top,
	    left: input[0].getBoundingClientRect().left - tooltip.outerWidth(true) - tooltipArrowWidth
	})
	.delay(tooltipHideTimeout).fadeOut(tooltipHideDuration)
}

export function hideTooltip() {
    $("#input-tooltip").hide()
}
