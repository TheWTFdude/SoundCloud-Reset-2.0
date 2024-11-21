// ==UserScript==
// @name         SoundCloud Unrepost with Continuous Deletion
// @namespace    https://github.com/TheWTFdude
// @version      1.4
// @description  Automatically remove reposts on SoundCloud and continuously attempt to delete reposts without page reload
// @match        https://soundcloud.com/*/reposts
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

var N = -1; // Number of deletions (-1 for all)
var interval = 125; // Time between actions in ms
var $ = window.jQuery;
var alreadyClickedUnpost = false;

// Detect changes and dynamically added buttons
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        // Detect when the "Unpost" button appears in the DOM
        if (mutation.type === "childList") {
            handleRepostsPage();
        }
    });
});

// Handle the reposts page
if (window.location.href.includes("/reposts")) {
    $(window).on("load", function () {
        console.log("Reposts page detected. Starting unreposting.");
        observeRepostsPage();
    });

    function observeRepostsPage() {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        console.log("Observer is now watching for changes in the reposts page.");
    }

    function handleRepostsPage() {
        if (!alreadyClickedUnpost) {
            var button = $("button:contains('Unpost'), [aria-label*='Remove repost'], [title*='Unpost']").first();
            if (button.length > 0) {
                console.log("Found 'Unpost' button.");
                button.click(); // Click "Unpost"
                alreadyClickedUnpost = true; // Ensure we click only once
                console.log("Clicked 'Unpost'. Now waiting for the modal.");
                // Start waiting for the modal after clicking "Unpost"
                waitForModal();
            } else {
                console.log("No 'Unpost' button found.");
            }
        }
    }
}

// Wait for the modal to appear
function waitForModal() {
    console.log("Waiting for the modal to appear...");
    setTimeout(performDelete, 1000); // Wait 1 second for the modal to show up
}

// Handle the "Delete repost" action in the modal
function performDelete() {
    // Look for the modal (using the class from the screenshot you provided)
    var modal = $(".dropdownMenu.g-z-index-overlay");
    if (modal.length > 0) {
        console.log("Modal is visible.");
        // Look for the 'Delete repost' button inside the modal
        var deleteButton = modal.find("button.sc-button.sc-button-nostyle.sc-button-medium.repostOverlay__formButton.repostOverlay__formButtonDelete").first();

        if (deleteButton.length > 0) {
            console.log("Found 'Delete repost' button.");
            deleteButton.click(); // Click the "Delete repost" button
            console.log("Clicked 'Delete repost'. Closing modal...");
            setTimeout(() => {
                modal.find(".sc-modal__close").click(); // Close the modal after a short delay
            }, 500); // Delay to ensure action completes
            // After deletion, continue to check for new reposts in the updated list
            setTimeout(() => {
                alreadyClickedUnpost = false; // Reset Unpost click flag
                handleRepostsPage(); // Retry after 1.5 seconds to check for the next repost
            }, 2000); // Wait longer to ensure page content updates before retrying
        } else {
            console.log("No 'Delete repost' button found inside the modal.");
            setTimeout(performDelete, 500); // Retry every 500ms if the button is not found
        }
    } else {
        console.log("Modal not visible yet. Retrying...");
        setTimeout(performDelete, 500); // Retry if the modal is not visible
    }
}
