// ==UserScript==
// @name         DevOps Backlog Totals Panel
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Calculates Effort and Actuals To Date from Azure DevOps Backlog. Includes floating panel, auto-scroll, and manual refresh button.
// @author       Jorge Ramos
// @match        https://dev.azure.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.location.href.includes('backlog')) return;

    // Create floating panel
    const totalsPanel = document.createElement('div');
    totalsPanel.id = 'backlog-totals-panel';
    totalsPanel.style.position = 'fixed';
    totalsPanel.style.bottom = '30px';
    totalsPanel.style.right = '20px';
    totalsPanel.style.background = 'rgba(30, 30, 30, 0.7)';
    totalsPanel.style.color = '#fff';
    totalsPanel.style.padding = '14px 18px';
    totalsPanel.style.fontFamily = 'Segoe UI, sans-serif';
    totalsPanel.style.fontSize = '14px';
    totalsPanel.style.fontWeight = 'bold';
    totalsPanel.style.borderRadius = '10px';
    totalsPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.4)';
    totalsPanel.style.zIndex = '9999';
    totalsPanel.style.lineHeight = '1.6';
    totalsPanel.style.maxWidth = '300px';

    // Content wrapper for totals
    const totalsContent = document.createElement('div');
    totalsContent.id = 'backlog-totals-content';

    // Manual refresh button
    const refreshButton = document.createElement('button');
    refreshButton.textContent = '🔁 Update Totals';
    refreshButton.style.marginTop = '10px';
    refreshButton.style.background = '#0078d4';
    refreshButton.style.color = '#fff';
    refreshButton.style.border = 'none';
    refreshButton.style.padding = '6px 12px';
    refreshButton.style.borderRadius = '6px';
    refreshButton.style.cursor = 'pointer';
    refreshButton.style.fontWeight = 'normal';

    totalsPanel.appendChild(totalsContent);
    totalsPanel.appendChild(refreshButton);
    document.body.appendChild(totalsPanel);

    // Scroll through backlog to load all PBIs
    function scrollBacklogToBottom(callback) {
        const container = document.querySelector('.bolt-scrollable-content') || document.querySelector('.scroll.scroll-horizontal.scroll-auto');
        if (!container) return callback();

        let attempts = 0;
        const maxAttempts = 20;
        const interval = setInterval(() => {
            container.scrollBy(0, 2000);
            attempts++;

            const nearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 20;
            if (attempts >= maxAttempts || nearBottom) {
                clearInterval(interval);
                setTimeout(callback, 2000);
            }
        }, 400);
    }

    // Calculates totals from visible PBIs
    function calculateBacklogTotals() {
        let totalEffort = 0;
        let totalActuals = 0;

        const rows = document.querySelectorAll('[role="row"]');
        rows.forEach(row => {
            const cells = row.querySelectorAll('[role="gridcell"]');

            const actualsText = cells[5]?.innerText.trim();
            const effortText  = cells[6]?.innerText.trim();

            const actualsVal = parseFloat(actualsText);
            const effortVal  = parseFloat(effortText);

            if (!isNaN(actualsVal)) totalActuals += actualsVal;
            if (!isNaN(effortVal)) totalEffort += effortVal;
        });

        totalsContent.innerHTML = `
            <div>🔢 <strong>Total Effort:</strong> ${totalEffort}</div>
            <div>⏱️ <strong>Actuals To Date:</strong> ${totalActuals}</div>
        `;
    }

    // Refresh logic: scroll then calculate
    refreshButton.addEventListener('click', () => {
        totalsContent.innerHTML = `<div>⏳ Loading PBIs...</div>`;
        scrollBacklogToBottom(calculateBacklogTotals);
    });

    // First auto-run after page loads
    setTimeout(() => {
        scrollBacklogToBottom(calculateBacklogTotals);
    }, 4000);
})();
