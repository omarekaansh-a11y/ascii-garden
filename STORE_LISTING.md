# Chrome Web Store Launch Kit: ASCII Animals

This kit contains all the pre-written copy, permission justifications, privacy policy, and instructions you need to publish **ASCII Animals** to the Chrome Web Store.

---

## 1. Quick Checklist

- [ ] **Google Developer Account**: Paid one-time $5 fee at [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole).
- [ ] **2-Step Verification**: Enabled on your Google Account (mandatory for CWS developers).
- [ ] **Zip Package**: Ready at `ascii-animals-extension.zip`.
- [ ] **Store Icon**: 128x128 PNG (use `icons/icon128.png`).
- [ ] **Screenshots**: At least 1 screenshot (1280x800 or 640x400 px).
- [ ] **Privacy Policy URL**: Host the text below on GitHub Gist, Notion, or GitHub Pages.

---

## 2. Store Listing Information

### Extension Name
```
ASCII Animals - Ambient New Tab
```

### Short Description (Max 132 chars)
```
Ambient ASCII animals drifting on a glassmorphic new tab with bookmarks, live web search, odometer clock, and full controls.
```

### Detailed Description (Copy & Paste)
```markdown
Transform your New Tab into a living, ambient canvas of text-art nature.

ASCII Animals blends retro terminal ASCII art with modern liquid-glass design. Watch schools of Koi, fluttering Butterflies, pulsing Jellyfish, gliding Sea Turtles, and other creatures drift across your screen every time you open a new tab.

✨ KEY FEATURES:

✨ 9 Living ASCII Species:
• Sea Turtle (Step 4 amber-gold mosaic carapace and flipper physics)
• Koi (lazy S-curve schooling with interactive feeding ripples)
• Butterflies (erratic flutter and wing-folded glides)
• Jellyfish (bioluminescent translucent bell pulses and flowing tentacles)
• Dragonflies (hovering, banking, and high-speed darts)
• Frogs (anticipation squats and arched leaps)
• Cranes (synchronized graceful flapping and gliding)
• Crabs (lateral scuttling, claw snaps, and startled retreats)
• Fireflies (50/50 golden-yellow & neon lime bioluminescent night swarm, mouse phototaxis, water ripples, depth bokeh dots, and adjustable click scatter)

⏱️ Vertical Scroll Odometer Clock:
• Bold, luminous typography matching high-end minimalist design.
• Physical odometer roll: changing numbers roll smoothly from top to bottom while stationary digits stay rock-solid.
• 12-Hour (with AM/PM) and 24-Hour modes (click the clock anytime to toggle).

🔍 Built-in Glassmorphic Search & Bookmarks:
• Fast web search using your browser's default search engine.
• Voice search capability via browser speech recognition.
• Frosted-glass top bookmarks bar with nested folder navigation and dynamic favicons.

⚙️ Deep Live Customization (Tweaks Panel):
• Frame rate control from 30 FPS up to 144 FPS for high-refresh ProMotion/gaming screens.
• Adjust density, speed, direction, sway, spread, trail fade, and color hue shifts.
• All customizations persist automatically across browser restarts and device reboots.

⚡ Zero Battery Drain:
• Intelligent background tab suspension immediately halts rendering when switching away from the tab, dropping CPU & GPU usage to 0%.

🔒 Privacy First:
• 100% on-device. No telemetry, no ads, no trackers, and no external data transmission.
```

### Category
- **Primary**: Productivity > Workflow & Planning (or Lifestyle > Art)

---

## 3. Privacy Practices & Permission Justifications (Crucial for Review Approval)

When asked to justify each permission in the Developer Console, copy and paste these exact explanations:

| Permission | Justification for Google Reviewer |
| :--- | :--- |
| `bookmarks` | "Required to display the user's bookmarks and bookmark folders in the customizable top bookmarks navigation bar on the new tab page." |
| `favicon` | "Required to fetch and display website favicon icons next to bookmark titles in the top bookmarks bar." |
| `search` | "Required to execute web searches directly from the center search composer using the user's default search provider." |
| `storage` | "Required to save user preferences (selected animal, clock format, custom greeting name, and FPS limits) locally on the device across browser restarts." |

### Data Usage Declarations
- **Single Purpose**: "A productivity-focused new tab page that replaces the blank new tab with ambient ASCII animal simulations, a bookmarks navigation bar, an odometer clock, and a search composer."
- **Data Collection Checkbox**: Check **"No, I am not collecting or using user data"**.
- Check all certification boxes (confirming compliance with Chrome Web Store Developer Program Policies).

---

## 4. Privacy Policy Text (Host on GitHub Gist or GitHub Pages)

```markdown
# Privacy Policy for ASCII Animals Chrome Extension

Last updated: November 2026

ASCII Animals is committed to protecting user privacy. This extension is built to run entirely on your local machine.

1. Information Collection and Use:
ASCII Animals does NOT collect, store, transmit, or sell any personal data, browsing history, or search queries. All data remains exclusively on your local device.

2. Browser Permissions:
- Bookmarks: Used solely to read and display your bookmarks in the new tab bookmarks bar. Bookmarks data is never exported or transmitted.
- Favicon: Used strictly to render website icons beside bookmark items.
- Search: Used exclusively to redirect your typed query to your default search provider upon pressing enter.
- Storage: Used solely by chrome.storage.local to remember your settings (such as chosen animal, clock format, and FPS settings).

3. Third-Party Services:
The extension makes no external network calls to third-party analytics, ads, or tracking services.

4. Contact:
If you have any questions regarding this Privacy Policy, please open an issue on our project repository.
```
