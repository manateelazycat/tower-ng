import { Controller } from "stimulus"

export default class extends Controller {
    connect() {
	$(".mission-distributor-datepicker").datepicker({
	    todayHighlight: true,
	    orientation: "bottom auto",
	    language: "zh-CN",
	    format: "yyyy/mm/dd",
	    autoclose: true,
	    weekStart: 1,
	})
    }
}
