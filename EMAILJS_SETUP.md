# EmailJS Setup Guide

This guide explains how to set up EmailJS for the contact form functionality.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address


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