// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

const STEP_RATE = 0.1, 
    STEP_RATE_HI = 1,
    SPEED = 1, 
    SPEED_LOW = 0.1, 
    SPEED_HI = 6

const useDefaultSpeed = document.getElementById('useDefaultSpeed');
const defaultSpeed = document.getElementById('defaultSpeed');
const stepRate = document.getElementById('stepRate');
const resetStepRate = document.getElementById('resetStepRate');
const resetDefaultSpeed = document.getElementById('resetDefaultSpeed');
const useMouseWheel = document.getElementById('useMouseWheel');

const updateDisabledState = (element,val1,val2) => {
  element.disabled = val1 == val2
}

// fetch settings
chrome.storage.sync.get(["useDefaultSpeed","defaultSpeed","useMouseWheel","stepRate"], value => {
  console.log(value)
  useDefaultSpeed.checked = !!value.useDefaultSpeed
  defaultSpeed.value = value.defaultSpeed || SPEED;
  updateDisabledState(resetDefaultSpeed,defaultSpeed.value,SPEED)
  stepRate.value = value.stepRate || STEP_RATE;
  updateDisabledState(resetStepRate,stepRate.value,STEP_RATE)
  useMouseWheel.checked = !!value.useMouseWheel;
})

useDefaultSpeed.onchange = event => {
  let state = typeof event === 'object'
    ? !!event.target.checked
    : !!event
  chrome.storage.sync.set({useDefaultSpeed: state}, ()=>{
    console.log('useDefaultSpeed saved: ' + state);
  })
}
defaultSpeed.onchange = event => {
  let speed = typeof event === 'object'
    ? event.target.value
    : parseFloat(event).toFixed(1)
  speed = Math.min(Math.max(speed,SPEED_LOW),SPEED_HI)  
  updateDisabledState(resetDefaultSpeed,speed,SPEED)
  console.log(speed)
  chrome.storage.sync.set({defaultSpeed: speed}, ()=>{
    console.log('defaultSpeed saved: ' + speed);
  })
}

stepRate.onchange = event => {
  let rate = typeof event === 'object'
    ? event.target.value
    : parseFloat(event).toFixed(8)
  rate = Math.min(rate,STEP_RATE_HI)  
  updateDisabledState(resetStepRate,rate,STEP_RATE)
  console.log(rate)
  chrome.storage.sync.set({stepRate: rate}, ()=>{
    console.log('stepRate saved: ' + rate);
  })
}

resetStepRate.onclick = event => {
   stepRate.value = STEP_RATE
   stepRate.onchange(STEP_RATE)
}

resetDefaultSpeed.onclick = event => {
  defaultSpeed.value = SPEED
  defaultSpeed.onchange(SPEED)
}

useMouseWheel.onchange = event => {
  let value = typeof event === 'object'
    ? !!event.target.checked
    : !!event
  console.log(value)
  chrome.storage.sync.set({useMouseWheel: value}, ()=>{
    console.log('useMouseWheel saved: ' + value);
  })
}
