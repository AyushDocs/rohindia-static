/**
 * Rohindia Group - Business Page Charts
 */

(function() {
    const ctx = document.getElementById('industriesChart');
    if (!ctx) return;

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['AI & Automation', 'ERP Systems', 'Café & Hospitality', 'Real Estate', 'Fashion & Lifestyle'],
            datasets: [{
                data: [30, 15, 20, 15, 20],
                backgroundColor: [
                    '#d4af37',
                    '#f1c40f',
                    '#ffffff',
                    '#888888',
                    '#aa8a22'
                ],
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#888',
                        font: {
                            family: 'Inter',
                            size: 14
                        }
                    }
                }
            }
        }
    });
})();
