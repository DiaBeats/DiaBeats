// DOM Elements
const form = document.getElementById('registrationForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePasswordBtn = document.getElementById('togglePassword');
const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
const strengthMeter = document.querySelector('.progress-bar');
const strengthText = document.querySelector('.password-strength-text span');
const passwordFeedback = document.getElementById('passwordFeedback');
const submitBtn = document.getElementById('submitBtn');
const specializationSelect = document.getElementById('specialization');
const otherSpecializationGroup = document.getElementById('otherSpecializationGroup');
const otherSpecializationInput = document.getElementById('otherSpecialization');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

// Initialize form when DOM is loaded
function initializeForm() {
    // Initialize phone input mask
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    // Toggle other specialization field
    if (specializationSelect && otherSpecializationGroup) {
        specializationSelect.addEventListener('change', function () {
            otherSpecializationGroup.style.display = this.value === 'Other' ? 'block' : 'none';
            if (this.value !== 'Other') {
                otherSpecializationInput.value = '';
                otherSpecializationInput.required = false;
            } else {
                otherSpecializationInput.required = true;
            }
        });
    }

    // Password input event
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            const strength = calculatePasswordStrength(this.value);
            updateStrengthMeter(strength);

            // Check password match
            if (confirmPasswordInput && confirmPasswordInput.value) {
                validatePasswordMatch();
            }
        });
    }

    // Confirm password input event
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }

    // Email validation
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
    }

    // Password toggle buttons
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function () {
            togglePasswordVisibility('password', 'togglePassword');
        });
    }

    if (toggleConfirmPasswordBtn) {
        toggleConfirmPasswordBtn.addEventListener('click', function () {
            togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword');
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize first step on page load
    const firstStep = document.getElementById('step1');
    if (firstStep) {
        firstStep.classList.remove('d-none');
    }
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
});

// Toggle password visibility
function togglePasswordVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);

    // Toggle icon
    const icon = button.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
}

// Password strength calculation
function calculatePasswordStrength(password) {
    let strength = 0;
    let feedback = [];

    // Length check
    if (password.length >= 12) strength += 2;
    else if (password.length >= 8) strength += 1;

    // Character type checks
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (hasLower && hasUpper) strength += 1;
    if (hasNumber) strength += 1;
    if (hasSpecial) strength += 1;

    // Generate feedback
    if (password.length < 8) {
        feedback.push('Make it at least 8 characters long');
    } else if (password.length < 12) {
        feedback.push('Consider making it 12+ characters');
    }

    if (!hasLower || !hasUpper) {
        feedback.push('Include both uppercase and lowercase letters');
    }

    if (!hasNumber) {
        feedback.push('Add numbers');
    }

    if (!hasSpecial) {
        feedback.push('Add special characters (e.g., !@#$%^&*)');
    }

    return { score: strength, feedback: feedback };
}

// Update password strength meter
function updateStrengthMeter(strength) {
    const percentages = [0, 20, 40, 60, 80, 100];
    const colors = ['danger', 'warning', 'info', 'primary', 'success'];
    const messages = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    const percentage = percentages[strength.score] || 0;
    const colorIdx = Math.min(Math.floor(strength.score / 2), 4);
    const color = colors[colorIdx] || 'danger';
    const message = strength.score > 0 ? messages[colorIdx] : 'Very Weak';

    strengthMeter.style.width = `${percentage}%`;
    strengthMeter.className = `progress-bar bg-${color}`;
    strengthText.textContent = message;
    strengthText.className = `text-${color}`;

    // Update feedback
    if (passwordInput.value.length > 0) {
        passwordFeedback.innerHTML = strength.feedback.length > 0
            ? strength.feedback.map(item => `<small class="d-block">• ${item}</small>`).join('')
            : '<small class="text-success">✓ Strong password</small>';
    } else {
        passwordFeedback.innerHTML = '';
    }
}

// Validate email format
function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailRegex.test(this.value)) {
        this.classList.add('is-invalid');
        const feedback = this.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = 'Please enter a valid email address';
            feedback.style.display = 'block';
        }
        return false;
    } else {
        this.classList.remove('is-invalid');
        const feedback = this.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.style.display = 'none';
        }
        return true;
    }
}

