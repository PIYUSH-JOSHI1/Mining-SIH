/**
 * Visualization Dashboard JavaScript
 */

let currentCharts = {};
let currentVisualizationType = 'sankey';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Visualization page initialized');
    
    // Initialize charts
    initializeCharts();
    
    // Load initial data
    loadVisualizationData();
});

function initializeCharts() {
    // Initialize main chart
    const mainCtx = document.getElementById('mainCanvas').getContext('2d');
    currentCharts.main = new Chart(mainCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Material Flow Analysis'
                },
                legend: {
                    position: 'top'
                }
            }
        }
    });
    
    // Initialize impact chart
    const impactCtx = document.getElementById('impactCanvas').getContext('2d');
    currentCharts.impact = new Chart(impactCtx, {
        type: 'doughnut',
        data: {
            labels: ['Raw Material Extraction', 'Processing', 'Transportation', 'End-of-Life'],
            datasets: [{
                data: [45, 35, 15, 5],
                backgroundColor: [
                    '#ef4444', // red
                    '#f97316', // orange
                    '#eab308', // yellow
                    '#22c55e'  // green
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Initialize circularity chart
    const circularityCtx = document.getElementById('circularityCanvas').getContext('2d');
    currentCharts.circularity = new Chart(circularityCtx, {
        type: 'radar',
        data: {
            labels: ['Material Recovery', 'Recyclability', 'Durability', 'Reusability', 'Resource Efficiency'],
            datasets: [{
                label: 'Current Process',
                data: [75, 82, 68, 45, 78],
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgb(59, 130, 246)',
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(59, 130, 246)'
            }, {
                label: 'Industry Benchmark',
                data: [65, 70, 75, 60, 68],
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: 'rgb(16, 185, 129)',
                pointBackgroundColor: 'rgb(16, 185, 129)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(16, 185, 129)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function loadVisualizationData() {
    // In a real implementation, this would fetch data from the API
    // For now, we'll use sample data
    updateMainChart();
}

function changeVisualization() {
    const select = document.getElementById('visualizationType');
    currentVisualizationType = select.value;
    
    updateMainChart();
    updateChartTitle();
}

function updateVisualization() {
    // Get filter values
    const metalType = document.getElementById('metalTypeFilter').value;
    const processType = document.getElementById('processTypeFilter').value;
    const metric = document.getElementById('metricFilter').value;
    const timeRange = document.getElementById('timeRange').value;
    
    console.log('Updating visualization with filters:', {
        metalType, processType, metric, timeRange
    });
    
    // Update charts based on filters
    updateMainChart();
    updateImpactChart(metalType, processType);
    updateCircularityChart(metalType, processType);
}

function updateMainChart() {
    const chart = currentCharts.main;
    
    switch (currentVisualizationType) {
        case 'sankey':
            updateSankeyChart(chart);
            break;
        case 'lifecycle':
            updateLifecycleChart(chart);
            break;
        case 'comparison':
            updateComparisonChart(chart);
            break;
        case 'trends':
            updateTrendChart(chart);
            break;
    }
}

function updateSankeyChart(chart) {
    // Simulate Sankey-like flow data using a horizontal bar chart
    chart.data.labels = ['Extraction', 'Processing', 'Manufacturing', 'Use Phase', 'End-of-Life'];
    chart.data.datasets = [{
        label: 'Material Flow (tonnes)',
        data: [1000, 850, 800, 750, 600],
        backgroundColor: [
            '#ef4444',
            '#f97316', 
            '#eab308',
            '#22c55e',
            '#3b82f6'
        ],
        borderWidth: 1
    }];
    
    chart.options.indexAxis = 'y';
    chart.update();
}

function updateLifecycleChart(chart) {
    chart.data.labels = ['Raw Materials', 'Manufacturing', 'Distribution', 'Use Phase', 'End-of-Life'];
    chart.data.datasets = [{
        label: 'CO₂ Emissions (kg CO₂e)',
        data: [5600, 4200, 800, 1200, 300],
        backgroundColor: '#ef4444',
        borderWidth: 1
    }, {
        label: 'Energy Consumption (MJ)',
        data: [75000, 45000, 3500, 8000, 2000],
        backgroundColor: '#f97316',
        borderWidth: 1
    }];
    
    chart.options.indexAxis = 'x';
    chart.update();
}

function updateComparisonChart(chart) {
    chart.data.labels = ['Current Process', 'Optimized Process', 'Best Practice'];
    chart.data.datasets = [{
        label: 'CO₂ Footprint',
        data: [12500, 8100, 6200],
        backgroundColor: '#ef4444'
    }, {
        label: 'Energy Consumption',
        data: [15000, 11200, 9500],
        backgroundColor: '#f97316'
    }, {
        label: 'Circularity Index',
        data: [65, 82, 90],
        backgroundColor: '#22c55e'
    }];
    
    chart.options.indexAxis = 'x';
    chart.update();
}

function updateTrendChart(chart) {
    chart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    chart.data.datasets = [{
        label: 'CO₂ Footprint Trend',
        data: [12500, 12200, 11800, 11200, 10800, 10500],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
    }, {
        label: 'Circularity Index Trend',
        data: [65, 68, 72, 75, 78, 80],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
    }];
    
    chart.type = 'line';
    chart.options.indexAxis = 'x';
    chart.update();
}

function updateImpactChart(metalType, processType) {
    // Update impact breakdown based on filters
    let data;
    
    if (processType === 'secondary') {
        data = [25, 45, 20, 10]; // Lower extraction impact for recycling
    } else {
        data = [45, 35, 15, 5]; // Default primary process
    }
    
    currentCharts.impact.data.datasets[0].data = data;
    currentCharts.impact.update();
}

function updateCircularityChart(metalType, processType) {
    // Update circularity metrics based on filters
    let currentData, benchmarkData;
    
    if (metalType === 'aluminium') {
        currentData = [85, 88, 70, 50, 82];
        benchmarkData = [75, 80, 78, 65, 75];
    } else if (metalType === 'copper') {
        currentData = [70, 85, 85, 60, 75];
        benchmarkData = [65, 78, 80, 55, 70];
    } else {
        currentData = [75, 82, 68, 45, 78];
        benchmarkData = [65, 70, 75, 60, 68];
    }
    
    currentCharts.circularity.data.datasets[0].data = currentData;
    currentCharts.circularity.data.datasets[1].data = benchmarkData;
    currentCharts.circularity.update();
}

function updateChartTitle() {
    const titles = {
        'sankey': 'Material Flow Analysis',
        'lifecycle': 'Life Cycle Impact Assessment', 
        'comparison': 'Process Scenario Comparison',
        'trends': 'Performance Trends Over Time'
    };
    
    document.getElementById('chartTitle').textContent = titles[currentVisualizationType];
}

function exportChart() {
    const canvas = document.getElementById('mainCanvas');
    const url = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = `lca_chart_${currentVisualizationType}_${new Date().toISOString().split('T')[0]}.png`;
    link.href = url;
    link.click();
    
    LCAApp.utils.showNotification('Chart exported successfully', 'success');
}

function toggleFullscreen() {
    const chartContainer = document.getElementById('primaryChart').closest('.bg-white');
    
    if (!document.fullscreenElement) {
        chartContainer.requestFullscreen().then(() => {
            chartContainer.classList.add('fixed', 'inset-0', 'z-50', 'p-8');
        }).catch(err => {
            console.log('Error attempting to enable full-screen:', err.message);
        });
    } else {
        document.exitFullscreen().then(() => {
            chartContainer.classList.remove('fixed', 'inset-0', 'z-50', 'p-8');
        });
    }
}

function addScenario() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Scenario</h3>
            <form id="scenarioForm" class="space-y-4">
                <div>
                    <label class="form-label">Scenario Name</label>
                    <input type="text" name="name" class="form-input" required placeholder="e.g., Green Energy Process">
                </div>
                <div>
                    <label class="form-label">Process Type</label>
                    <select name="processType" class="form-select" required>
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Expected CO₂ Reduction (%)</label>
                    <input type="number" name="co2Reduction" class="form-input" min="0" max="100" placeholder="25">
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="this.closest('.fixed').remove()" class="btn-outline">
                        Cancel
                    </button>
                    <button type="submit" class="btn-primary">
                        Add Scenario
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#scenarioForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const scenario = Object.fromEntries(formData);
        
        addScenarioToTable(scenario);
        modal.remove();
        LCAApp.utils.showNotification('Scenario added successfully', 'success');
    });
}

function addScenarioToTable(scenario) {
    const tbody = document.getElementById('scenarioTableBody');
    const row = document.createElement('tr');
    
    // Calculate estimated values based on scenario parameters
    const baseCO2 = 12500;
    const baseEnergy = 15000;
    const baseCircularity = 65;
    
    const co2Reduction = parseFloat(scenario.co2Reduction || 0) / 100;
    const newCO2 = Math.round(baseCO2 * (1 - co2Reduction));
    const newEnergy = Math.round(baseEnergy * (1 - co2Reduction * 0.8));
    const newCircularity = Math.round(baseCircularity * (1 + co2Reduction * 0.5));
    
    row.innerHTML = `
        <td class="font-medium">${scenario.name}</td>
        <td>${scenario.processType}</td>
        <td class="text-green-600">${LCAApp.utils.formatNumber(newCO2, 0)}</td>
        <td class="text-green-600">${LCAApp.utils.formatNumber(newEnergy, 0)}</td>
        <td class="text-green-600">${newCircularity}%</td>
        <td class="text-green-600">-₹${Math.round(co2Reduction * 50)}L/year</td>
        <td>
            <button class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
        </td>
    `;
    
    tbody.appendChild(row);
}

function compareScenarios() {
    const scenarios = Array.from(document.querySelectorAll('#scenarioTableBody tr')).map(row => {
        const cells = row.querySelectorAll('td');
        return {
            name: cells[0].textContent,
            processType: cells[1].textContent,
            co2: parseFloat(cells[2].textContent.replace(/,/g, '')),
            energy: parseFloat(cells[3].textContent.replace(/,/g, '')),
            circularity: parseFloat(cells[4].textContent.replace('%', ''))
        };
    });
    
    // Update main chart to show comparison
    document.getElementById('visualizationType').value = 'comparison';
    changeVisualization();
    
    LCAApp.utils.showNotification('Scenario comparison updated', 'info');
}