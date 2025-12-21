import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18nService } from '@core/services';
import emailjs from '@emailjs/browser';

@Component({
  template: `
    <div class="page">
      <div class="page-header">
        <div class="container">
          <h1>{{ i18n.translate('contact_page_title') }}</h1>
          <p class="text-muted">{{ i18n.translate('contact_page_subtitle') }}</p>
        </div>
      </div>
      
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
            
            <!-- Contact/Reservation Form -->
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
                
                <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" novalidate>
                  <!-- Contact Type Selection -->
                  <div class="form-group">
                    <label for="contactType">{{ i18n.translate('contact_type') }} *</label>
                    <select id="contactType" class="form-control" formControlName="contactType">
                      <option value="">{{ i18n.translate('contact_type_placeholder') }}</option>
                      <option value="reservation">{{ i18n.translate('contact_type_reservation') }}</option>
                      <option value="event">{{ i18n.translate('contact_type_event') }}</option>
                      <option value="feedback">{{ i18n.translate('contact_type_feedback') }}</option>
                      <option value="general">{{ i18n.translate('contact_type_general') }}</option>
                      <option value="other">{{ i18n.translate('contact_type_other') }}</option>
                    </select>
                    <div *ngIf="contactForm.get('contactType')?.invalid && contactForm.get('contactType')?.touched" 
                         class="invalid-feedback">
                      {{ i18n.translate('contact_type_required') }}
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="firstName">{{ i18n.translate('first_name') }} *</label>
                        <input type="text" id="firstName" class="form-control" 
                               formControlName="firstName" [placeholder]="i18n.translate('first_name_placeholder')">
                        <div *ngIf="contactForm.get('firstName')?.invalid && contactForm.get('firstName')?.touched" 
                             class="invalid-feedback">
                          {{ i18n.translate('first_name_required') }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="lastName">{{ i18n.translate('last_name') }} *</label>
                        <input type="text" id="lastName" class="form-control" 
                               formControlName="lastName" [placeholder]="i18n.translate('last_name_placeholder')">
                        <div *ngIf="contactForm.get('lastName')?.invalid && contactForm.get('lastName')?.touched" 
                             class="invalid-feedback">
                          {{ i18n.translate('last_name_required') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="email">{{ i18n.translate('email_address') }} *</label>
                        <input type="email" id="email" class="form-control" 
                               formControlName="email" [placeholder]="i18n.translate('email_placeholder')">
                        <div *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched" 
                             class="invalid-feedback">
                          <span *ngIf="contactForm.get('email')?.errors?.['required']">{{ i18n.translate('email_required') }}</span>
                          <span *ngIf="contactForm.get('email')?.errors?.['email']">{{ i18n.translate('email_invalid') }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="phone">{{ i18n.translate('phone_number') }}</label>
                        <input type="tel" id="phone" class="form-control" 
                               formControlName="phone" [placeholder]="i18n.translate('phone_placeholder')">
                      </div>
                    </div>
                  </div>
                  
                  <!-- Reservation Specific Fields -->
                  <div *ngIf="contactForm.get('contactType')?.value === 'reservation' || 
                              contactForm.get('contactType')?.value === 'event'" class="reservation-fields">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="form-group">
                          <label for="reservationDate">{{ i18n.translate('preferred_date') }}</label>
                          <input type="date" id="reservationDate" class="form-control" 
                                 formControlName="reservationDate" [min]="minDate">
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group">
                          <label for="reservationTime">{{ i18n.translate('preferred_time') }}</label>
                          <select id="reservationTime" class="form-control" formControlName="reservationTime">
                            <option value="">{{ i18n.translate('select_time') }}</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="12:00">12:00</option>
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:00">14:00</option>
                            <option value="14:30">14:30</option>
                            <option value="15:00">15:00</option>
                            <option value="15:30">15:30</option>
                            <option value="16:00">16:00</option>
                            <option value="16:30">16:30</option>
                            <option value="17:00">17:00</option>
                            <option value="17:30">17:30</option>
                            <option value="18:00">18:00</option>
                            <option value="18:30">18:30</option>
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                            <option value="20:30">20:30</option>
                            <option value="21:00">21:00</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group">
                          <label for="partySize">{{ i18n.translate('party_size') }}</label>
                          <select id="partySize" class="form-control" formControlName="partySize">
                            <option value="">{{ i18n.translate('select_size') }}</option>
                            <option value="1">{{ i18n.translate('party_size_1') }}</option>
                            <option value="2">{{ i18n.translate('party_size_2') }}</option>
                            <option value="3">{{ i18n.translate('party_size_3') }}</option>
                            <option value="4">{{ i18n.translate('party_size_4') }}</option>
                            <option value="5">{{ i18n.translate('party_size_5') }}</option>
                            <option value="6">{{ i18n.translate('party_size_6') }}</option>
                            <option value="7">{{ i18n.translate('party_size_7') }}</option>
                            <option value="8">{{ i18n.translate('party_size_8') }}</option>
                            <option value="9-15">{{ i18n.translate('party_size_9_15') }}</option>
                            <option value="16+">{{ i18n.translate('party_size_16_plus') }}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="subject">{{ i18n.translate('subject') }}</label>
                    <input type="text" id="subject" class="form-control" 
                           formControlName="subject" [placeholder]="i18n.translate('subject_placeholder')">
                  </div>
                  
                  <div class="form-group">
                    <label for="message">{{ i18n.translate('message') }} *</label>
                    <textarea id="message" class="form-control" rows="6" 
                              formControlName="message" 
                              [placeholder]="i18n.translate('message_placeholder')"></textarea>
                    <div *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched" 
                         class="invalid-feedback">
                      {{ i18n.translate('message_required') }}
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <div class="form-check">
                      <input type="checkbox" id="copyEmail" class="form-check-input" formControlName="copyEmail">
                      <label for="copyEmail" class="form-check-label">
                        {{ i18n.translate('copy_email') }}
                      </label>
                    </div>
                  </div>
                  
                  <div class="form-actions">
                    <button type="submit" class="btn btn-primary btn-lg" 
                            [disabled]="contactForm.invalid || isSubmitting">
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
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  showErrorMessage = false;
  minDate: string;

  constructor(private formBuilder: FormBuilder, public i18n: I18nService) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.contactForm = this.formBuilder.group({
      contactType: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      reservationDate: [''],
      reservationTime: [''],
      partySize: [''],
      subject: [''],
      message: ['', Validators.required],
      copyEmail: [true]
    });
  }

  async onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.showSuccessMessage = false;
      this.showErrorMessage = false;

      try {
        const formData = this.contactForm.value;
        
        // Prepare email template parameters
        const templateParams = {
          contact_type: formData.contactType,
          first_name: formData.firstName,
          last_name: formData.lastName,
          customer_email: formData.email,
          phone: formData.phone || 'Not provided',
          reservation_date: formData.reservationDate || 'Not specified',
          reservation_time: formData.reservationTime || 'Not specified',
          party_size: formData.partySize || 'Not specified',
          subject: formData.subject || `${formData.contactType} inquiry`,
          message: formData.message,
          to_email: 'hssnmd.farhad+sd@gmail.com'
        };

        // Initialize EmailJS (you'll need to set up your service ID, template ID, and public key)
        emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS public key
        
        // Send email to restaurant
        await emailjs.send(
          'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
          'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
          templateParams
        );

        // Send copy to customer if requested
        if (formData.copyEmail) {
          const customerParams = {
            ...templateParams,
            to_email: formData.email
          };
          
          await emailjs.send(
            'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
            'YOUR_CUSTOMER_TEMPLATE_ID', // Replace with your customer copy template ID
            customerParams
          );
        }

        this.showSuccessMessage = true;
        this.contactForm.reset();
        this.contactForm.patchValue({ copyEmail: true });

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } catch (error) {
        console.error('Error sending email:', error);
        this.showErrorMessage = true;
      } finally {
        this.isSubmitting = false;
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
}