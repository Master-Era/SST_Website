import aboutImg from "../../assets/images/Wo we Are.jpg";
import activityImg from "../../assets/images/Gaushala.jfif";
import eventImg from "../../assets/images/Event..jfif";
import mandirImg from "../../assets/images/Madir,.jpg";
import galleryImg from "../../assets/images/images.jfif";
import logoImg from "../../assets/images/shreeji-logo.png";

export const defaultAdmins = [
  { id: 1, name: "Super Admin", username: "superadmin", password: "Master@123", role: "Super Admin", active: true }
];

export const defaultWebsiteData = {
  home: {
    hero: [
      { id: 1, title: "Mandir Hero Image", image: mandirImg, active: true },
      { id: 2, title: "Utsav Hero Image", image: eventImg, active: true },
      { id: 3, title: "Gaushala Hero Image", image: activityImg, active: true }
    ],
    sections: [
      { id: 1, key: "who-we-are", title: "Who We Are", content: "Shreeji Samipya Trust is a mandir-centered NGO working for satsang, seva and community upliftment.", image: aboutImg, active: true },
      { id: 2, key: "what-are-we-doing", title: "What Are We Doing", content: "We organize mandir seva, devotee connection, gurukul support and social welfare activities.", image: mandirImg, active: true },
      { id: 3, key: "activity", title: "Activity", content: "Gaushala, Anna Dan, Vastra Dan, Satsang Sabha and Utsav seva are managed section-wise.", image: activityImg, active: true },
      { id: 4, key: "donation", title: "Donation", content: "Donation support helps Gaushala, Mandir Seva, Gurukul Seva, Utsav and community programs.", image: galleryImg, active: true }
    ],
    founder: { title: "Founder", name: "Founder Name", content: "Founder message and introduction can be edited from admin panel.", image: logoImg }
  },
  activity: {
    activities: [
      { id: 1, title: "Blood Donation", content: "Blood donation camp connects volunteers and donors for lifesaving seva.", image: eventImg, layout: "left", active: true },
      { id: 2, title: "Health Care", content: "Health care provides basic checkups, awareness and guidance for families.", image: mandirImg, layout: "right", active: true },
      { id: 3, title: "Educate Child", content: "Child education support helps with learning materials, guidance and sanskar.", image: galleryImg, layout: "left", active: true }
    ],
    socialCare: [
      { id: 1, title: "Weekly Sabha", content: "Weekly sabha for satsang, katha, kirtan and devotee connection.", image: logoImg, active: true },
      { id: 2, title: "Youth Activity", content: "Youth activities build leadership, discipline, seva bhav and spiritual confidence.", image: eventImg, active: true },
      { id: 3, title: "Tirth Yatra", content: "Tirth yatra connects devotees with sacred places, darshan and group satsang.", image: mandirImg, active: true }
    ]
  },
  events: {
    items: [
      { id: 1, title: "Fuldol Utsav", year: "2026", content: "Fuldol utsav celebration details.", image: eventImg, active: true },
      { id: 2, title: "Ganesh Utsav", year: "2026", content: "Ganesh utsav celebration details.", image: mandirImg, active: true },
      { id: 3, title: "Annakut Mahotsav", year: "2026", content: "Annakut mahotsav celebration details.", image: galleryImg, active: true }
    ]
  },
  news: {
    latest: [{ id: 1, title: "Latest News", date: "2026-06-30", content: "Latest mandir news details.", image: "", videoUrl: "", active: true }],
    announcements: [{ id: 1, title: "Upcoming Announcement", date: "2026-06-30", content: "Yatra or event announcement details.", image: "", pdfName: "", pdfData: "", active: true }],
    notices: [{ id: 1, title: "Important Notice", content: "Important notice content.", image: "", active: true }],
    customSections: []
  },
  gallery: {
    albums: [{ id: 1, title: "Mandir Gallery", description: "Temple photos and memories.", cover: mandirImg, images: [mandirImg, eventImg, activityImg] }]
  },
  about: {
    sections: [
      { id: 1, title: "Who We Are", content: "About mandir/trust and spiritual mission.", image: aboutImg, active: true },
      { id: 2, title: "What We Do", content: "Social, educational and spiritual activities.", image: mandirImg, active: true },
      { id: 3, title: "Premises", content: "Mandir premises information.", image: activityImg, active: true },
      { id: 4, title: "Founder", content: "Founder guidance, seva vision and spiritual inspiration details.", image: logoImg, active: true }
    ]
  }
};

export const defaultInquiries = [
  { id: 1, name: "Sample Contact", phone: "", email: "", reason: "Contact Form", message: "Sample inquiry", status: "New", createdAt: "2026-06-30" }
];
export const defaultDonations = [
  { id: 1, name: "Sample Donor", phone: "", email: "", category: "General Donation", amount: 501, paymentMode: "UPI", receiptStatus: "Pending", message: "", createdAt: "2026-06-30" }
];
export const defaultDevotees = [
  { id: 1, name: "Sample Devotee", phone: "", email: "", address: "", familyMembers: 1, image: "", status: "Active", createdAt: "2026-06-30" }
];
export const defaultSettings = {
  notificationEmails: "admin@example.com,trust@example.com",
  emailNotifications: true,
  bankName: "",
  accountName: "",
  accountNo: "",
  ifsc: "",
  upiId: "",
  upiQr: ""
};
