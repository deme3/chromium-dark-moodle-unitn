let currentPalette = null;

chrome.runtime.sendMessage({ action: "getStorage" }, (response) => {
    if(response.chosen_palette) {
        currentPalette = response.chosen_palette;
        applyPalette(currentPalette);
    }
});

window.addEventListener("load", () => {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === "applyPalette") {
            sendResponse({ success: applyPalette(request.palette) });
        }
    });
});

function applyPalette(paletteId) {
    if(typeof palettes !== "undefined") {
        let referencePalette = palettes[paletteId];
        console.group(`Applying "${paletteId}":`);
        for(let paletteParameter in referencePalette) {
            if(paletteParameter === "display-name" || paletteParameter === "palette-predominance")
                continue;
            console.log(`Injecting ${paletteParameter}..`)
            document.querySelector(":root").style.setProperty(paletteParameter, referencePalette[paletteParameter]);
        }
        console.log("Done.");
        console.groupEnd();
        return true;
    } else {
        console.error("Palettes object was not defined, can't inject any palette dynamically!");
        return false;
    }
}