// Saves options to chrome.storage
const DEFAULT_PALETTE = "unitn-dark";
var current_palette = DEFAULT_PALETTE;
function save_options() {
    chrome.storage.local.set({
        "chosen_palette": current_palette
    }, function() {
        // on save complete
    });
}

function load_options() {
    chrome.storage.local.get(["chosen_palette"], function(items) {
        if(items.chosen_palette != null)
            current_palette = items.chosen_palette;
        else {
            current_palette = DEFAULT_PALETTE;
            save_options();
        }
    });
}
document.addEventListener('DOMContentLoaded', load_options);