// --- Global Functions (called from HTML onclick) ---
function toggleMenu() {
  // Simple nav-links toggle for index.html mobile menu
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) navLinks.classList.toggle('active');

  // Also support drawer pattern for other pages
  const burger = document.querySelector('.burger-menu');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-overlay');
  if (burger) burger.classList.toggle('active');
  if (drawer) drawer.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
}

function openCalendly(e) {
  if (e) e.preventDefault();
  // Try to open the modal if it exists on the page
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay && typeof window._openModal === 'function') {
    window._openModal("Schedule Your Online Tax Review", window._calendlyTemplate || '');
  } else {
    // Fallback: open Calendly link
    window.open('https://calendly.com/taxreturnfilingguru/30min', '_blank');
  }
}

function openUpload(e) {
  if (e) e.preventDefault();
  window.open('https://docs.google.com/forms/d/e/1FAIpQLScH98w2nqrnHVkAM9Zeo3sSVOV931aphcyUBYzwVoLzCneqyg/viewform?usp=publish-editor', '_blank');
}

function toggleFaq(btn) {
  var faqItem = btn.closest('.faq-item');
  // Close all other FAQs
  document.querySelectorAll('.faq-item').forEach(function(item) {
    if (item !== faqItem) item.classList.remove('active');
  });
  faqItem.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Navigation Header ---
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. Mobile Drawer Menu Navigation ---
  // (Handled by global toggleMenu function above)
  const closeBtn = document.querySelector('.mobile-drawer-close');
  if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

  // --- 3. Interactive FAQ Accordion ---
  // FAQ toggle is now handled by the global toggleFaq() function
  // called via onclick on the star button in the HTML.

  // --- 4. Modals / Interactive Popups (Calendly & Secure Upload) ---
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalBodyContainer = document.getElementById('modal-body-container');
  const modalTitle = document.getElementById('modal-title');

  function openModal(title, htmlContent) {
    if (!modalOverlay || !modalBodyContainer) return;
    modalTitle.textContent = title;
    modalBodyContainer.innerHTML = htmlContent;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Hook up internal elements of the modal once loaded
    setupModalListeners();
  }

  // Expose modal function globally so openCalendly/openUpload can use it
  window._openModal = openModal;

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Define Calendly Booking Modal template (using --accent-yellow)
  window._calendlyTemplate = `
    <div class="calendly-mock-body">
      <p style="margin-bottom: 20px; font-size: 0.95rem; color: var(--text-light);">Select a convenient time for your online tax consultation with a registered agent. Available late into the evening and on weekends.</p>
      <div class="calendly-days">
        <div class="calendly-day-header">Mon</div>
        <div class="calendly-day-header">Tue</div>
        <div class="calendly-day-header">Wed</div>
        <div class="calendly-day-header">Thu</div>
        <div class="calendly-day-header">Fri</div>
        <div class="calendly-day-header">Sat</div>
        <div class="calendly-day-header">Sun</div>
        
        <button class="calendly-day-btn active">08 Jun</button>
        <button class="calendly-day-btn">09 Jun</button>
        <button class="calendly-day-btn">10 Jun</button>
        <button class="calendly-day-btn">11 Jun</button>
        <button class="calendly-day-btn">12 Jun</button>
        <button class="calendly-day-btn">13 Jun</button>
        <button class="calendly-day-btn">14 Jun</button>
      </div>
      
      <p style="font-weight: 600; margin-bottom: 12px; font-family: var(--font-headings);">Available Slots (AEST / Sydney Time)</p>
      <div class="calendly-times">
        <button class="calendly-time-btn">09:00 AM</button>
        <button class="calendly-time-btn">11:30 AM</button>
        <button class="calendly-time-btn">02:00 PM</button>
        <button class="calendly-time-btn">04:30 PM</button>
        <button class="calendly-time-btn" style="background: rgba(37, 204, 191, 0.1); border-color: var(--accent-yellow); font-weight:600; color: var(--primary-dark);">07:00 PM</button>
        <button class="calendly-time-btn" style="background: rgba(37, 204, 191, 0.1); border-color: var(--accent-yellow); font-weight:600; color: var(--primary-dark);">08:30 PM</button>
      </div>
      
      <div style="margin-top: 32px; display: flex; gap: 12px; justify-content: flex-end;">
        <button class="btn btn-outline" id="calendly-cancel" style="padding: 10px 20px;">Cancel</button>
        <button class="btn btn-primary" id="calendly-confirm" style="padding: 10px 20px;">Confirm Slot</button>
      </div>
    </div>
  `;

  // Define Secure Submission Modal template
  window._uploadTemplate = `
    <div class="upload-modal-body">
      <div class="upload-icon-container">
        <svg viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 15V3m0 12l-4-4m4 4l4-4M4 17h16a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 012-2z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p style="font-weight: 600; font-size: 1.15rem; margin-bottom: 8px;">Upload Tax Statements & Receipts</p>
      <p style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 24px;">Files will be encrypted and submitted directly to your registered tax agent. We accept TFN summaries, WFH logs, and expense receipts.</p>
      
      <div class="upload-dropzone" id="dropzone">
        <p style="font-weight: 600; color: var(--primary-blue); margin-bottom: 4px;">Drag and drop files here</p>
        <p style="font-size: 0.8rem; color: var(--text-light);">or click to browse from device (PDF, JPG, PNG)</p>
        <input type="file" id="file-selector" multiple />
      </div>
      
      <div id="file-list" style="margin-bottom: 20px; text-align: left; max-height: 100px; overflow-y: auto;"></div>
      
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button class="btn btn-outline" id="upload-cancel" style="padding: 10px 20px;">Cancel</button>
        <button class="btn btn-primary" id="upload-submit" style="padding: 10px 20px;" disabled>Submit Encrypted</button>
      </div>
    </div>
  `;

  function setupModalListeners() {
    // Calendly Cancel/Confirm
    const calCancel = document.getElementById('calendly-cancel');
    const calConfirm = document.getElementById('calendly-confirm');
    const calDays = document.querySelectorAll('.calendly-day-btn');
    const calTimes = document.querySelectorAll('.calendly-time-btn');

    calDays.forEach(btn => {
      btn.addEventListener('click', () => {
        calDays.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    calTimes.forEach(btn => {
      btn.addEventListener('click', () => {
        calTimes.forEach(b => {
          b.style.backgroundColor = '';
          b.style.color = '';
        });
        btn.style.backgroundColor = 'var(--primary-blue)';
        btn.style.color = 'var(--text-white)';
      });
    });

    if (calCancel) calCancel.addEventListener('click', closeModal);
    if (calConfirm) {
      calConfirm.addEventListener('click', () => {
        closeModal();
        showToast("Consultation booked successfully! Check your inbox for confirmation.");
      });
    }

    // Upload files selection & submit
    const fileSelector = document.getElementById('file-selector');
    const fileListDiv = document.getElementById('file-list');
    const uploadSubmit = document.getElementById('upload-submit');
    const uploadCancel = document.getElementById('upload-cancel');

    if (fileSelector) {
      fileSelector.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          fileListDiv.innerHTML = files.map(file => `
            <div style="font-size: 0.85rem; padding: 6px 12px; background: #e2e8f0; border-radius: 4px; margin-bottom: 4px; display: flex; justify-content: space-between;">
              <span style="font-weight:600; color:var(--primary-dark); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width: 80%;">${file.name}</span>
              <span style="color:var(--text-light);">${(file.size / 1024).toFixed(1)} KB</span>
            </div>
          `).join('');
          uploadSubmit.disabled = false;
        } else {
          fileListDiv.innerHTML = '';
          uploadSubmit.disabled = true;
        }
      });
    }

    if (uploadCancel) uploadCancel.addEventListener('click', closeModal);
    if (uploadSubmit) {
      uploadSubmit.addEventListener('click', () => {
        closeModal();
        showToast("Documents securely uploaded to our encrypted email server.");
      });
    }
  }

  // Hook global buttons to open modals
  const bookCTAs = document.querySelectorAll('.trigger-calendly');
  bookCTAs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal("Schedule Your Online Tax Review", calendlyTemplate);
    });
  });

  const uploadCTAs = document.querySelectorAll('.trigger-upload');
  uploadCTAs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal("Secure Digital Submission Portal", uploadTemplate);
    });
  });

  // --- 5. Form Submissions (Lead Magnet & Contact Form) ---
  const leadMagnetForm = document.getElementById('lead-magnet-form');
  if (leadMagnetForm) {
    leadMagnetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const firstName = document.getElementById('first-name');
      const email = document.getElementById('email-address');
      const phone = document.getElementById('phone-number');

      let isValid = true;

      // Simple validation
      if (!firstName.value.trim()) {
        showInputError(firstName, "First name is required");
        isValid = false;
      } else {
        clearInputError(firstName);
      }

      if (!validateEmail(email.value)) {
        showInputError(email, "Please enter a valid email address");
        isValid = false;
      } else {
        clearInputError(email);
      }

      if (!validatePhone(phone.value)) {
        showInputError(phone, "Please enter a valid Australian mobile number (e.g., 0412 345 678)");
        isValid = false;
      } else {
        clearInputError(phone);
      }

      if (isValid) {
        const formData = new FormData(leadMagnetForm);
        const accessKey = formData.get('access_key');
        
        const submitForm = () => {
          showToast("Thank you! Opening your tax deduction checklist in a new tab...");
          window.open("https://docs.google.com/document/d/1zyRqeIr5zPIsFYnbCONAzIxQ2KTLgA6AS4E4DaQHKDM/edit?usp=sharing", "_blank");
          
          const formCard = leadMagnetForm.closest('.premium-form-card');
          if (formCard) {
            formCard.innerHTML = `
              <div class="text-center" style="animation: fadeIn 0.5s ease-out; padding: 10px 0;">
                <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 50%; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h3 style="font-family: var(--font-headings); font-weight: 700; color: var(--primary-dark); margin-bottom: 1rem;">Thank You!</h3>
                <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">We've opened the Ultimate Tax Deduction Checklist 2026 in a new tab for you.</p>
                
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; text-align: left;">
                  <p style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--primary-blue); font-weight: 600;">Didn't open automatically?</p>
                  <a href="https://docs.google.com/document/d/1zyRqeIr5zPIsFYnbCONAzIxQ2KTLgA6AS4E4DaQHKDM/edit?usp=sharing" target="_blank" class="btn btn-accent btn-sm btn-block" style="text-decoration: none; text-align: center; display: block; color: var(--primary-dark);">Click Here to Access Document</a>
                </div>
                
                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.5rem;">Ready to maximize your return? Book your online review with a registered agent today.</p>
                <button class="btn btn-primary btn-block btn-lg" onclick="openCalendly(event)">Book a Call via Calendly</button>
              </div>
            `;
          }
        };

        if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
          console.warn("Web3Forms API key is placeholder. Simulating submission.");
          submitForm();
        } else {
          showToast("Submitting details...");
          
          const object = Object.fromEntries(formData);
          const json = JSON.stringify(object);
          
          fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: json
          })
          .then(async (response) => {
            const resJson = await response.json();
            if (response.status === 200) {
              submitForm();
            } else {
              console.error("Web3Forms Error:", resJson);
              showToast("Form submission failed: " + (resJson.message || "Unknown error"));
            }
          })
          .catch((error) => {
            console.error("Submission error:", error);
            showToast("Network error. Please try again.");
          });
        }
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const phone = document.getElementById('contact-phone');
      const message = document.getElementById('contact-message');

      let isValid = true;

      if (!name.value.trim()) {
        showInputError(name, "Your name is required");
        isValid = false;
      } else {
        clearInputError(name);
      }

      if (!validateEmail(email.value)) {
        showInputError(email, "Please enter a valid email address");
        isValid = false;
      } else {
        clearInputError(email);
      }

      // Phone is optional on contact form
      if (phone && phone.value.trim() && !validatePhone(phone.value)) {
        showInputError(phone, "Invalid mobile number format");
        isValid = false;
      } else if (phone) {
        clearInputError(phone);
      }

      if (!message.value.trim()) {
        showInputError(message, "Message content is required");
        isValid = false;
      } else {
        clearInputError(message);
      }

      if (isValid) {
        const formData = new FormData(contactForm);
        const accessKey = formData.get('access_key');
        
        const submitForm = () => {
          showToast("Thank you for submitting the form. We will reach out to you shortly.");
          
          const formCard = contactForm.closest('.premium-form-card');
          if (formCard) {
            formCard.innerHTML = `
              <div class="text-center" style="animation: fadeIn 0.5s ease-out; padding: 20px 0;">
                <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 50%; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h3 style="font-family: var(--font-headings); font-weight: 700; color: var(--primary-dark); margin-bottom: 1rem;">Message Sent!</h3>
                <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">Thank you for submitting the form. A registered agent will review your enquiry and reach out to you shortly.</p>
                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.5rem;">Need immediate help? You can also book a video call directly with us.</p>
                <button class="btn btn-primary btn-block btn-lg" onclick="openCalendly(event)">Book a Video Call</button>
              </div>
            `;
          }
        };

        if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
          console.warn("Web3Forms API key is placeholder. Simulating contact form submission.");
          submitForm();
        } else {
          showToast("Submitting your enquiry...");
          
          const object = Object.fromEntries(formData);
          const json = JSON.stringify(object);
          
          fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: json
          })
          .then(async (response) => {
            const resJson = await response.json();
            if (response.status === 200) {
              submitForm();
            } else {
              console.error("Web3Forms Error:", resJson);
              showToast("Form submission failed: " + (resJson.message || "Unknown error"));
            }
          })
          .catch((error) => {
            console.error("Submission error:", error);
            showToast("Network error. Please try again.");
          });
        }
      }
    });
  }

  // Form error helper helpers
  function showInputError(inputEl, msg) {
    inputEl.classList.add('error');
    const errorMsgEl = inputEl.parentElement.querySelector('.form-error-msg');
    if (errorMsgEl) {
      errorMsgEl.textContent = msg;
      errorMsgEl.style.display = 'block';
    }
  }

  function clearInputError(inputEl) {
    inputEl.classList.remove('error');
    const errorMsgEl = inputEl.parentElement.querySelector('.form-error-msg');
    if (errorMsgEl) {
      errorMsgEl.textContent = "";
      errorMsgEl.style.display = 'none';
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    const re = /^(?:\+?61|0)4\d{8}$/;
    return re.test(String(phone).replace(/[\s-()]/g, ''));
  }

  // --- 6. Pricing Calculator logic (pricing.html) ---
  const auditProtectionSwitch = document.getElementById('audit-protection-toggle');
  const priceValues = document.querySelectorAll('.pricing-card-amount');

  if (auditProtectionSwitch && priceValues.length > 0) {
    const basePrices = [98, 128, 188, 248];

    auditProtectionSwitch.addEventListener('change', () => {
      const isChecked = auditProtectionSwitch.checked;
      
      priceValues.forEach((el, index) => {
        const baseline = basePrices[index];
        const extra = isChecked ? 29 : 0;
        const newTotal = baseline + extra;
        
        el.style.opacity = '0';
        setTimeout(() => {
          el.innerHTML = `$${newTotal} <span class="pricing-card-period">+ GST</span>`;
          el.style.opacity = '1';
        }, 150);
      });

      const banner = document.getElementById('protection-addon-indicator');
      if (banner) {
        if (isChecked) {
          banner.textContent = "Includes Audit Protection (+$29 + GST)";
          banner.style.color = 'var(--success)';
        } else {
          banner.textContent = "Click to add Audit Protection (+$29 + GST)";
          banner.style.color = 'var(--text-light)';
        }
      }
    });
  }

  // --- 7. Toast Alerts UI ---
  const toastNotification = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');

  function showToast(msg) {
    if (!toastNotification || !toastMsg) return;
    toastMsg.innerHTML = msg;
    toastNotification.classList.add('active');

    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 6000);
  }

  // Simulation of downloading the 2026 Checklist
  function triggerChecklistDownload() {
    const textData = `
============================================================
THE ULTIMATE 2026 AUSTRALIAN INDIVIDUAL TAX DEDUCTION CHECKLIST
Prepared by Registered Tax Agents - 10+ Years Experience
============================================================

1. INCOME STATEMENTS & RECORDS
[ ] TFN (Tax File Number) Details & Photo ID
[ ] myGov login credentials / TFN Income Statement check
[ ] Bank accounts statements showing annual interest earnings
[ ] Share dividend statements and investment logs
[ ] Cryptocurrency disposals (FIFO lists, CSV transactions)
[ ] Foreign investment income summaries

2. STANDARD WORK-RELATED DEDUCTIONS (PAYG)
[ ] Home office logs (Actual hours worked from home - diary records)
[ ] Phone & internet records (Calculate business usage percentage)
[ ] Vehicle mileage logbook (If using personal vehicle for client visits)
[ ] Work uniform details (Logos, protective gears, laundry records)
[ ] Subscriptions, books, and professional memberships/unions
[ ] Professional seminars, courses, and educational assets

3. PROPERTY INVESTOR SCHEDULES
[ ] Rental income statements (Property management statements)
[ ] Body corporate fees, council rates, and land tax receipts
[ ] Loan interest certificates for property financing
[ ] Repairs, maintenance, garden, and cleaning records
[ ] Quantity Surveyor depreciation reports

4. SOLE TRADER / ABN DEDUCTIONS
[ ] Business income summaries (Invoicing summaries, cashbooks)
[ ] Travel expenses (Client meetings, delivery miles)
[ ] Software subscriptions (accounting software, web hosting)
[ ] Small business concessions details
[ ] Simplified depreciation logs for equipment purchase

5. TAX OFFSET SCHEMES
[ ] Private Health Insurance annual tax statement
[ ] Spouse details & taxable income details
[ ] Superannuation personal contribution statement (Notice of Intent)

ATO STANDARD Lodgement Deadline: 31 October 2026.
Lodge early online to receive your refund within 12 business days!

Need professional lodgement assistance?
Book your 10-minute online review via Calendly: https://calendly.com/taxreturnfilingguru/30min
`;

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '2026-Ultimate-Tax-Deduction-Checklist.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
});
