(function() {
    'use strict';

    // ---------- Theme Toggle ----------
    var themeToggle = document.getElementById('themeToggle');
    var html = document.documentElement;

    function setTheme(theme) {
        html.setAttribute('data-bs-theme', theme);
        localStorage.setItem('pm-theme', theme);
        var icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }

    var savedTheme = localStorage.getItem('pm-theme') || 'light';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var current = html.getAttribute('data-bs-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // ---------- Toast Notifications ----------
    window.showToast = function(message, type) {
        type = type || 'info';
        var container = document.getElementById('toastContainer');
        if (!container) return;

        var iconMap = {
            success: 'bi-check-circle-fill',
            danger: 'bi-exclamation-triangle-fill',
            info: 'bi-info-circle-fill',
            warning: 'bi-exclamation-circle-fill'
        };

        var toast = document.createElement('div');
        toast.className = 'toast show align-items-center text-bg-' + type + ' border-0 mb-2';
        toast.setAttribute('role', 'alert');
        toast.innerHTML =
            '<div class="d-flex">' +
                '<div class="toast-body">' +
                    '<i class="bi ' + (iconMap[type] || iconMap.info) + ' me-2"></i>' +
                    message +
                '</div>' +
                '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>' +
            '</div>';

        container.appendChild(toast);

        setTimeout(function() {
            toast.style.transition = 'opacity .3s ease';
            toast.style.opacity = '0';
            setTimeout(function() { toast.remove(); }, 300);
        }, 4000);
    };

    // ---------- Product Search / Filter ----------
    var searchInput = document.getElementById('searchProducts');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            var rows = document.querySelectorAll('#productsTable tbody tr');

            rows.forEach(function(row) {
                var name = row.getAttribute('data-name') || '';
                row.style.display = name.indexOf(query) !== -1 ? '' : 'none';
            });

            var visible = document.querySelectorAll('#productsTable tbody tr:not([style*="display: none"])');
            var emptyMsg = document.getElementById('noSearchResults');

            if (visible.length === 0 && !emptyMsg) {
                var tbody = document.querySelector('#productsTable tbody');
                var tr = document.createElement('tr');
                tr.id = 'noSearchResults';
                tr.innerHTML = '<td colspan="6" class="text-center text-muted py-4">' +
                    '<i class="bi bi-search me-2"></i>No products match your search.</td>';
                tbody.appendChild(tr);
            } else if (visible.length > 0 && emptyMsg) {
                emptyMsg.remove();
            }
        });
    }

    // ---------- Table Sorting ----------
    var sortHeaders = document.querySelectorAll('.sortable');
    var sortState = { column: null, asc: true };

    sortHeaders.forEach(function(header) {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            var sortKey = this.getAttribute('data-sort');
            if (sortState.column === sortKey) {
                sortState.asc = !sortState.asc;
            } else {
                sortState.column = sortKey;
                sortState.asc = true;
            }

            sortHeaders.forEach(function(h) {
                h.querySelector('i').className = 'bi bi-arrow-down-up ms-1';
            });
            var icon = this.querySelector('i');
            icon.className = 'bi ms-1 ' + (sortState.asc ? 'bi-arrow-up' : 'bi-arrow-down');

            var tbody = document.querySelector('#productsTable tbody');
            if (!tbody) return;
            var rows = Array.from(tbody.querySelectorAll('tr:not(#noSearchResults)'));

            rows.sort(function(a, b) {
                var valA, valB;
                if (sortKey === 'name') {
                    valA = (a.getAttribute('data-name') || '');
                    valB = (b.getAttribute('data-name') || '');
                    return sortState.asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }
                if (sortKey === 'target') {
                    valA = parseFloat(a.getAttribute('data-target')) || 0;
                    valB = parseFloat(b.getAttribute('data-target')) || 0;
                } else {
                    valA = parseFloat(a.getAttribute('data-latest')) || 0;
                    valB = parseFloat(b.getAttribute('data-latest')) || 0;
                }
                return sortState.asc ? valA - valB : valB - valA;
            });

            rows.forEach(function(row) { tbody.appendChild(row); });
        });
    });

    // ---------- Export Button Feedback ----------
    var exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.showToast('Downloading CSV export...', 'success');
        });
    }

    // ---------- Animated Counter ----------
    function animateCounter(el, target) {
        var start = 0;
        var duration = 800;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(step);
        }

        if (target > 0) requestAnimationFrame(step);
    }

    document.querySelectorAll('.stat-card .fw-bold.fs-4').forEach(function(el) {
        var value = parseInt(el.textContent) || 0;
        if (value > 0) animateCounter(el, value);
    });

})();
