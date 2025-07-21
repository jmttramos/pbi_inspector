# DevOps Backlog Totals Panel

Tampermonkey script for Azure DevOps Backlog view that automatically calculates total **Effort** and **Actuals To Date** from Product Backlog Items (PBIs). Displays results in a floating transparent panel with manual refresh and auto-scroll support.

---

## 🔧 Features

- ✅ Only runs on the Backlog view (`/backlog`)
- 📊 Displays Effort and Actuals To Date totals
- 🖼️ Transparent floating UI panel
- 🔁 Manual “Update Totals” button
- 🔽 Scroll automation to load all PBIs before calculation
- 🧩 Easy to customize for other columns or filters

---

## 🚀 Installation

1. Install [Tampermonkey extension](https://tampermonkey.net/) on your browser
2. Open Tampermonkey dashboard and create a **New Script**
3. Paste the contents of [`backlog-totals-panel-v1.0.0.js`](scripts/backlog-totals-panel-v1.0.0.js)
4. Save and make sure the script is **enabled**

When you visit Azure DevOps Backlog, the panel will appear in the bottom-right corner.

---

## 🧮 Column Index Reference

By default, the script uses:

| Metric            | Column Index |
|------------------|--------------|
| Actuals To Date  | 5            |
| Effort           | 6            |

If your backlog columns are in a different order, adjust the indexes inside the script.

---

## 📚 Documentation

For advanced usage, customization and troubleshooting, see the [Wiki](https://github.com/your-repo/wiki)

---

## 📦 Releases

Latest version: [`v1.0.0`](https://github.com/your-repo/releases/tag/v1.0.0)  
Includes scroll automation and manual refresh button.

---

## 👤 Author

Made by [Jorge Ramos](https://github.com/your-username)  
Built to help teams gain faster visibility during sprint planning and backlog grooming.
