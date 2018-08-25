export function createTooltip(text) {
    var tooltip

    // Fade in tooltip element if it exists.
    if ($(".input-tooltip").length) {
        tooltip = $(".input-tooltip")
        tooltip.text(text)
        tooltip.fadeIn(0)
    }
    // Otherwise create tooltip element.
    else {
        tooltip = $("<div />")
        tooltip.attr({class: "input-tooltip"});
        tooltip.text(text)
        $("body").append(tooltip)
    }

    return tooltip
}

export function updateTooltip(tooltip, input) {
    var scrollOffset = window.scrollY
    var tooltipHideTimeout = 3000
    var tooltipHideDuration = 400
    var tooltipArrowWidth = 20

    // Adjust tooltip coordinate.
    tooltip.css({
        top: scrollOffset + input[0].getBoundingClientRect().top,
        left: input[0].getBoundingClientRect().left - tooltip.outerWidth(true) - tooltipArrowWidth
    })

    // Hide tooltip after duration.
    tooltip.delay(tooltipHideTimeout).fadeOut(tooltipHideDuration)
}

export function hideTooltip() {
    var tooltip = $(".input-tooltip")

    if (tooltip.length) {
	tooltip.hide()
    }
}
