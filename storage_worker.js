chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "getStorage") {
		chrome.storage.local.get(["chosen_palette"], function(items) {
			sendResponse(items);
		});
	}
	return true;
});