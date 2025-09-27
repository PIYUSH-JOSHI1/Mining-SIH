/**
 * Process Input Form JavaScript
 */

let currentStep = 1;
const totalSteps = 4;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Process Input form initialized');
    
    // Initialize form
    updateStepDisplay();
    
    // Add form validation
    document.getElementById('processForm').addEventListener('submit', handleFormSubmit);
    
    // Add input change listeners for auto-validation
    addInputListeners();
});

function changeStep(direction) {
    const newStep = currentStep + direction;
    
    if (newStep < 1 || newStep > totalSteps) {
        return;
    }
    
    // Validate current step before proceeding
    if (direction > 0 && !validateCurrentStep()) {
        return;
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).style.display = 'none';
    
    // Update step
    currentStep = newStep;
    
    // Show new step
    document.getElementById(`step${currentStep}`).style.display = 'block';
    
    // Update display
    updateStepDisplay();
}

function updateStepDisplay() {
    // Update step indicator
    document.getElementById('currentStep').textContent = currentStep;
    
    // Update progress bar
    const progressPercent = (currentStep / totalSteps) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    nextBtn.style.display = currentStep < totalSteps ? 'block' : 'none';
    submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentStep() {
    const stepElement = document.getElementById(`step${currentStep}`);
    const requiredInputs = stepElement.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous errors
    LCAApp.utils.clearFormErrors();
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        }
    });
    
    if (!isValid) {
        LCAApp.utils.showNotification('Please fill in all required fields', 'warning');
    }
    
    return isValid;
}

function validateAllSteps() {
    let isValid = true;
    
    for (let step = 1; step <= totalSteps; step++) {
        const stepElement = document.getElementById(`step${step}`);
        const requiredInputs = stepElement.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('border-red-500');
                isValid = false;
            }
        });
    }
    
    return isValid;
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateAllSteps()) {
        LCAApp.utils.showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Collect form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
    submitBtn.disabled = true;
    
    // Submit to backend
    LCAApp.utils.apiCall('/submit-process', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.success) {
            LCAApp.utils.showNotification('LCA analysis completed successfully!', 'success');
            
            // Store results for other pages
            sessionStorage.setItem('lca_results', JSON.stringify(response));
            
            // Redirect to results page
            setTimeout(() => {
                window.location.href = '/lca-analysis';
            }, 1500);
        } else {
            throw new Error(response.error || 'Analysis failed');
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        LCAApp.utils.showNotification('Failed to process LCA analysis. Please try again.', 'error');
    })
    .finally(() => {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
        document.getElementById('processForm').reset();
        LCAApp.utils.clearFormErrors();
        
        // Reset to first step
        document.getElementById(`step${currentStep}`).style.display = 'none';
        currentStep = 1;
        document.getElementById(`step${currentStep}`).style.display = 'block';
        updateStepDisplay();
        
        // Clear saved data
        localStorage.removeItem('lca-form-processForm');
        
        LCAApp.utils.showNotification('Form cleared successfully', 'info');
    }
}

function saveAsDraft() {
    // Force save current form state
    LCAApp.events.saveFormData();
    LCAApp.utils.showNotification('Draft saved successfully', 'success');
}

function addInputListeners() {
    // Metal type change handler
    document.getElementById('metalType').addEventListener('change', function() {
        updateProcessTypeOptions(this.value);
        updateEnergyDefaults(this.value);
    });
    
    // Process type change handler
    document.getElementById('processType').addEventListener('change', function() {
        updateRecycledContentDefaults(this.value);
    });
    
    // Location change handler
    document.getElementById('location').addEventListener('change', function() {
        updateElectricitySourceDefaults(this.value);
    });
    
    // Production capacity change handler
    document.getElementById('productionCapacity').addEventListener('input', function() {
        updateScaleRecommendations(parseFloat(this.value));
    });
}

function updateProcessTypeOptions(metalType) {
    // This could be enhanced to show different process options based on metal type
    console.log(`Metal type changed to: ${metalType}`);
}

function updateEnergyDefaults(metalType) {
    const energyInput = document.getElementById('energyConsumption');
    
    // Set default energy consumption based on metal type
    const defaults = {
        'aluminium': 15000, // kWh/tonne for primary aluminium
        'copper': 2500,     // kWh/tonne for primary copper  
        'steel': 600,       // kWh/tonne for steel
        'zinc': 3200,       // kWh/tonne for zinc
        'lead': 1800        // kWh/tonne for lead
    };
    
    if (defaults[metalType] && !energyInput.value) {
        energyInput.placeholder = `e.g., ${defaults[metalType]} (typical for ${metalType})`;
    }
}

function updateRecycledContentDefaults(processType) {
    const recycledContentInput = document.getElementById('recycledContentInput');
    
    if (processType === 'secondary' && !recycledContentInput.value) {
        recycledContentInput.value = '95';
    } else if (processType === 'primary' && !recycledContentInput.value) {
        recycledContentInput.value = '0';
    } else if (processType === 'hybrid' && !recycledContentInput.value) {
        recycledContentInput.value = '30';
    }
}

function updateElectricitySourceDefaults(location) {
    // This could set regional electricity grid defaults
    console.log(`Location changed to: ${location}`);
}

function updateScaleRecommendations(capacity) {
    if (capacity > 100000) {
        console.log('Large scale operation - consider efficiency optimizations');
    } else if (capacity < 1000) {
        console.log('Small scale operation - focus on process optimization');
    }
}