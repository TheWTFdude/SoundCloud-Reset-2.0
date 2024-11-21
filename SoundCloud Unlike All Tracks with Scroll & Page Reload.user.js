// ==UserScript==
// @name         SoundCloud Unlike All Tracks with Scroll & Page Reload
// @namespace    https://github.com/TheWTFdude
// @version      1.3
// @description  Automatically unlikes all tracks on SoundCloud Likes page, scrolls down, and reloads after 5 successful unlikes
// @match        https://soundcloud.com/*/likes
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

var interval = 500; // Time between actions in ms
var $ = window.jQuery;
var unlikeCount = 0; // Track the number of successful unlikes
var scrollInterval = 2000; // Scroll interval to load new content (in ms)
var scrollDistance = 300; // Scroll distance in pixels to reveal new posts

// Wait for the page to fully load
$(window).on('load', function () {
    console.log('SoundCloud Likes page detected. Starting to unlike tracks.');
    performUnlikeActions();
});

function performUnlikeActions() {
    // Find all "Unlike" buttons based on the HTML you've provided
    var likeButtons = $("button[aria-label='Unlike'], button.sc-button-like.sc-button-secondary.sc-button-small.sc-button-responsive.sc-button-selected");

    if (likeButtons.length > 0) {
        console.log("Found " + likeButtons.length + " 'Unlike' buttons.");

        // Iterate over all the "Unlike" buttons and click each one to unlike
        likeButtons.each(function(index, button) {
            setTimeout(function() {
                // Ensure button is in the visible viewport before clicking
                if (isElementInViewport(button)) {
                    $(button).click(); // Click the "Unlike" button to unlike the track
                    console.log("Unliked track at index: " + index);
                    unlikeCount++; // Increment the count of successful unlikes

                    // After 5 successful unlikes, reload the page
                    if (unlikeCount >= 5) {
                        console.log("5 unlikes completed. Reloading the page.");
                        location.reload(); // Reload the page
                        return; // Stop further execution after reload
                    }
                }
                // Scroll down to reveal more tracks if necessary
                if (index === likeButtons.length - 1) {
                    scrollToBottom(); // Scroll the page down to reveal more posts
                }
            }, interval * index); // Delay each click to avoid rapid requests
        });
    } else {
        console.log("No 'Unlike' buttons found. Retrying...");
        setTimeout(performUnlikeActions, 1000); // Retry if no buttons are found
    }
}

function isElementInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (rect.top >= 0 && rect.bottom <= window.innerHeight); // Check if element is in the viewport
}

function scrollToBottom() {
    console.log("Scrolling down to reveal more tracks...");
    window.scrollBy(0, scrollDistance); // Scroll the page down by a certain distance
    setTimeout(performUnlikeActions, scrollInterval); // Wait for new content to load before continuing
}
