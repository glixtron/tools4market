// Tools4Market — runtime logic: Marketing calculators (all local, no fetch)
(function () {
  'use strict';
  var T = window.T4M_TOOLS = window.T4M_TOOLS || {};
  var TXT = window.T4M_ISTR || {};
  var TOOLTXT = TXT.tools || {};

  function $(root, id) { return root.querySelector('#' + id); }

  // {v} template fill — the copy itself lives in src/data/inspect.js (rules §3)
  function tpl(str, map) {
    var s = String(str);
    Object.keys(map).forEach(function (k) { s = s.split('{' + k + '}').join(map[k]); });
    return s;
  }

  // parse user input: commas stripped, invalid/absent -> 0
  function num(v) {
    var n = parseFloat(String(v == null ? '' : v).replace(/,/g, ''));
    return isFinite(n) ? n : 0;
  }

  function fmt(n) {
    if (!isFinite(n)) return '—';
    var abs = Math.abs(n);
    var dec = abs >= 100 ? 0 : abs >= 1 ? 2 : 4;
    return n.toLocaleString('en-US', { maximumFractionDigits: dec });
  }

  function money(n, c) { return c + fmt(n); }

  function set(out, verdict, body, verdictText) {
    out.textContent = body;
    verdict.textContent = verdictText || '';
  }

  function on(root, fn) {
    root.addEventListener('input', fn);
    root.addEventListener('change', fn);
  }

  // ---- visual helpers: KPI tiles, bar chart, verdict chip (rendered next to output) ----
  function kpiTile(label, value, delta, deltaDir, barPct) {
    var tile = document.createElement('div');
    tile.className = 'stat-tile';
    tile.innerHTML =
      '<span class="stat-tile-label">' + label + '</span>' +
      '<span class="stat-tile-value">' + value + '</span>' +
      (delta != null
        ? '<span class="stat-tile-delta ' + deltaDir + '">' +
            (deltaDir === 'flat' ? '' : (deltaDir === 'up' ? '▲ ' : '▼ ')) + delta + '</span>'
        : '') +
      (barPct != null
        ? '<div class="stat-tile-bar"><i style="width:' + Math.max(2, Math.min(100, barPct)) + '%"></i></div>'
        : '');
    return tile;
  }
  function barChart(title, sub, rows, opts) {
    opts = opts || {};
    var card = document.createElement('div');
    card.className = 'chart-card';
    var head = document.createElement('div');
    head.innerHTML = '<p class="chart-title">' + title + '</p>' +
      (sub ? '<p class="chart-sub">' + sub + '</p>' : '');
    card.appendChild(head);
    var chart = document.createElement('div');
    chart.className = 'bar-chart';
    var colors = opts.colors || [opts.color1 || 'var(--c-chart-1)', opts.color2 || 'var(--c-chart-3)'];
    rows.forEach(function (r, i) {
      var row = document.createElement('div');
      row.className = 'bar-row';
      var lbl = document.createElement('div');
      lbl.className = 'bar-label';
      lbl.textContent = r.label;
      var track = document.createElement('div');
      track.className = 'bar-track';
      var fill = document.createElement('div');
      fill.className = 'bar-fill';
      fill.style.width = '0%';
      fill.style.background = (Array.isArray(colors[i]) ? colors[i].join(',') : colors[i]);
      track.appendChild(fill);
      var val = document.createElement('div');
      val.className = 'bar-val';
      val.innerHTML = r.val + (r.unit ? ' <small>' + r.unit + '</small>' : '');
      row.appendChild(lbl); row.appendChild(track); row.appendChild(val);
      chart.appendChild(row);
      requestAnimationFrame(function () { fill.style.width = Math.max(2, Math.min(100, r.pct)) + '%'; });
    });
    card.appendChild(chart);
    return card;
  }

  // ---------------------------------------------------------- ROI calculator
  T['roi-calculator'] = function (root) {
    var C = TOOLTXT.roiCalc || {};
    var cur = $(root, 'roic-cur');
    var rev = $(root, 'roic-rev');
    var inv = $(root, 'roic-inv');
    var out = $(root, 'roic-out');
    var verdict = $(root, 'roic-verdict');
    function update() {
      var c = cur.value || '$';
      var r = num(rev.value), i = num(inv.value);
      if (!r && !i) { set(out, verdict, '', C.empty || ''); return; }
      var profit = r - i;
      var profitLine = (profit < 0 ? (C.negProfit || 'Net profit: {v}.') : (C.profit || 'Net profit: {v}'))
        .replace('{v}', money(profit, c));
      if (!i) {
        set(out, verdict, profitLine + '\n' + (C.invZero || 'Investment is zero — the ROI percentage is undefined; the full revenue counts as profit.'), '');
        return;
      }
      var pct = (profit / i) * 100;
      var mult = r / i;
      var roiLine = tpl(C.roi || 'ROI: {v}% ({m}× the investment back).', {
        v: fmt(pct), m: fmt(mult),
      });
      var tier = pct < 0 ? (C.vLoss || '')
        : pct < 10 ? (C.vThin || '')
        : pct < 25 ? (C.vSteady || '')
        : pct < 50 ? (C.vHealthy || '')
        : pct < 100 ? (C.vStrong || '')
        : (C.vExceptional || '');
      set(out, verdict, profitLine + '\n' + roiLine, tier + ' ' + (C.note || ''));

      // ---- visual: KPI tiles + bar chart alongside the text output ----
      var vis = $(root, 'roic-vis');
      if (vis) {
        var revBars = rev > 0 ? (inv > 0 ? Math.min(100, (rev / (inv * 4)) * 100) : 100) : 2;
        vis.innerHTML = '';
        vis.appendChild(kpiTile('Revenue', money(rev, c), profit >= 0 ? 'Profitable' : 'Loss', profit >= 0 ? 'up' : 'down', revBars));
        vis.appendChild(kpiTile('Net profit', money(profit, c), fmt(pct) + '% ROI', pct >= 0 ? (pct >= 25 ? 'up' : 'flat') : 'down', pct >= 0 ? Math.min(100, pct * 2) : 4));
        vis.appendChild(kpiTile('Spend multiple', fmt(mult) + '×', mult >= 1 ? 'Recovered' : 'Not yet', mult >= 1 ? 'up' : 'down', mult >= 1 ? Math.min(100, (mult - 0.5) * 60) : 4));
      }
    }
    on(root, update);
    update();
  };

  // ---------------------------------------------------------- ROAS calculator
  T['roas-calculator'] = function (root) {
    var C = TOOLTXT.roasCalc || {};
    var cur = $(root, 'roasc-cur');
    var spend = $(root, 'roasc-spend');
    var rev = $(root, 'roasc-rev');
    var margin = $(root, 'roasc-margin');
    var out = $(root, 'roasc-out');
    var verdict = $(root, 'roasc-verdict');
    function update() {
      var c = cur.value || '$';
      var s = num(spend.value), r = num(rev.value), m = num(margin.value);
      if (!s && !r) { set(out, verdict, '', C.empty || ''); return; }
      if (!s) { set(out, verdict, '', C.badSpend || 'Ad spend must be greater than zero — ROAS divides revenue by spend.'); return; }
      var roas = r / s;
      var roasLine = tpl(C.roas || 'ROAS: {v}× — {c}1 spent returned {c}{r} in revenue.', {
        v: fmt(roas), c: c, r: fmt(roas),
      });
      var body = roasLine;
      if (m > 0 && m <= 100) {
        var be = 1 / (m / 100);
        body += '\n' + tpl(C.beLine || 'Break-even ROAS: {v}× at a {m}% gross margin.', { v: fmt(be), m: fmt(m) });
        var tier = roas < be * 0.97 ? (C.vBelowBE || '')
          : roas <= be * 1.03 ? (C.vNearBE || '')
          : (C.vAboveBE || '');
        set(out, verdict, body, tier + ' ' + (C.note || ''));
      } else {
        var hint = !r ? (C.noRev || '') : '';
        set(out, verdict, body + (r ? '' : '\n' + (C.noRevLine || 'No revenue attributed — every unit spent returned nothing measurable.')),
          (hint ? '' : (C.marginHint || '')) + ' ' + (C.note || ''));
      }
    }
    on(root, update);
    update();
  };

  // ---------------------------------------------------------- CAC calculator
  T['cac-calculator'] = function (root) {
    var C = TOOLTXT.cacCalc || {};
    var cur = $(root, 'cacc-cur');
    var spend = $(root, 'cacc-spend');
    var cust = $(root, 'cacc-cust');
    var ltv = $(root, 'cacc-ltv');
    var out = $(root, 'cacc-out');
    var verdict = $(root, 'cacc-verdict');
    function update() {
      var c = cur.value || '$';
      var s = num(spend.value), n = num(cust.value), l = num(ltv.value);
      if (!s && !n && !l) { set(out, verdict, '', C.empty || ''); return; }
      if (!n) { set(out, verdict, '', C.badCust || 'New customers must be greater than zero — CAC divides spend by customers.'); return; }
      var cac = s / n;
      var body = tpl(C.cac || 'CAC: {c}{v} per new customer.', { c: c, v: fmt(cac) });
      if (l > 0 && cac > 0) {
        var ratio = l / cac;
        body += '\n' + tpl(C.ltvLine || 'LTV:CAC ratio: {v}×.', { v: fmt(ratio) });
        var tier = ratio < 1 ? (C.vUnsustainable || '')
          : ratio < 3 ? (C.vEarly || '')
          : ratio <= 5 ? (C.vHealthy || '')
          : (C.vStrong || '');
        set(out, verdict, body, tier + ' ' + (C.note || ''));
      } else {
        set(out, verdict, body, C.ltvHint || '');
      }

      var vis = $(root, 'cacc-vis');
      if (vis) {
        vis.innerHTML = '';
        vis.appendChild(kpiTile('CAC', money(cac, c) + ' / cust', l > 0 && cac > 0 ? fmt(ratio) + '× LTV:CAC' : '', l > 0 && cac > 0 ? (ratio >= 3 ? 'up' : ratio >= 1 ? 'flat' : 'down') : 'flat', l > 0 && cac > 0 && ratio > 0 ? Math.min(100, ratio / 5 * 100) : 4));
        if (l > 0 && cac > 0) {
          vis.appendChild(barChart('LTV:CAC ratio context', '1× = break-even, 3× is the healthy band', [
            { label: 'Your ratio', val: fmt(ratio) + '×', pct: Math.min(100, ratio / 5 * 100), color1: 'var(--c-chart-3)' },
            { label: '1× (break-even)', val: '1×', pct: 20, color1: 'var(--c-danger)' },
            { label: '3× (healthy)', val: '3×', pct: 60, color1: 'var(--c-warn)' },
            { label: '5× (strong)', val: '5×', pct: 100, color1: 'var(--c-success)' },
          ]));
        } else {
          vis.appendChild(barChart('Spend & customers', 'Inputs', [
            { label: 'Spend', val: money(s, c), pct: 40 },
            { label: 'New customers', val: String(n), pct: n > 0 ? Math.min(100, n / (s || 1) * 20) : 4 },
          ]));
        }
      }
    }
    on(root, update);
    update();
  };

  // ---------------------------------------------------------- ad metrics calculator
  T['ad-metrics-calculator'] = function (root) {
    var C = TOOLTXT.admCalc || {};
    var cur = $(root, 'amc-cur');
    var spend = $(root, 'amc-spend');
    var imp = $(root, 'amc-imp');
    var clicks = $(root, 'amc-clicks');
    var conv = $(root, 'amc-conv');
    var out = $(root, 'amc-out');
    var verdict = $(root, 'amc-verdict');
    function update() {
      var c = cur.value || '$';
      var s = num(spend.value), i = num(imp.value), k = num(clicks.value), v = num(conv.value);
      if (!s && !i && !k) { set(out, verdict, '', C.empty || ''); return; }
      if (!s) { set(out, verdict, '', C.spendFirst || 'Ad spend must be greater than zero — every rate below divides by spend.'); return; }
      var rows = [];
      if (k) rows.push(tpl(C.cpc || 'CPC: {c}{v} per click.', { c: c, v: fmt(s / k) }));
      if (i) rows.push(tpl(C.cpm || 'CPM: {c}{v} per 1,000 impressions.', { c: c, v: fmt((s / i) * 1000) }));
      if (i && k) rows.push(tpl(C.ctr || 'CTR: {v}% click-through rate.', { v: fmt((k / i) * 100) }));
      if (v) rows.push(tpl(C.cpa || 'CPA: {c}{v} per conversion.', { c: c, v: fmt(s / v) }));
      if (!rows.length) { set(out, verdict, '', C.spendOnly || 'Enter impressions, clicks or conversions — spend alone gives no rate.'); return; }
      var missing = [];
      if (!k && i) missing.push(C.cpcNeed || '');
      if (!i && k) missing.push(C.cpmNeed || '');
      if (!i || !k) missing.push(C.ctrNeed || '');
      if (!v) missing.push(C.zeroConv || C.cpaNeed || '');
      set(out, verdict, rows.join('\n'), (missing.join(' ').trim() ? 'Missing inputs: ' + missing.join(' ') : '') + ' ' + (C.note || ''));

      var vis = $(root, 'amc-vis');
      if (vis) {
        vis.innerHTML = '';
        var rows2 = [];
        if (k) rows2.push({ label: 'CPC', val: money(s / k, c), pct: Math.min(100, (s / k) / (i || 1) * 60) });
        if (i) rows2.push({ label: 'CPM', val: money((s / i) * 1000, c), pct: Math.min(100, ((s / i) * 1000) * 0.4) });
        if (i && k) rows2.push({ label: 'CTR', val: fmt((k / i) * 100) + '%', pct: Math.min(100, (k / i) * 10000) });
        if (v) rows2.push({ label: 'CPA', val: money(s / v, c), pct: Math.min(100, (s / v) * 4) });
        if (rows2.length) {
          vis.appendChild(barChart('Ad rates at a glance', 'The four ratios from four inputs', rows2));
        } else {
          vis.appendChild(barChart('Spend only', 'Add impressions, clicks or conversions to see the rates', [
            { label: 'Ad spend', val: money(s, c), pct: 30 },
          ]));
        }
      }
    }
    on(root, update);
    update();
  };

  // ---------------------------------------------------------- Email ROI calculator
  T['email-roi-calculator'] = function (root) {
    var C = TOOLTXT.emailRoi || {};
    var cur = $(root, 'erc-cur');
    var sent = $(root, 'erc-sent');
    var opened = $(root, 'erc-opened');
    var clicked = $(root, 'erc-clicked');
    var conv = $(root, 'erc-conv');
    var rev = $(root, 'erc-rev');
    var cost = $(root, 'erc-cost');
    var out = $(root, 'erc-out');
    var verdict = $(root, 'erc-verdict');
    function pct(n, d) { return d > 0 ? fmt(n / d * 100) + '%' : '—'; }
    function update() {
      var c = cur.value || '$';
      var s = num(sent.value), o = num(opened.value), k = num(clicked.value), cv = num(conv.value), r = num(rev.value), i = num(cost.value);
      if (!s && !r && !i) { set(out, verdict, '', C.empty || ''); return; }
      if (!s) { set(out, verdict, '', C.needSent || ''); return; }
      if (o > s) { set(out, verdict, '', C.impossibleOpens || ''); return; }
      if (k > s) { set(out, verdict, '', C.impossibleClicks || ''); return; }
      if (cv > k) { set(out, verdict, '', C.impossibleConv || ''); return; }
      var lines = [];
      lines.push(C.lblOpen + ' ' + pct(o, s));
      lines.push(C.lblClick + ' ' + pct(k, s));
      if (o) lines.push(C.lblCtor + ' ' + pct(k, o));
      if (k) lines.push(C.lblConvRate + ' ' + pct(cv, k));
      lines.push(C.lblRevPer + ' ' + money(r / s, c));
      var profit = r - i;
      lines.push((profit < 0 ? (C.negProfit || 'Net profit: {v}.') : (C.profit || 'Net profit: {v}')).replace('{v}', money(profit, c)));
      var vText = '';
      if (!i) {
        lines.push(C.costZero || '');
      } else {
        var roi = profit / i * 100;
        lines.push((C.roi || 'Email ROI: {v}% ({m}× the investment back).').replace('{v}', fmt(roi)).replace('{m}', fmt(r / i)));
        vText = roi < 0 ? (C.vNeg || '') : roi < 50 ? (C.vThin || '') : roi < 200 ? (C.vSteady || '') : (C.vStrong || '');
      }
      set(out, verdict, lines.filter(Boolean).join('\n'), vText);

      var vis = $(root, 'erc-vis');
      if (vis) {
        vis.innerHTML = '';
        var roi = i > 0 ? (profit / i * 100) : 0;
        vis.appendChild(kpiTile('Email ROI', roi ? fmt(roi) + '%' : '—', profit >= 0 ? 'Profitable' : 'Loss', profit >= 0 ? 'up' : 'down', i > 0 ? Math.min(100, roi * 1.5) : 4));
        if (s > 0) {
          vis.appendChild(barChart('Funnel', 'Open → Click → Convert (of ' + fmt(s) + ' sent)', [
            { label: 'Opened', val: pct(o, s), pct: Math.min(100, (o / s) * 100 * 6) },
            { label: 'Clicked', val: pct(k, s), pct: Math.min(100, (k / s) * 100 * 15) },
            { label: 'Converted', val: pct(cv, s), pct: Math.min(100, (cv / s) * 100 * 40) },
          ]));
        }
      }
    }
    on(root, update);
    update();
  };

  // ---------------------------------------------------------- Marketing budget calculator
  T['marketing-budget-calculator'] = function (root) {
    var C = TOOLTXT.budgetCalc || {};
    var cur = $(root, 'mbc-cur');
    var base = $(root, 'mbc-base');
    var rate = $(root, 'mbc-rate');
    var target = $(root, 'mbc-target');
    var cac = $(root, 'mbc-cac');
    var arpu = $(root, 'mbc-arpu');
    var out = $(root, 'mbc-out');
    var verdict = $(root, 'mbc-verdict');
    function update() {
      var c = cur.value || '$';
      var b = num(base.value), g = num(rate.value) / 100, t = num(target.value), cc = num(cac.value), a = num(arpu.value);
      if (!b && !t && !cc) { set(out, verdict, '', C.empty || ''); return; }
      if (!b) { set(out, verdict, '', C.needBase || ''); return; }
      if (t <= b) { set(out, verdict, C.lblNeeded + ' 0', C.already || ''); return; }
      var gap = t - b;
      var lines = [];
      lines.push(C.lblNeeded + ' ' + fmt(gap));
      var vText = '';
      if (!g) {
        lines.push(C.lblMonths + ' —');
        vText = C.noGrowth || '';
      } else {
        var months = Math.log(t / b) / Math.log(1 + g);
        lines.push(C.lblMonths + ' ' + fmt(months) + ' ' + (C.monthsUnit || ''));
        vText = months < 6 ? (C.vFast || '') : months < 12 ? (C.vSteady || '') : months < 24 ? (C.vLong || '') : (C.vDistant || '');
      }
      if (cc) {
        lines.push(C.lblBudget + ' ' + money(gap * cc, c));
        if (a) {
          lines.push(C.lblRevenue + ' ' + money(gap * a, c));
          lines.push(C.lblPayback + ' ' + fmt(cc / a) + ' ' + (C.monthsUnit || ''));
        }
      } else {
        lines.push(C.cacZero || '');
      }
      set(out, verdict, lines.filter(Boolean).join('\n'), vText);

      var vis = $(root, 'mbc-vis');
      if (vis) {
        vis.innerHTML = '';
        var gap = t - b;
        var gapPct = t > b ? Math.min(100, (gap / t) * 100) : 6;
        vis.appendChild(kpiTile('Target gap', fmt(gap) + ' customers', g > 0 ? fmt(Math.log(t / b) / Math.log(1 + g)) + ' months' : '—', g > 0 && months_calc() <= 12 ? 'up' : 'flat', gapPct));
        if (cc > 0) {
          vis.appendChild(kpiTile('Acquisition budget', money(gap * cc, c), cc + ' CAC', 'flat', 70));
        }
        vis.appendChild(barChart('Growth projection', 'Current base → target (compounding, where rate > 0)', [
          { label: 'Current base', val: fmt(b), pct: b > 0 ? Math.min(100, (b / t) * 100) : 8 },
          { label: 'Remaining gap', val: fmt(gap), pct: Math.min(100, gapPct), color1: 'var(--c-chart-2)' },
        ]));
      }
    }
    function months_calc() {
      return g > 0 ? Math.ceil(Math.log(t / b) / Math.log(1 + g)) : (t - b);
    }
    on(root, update);
    update();
  };
})();
