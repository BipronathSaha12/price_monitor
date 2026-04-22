function renderChart(data) {
    var canvas = document.getElementById('priceChart');
    if (!canvas) return;

    var colors = [
        { border: '#4f46e5', bg: 'rgba(79,70,229,.1)' },
        { border: '#7c3aed', bg: 'rgba(124,58,237,.1)' },
        { border: '#06b6d4', bg: 'rgba(6,182,212,.1)' },
        { border: '#10b981', bg: 'rgba(16,185,129,.1)' },
        { border: '#f59e0b', bg: 'rgba(245,158,11,.1)' },
        { border: '#ef4444', bg: 'rgba(239,68,68,.1)' },
        { border: '#ec4899', bg: 'rgba(236,72,153,.1)' },
        { border: '#8b5cf6', bg: 'rgba(139,92,246,.1)' },
    ];

    var datasets = [];
    var allLabels = new Set();
    var colorIndex = 0;

    for (var product in data) {
        if (!data.hasOwnProperty(product)) continue;
        var entries = data[product];
        var color = colors[colorIndex % colors.length];

        entries.forEach(function(item) {
            allLabels.add(item.time);
        });

        datasets.push({
            label: product,
            data: entries.map(function(x) { return x.price; }),
            borderColor: color.border,
            backgroundColor: color.bg,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: color.border,
            fill: true,
            tension: 0.3,
        });

        colorIndex++;
    }

    var labels = Array.from(allLabels);

    var isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    var gridColor = isDark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.06)';
    var textColor = isDark ? '#94a3b8' : '#64748b';

    var chartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        color: textColor,
                        font: { size: 13, weight: '500' },
                    },
                },
                tooltip: {
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    titleColor: isDark ? '#e2e8f0' : '#1e293b',
                    bodyColor: isDark ? '#94a3b8' : '#64748b',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(ctx) {
                            return ' ' + ctx.dataset.label + ': $' + ctx.parsed.y.toFixed(2);
                        },
                    },
                },
            },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { size: 12 } },
                },
                y: {
                    grid: { color: gridColor },
                    ticks: {
                        color: textColor,
                        font: { size: 12 },
                        callback: function(value) { return '$' + value; },
                    },
                },
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart',
            },
        },
    });

    // Chart type switcher
    var chartTypeGroup = document.getElementById('chartTypeGroup');
    if (chartTypeGroup) {
        chartTypeGroup.addEventListener('click', function(e) {
            var btn = e.target.closest('[data-chart-type]');
            if (!btn) return;

            chartTypeGroup.querySelectorAll('.btn').forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            var newType = btn.getAttribute('data-chart-type');
            chartInstance.config.type = newType;

            chartInstance.data.datasets.forEach(function(ds) {
                ds.fill = newType === 'line';
                ds.tension = newType === 'line' ? 0.3 : 0;
            });

            chartInstance.update();
        });
    }
}
