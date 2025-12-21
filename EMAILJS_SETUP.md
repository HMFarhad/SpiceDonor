# EmailJS Setup Guide

This guide explains how to set up EmailJS for the contact form functionality.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Set Up Email Service

1. Go to the "Services" section in your EmailJS dashboard
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID**

## Step 3: Create Email Templates

### Template 1: Restaurant Notification Template
Create a template for notifications sent to the restaurant:

**Template ID**: `restaurant_contact_form`

**Subject**: `New Contact Form Submission - {{contact_type}}`

**Body**:
```
New contact form submission received:

Contact Type: {{contact_type}}
Name: {{first_name}} {{last_name}}
Email: {{customer_email}}
Phone: {{phone}}

Reservation Details (if applicable):
Date: {{reservation_date}}
Time: {{reservation_time}}
Party Size: {{party_size}}

Subject: {{subject}}

Message:
{{message}}

---
This message was sent through the Spice Döner website contact form.
```

### Template 2: Customer Copy Template
Create a template for confirmation emails sent to customers:

**Template ID**: `customer_copy_template`

**Subject**: `Thank you for contacting Spice Döner - We've received your message`

**Body**:
```
Dear {{first_name}},

Thank you for contacting Spice Döner! We have received your message and will get back to you within 24 hours.

Your submission details:
Contact Type: {{contact_type}}
Subject: {{subject}}

Message:
{{message}}

If you have made a reservation request, we will confirm availability and send you a confirmation email.

Best regards,
The Spice Döner Team

Malminkaari 9, 00700 Helsinki
Phone: +358 9 1234 5678
Email: info@spicedonor.fi
```

## Step 4: Update Contact Component

Replace the placeholder values in `contact.component.ts`:

```typescript
// Line ~354: Replace 'YOUR_PUBLIC_KEY' with your EmailJS public key
emailjs.init('YOUR_ACTUAL_PUBLIC_KEY');

// Line ~357: Replace with your actual service ID
'YOUR_ACTUAL_SERVICE_ID',

// Line ~358: Replace with your restaurant template ID
'restaurant_contact_form',

// Line ~368: Replace with your actual service ID
'YOUR_ACTUAL_SERVICE_ID',

// Line ~369: Replace with your customer template ID
'customer_copy_template',
```

## Step 5: Get Your Credentials

1. **Public Key**: Go to "Account" > "API Keys" in your EmailJS dashboard
2. **Service ID**: Found in your "Services" section
3. **Template IDs**: Found in your "Templates" section

## Step 6: Configure Email Recipients

The form is currently configured to send emails to: `hssnmd.farhad+sd@gmail.com`

You can change this by modifying the `templateParams` object in the contact component:

```typescript
to_email: 'your-restaurant-email@example.com'
```

## Step 7: Test the Form

1. Update the credentials in the contact component
2. Build and serve your application
3. Navigate to the contact page
4. Fill out and submit the form
5. Check both the restaurant email and customer email for messages

## Usage Limits

EmailJS free plan includes:
- 200 emails per month
- Basic templates
- Standard support

For higher volume, consider upgrading to a paid plan.

## Troubleshooting

If emails aren't sending:
1. Check browser console for errors
2. Verify all credentials are correct
3. Ensure email service is properly authenticated
4. Check EmailJS dashboard for failed sends
5. Verify template parameter names match exactly

## Security Note

The EmailJS public key can be safely included in client-side code as it's designed for public use. However, consider implementing server-side validation for production use to prevent spam.