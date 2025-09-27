/**
 * LCA Analysis Results JavaScript
 */

let currentResults = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('LCA Analysis page initialized');
    
    // Load results from session storage or show no results state
    loadAnalysisResults();
});

function loadAnalysisResults() {
    // Try to get results from session storage
    const savedResults = sessionStorage.getItem('lca_results');
    
    if (savedResults) {
        try {
            currentResults = JSON.parse(savedResults);
            displayResults(currentResults);
        } catch (error) {
            console.error('Error parsing saved results:', error);
            showNoResultsState();
        }
    } else {
        showNoResultsState();
    }
}

function displayResults(data) {
    // Hide no results state
    document.getElementById('noResultsState').style.display = 'none';
    
    // Show results container
    document.getElementById('resultsContainer').style.display = 'block';
    
    // Populate results
    if (data.lca_results) {
        populateMetrics(data.lca_results);
        populateRecommendations(data.recommendations || []);
    }
    
    // Add animation
    document.getElementById('resultsContainer').classList.add('fade-in');
}

function populateMetrics(results) {
    // Overall scores
    document.getElementById('sustainabilityGrade').textContent = results.sustainability_grade || 'N/A';
    document.getElementById('circularityScore').textContent = LCAApp.utils.formatNumber(results.circularity_index, 1);
    
    // Calculate potential CO2 reduction (example calculation)
    const co2Reduction = calculatePotentialReduction(results.co2_footprint);
    document.getElementById('co2Reduction').textContent = co2Reduction;
    
    // Key metrics
    document.getElementById('co2Footprint').textContent = LCAApp.utils.formatNumber(results.co2_footprint, 1);
    document.getElementById('energyIntensity').textContent = LCAApp.utils.formatNumber(results.energy_intensity, 0);
    document.getElementById('waterFootprint').textContent = LCAApp.utils.formatNumber(results.water_footprint, 0);
    document.getElementById('recoveryPotential').textContent = LCAApp.utils.formatNumber(results.material_recovery_potential, 1);
    
    // Circularity metrics
    document.getElementById('materialRecoveryRate').textContent = LCAApp.utils.formatNumber(results.material_recovery_potential, 1) + '%';
    document.getElementById('recyclabilityScore').textContent = LCAApp.utils.formatNumber(results.recyclability_score, 1) + '%';
    
    // Calculate resource efficiency (example)
    const resourceEfficiency = (results.circularity_index + results.recyclability_score) / 2;
    document.getElementById('resourceEfficiency').textContent = LCAApp.utils.formatNumber(resourceEfficiency, 1) + '%';
    
    // Update progress bars
    updateProgressBars(results);
}

