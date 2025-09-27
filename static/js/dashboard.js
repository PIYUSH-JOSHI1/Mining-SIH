/**
 * Dashboard specific JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized');
    
    // Load dashboard analytics
    loadAnalytics();
    
    // Refresh data every 30 seconds
    setInterval(loadAnalytics, 30000);
});

function loadAnalytics() {
    LCAApp.utils.apiCall('/get-analytics')
        .then(data => {
            updateMetrics(data);
            updateCharts(data);
        })
        .catch(error => {
            console.error('Error loading analytics:', error);
            LCAApp.utils.showNotification('Failed to load dashboard data', 'error');
        });
}

function updateMetrics(data) {
    // Update metric cards
    const totalAssessments = document.getElementById('totalAssessments');
    const avgCircularity = document.getElementById('avgCircularity');
    const avgCO2 = document.getElementById('avgCO2');
    
    if (totalAssessments) {
        totalAssessments.textContent = data.total_assessments || '0';
    }
    
    if (avgCircularity) {
        avgCircularity.textContent = data.avg_circularity_index || '0.0';
    }
    
    if (avgCO2) {
        avgCO2.textContent = LCAApp.utils.formatNumber(data.avg_co2_footprint, 1) || '0.0';
    }
}

function updateCharts(data) {
    // Update metal distribution chart
    const metalDistribution = document.getElementById('metalDistribution');
    if (metalDistribution && data.metal_distribution) {
        updateMetalDistribution(data.metal_distribution);
    }
}

function updateMetalDistribution(distribution) {
    const container = document.getElementById('metalDistribution');
    if (!container) return;
    
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm">No data available</p>';
        return;
    }
    
    const colors = {
        'aluminium': 'bg-gov-blue',
        'copper': 'bg-gov-green', 
        'steel': 'bg-gov-orange',
        'other': 'bg-gray-400'
    };
    
    let html = '';
    Object.entries(distribution).forEach(([metal, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        const colorClass = colors[metal.toLowerCase()] || colors.other;
        
        html += `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="w-3 h-3 ${colorClass} rounded-full mr-3"></div>
                    <span class="text-sm text-gray-600 capitalize">${metal}</span>
                </div>
                <span class="text-sm font-medium text-gray-900">${percentage}%</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
}