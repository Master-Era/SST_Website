/*
  Structural defaults only - no sample/dummy text or images.

  Previously this file contained fake sample content ("Blood Donation",
  "Weekly Sabha", "Fuldol Utsav", etc.) using stock photos. That dummy
  data was being silently merged back into real admin-saved content by
  normalizeWebsiteData() any time the schema version changed, which is
  why old placeholder content kept reappearing even after being edited
  in the admin panel. This file now only defines the shape (empty
  arrays / empty strings) - never dummy content.
*/

export const defaultAdmins = [
  { id: 1, name: "Super Admin", username: "superadmin", password: "Master@123", role: "Super Admin", active: true }
];

export const defaultWebsiteData = {
  home: {
    hero: [],
    sections: [],
    founder: { title: "", name: "", content: "", image: "" },
  },
  activity: {
    activities: [],
    socialCare: [],
  },
  events: {
    intro: "",
    items: [],
  },
  news: {
    latest: [],
    announcements: [],
    notices: [],
    customSections: [],
  },
  gallery: {
    albums: [],
  },
  about: {
    sections: [],
  },
  // Real trust contact details. These are genuine business information
  // (not placeholder/sample content), safe to ship as the starting
  // default so the site never shows blank contact info. Editable any
  // time from Admin Panel -> Contact Edit.
  contact: {
    phone: "+91 70433 55925",
    whatsapp: "+91 70433 55925",
    email: "info@shreejisamipya.org",
    address: "Hari Tirth Aashram, Opposite Central University, Kundhela, Vadodara, Gujarat, India",
    mapLink: "https://maps.app.goo.gl/a5YXeXm7esqtdf729",
    darshanMorning: "6:00 AM – 12:30 PM",
    darshanEvening: "4:00 PM – 9:00 PM",
    facebook: "https://m.facebook.com/search_results/?q=Shreeji+Samipya+Trust",
    instagram: "https://www.instagram.com/shreeji_samipya_trust/",
    youtube: "https://www.youtube.com/channel/UCFupl8zGAC817dFp4k3hnRg",
  },
};

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
