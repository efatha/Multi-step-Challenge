// State management
let currentStep = 1;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Show first step
  showStep(1);
  
  // Add click listeners to buttons
  document.getElementById('nextStepBtn').addEventListener('click', nextStep);
  document.getElementById('goBackBtn').addEventListener('click', prevStep);
});

// Function to show a specific step
function showStep(step) {
  // Hide all steps
  document.querySelectorAll('.step').forEach(s => {
    s.classList.remove('active-step');
  });
  
  // Show current step
  document.getElementById(`step${step}`).classList.add('active-step');
  
  // Update sidebar numbers
  document.querySelectorAll('.step-number').forEach((num, index) => {
    if (index + 1 === step) {
      num.classList.add('active');
    } else {
      num.classList.remove('active');
    }
  });
  
  // Hide Go Back button on first step
  const goBackBtn = document.getElementById('goBackBtn');
  if (step === 1) {
    goBackBtn.style.visibility = 'hidden';
  } else {
    goBackBtn.style.visibility = 'visible';
  }
}

// Go to next step
function nextStep() {
  if (currentStep < 5) {
    currentStep++;
    showStep(currentStep);
  }
}

// Go to previous step
function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}