# Doom Clock – JavaScript Module

## Overview
This module converts the original Python-based Doom Clock mechanic into JavaScript for use in the web version of the game. It manages a countdown timer, milestone events, and custom actions when the clock reaches zero.

## Files
    Doomclock/
    │── doomclock.js # Main JS module
    └── doomclock_demo.html # Example usage page

## Features
- Countdown timer  
- Adding time  
- Resetting timer  
- Milestone events at percentage thresholds  
- Custom onZero event  
- Optional logging system  
- Fully modular — works on any HTML page  

---

## How to Use

### 1. Import the Script
```html
<script src="Doomclock/doomclock.js"></script>

2. Create a Doom Clock Instance
const doom = new DoomClock({
    start: 100,
    milestonePercents: {
        75: (p,e,log) => log.push("Event at 75%"),
        50: (p,e,log) => log.push("Event at 50%"),
        25: (p,e,log) => log.push("Event at 25%")
    },
    onZero: (p,e,log) => log.push("DOOM REACHED ZERO")
});

3. Call Functions
doom.countdown(1); 
doom.addTime(10);
doom.reset();
