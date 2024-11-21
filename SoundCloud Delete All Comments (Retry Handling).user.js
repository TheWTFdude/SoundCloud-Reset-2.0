// ==UserScript==
// @name         SoundCloud Delete All Comments (Retry Handling)
// @namespace    https://github.com/TheWTFdude
// @version      1.2
// @description  Automatically deletes all comments on SoundCloud without scrolling, retry handling for disappearing comments
// @match        https://soundcloud.com/*/comments
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

var interval = 500; // Time between actions in ms
var $ = window.jQuery;
var deleteCount = 0; // Track the number of successful deletions

$(window).on("load", function () {
    console.log('SoundCloud Comments page detected. Starting to delete comments.');
    performDeleteActions();
});

function performDeleteActions() {
    // Find all comment containers
    var commentContainers = $("div.commentBadge");

    if (commentContainers.length > 0) {
        console.log("Found " + commentContainers.length + " comment containers.");

        // Iterate over all the comment containers
        commentContainers.each(function(index, container) {
            setTimeout(function() {
                // Hover over the comment to reveal the delete button
                $(container).hover();

                // Find the delete button within the hovered comment container
                var deleteButton = $(container).find("button[aria-label='Delete this comment']");

                if (deleteButton.length > 0) {
                    deleteButton.click(); // Click the "Delete" button
                    console.log("Deleted comment at index: " + index);
                    deleteCount++; // Increment the count of successful deletions

                    // Wait for the modal to appear and click 'Yes'
                    handleDeleteModal();
                }
            }, interval * index); // Delay each action to avoid rapid requests
        });
    } else {
        console.log("No more comment containers found. All comments should be deleted.");
    }
}

function handleDeleteModal() {
    // Wait for the modal to appear
    var modalInterval = setInterval(function() {
        var modal = $("div.dialog");
        var yesButton = modal.find("button[type='submit']"); // The "Yes" button in the modal

        if (modal.length > 0 && yesButton.length > 0) {
            console.log("Modal found, clicking 'Yes' to confirm delete.");
            yesButton.click(); // Click the "Yes" button
            clearInterval(modalInterval); // Stop checking for the modal

            // After modal confirmation, recheck the comment containers
            setTimeout(performDeleteActions, 500); // Retry deleting after modal
        }
    }, 500); // Check every 500ms for the modal
}