function populateRecommendations(recommendations) {
    const container = document.getElementById('recommendationsList');
    
    if (!recommendations || recommendations.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-info-circle text-2xl mb-2"></i>
                <p>No specific recommendations available for this analysis.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recommendations.map((rec, index) => `
        <div class="recommendation-card border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 ${getRecommendationIcon(rec.type).bg} rounded-lg flex items-center justify-center">
                        <i class="fas ${getRecommendationIcon(rec.type).icon} text-white"></i>
                    </div>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-sm font-semibold text-gray-900">${rec.type}</h4>
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadge(rec.implementation_difficulty)}">
                            ${rec.implementation_difficulty} Implementation
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-3">${rec.description}</p>
                    <div class="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <span class="text-gray-500">CO₂ Savings:</span>
                            <span class="font-medium text-green-600">${LCAApp.utils.formatNumber(rec.potential_savings_co2, 1)} tonnes</span>
                        </div>
                        <div>
                            <span class="text-gray-500">Cost Impact:</span>
                            <span class="font-medium text-blue-600">${rec.potential_savings_cost}</span>
                        </div>
                    </div>
                </div>
                <div class="flex-shrink-0">
                    <button onclick="applyRecommendation(${index})" class="btn-outline text-xs">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getRecommendationIcon(type) {
    const icons = {
        'Energy Efficiency': { icon: 'fa-bolt', bg: 'bg-yellow-500' },
        'Process Optimization': { icon: 'fa-cogs', bg: 'bg-blue-500' },
        'Circular Economy': { icon: 'fa-recycle', bg: 'bg-green-500' },
        'Logistics': { icon: 'fa-truck', bg: 'bg-purple-500' },
        'Material Selection': { icon: 'fa-cube', bg: 'bg-orange-500' }
    };
    return icons[type] || { icon: 'fa-lightbulb', bg: 'bg-gray-500' };
}

function getDifficultyBadge(difficulty) {
    const badges = {
        'Low': 'bg-green-100 text-green-800',
        'Medium': 'bg-yellow-100 text-yellow-800',
        'High': 'bg-red-100 text-red-800'
    };
    return badges[difficulty] || badges['Medium'];
}

function updateProgressBars(results) {
    // Update material recovery rate bar
    const recoveryBar = document.querySelector('#materialRecoveryRate').closest('div').querySelector('.progress-fill');
    if (recoveryBar) {
        recoveryBar.style.width = `${Math.min(100, results.material_recovery_potential || 0)}%`;
    }
    
    // Update recyclability score bar
    const recyclabilityBar = document.querySelector('#recyclabilityScore').closest('div').querySelector('.progress-fill');
    if (recyclabilityBar) {
        recyclabilityBar.style.width = `${Math.min(100, results.recyclability_score || 0)}%`;
    }
    
    // Update resource efficiency bar
    const resourceEfficiency = (results.circularity_index + results.recyclability_score) / 2;
    const efficiencyBar = document.querySelector('#resourceEfficiency').closest('div').querySelector('.progress-fill');
    if (efficiencyBar) {
        efficiencyBar.style.width = `${Math.min(100, resourceEfficiency || 0)}%`;
    }
}

function calculatePotentialReduction(currentFootprint) {
    // Simple calculation for potential reduction based on best practices
    const potentialReduction = Math.min(45, Math.max(15, currentFootprint * 0.3));
    return `-${potentialReduction.toFixed(0)}%`;
}

function showNoResultsState() {
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('noResultsState').style.display = 'block';
}

function exportResults() {
    if (!currentResults) {
        LCAApp.utils.showNotification('No results to export', 'warning');
        return;
    }
    
    // Create export data
    const exportData = {
        analysis_date: new Date().toISOString(),
        user_id: currentResults.user_id,
        lca_results: currentResults.lca_results,
        recommendations: currentResults.recommendations
    };
    
    // Convert to CSV format
    const csvContent = convertToCSV(exportData);
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `lca_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    LCAApp.utils.showNotification('Results exported successfully', 'success');
}

function convertToCSV(data) {
    const results = data.lca_results;
    
    let csv = 'Metric,Value,Unit\n';
    csv += `CO2 Footprint,${results.co2_footprint},tonnes CO2e\n`;
    csv += `Energy Intensity,${results.energy_intensity},kWh/tonne\n`;
    csv += `Water Footprint,${results.water_footprint},L/tonne\n`;
    csv += `Circularity Index,${results.circularity_index},%\n`;
    csv += `Material Recovery Potential,${results.material_recovery_potential},%\n`;
    csv += `Recyclability Score,${results.recyclability_score},%\n`;
    csv += `Environmental Impact Score,${results.environmental_impact_score},%\n`;
    csv += `Sustainability Grade,${results.sustainability_grade},-\n`;
    
    // Add recommendations
    if (data.recommendations && data.recommendations.length > 0) {
        csv += '\n\nRecommendations\n';
        csv += 'Type,Description,CO2 Savings (tonnes),Cost Impact,Implementation Difficulty\n';
        
        data.recommendations.forEach(rec => {
            csv += `"${rec.type}","${rec.description}",${rec.potential_savings_co2},"${rec.potential_savings_cost}",${rec.implementation_difficulty}\n`;
        });
    }
    
    return csv;
}

function startNewAnalysis() {
    // Clear current results
    sessionStorage.removeItem('lca_results');
    
    // Redirect to process input
    window.location.href = '/process-input';
}

function applyRecommendation(index) {
    if (!currentResults || !currentResults.recommendations || !currentResults.recommendations[index]) {
        LCAApp.utils.showNotification('Recommendation not found', 'error');
        return;
    }
    
    const recommendation = currentResults.recommendations[index];
    
    // Show implementation dialog
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Implementation Plan</h3>
            <div class="space-y-4">
                <div>
                    <h4 class="font-medium text-gray-900">${recommendation.type}</h4>
                    <p class="text-sm text-gray-600 mt-1">${recommendation.description}</p>
                </div>
                <div class="bg-green-50 p-3 rounded">
                    <div class="text-sm">
                        <div class="font-medium text-green-800">Expected Benefits:</div>
                        <div class="text-green-700 mt-1">
                            • CO₂ Reduction: ${recommendation.potential_savings_co2} tonnes<br>
                            • Cost Impact: ${recommendation.potential_savings_cost}<br>
                            • Implementation: ${recommendation.implementation_difficulty} complexity
                        </div>
                    </div>
                </div>
                <div class="flex justify-end space-x-3">
                    <button onclick="this.closest('.fixed').remove()" class="btn-outline">
                        Close
                    </button>
                    <button onclick="implementRecommendation(${index}); this.closest('.fixed').remove();" class="btn-primary">
                        Get Implementation Guide
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function implementRecommendation(index) {
    LCAApp.utils.showNotification('Implementation guide will be available in the Reports section', 'info');
    
    // In a real implementation, this would:
    // 1. Generate detailed implementation steps
    // 2. Create project timeline
    // 3. Estimate resources needed
    // 4. Provide monitoring metrics
}