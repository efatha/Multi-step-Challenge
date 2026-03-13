
    // State management
    let currentStep = 1;
    let isYearly = false;
    let formData = {
      name: '',
      email: '',
      phone: '',
      plan: 'arcade',
      addons: ['online', 'storage']
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
      attachEventListeners();
    });

    function attachEventListeners() {
      // Step 1 inputs with live validation
      document.getElementById('name').addEventListener('input', function(e) {
        formData.name = e.target.value;
        validateField('name');
      });
      
      document.getElementById('email').addEventListener('input', function(e) {
        formData.email = e.target.value;
        validateField('email');
      });
      
      document.getElementById('phone').addEventListener('input', function(e) {
        formData.phone = e.target.value;
        validateField('phone');
      });

      // Step 2 plan selection
      document.querySelectorAll('.plan-card').forEach(card => {
        card.addEventListener('click', function() {
          document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
          this.classList.add('selected');
          formData.plan = this.dataset.plan;
          updateSummary();
        });
      });

      // Step 2 billing toggle
      document.querySelector('.toggle-switch').addEventListener('click', toggleBilling);
      document.querySelectorAll('.toggle-option').forEach(option => {
        option.addEventListener('click', function() {
          isYearly = this.textContent === 'Yearly';
          updateBillingUI();
        });
      });

      // Step 3 add-ons
      document.querySelectorAll('.addon-card').forEach(card => {
        card.addEventListener('click', function(e) {
          if (e.target.type !== 'checkbox') {
            const checkbox = this.querySelector('.addon-checkbox');
            checkbox.checked = !checkbox.checked;
          }
          this.classList.toggle('selected', this.querySelector('.addon-checkbox').checked);
          updateAddonsState();
        });
      });

      // Addon checkboxes
      document.querySelectorAll('.addon-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const card = this.closest('.addon-card');
          card.classList.toggle('selected', this.checked);
          updateAddonsState();
        });
      });
    }

    function validateField(fieldId) {
      const field = document.getElementById(fieldId);
      const errorElement = document.getElementById(fieldId + 'Error');
      let isValid = true;
      let errorMessage = '';

      switch(fieldId) {
        case 'name':
          if (!field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
          }
          break;
        case 'email':
          if (!field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
          } else if (!isValidEmail(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
          }
          break;
        case 'phone':
          if (!field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
          }
          break;
      }

      field.classList.toggle('error', !isValid);
      errorElement.textContent = errorMessage;
      
      return isValid;
    }

    function validateStep1Live() {
      const nameValid = validateField('name');
      const emailValid = validateField('email');
      const phoneValid = validateField('phone');
      
      return nameValid && emailValid && phoneValid;
    }

    function toggleBilling() {
      isYearly = !isYearly;
      updateBillingUI();
    }

    function updateBillingUI() {
      // Update toggle switch
      document.querySelector('.toggle-switch').classList.toggle('yearly', isYearly);
      
      // Update toggle options
      document.querySelectorAll('.toggle-option').forEach((opt, index) => {
        opt.classList.toggle('active', (index === 0 && !isYearly) || (index === 1 && isYearly));
      });

      // Update plan prices
      document.querySelectorAll('.plan-card').forEach(card => {
        const monthly = card.dataset.priceMonthly;
        const yearly = card.dataset.priceYearly;
        const priceEl = card.querySelector('.plan-price');
        const freeEl = card.querySelector('.plan-free');
        
        if (isYearly) {
          priceEl.textContent = `$${yearly}/yr`;
          freeEl.style.display = 'block';
        } else {
          priceEl.textContent = `$${monthly}/mo`;
          freeEl.style.display = 'none';
        }
      });

      // Update add-on prices
      document.querySelectorAll('.addon-card').forEach(card => {
        const monthly = card.dataset.priceMonthly;
        const yearly = card.dataset.priceYearly;
        const priceEl = card.querySelector('.addon-price');
        priceEl.textContent = isYearly ? `+$${yearly}/yr` : `+$${monthly}/mo`;
      });

      updateSummary();
    }

    function updateAddonsState() {
      formData.addons = [];
      document.querySelectorAll('.addon-card').forEach(card => {
        if (card.querySelector('.addon-checkbox').checked) {
          formData.addons.push(card.dataset.addon);
        }
      });
      updateSummary();
    }

    function updateSummary() {
      const planCard = document.querySelector('.plan-card.selected');
      if (!planCard) return;

      const planName = planCard.querySelector('.plan-name').textContent;
      const planPrice = isYearly ? planCard.dataset.priceYearly : planCard.dataset.priceMonthly;
      document.getElementById('summaryPlanName').textContent = `${planName} (${isYearly ? 'Yearly' : 'Monthly'})`;
      document.getElementById('summaryPlanPrice').textContent = isYearly ? `$${planPrice}/yr` : `$${planPrice}/mo`;

      // Update addons in summary
      const summaryAddons = document.getElementById('summaryAddons');
      summaryAddons.innerHTML = '';
      let total = parseInt(planPrice);

      document.querySelectorAll('.addon-card').forEach(card => {
        if (card.querySelector('.addon-checkbox').checked) {
          const name = card.querySelector('.addon-name').textContent;
          const price = isYearly ? card.dataset.priceYearly : card.dataset.priceMonthly;
          total += parseInt(price);
          
          summaryAddons.innerHTML += `
            <div class="summary-addon">
              <span>${name}</span>
              <span class="summary-addon-price">+$${price}/${isYearly ? 'yr' : 'mo'}</span>
            </div>
          `;
        }
      });

      // Update total
      document.getElementById('summaryTotal').textContent = `+$${total}/${isYearly ? 'yr' : 'mo'}`;
      document.querySelector('.summary-total-label').textContent = `Total (per ${isYearly ? 'year' : 'month'})`;
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function nextStep() {
      if (currentStep === 1 && !validateStep1Live()) {
        // Show all validation errors
        validateField('name');
        validateField('email');
        validateField('phone');
        return;
      }
      
      if (currentStep < 5) {
        if (currentStep === 4) {
          currentStep = 5;
          updateNavigation();
        } else {
          currentStep++;
        }
        goToStep(currentStep);
      }
    }

    function goBack() {
      if (currentStep > 1) {
        currentStep--;
        goToStep(currentStep);
      }
    }

    function goToStep(step) {
      currentStep = step;
      
      // Hide all steps
      document.querySelectorAll('.step').forEach(s => s.classList.remove('active-step'));
      
      // Show current step
      document.getElementById(`step${step}`).classList.add('active-step');
      
      // Update sidebar numbers
      document.querySelectorAll('.step-number').forEach((num, index) => {
        num.classList.toggle('active', index + 1 === step);
      });

      updateNavigation();
      
      if (step === 4) updateSummary();
    }

    function updateNavigation() {
      const goBackBtn = document.getElementById('goBackBtn');
      const nextBtn = document.getElementById('nextStepBtn');
      const confirmBtn = document.getElementById('confirmBtn');

      if (currentStep === 1) {
        goBackBtn.style.visibility = 'hidden';
      } else {
        goBackBtn.style.visibility = 'visible';
      }

      if (currentStep === 4) {
        nextBtn.style.display = 'none';
        confirmBtn.style.display = 'block';
      } else if (currentStep === 5) {
        goBackBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        confirmBtn.style.display = 'none';
      } else {
        nextBtn.style.display = 'block';
        confirmBtn.style.display = 'none';
      }
    }

    function confirmSubscription() {
      currentStep = 5;
      goToStep(5);
    }

    function updateUI() {
      // Set initial values from formData
      document.getElementById('name').value = formData.name;
      document.getElementById('email').value = formData.email;
      
      // Initial validation for step 1
      validateStep1Live();
    }