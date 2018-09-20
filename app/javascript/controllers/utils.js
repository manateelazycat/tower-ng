export function clickOnElements(event, elements) {
    return elements.reduce((sum, next) => sum && ($(event.target).closest(next).length === 0), true)
}
