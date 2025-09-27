/**
 * Reports and Analytics JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Reports page initialized');
    
    // Load report history
    loadReportHistory();
});

function generateReport() {
    // Generic report generation
    showReportModal();
}

function generateExecutiveReport() {
    generateSpecificReport('executive', {
        title: 'Executive Summary Report',
        description: 'High-level sustainability overview for leadership',
        sections: ['executive_summary', 'key_metrics', 'recommendations', 'action_plan'],
        pages: '5-10',
        audience: 'Management & Stakeholders'
    });
}

function generateTechnicalReport() {
    generateSpecificReport('technical', {
        title: 'Technical Assessment Report',
        description: 'Detailed technical analysis with methodologies',
        sections: ['methodology', 'data_analysis', 'impact_assessment', 'technical_recommendations', 'appendices'],
        pages: '20-30',
        audience: 'Engineers & Analysts'
    });
}

function generateComplianceReport() {
    generateSpecificReport('compliance', {
        title: 'Regulatory Compliance Report',
        description: 'Assessment against Indian environmental regulations',
        sections: ['regulatory_framework', 'compliance_analysis', 'gap_assessment', 'remediation_plan'],
        pages: '15-20',
        audience: 'Regulatory Submissions'
    });
}

function generateCircularityReport() {
    generateSpecificReport('circularity', {
        title: 'Circularity Assessment Report',
        description: 'Circular economy opportunities and material flows',
        sections: ['circularity_metrics', 'material_flows', 'waste_analysis', 'circular_opportunities'],
        pages: '12-15',
        audience: 'Sustainability Teams'
    });
}

function generateBenchmarkReport() {
    generateSpecificReport('benchmark', {
        title: 'Industry Benchmark Report',
        description: 'Performance comparison with industry peers',
        sections: ['industry_overview', 'benchmark_analysis', 'performance_gaps', 'improvement_roadmap'],
        pages: '8-12',
        audience: 'Competitive Analysis'
    });
}

function generateSpecificReport(type, config) {
    // Show generation progress modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div class="text-center">
                <div class="w-16 h-16 bg-gov-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-file-pdf text-white text-2xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${config.title}</h3>
                <p class="text-gray-600 mb-6">${config.description}</p>
                
                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gray-500">Length:</span>
                            <span class="font-medium text-gray-900">${config.pages} pages</span>
                        </div>
                        <div>
                            <span class="text-gray-500">Audience:</span>
                            <span class="font-medium text-gray-900">${config.audience}</span>
                        </div>
                    </div>
                </div>
                
                <div id="generationProgress" class="mb-6">
                    <div class="flex items-center justify-center mb-4">
                        <div class="spinner mr-3"></div>
                        <span class="text-gray-600">Generating report...</span>
                    </div>
                    <div class="progress-bar">
                        <div id="progressBar" class="progress-fill" style="width: 0%"></div>
                    </div>
                    <div id="progressText" class="text-sm text-gray-500 mt-2">Initializing...</div>
                </div>
                
                <div id="generationComplete" class="hidden">
                    <div class="flex items-center justify-center text-green-600 mb-4">
                        <i class="fas fa-check-circle text-2xl mr-2"></i>
                        <span class="font-medium">Report generated successfully!</span>
                    </div>
                    <div class="flex justify-center space-x-3">
                        <button onclick="downloadGeneratedReport('${type}')" class="btn-primary">
                            <i class="fas fa-download mr-2"></i>Download PDF
                        </button>
                        <button onclick="this.closest('.fixed').remove()" class="btn-outline">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Simulate report generation process
    simulateReportGeneration(type, config);
}

function simulateReportGeneration(type, config) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    const steps = [
        'Collecting data...',
        'Analyzing environmental impacts...',
        'Calculating circularity metrics...',
        'Generating charts and visualizations...',
        'Compiling recommendations...',
        'Formatting report...',
        'Finalizing PDF...'
    ];
    
    let currentStep = 0;
    const totalSteps = steps.length;
    
    const interval = setInterval(() => {
        if (currentStep < totalSteps) {
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = steps[currentStep];
            currentStep++;
        } else {
            clearInterval(interval);
            
            // Show completion
            document.getElementById('generationProgress').classList.add('hidden');
            document.getElementById('generationComplete').classList.remove('hidden');
            
            // Add to history
            addToReportHistory(type, config.title);
        }
    }, 1000);
}

function createCustomReport() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Create Custom Report</h3>
            
            <form id="customReportForm" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="form-label">Report Title</label>
                        <input type="text" name="title" class="form-input" required placeholder="e.g., Q1 2024 Sustainability Report">
                    </div>
                    <div>
                        <label class="form-label">Target Audience</label>
                        <select name="audience" class="form-select" required>
                            <option value="">Select Audience</option>
                            <option value="executive">Executive Leadership</option>
                            <option value="technical">Technical Teams</option>
                            <option value="regulatory">Regulatory Bodies</option>
                            <option value="stakeholders">External Stakeholders</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <label class="form-label">Report Sections</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        <label class="flex items-center">
                            <input type="checkbox" name="sections" value="executive_summary" class="mr-3">
                            <span class="text-sm">Executive Summary</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="sections" value="methodology" class="mr-3">
                            <span class="text-sm">Methodology</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="sections" value="environmental_impact" class="mr-3">
                            <span class="text-sm">Environmental Impact</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="sections" value="circularity_analysis" class="mr-3">
                            <span class="text-sm">Circularity Analysis</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="sections" value="benchmark_comparison" class="mr-3">
                            <span class="text-sm">Benchmark Comparison</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="sections" value="recommendations" class="mr-3">
                            <span class="text-sm">Recommendations</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="sections" value="action_plan" class="mr-3">
                            <span class="text-sm">Action Plan</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="sections" value="data_appendix" class="mr-3">
                            <span class="text-sm">Data Appendix</span>
                        </label>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="form-label">Time Period</label>
                        <select name="timePeriod" class="form-select" required>
                            <option value="">Select Period</option>
                            <option value="current">Current Analysis</option>
                            <option value="last_month">Last Month</option>
                            <option value="last_quarter">Last Quarter</option>
                            <option value="last_year">Last Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                    <div>
                        <label class="form-label">Report Format</label>
                        <select name="format" class="form-select" required>
                            <option value="pdf">PDF Document</option>
                            <option value="excel">Excel Workbook</option>
                            <option value="both">Both PDF & Excel</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <label class="form-label">Additional Notes</label>
                    <textarea name="notes" class="form-input" rows="3" placeholder="Any specific requirements or focus areas..."></textarea>
                </div>
                
                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="this.closest('.fixed').remove()" class="btn-outline">
                        Cancel
                    </button>
                    <button type="submit" class="btn-primary">
                        Generate Custom Report
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    modal.querySelector('#customReportForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const reportConfig = {
            title: formData.get('title'),
            audience: formData.get('audience'),
            sections: formData.getAll('sections'),
            timePeriod: formData.get('timePeriod'),
            format: formData.get('format'),
            notes: formData.get('notes')
        };
        
        modal.remove();
        generateSpecificReport('custom', {
            title: reportConfig.title,
            description: 'Custom report with selected sections',
            pages: 'Variable',
            audience: reportConfig.audience
        });
    });
}

function exportData(format) {
    const exportUrl = `/api/export-data/all_data?format=${format}`;
    
    // Show loading notification
    LCAApp.utils.showNotification(`Preparing ${format.toUpperCase()} export...`, 'info');
    
    // Simulate export process
    setTimeout(() => {
        LCAApp.utils.downloadFile(exportUrl, `lca_data_export_${new Date().toISOString().split('T')[0]}.${format}`);
        LCAApp.utils.showNotification(`${format.toUpperCase()} export completed`, 'success');
    }, 2000);
}

function loadReportHistory() {
    // In a real implementation, this would fetch from API
    console.log('Report history loaded');
}

function addToReportHistory(type, title) {
    const tbody = document.getElementById('reportHistoryBody');
    const row = document.createElement('tr');
    
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
    const reportId = `${type}_${now.getTime()}`;
    
    row.innerHTML = `
        <td>
            <div class="flex items-center">
                <i class="fas fa-file-pdf text-red-500 mr-2"></i>
                <span class="font-medium">${title}</span>
            </div>
        </td>
        <td class="text-gray-600">${dateStr}</td>
        <td class="text-gray-600">${Math.random() > 0.5 ? '3.2' : '4.7'} MB</td>
        <td>
            <span class="status-badge-success">Completed</span>
        </td>
        <td>
            <div class="flex items-center space-x-2">
                <button onclick="downloadReport('${reportId}')" class="text-blue-600 hover:text-blue-800 text-sm">
                    <i class="fas fa-download mr-1"></i>Download
                </button>
                <button onclick="shareReport('${reportId}')" class="text-green-600 hover:text-green-800 text-sm">
                    <i class="fas fa-share mr-1"></i>Share
                </button>
            </div>
        </td>
    `;
    
    // Insert at the beginning
    tbody.insertBefore(row, tbody.firstChild);
}

function downloadGeneratedReport(type) {
    // Simulate download
    const filename = `${type}_report_${new Date().toISOString().split('T')[0]}.pdf`;
    LCAApp.utils.showNotification('Report downloaded successfully', 'success');
    
    // Close modal
    document.querySelector('.fixed').remove();
}

function downloadReport(reportId) {
    LCAApp.utils.showNotification('Downloading report...', 'info');
    // Simulate download delay
    setTimeout(() => {
        LCAApp.utils.showNotification('Report downloaded successfully', 'success');
    }, 1500);
}

function shareReport(reportId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Share Report</h3>
            <div class="space-y-4">
                <div>
                    <label class="form-label">Share with Email</label>
                    <input type="email" class="form-input" placeholder="colleague@example.com">
                </div>
                <div>
                    <label class="form-label">Message (Optional)</label>
                    <textarea class="form-input" rows="3" placeholder="Please find the attached LCA report..."></textarea>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" class="mr-2" checked>
                    <label class="text-sm text-gray-600">Include download link</label>
                </div>
                <div class="flex justify-end space-x-3">
                    <button onclick="this.closest('.fixed').remove()" class="btn-outline">Cancel</button>
                    <button onclick="sendReport(); this.closest('.fixed').remove();" class="btn-primary">Send Report</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function sendReport() {
    LCAApp.utils.showNotification('Report shared successfully', 'success');
}

function showApiDocumentation() {
    window.open('/api/docs', '_blank');
}

function generateApiKey() {
    const apiKey = 'lca_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">API Key Generated</h3>
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between">
                    <code class="text-sm font-mono text-gray-800">${apiKey}</code>
                    <button onclick="LCAApp.utils.copyToClipboard('${apiKey}')" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
            <p class="text-sm text-red-600 mb-4">
                <i class="fas fa-exclamation-triangle mr-1"></i>
                Please save this key securely. It will not be shown again.
            </p>
            <div class="flex justify-end">
                <button onclick="this.closest('.fixed').remove()" class="btn-primary">
                    I've Saved the Key
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function testConnection() {
    LCAApp.utils.showNotification('Testing API connection...', 'info');
    
    setTimeout(() => {
        LCAApp.utils.showNotification('API connection successful', 'success');
    }, 2000);
}

function setupSchedule() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Schedule Automated Reports</h3>
            <form class="space-y-4">
                <div>
                    <label class="form-label">Report Type</label>
                    <select class="form-select" required>
                        <option value="">Select Type</option>
                        <option value="executive">Executive Summary</option>
                        <option value="technical">Technical Assessment</option>
                        <option value="compliance">Compliance Report</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Frequency</label>
                    <select class="form-select" required>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Email Recipients</label>
                    <input type="email" class="form-input" placeholder="admin@company.com">
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="this.closest('.fixed').remove()" class="btn-outline">Cancel</button>
                    <button type="submit" onclick="saveSchedule(); this.closest('.fixed').remove();" class="btn-primary">Save Schedule</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function saveSchedule() {
    LCAApp.utils.showNotification('Report schedule saved successfully', 'success');
}

function viewScheduledReports() {
    LCAApp.utils.showNotification('No scheduled reports configured', 'info');
}

function emailSettings() {
    LCAApp.utils.showNotification('Email settings will be available in System Settings', 'info');
}

function refreshHistory() {
    loadReportHistory();
    LCAApp.utils.showNotification('Report history refreshed', 'info');
}

function cancelReport(reportId) {
    if (confirm('Are you sure you want to cancel this report generation?')) {
        LCAApp.utils.showNotification('Report generation cancelled', 'info');
        // Remove the processing row
        event.target.closest('tr').remove();
    }
}