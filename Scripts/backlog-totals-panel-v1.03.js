// ==UserScript==
// @name         DevOps Backlog Totals Panel
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Calculates total Initial Estimate and Actuals To Date in Azure DevOps Backlog. Dynamically detects columns, filters out PBIs with 0 Actuals and no Tags, auto-scrolls and offers manual refresh.
// @author       Jorge Ramos
// @match        https://dev.azure.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (!window.location.href.includes('/backlog')) return;

    //–– create the floating panel
    const panel = document.createElement('div');
    panel.id = 'backlog-totals-panel';
    Object.assign(panel.style, {
        position:   'fixed',
        bottom:     '30px',
        right:      '20px',
        background: 'rgba(30,30,30,0.75)',
        color:      '#fff',
        padding:    '14px 18px',
        fontFamily: 'Segoe UI, sans-serif',
        fontSize:   '14px',
        fontWeight: 'bold',
        borderRadius:'10px',
        boxShadow:  '0 0 10px rgba(0,0,0,0.4)',
        zIndex:     '9999',
        lineHeight: '1.6',
        maxWidth:   '320px'
    });
    const content = document.createElement('div');
    content.id = 'backlog-totals-content';
    const btn = document.createElement('button');
    btn.textContent = '🔁 Update Totals';
    Object.assign(btn.style, {
        marginTop: '10px',
        background:'#0078d4',
        color:     '#fff',
        border:    'none',
        padding:   '6px 12px',
        borderRadius:'6px',
        cursor:    'pointer',
        fontWeight:'normal'
    });
    panel.append(content, btn);
    document.body.appendChild(panel);

    let colActuals   = 5;
    let colEstimate  = 6;
    let colTags      = 8;

    //–– detect columns by header text
    function detectColumns() {
        const headers = document.querySelectorAll('[role="columnheader"]');
        headers.forEach((h, i) => {
            const txt = h.innerText.trim().toLowerCase();
            if (txt === 'atuals to date')    colActuals  = i;
            if (txt === 'initial estimate')  colEstimate = i;
            if (txt === 'tags')              colTags     = i;
        });
    }

    //–– robust scroll to bottom of backlog
    function scrollToEnd(callback) {
        const sels = [
          '.sticky-table.full-height.bolt-table-container.flex-grow.v-scroll-auto',
          '.bolt-scrollable-content',
          '.grid-canvas',
          '.work-item-grid .grid-canvas',
          '.scroll.scroll-auto',
          null
        ];
        let container = null, useWin = false;
        for (const sel of sels) {
            if (!sel) { useWin = true; break; }
            const el = document.querySelector(sel);
            if (el && el.scrollHeight > el.clientHeight) {
                container = el; break;
            }
        }
        if (!container) container = window;

        let lastH = 0, tries = 0, max = 30;
        const iv = setInterval(() => {
            tries++;
            const scrollTop = useWin ? window.scrollY : container.scrollTop;
            const clientH   = useWin ? window.innerHeight : container.clientHeight;
            const scrollH   = useWin
                              ? document.documentElement.scrollHeight
                              : container.scrollHeight;
            const atBottom  = scrollTop + clientH >= scrollH - 5;
            const noChange  = scrollH === lastH;

            if (atBottom || noChange || tries >= max) {
                clearInterval(iv);
                return setTimeout(callback, 800);
            }
            lastH = scrollH;
            if (useWin) window.scrollBy(0, scrollH);
            else container.scrollBy(0, scrollH);
        }, 300);
    }

    //–– sum up only PBIs that have Actuals≠0 OR Tags≠empty
    function calculateTotals() {
        let totAct = 0, totEst = 0;
        const rows = document.querySelectorAll('[role="row"]');
        rows.forEach(r => {
            const cells = r.querySelectorAll('[role="gridcell"]');
            const act   = parseFloat(cells[colActuals]?.innerText.trim()) || 0;
            const est   = parseFloat(cells[colEstimate]?.innerText.trim())|| 0;
            const tags  = (cells[colTags]?.innerText.trim() || '');
            const keep  = !(act === 0 && !tags);
            if (keep) {
                totAct += act;
                totEst += est;
            }
        });
        content.innerHTML = `
          <div>🔢 <strong>Initial Estimate:</strong> ${totEst}</div>
          <div>⏱️ <strong>Atuals To Date:</strong> ${totAct}</div