// Copyright 2019 Dan Kloke. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const changeVideoSpeed = event => {
    let speed = isNaN(event)?event.target.value:event
    resetEl.disabled = (speed == 1)?true:null
    chrome.tabs.query({active: true, currentWindow: true}, 
        tabs => {
            chrome.tabs.executeScript(
                tabs[0].id,
                {code: "Array.prototype.slice.call(document.getElementsByTagName('video')).forEach(v=>v.playbackRate="+speed+")"}
            )
        }
    )
}

// get elements
const inputEl = document.getElementById('videospeed')
const resetEl = document.getElementById('reset')
const helpEl = document.getElementById('help')


// fetch settings
chrome.storage.sync.get(["useDefaultSpeed","defaultSpeed","useMouseWheel","stepRate"], value => {
    console.log(value)
    const {useDefaultSpeed, defaultSpeed, useMouseWheel, stepRate} = value
    // get page's rates
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: "Array.prototype.slice.call(document.getElementsByTagName('video')).map(e=>e.playbackRate)"},
            result => {
                console.log('Found rates:',result)
                inputEl.value = useDefaultSpeed?defaultSpeed:result[0][0]
                changeVideoSpeed({target:inputEl})
            }
        )
     })
    inputEl.step=stepRate||0.1
    if(useMouseWheel) 
        inputEl.onmousewheel = changeVideoSpeed
})

inputEl.onchange = changeVideoSpeed
inputEl.onclick = changeVideoSpeed
inputEl.onkeyup = changeVideoSpeed
inputEl.onmouseup = changeVideoSpeed
inputEl.onmouseup = changeVideoSpeed

resetEl.onclick = event => {
    inputEl.value="1"
    changeVideoSpeed(1) 
}
helpEl.onclick = event => {
    alert(
        "This should be helpful, but it's not."
    )
}

