# Contact and Donation Email Notification Setup

The Node.js backend saves Contact and Donation submissions in MySQL and then sends an automatic email notification to the configured trust/admin email addresses.

## 1. Create backend-node/.env

Copy:

```text
backend-node/.env.example
```

to:

```text
backend-node/.env
```

## 2. Gmail SMTP configuration

Add your real email details:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-google-app-password
SMTP_FROM=Shreeji Samipya Website <your-email@gmail.com>
NOTIFICATION_EMAIL=trust-notification@gmail.com
```

Use a Google App Password, not the normal Gmail password.

Google Account steps:

1. Enable 2-Step Verification.
2. Open Google Account > Security > App passwords.
3. Create an app password for the website/mail.
4. Paste the generated 16-character password in `SMTP_PASS` without spaces.

## 3. Admin Panel recipient emails

The backend also sends notifications to valid email addresses saved in Admin Panel Settings:

- email1
- email2
- email3

Duplicate addresses are removed automatically. Multiple addresses may also be placed in `NOTIFICATION_EMAIL`, separated by commas.

## 4. Run backend

```bash
cd backend-node
npm install
npm run dev
```

## Notification behavior

- Contact submit: saves inquiry and emails full visitor details.
- Donation submit: saves donation, creates receipt number, and emails donor/payment details.
- Visitor email is used as Reply-To when supplied, so the admin can reply directly.
- If SMTP fails or is missing, the form submission remains safely stored in MySQL.
- The API response contains `notification_sent: true` when mail succeeds.

## Common Gmail error

`Invalid login: 535-5.7.8 Username and Password not accepted`

Use an App Password and confirm that `SMTP_USER` is the same Gmail account that created it.
