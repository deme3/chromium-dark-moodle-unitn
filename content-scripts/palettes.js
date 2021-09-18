var palettes = {
    "reddit-dark": {
        "display-name": "Reddit Dark Palette",
        "palette-predominance": "dark",
        "--addon-unitn-red": "#C01532",
        "--addon-unitn-dark-red": "#7a0d20",
        "--addon-black": "#030303",
        "--addon-light-black": "#1A1A1B",
        "--addon-lighter-black": "#272729",
        "--addon-grey": "#818384",
        "--addon-dark-grey": "#272729",
        "--addon-white": "#d7dadc",
        "--addon-lighter-red": "#ff585b",
        "--addon-light-red": "#ff4f4f",
        "--addon-red": "#b10b25",
        "--addon-dark-red": "#901629",
        "--addon-green": "#46d161",
        "--addon-blue": "#4fbcff"
    },
    "unitn-dark": {
        "display-name": "UniTN Dark Palette",
        "palette-predominance": "dark",
        "--addon-unitn-red": "#C01532", 
        "--addon-unitn-dark-red": "#7a0d20", 
        "--addon-black": "#000000", 
        "--addon-light-black": "#212121", 
        "--addon-lighter-black": "#404040", 
        "--addon-grey": "#404040", 
        "--addon-dark-grey": "#404040",  
        "--addon-white": "#AAAAAA", 
        "--addon-lighter-red": "#e05551", 
        "--addon-light-red": "#e40f2f", 
        "--addon-red": "#b10b25", 
        "--addon-dark-red": "#901629", 
        "--addon-green": "#46d161",
        "--addon-blue": "#4fbcff"
    }
}

function load_palettes_selector() {
    // load only if page has palette selector
    // otherwise means it's palette-inject
    if(document.getElementById("palette-selector")) {
        let paletteSelector = document.getElementById("palette-selector");

        for(let paletteId in palettes) {
            let paletteData = palettes[paletteId];
            let paletteDisplayName = paletteData["display-name"];
            let palettePredominance = paletteData["palette-predominance"];

            let paletteBaseElement = document.createElement("div");
            paletteBaseElement.classList.add("palette-choice", `palette-choice-${palettePredominance}`);
            paletteBaseElement.setAttribute("data-palette-id", paletteId);
            paletteBaseElement.addEventListener("click", () => {
                chrome.tabs.query({active: true, currentWindow: true}, (tabsFound) => {
                    let tabInfo = tabsFound[0];
                    let tabURL = new URL(tabInfo.url);

                    if(tabURL.href.includes(chrome.runtime.id) || tabURL.hostname === "extensions") {
                        // I'm in options page, not real time tab popup!
                        // TODO : better separate flows
                        current_palette = paletteBaseElement.getAttribute("data-palette-id");
                        save_options();
                    } else {
                        chrome.tabs.sendMessage(tabsFound[0].id, { action: "applyPalette", palette: paletteBaseElement.getAttribute("data-palette-id") }, (response) => {
                            if(response.success) {
                                current_palette = paletteBaseElement.getAttribute("data-palette-id");
                                save_options();
                            }
                        });
                    }
                });
            });
            
            let palettePredominanceElement = document.createElement("div");
            palettePredominanceElement.classList.add(`predominance-${palettePredominance}`, `predominance`);
            palettePredominanceElement.innerText = palettePredominance[0].toUpperCase() + palettePredominance.substr(1, palettePredominance.length-1);
            

            let paletteDisplayNameElement = document.createElement("div");
            paletteDisplayNameElement.classList.add("palette-display-name");
            paletteDisplayNameElement.innerText = paletteDisplayName;

            paletteBaseElement.append(palettePredominanceElement, paletteDisplayNameElement);
            paletteSelector.append(paletteBaseElement);
        }
    }
}

document.addEventListener('DOMContentLoaded', load_palettes_selector);