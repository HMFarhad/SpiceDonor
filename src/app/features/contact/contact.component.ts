import { Component } from '@angular/core';
import { I18nService } from '@core/services';
import { isValidPhoneNumber } from './phone-validation';
import emailjs from '@emailjs/browser';

@Component({
  template: `
    <div class="page">
      <div class="section">
        <div class="container">
          <div class="row">
            <!-- Contact Information -->
            <div class="col-md-4">
              <div class="contact-info-card">
                <h2>{{ i18n.translate('visit_us') }}</h2>
                <app-visit-info></app-visit-info>
              </div>
            </div>
            
            <!-- Contact Form -->
            <div class="col-md-8">
              <div class="contact-form-card">
                <h2>{{ i18n.translate('contact_us_or_make_reservation') }}</h2>
                
                <!-- Success/Error Messages -->
                <div *ngIf="showSuccessMessage" class="alert alert-success" role="status">
                  <i class="fas fa-check-circle"></i>
                  {{ i18n.translate('success_message') }}
                </div>
                
                <div *ngIf="showErrorMessage" class="alert alert-danger" role="alert">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ i18n.translate('error_message') }}
                </div>
                
                <form id="contact-form" (submit)="onSubmit($event)">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="first_name">{{ i18n.translate('first_name') }} *</label>
                        <input type="text" id="first_name" name="first_name" autocomplete="given-name" class="form-control"
                               [placeholder]="i18n.translate('first_name_placeholder')" required>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="last_name">{{ i18n.translate('last_name') }} *</label>
                        <input type="text" id="last_name" name="last_name" autocomplete="family-name" class="form-control"
                               [placeholder]="i18n.translate('last_name_placeholder')" required>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="email">{{ i18n.translate('email_address') }} *</label>
                        <input type="email" id="email" name="email" autocomplete="email" class="form-control"
                               [placeholder]="i18n.translate('email_placeholder')" required>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="phone">{{ i18n.translate('phone_number') }}</label>
                        <input type="tel" id="phone" name="phone" autocomplete="tel" inputmode="tel" class="form-control"
                               [placeholder]="i18n.translate('phone_placeholder')"
                               (input)="validatePhoneNumber($event)" (blur)="validatePhoneNumber($event)"
                               [attr.aria-invalid]="phoneInvalid" [attr.aria-describedby]="phoneInvalid ? 'phone-error' : null">
                        <div *ngIf="phoneInvalid" id="phone-error" class="invalid-feedback" role="alert">
                          {{ i18n.translate('phone_invalid') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="contact_type">{{ i18n.translate('message') }} *</label>
                    <textarea id="contact_type" name="contact_type" class="form-control" rows="6"
                              [placeholder]="i18n.translate('message_placeholder')" required></textarea>
                  </div>

                  <p class="privacy-note">
                    {{ i18n.translate('contact_privacy_notice') }}
                    <a routerLink="/privacy">{{ i18n.translate('privacy_policy') }}</a>.
                  </p>
                  
                  <div class="form-actions">
                    <button type="submit" class="btn btn-primary btn-lg" [disabled]="isSubmitting">
                      <span *ngIf="isSubmitting">
                        <i class="fas fa-spinner fa-spin"></i> {{ i18n.translate('sending') }}
                      </span>
                      <span *ngIf="!isSubmitting">
                        <i class="fas fa-paper-plane"></i> {{ i18n.translate('send_message') }}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container > .row { display:grid; grid-template-columns:minmax(0,.85fr) minmax(0,1.5fr); gap:1.5rem; }
    form .row { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:0 1rem; }
    .col-md-4,.col-md-8,.col-md-6 { min-width:0; }
    @media(max-width:768px) {
      .container > .row, form .row { grid-template-columns:1fr; }
      .contact-info-card,.contact-form-card { padding:1.25rem !important; }
    }

    .page-header {
      background-image: var(--image-background-orange);
      background-size: cover;
      background-position: center;
      position: relative;
      color: var(--white);
      padding: 4rem 0;
      text-align: center;
    }
    
    .page-header::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.3);
      z-index: 1;
    }
    
    .page-header .container {
      position: relative;
      z-index: 2;
    }
    
    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--white);
    }
    
    .contact-info-card, .contact-form-card {
      scroll-margin-top:150px;
      background-image: var(--image-background-black);
      background-size: cover;
      background-position: center;
      position: relative;
      border-radius: var(--radius-large);
      padding: 2rem;
      height: fit-content;
      border: 1px solid rgba(255, 107, 53, 0.2);
    }
    
    .contact-info-card::after, .contact-form-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(45, 45, 45, 0.9);
      z-index: 1;
      border-radius: var(--radius-large);
    }
    
    .contact-info-card > *, .contact-form-card > * {
      position: relative;
      z-index: 2;
    }
    
    .contact-info-card h2, .contact-form-card h2 {
      color: var(--text-special);
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    
    .info-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      gap: 1rem;
    }
    
    .info-item i {
      color: var(--primary-color);
      font-size: 1.2rem;
      margin-top: 0.2rem;
      min-width: 20px;
    }
    
    .info-item strong {
      color: var(--white);
      display: block;
      margin-bottom: 0.25rem;
    }
    
    .info-item p {
      color: var(--text-muted);
      margin: 0;
      line-height: 1.4;
    }
    
    .info-item a {
      color: var(--primary-color);
      text-decoration: none;
    }
    
    .info-item a:hover {
      color: var(--text-special);
      text-decoration: underline;
    }
    
    .hours-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .hours-list li {
      color: var(--text-muted);
      padding: 0.25rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .hours-list li:last-child {
      border-bottom: none;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      color: var(--white);
      font-weight: 500;
      margin-bottom: 0.5rem;
      display: block;
    }
    
    .form-control {
      width:100%;
      min-width:0;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-medium);
      color: var(--white);
      padding: 0.75rem 1rem;
      font-size: 1rem;
      transition: var(--transition);
    }
    
    .form-control:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: var(--primary-color);
      box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
      color: var(--white);
    }
    
    .form-control::placeholder {
      color: var(--text-muted);
    }
    
    .form-control option {
      background: var(--surface-color);
      color: var(--white);
    }
    
    .reservation-fields {
      background: rgba(255, 107, 53, 0.1);
      border-radius: var(--radius-medium);
      padding: 1.5rem;
      margin: 1.5rem 0;
      border: 1px solid rgba(255, 107, 53, 0.3);
    }
    
    .form-check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .form-check-input {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }
    
    .form-check-input:checked {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
    
    .form-check-label {
      color: var(--text-muted);
      margin: 0;
    }
    
    .form-actions {
      text-align: center;
      margin-top: 2rem;
    }

    .privacy-note {
      color: var(--text-muted);
      font-size: .875rem;
      line-height: 1.5;
      margin: 0;
    }

    .privacy-note a { color: var(--text-special); }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--primary-color) 0%, #e55a2b 100%);
      border: none;
      color: var(--white);
      padding: 0.75rem 2rem;
      font-size: 1.1rem;
      font-weight: 500;
      border-radius: var(--radius-medium);
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .btn-primary:hover {
      background: linear-gradient(135deg, #e55a2b 0%, var(--primary-color) 100%);
      transform: translateY(-1px);
      box-shadow: var(--shadow-medium);
    }
    
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .invalid-feedback {
      color: #ff6b6b;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }
    
    .form-control.ng-invalid.ng-touched {
      border-color: #ff6b6b;
    }
    
    .form-control.is-invalid {
      border-color: #ff6b6b;
      box-shadow: 0 0 0 0.2rem rgba(255, 107, 107, 0.25);
    }
    
    .form-control.is-valid {
      border-color: #28a745;
      box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
    }
    
    .alert {
      padding: 1rem 1.5rem;
      border-radius: var(--radius-medium);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .alert-success {
      background: rgba(40, 167, 69, 0.15);
      border: 1px solid rgba(40, 167, 69, 0.3);
      color: #28a745;
    }
    
    .alert-danger {
      background: rgba(220, 53, 69, 0.15);
      border: 1px solid rgba(220, 53, 69, 0.3);
      color: #dc3545;
    }
    
    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 2rem;
      }
      
      .contact-info-card, .contact-form-card {
      scroll-margin-top:150px;
        margin-bottom: 2rem;
      }
      
      .reservation-fields {
        padding: 1rem;
      }
      
      .btn-primary {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class ContactComponent {
  phoneInvalid = false;
  isSubmitting = false;
  showSuccessMessage = false;
  showErrorMessage = false;

  constructor(public i18n: I18nService) {
    // Initialize EmailJS
    emailjs.init('SwYGWuRATmlLhXvCL');
  }

  validatePhoneNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.phoneInvalid = !isValidPhoneNumber(input.value);
    input.setCustomValidity(this.phoneInvalid ? this.i18n.translate('phone_invalid') : '');
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    
    // Validate phone number if provided
    const form = event.target as HTMLFormElement;
    const phoneInput = form.querySelector('#phone') as HTMLInputElement;
    
    if (phoneInput && !isValidPhoneNumber(phoneInput.value)) {
      // Don't submit if phone number is invalid
      phoneInput.focus();
      return;
    }
    
    this.isSubmitting = true;
    this.showSuccessMessage = false;
    this.showErrorMessage = false;

    try {
      const formData = new FormData(form);
      
      const phone = String(formData.get('phone') || '').trim();
      const originalMessage = String(formData.get('contact_type') || '');
      // Build the outgoing payload without changing the editable message on failed attempts.
      await emailjs.send('service_5aorl74', 'template_9lm9mzo', {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone,
        contact_type: phone ? originalMessage + '\n\nPhone Number: ' + phone : originalMessage
      });

      this.showSuccessMessage = true;
      
      // Reset the form
      form.reset();
      this.phoneInvalid = false;
      
      // Scroll to top to show success message
      document.querySelector('.contact-form-card')?.scrollIntoView({ block: 'start' });

    } catch (error: any) {
      console.error('Error sending email:', error);
      this.showErrorMessage = true;
      document.querySelector('.contact-form-card')?.scrollIntoView({ block: 'start' });
      
      // Log specific error details
      if (error.status) {
        console.error('EmailJS Status:', error.status);
        console.error('EmailJS Text:', error.text);
      }
      
    } finally {
      this.isSubmitting = false;
    }
  }
}