// Validate password match
function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const errorElement = document.getElementById('passwordMatchError');

    if (password && confirmPassword && password !== confirmPassword) {
        confirmPasswordInput.classList.add('is-invalid');
        if (errorElement) {
            errorElement.style.display = 'block';
        }
        return false;
    } else {
        confirmPasswordInput.classList.remove('is-invalid');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        return true;
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    // Reset previous errors
 document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
document.getElementById('step1').classList.add('active');

    let isValid = true;

    // Validate required fields in current step
    const currentStep = document.querySelector('.form-step:not(.d-none)');
    if (!currentStep) return;

    const requiredFields = currentStep.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        }

        // Special validation for email
        if (field.type === 'email' && field.value) {
            if (!validateEmail.call(field)) {
                isValid = false;
            }
        }
    });

    // Special validation for step 3 (password)
    if (currentStep.id === 'step3') {
        // Validate password strength
        const strength = calculatePasswordStrength(passwordInput.value);
        if (strength.score < 3) {
            passwordInput.classList.add('is-invalid');
            isValid = false;
        }

        // Validate password match
        if (!validatePasswordMatch()) {
            isValid = false;
        }

        // Validate terms checkbox
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            termsCheckbox.classList.add('is-invalid');
            isValid = false;
        }
    }

    if (!isValid) {
        // Scroll to first error
        const firstError = currentStep.querySelector('.is-invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }

    // If all validations pass, submit the form
    const submitBtn = document.getElementById('submitBtn');
    const spinner = submitBtn.querySelector('.spinner-border');
    const btnText = submitBtn.querySelector('.btn-text');

    // Show loading state
    submitBtn.disabled = true;
    spinner.classList.remove('d-none');
    btnText.textContent = 'Creating Account...';

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success message
        form.reset();
        form.classList.add('d-none');
        document.getElementById('successMessage').classList.remove('d-none');

        // Reset form state
        document.querySelector('.progress-bar').style.width = '0%';
        document.querySelector('.password-strength-text span').textContent = 'Weak';
        document.querySelector('.password-strength-text span').className = 'text-danger';
        document.querySelector('.progress-bar').className = 'progress-bar bg-danger';

    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration. Please try again.');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        spinner.classList.add('d-none');
        btnText.textContent = 'Create Account';
    }
}

// Form navigation functions
window.nextStep = function (currentStepNum) {
    // Validate current step before proceeding
    const currentStep = document.getElementById(`step${currentStepNum}`);
    const requiredFields = currentStep.querySelectorAll('[required]');
    let isValid = true;

    // Check all required fields in current step
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else if (field.type === 'email' && !validateEmail.call(field)) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });

    // Special validation for password match in step 3
    if (currentStepNum === 2) {
        if (!validatePasswordMatch()) {
            isValid = false;
        }
    }

    if (!isValid) {
        // Scroll to first error
        const firstError = currentStep.querySelector('.is-invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Hide current step and show next step
    currentStep.classList.remove('active'); // Replace: currentStep.classList.add('d-none');
    document.getElementById(`step${currentStepNum + 1}`).classList.add('active'); // Replace: .remove('d-none');

    // Update progress bar
    const progress = (currentStepNum / 3) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    document.querySelector('.progress-bar').setAttribute('aria-valuenow', progress);

    // Scroll to top of form
    document.querySelector('.auth-card').scrollIntoView({ behavior: 'smooth' });
}

window.prevStep = function (currentStepNum) {
    // Hide current step and show previous step
    document.getElementById(`step${currentStepNum}`).classList.remove('active');
    document.getElementById(`step${currentStepNum - 1}`).classList.add('active');

    // Update progress bar
    const progress = ((currentStepNum - 2) / 3) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    document.querySelector('.progress-bar').setAttribute('aria-valuenow', progress);

    // Scroll to top of form
    document.querySelector('.auth-card').scrollIntoView({ behavior: 'smooth' });
}

// Add real-time validation for email
if (document.getElementById('email')) {
    document.getElementById('email').addEventListener('input', function () {
        if (this.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
            this.classList.add('is-invalid');
            const feedback = document.getElementById('emailFeedback');
            if (feedback) {
                feedback.textContent = 'Please enter a valid email address';
                feedback.style.display = 'block';
            }
        } else {
            this.classList.remove('is-invalid');
            const feedback = document.getElementById('emailFeedback');
            if (feedback) {
                feedback.style.display = 'none';
            }
        }
    });
}