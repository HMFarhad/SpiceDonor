import { Component } from '@angular/core';
import { I18nService } from '@core/services';
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
                <div class="info-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <div>
                    <strong>{{ i18n.translate('address') }}</strong>
                    <p>Malminkaari 9<br>00700 Helsinki, Finland</p>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-phone"></i>
                  <div>
                    <strong>{{ i18n.translate('phone') }}</strong>
                    <p><a href="tel:+35891234567">+358 9 1234 5678</a></p>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-envelope"></i>
                  <div>
                    <strong>{{ i18n.translate('email') }}</strong>
                    <p><a href="mailto:info@spicedonor.fi">info&#64;spicedonor.fi</a></p>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="fas fa-clock"></i>
                  <div>
                    <strong>{{ i18n.translate('opening_hours_title') }}</strong>
                    <ul class="hours-list">
                      <li>{{ i18n.translate('monday_friday') }}</li>
                      <li>{{ i18n.translate('saturday') }}</li>
                      <li>{{ i18n.translate('sunday') }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Contact Form -->
            <div class="col-md-8">
              <div class="contact-form-card">
                <h2>{{ i18n.translate('contact_us_or_make_reservation') }}</h2>
                
                <!-- Success/Error Messages -->
                <div *ngIf="showSuccessMessage" class="alert alert-success">
                  <i class="fas fa-check-circle"></i>
                  {{ i18n.translate('success_message') }}
                </div>
                
                <div *ngIf="showErrorMessage" class="alert alert-danger">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ i18n.translate('error_message') }}
                </div>
                
                <form id="contact-form" (submit)="onSubmit($event)">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="first_name">{{ i18n.translate('first_name') }} *</label>
                        <input type="text" id="first_name" name="first_name" class="form-control" 
                               [placeholder]="i18n.translate('first_name_placeholder')" required>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="last_name">{{ i18n.translate('last_name') }} *</label>
                        <input type="text" id="last_name" name="last_name" class="form-control" 
                               [placeholder]="i18n.translate('last_name_placeholder')" required>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label for="email">{{ i18n.translate('email_address') }} *</label>
                        <input type="email" id="email" name="email" class="form-control" 
                               [placeholder]="i18n.translate('email_placeholder')" required>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="contact_type">{{ i18n.translate('message') }} *</label>
                    <textarea id="contact_type" name="contact_type" class="form-control" rows="6"
                              [placeholder]="i18n.translate('message_placeholder')" required></textarea>
                  </div>
                  
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
  isSubmitting = false;
  showSuccessMessage = false;
  showErrorMessage = false;

  constructor(public i18n: I18nService) {
    // Initialize EmailJS
    emailjs.init('SwYGWuRATmlLhXvCL');
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.showSuccessMessage = false;
    this.showErrorMessage = false;

    try {
      console.log('Sending email using EmailJS...');
      
      // Use the exact pattern from your working sample
      const result = await emailjs.sendForm(
        'service_5aorl74',  // Service ID
        'template_9lm9mzo', // Template ID  
        event.target as HTMLFormElement
      );
      
      console.log('Email sent successfully:', result);
      this.showSuccessMessage = true;
      
      // Reset the form
      (event.target as HTMLFormElement).reset();
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error: any) {
      console.error('Error sending email:', error);
      this.showErrorMessage = true;
      
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