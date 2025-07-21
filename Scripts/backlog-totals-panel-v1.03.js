// ==UserScript==
// @name         DevOps Backlog Totals Panel
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Calculates total Initial Estimate and Actuals To Date in Azure DevOps Backlog. Filters out PBIs with 0 Actuals and no Tags. Features floating panel, sticky-table auto-scroll, and manual refresh button.
// @author       Jorge Ramos
// @match        https://dev.azure.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Only run on the Backlog view
    if (!window.location.href.includes('/backlog')) return;

    // Create floating panel
    const totalsPanel = document.createElement('div');
    totalsPanel.id = 'backlog-totals-panel';
    Object.assign(totalsPanel.style, {
        position: 'fixed',
        bottom: '30px',
        right: '20px',
        background: 'rgba(30, 30, 30, 0.75)',
        color: '#fff',
        padding: '14px 18px',
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.4)',
        zIndex: '9999',
        lineHeight: '1.6',
        maxWidth: '320px'
    });

    const totalsContent = document.createElement('div');
    totalsContent.id = 'backlog-totals-content';

    const refreshButton = document.createElement('button');
    refreshButton.id = 'update-totals-btn';
    refreshButton.textContent = '🔁 Update Totals';
    Object.assign(refreshButton.style, {
        marginTop: '10px',
        background: '#0078d4',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'normal'
    });

    totalsPanel.appendChild(totalsContent);
    totalsPanel.appendChild(refreshButton);
    document.body.appendChild(totalsPanel);

    function scrollBacklogToBottom(callback) {
        const selectors = [
            '.sticky-table.full-height.bolt-table-container.flex-grow.v-scroll-auto',
            '.bolt-scrollable-content',
            '.grid-canvas',
            '.work-item-grid .grid-canvas',
            '.scroll.scroll-auto',
            null
        ];

        let container = null;
        let useWindow = false;
        for (const sel of selectors) {
            if (!sel) {
                useWindow = true;
                break;
            }
            const el = document.querySelector(sel);
            if (el && el.scrollHeight > el.clientHeight) {
                container = el;
                break;
            }
        }
        if (!container) container = window;

        let lastHeight = 0;
        let attempts = 0;
        const maxAttempts = 30;

        const interval = setInterval(() => {
            attempts++;
            const scrollTop  = useWindow ? window.scrollY : container.scrollTop;
            const clientH    = useWindow ? window.innerHeight : container.clientHeight;
            const scrollH    = useWindow
                               ? document.documentElement.scrollHeight
                               : container.scrollHeight;
            const atBottom   = scrollTop + clientH >= scrollH - 5;
            const noNewItems = scrollH === lastHeight;

            if (atBottom || noNewItems || attempts >= maxAttempts) {
                clearInterval(interval);
                return setTimeout(callback, 800);
            }

            lastHeight = scrollH;
            const scrollAmount = scrollH;
            if (useWindow) window.scrollBy(0, scrollAmount);
            else container.scrollBy(0, scrollAmount);
        }, 300);
    }

    function calculateBacklogTotals() {
        let totalEstimate = 0;
        let totalActuals = 0;

        document.querySelectorAll('[role="row"]').forEach(row => {
            const cells = row.querySelectorAll('[role="gridcell"]');
            const actualsVal = parseFloat(cells[5]?.innerText.trim()) || 0;
            const estimateVal = parseFloat(cells[6]?.innerText.trim()) || 0;
            const tagsText = cells[8]?.innerText.trim(); // Adjust index if needed
            const hasTags = !!tagsText;

            // Include only if Atuals ≠ 0 OR Tags exist
            const shouldInclude = !(actualsVal === 0 && !hasTags);

            if (shouldInclude) {
                totalActuals += actualsVal;
                totalEstimate += estimateVal;
            }
        });

        totalsContent.innerHTML = `
            <div>🔢 <strong>Initial Estimate (filtered):</strong> ${totalEstimate}</div>
            <div>⏱️ <strong>Actuals To Date (filtered):</strong> ${totalActuals}</div>
        `;
    }

    refreshButton.addEventListener('click', () => {
        totalsContent.innerHTML = `<div>⏳ Loading backlog items…</div>`;
        scrollBacklogToBottom(calculateBacklogTotals);
    });

    setTimeout(() => {
        scrollBacklogToBottom(calculateBacklogTotals);
    }, 4000);
})();