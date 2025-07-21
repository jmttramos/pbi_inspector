[![Latest Release](https://img.shields.io/github/v/release/jmttramos/pbi_inspector?label=Latest%20Release)](https://github.com/jmttramos/pbi_inspector/releases/latest)

# DevOps Backlog Totals Panel

Tampermonkey script for Azure DevOps Backlog view that automatically calculates total **Initial Estimate** and **Actuals To Date** from Product Backlog Items (PBIs). Displays results in a floating transparent panel with manual refresh and auto-scroll support.

---

## 🔧 Features

- ✅ Only runs on the Backlog view (`/backlog`)  
- 📊 Displays Initial Estimate and Actuals To Date totals  
- 🖼️ Transparent floating UI panel  
- 🔁 Manual “Update Totals” button  
- 🔽 Scroll automation to load all PBIs before calculation  
- 🧩 Easy to customize for other columns or filters  

---

## 🚀 Installation

1. Install the [Tampermonkey extension](https://tampermonkey.net/) on your browser  
2. Open Tampermonkey dashboard and create a **New Script**  
3. Paste the contents of the [latest release script](https://github.com/jmttramos/pbi_inspector/releases/latest)  
4. Save and ensure the script is **enabled**  

When you visit Azure DevOps Backlog, the panel will appear in the bottom-right corner.

---

## 🧮 Column Index Reference

By default, the script uses:

| Metric            | Column Index |
|-------------------|--------------|
| Actuals To Date   | 5            |
| Initial Estimate  | 6            |

If your backlog columns are in a different order, adjust the indexes inside the script.  
*(Still trying to find a way to overcome this and detect columns by name instead of index.)*

---

## 📚 Documentation

For advanced usage, customization and troubleshooting, see the [Wiki](https://github.com/jmttramos/pbi_inspector/wiki)

---

## 📦 Releases

Latest release: [v1.0.2](https://github.com/jmttramos/pbi_inspector/releases/tag/v1.0.2)  
Includes scroll automation targeting sticky-table container, manual refresh button, and floating metrics UI.

---

## 👤 Author

Made by [Jorge Ramos](https://github.com/jmttramos)  
Built to help teams gain faster visibility during sprint planning and backlog grooming.
