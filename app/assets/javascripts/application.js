// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require bootstrap
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require sortable-rails
//= require_tree .
$(document).on("turbolinks:load", function() {
    // Make teams page items sortable.
    if ($("#teams-show").length > 0) {
	Sortable.create(sortableContainer, {});
    }
});

// Make top alert notification hide after display 5 seconds. 
$(document).ready(function () {
    window.setTimeout(function() {
	$(".alert").fadeTo(1000, 0).slideUp(1000, function(){
            $(this).remove(); 
	});
    }, 5000);
    
});
