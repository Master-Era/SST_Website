/*
  Structural defaults for the operational admin panel (Devotees, Inquiries,
  Donations, Users, Settings). Website content (Home, About, Activity,
  Events, Gallery, News, Contact) is no longer managed from the admin
  panel at all - see backend-node/scripts/website-content.js.
*/

export const defaultAdmins = [
  { id: 1, name: "Super Admin", username: "superadmin", password: "Master@123", role: "Super Admin", active: true }
];

export const defaultInquiries = [];
export const defaultDonations = [];
export const defaultDevotees = [];
export const defaultSettings = {
  notificationEmails: "",
  emailNotifications: true,
  bankName: "",
  accountName: "",
  accountNo: "",
  ifsc: "",
  upiId: "",
  upiQr: ""
};
