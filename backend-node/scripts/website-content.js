/*
  ================================================================
  WEBSITE CONTENT - edit this file directly, no admin panel needed
  ================================================================

  How to use:
  1. Put your real image files inside: backend-node/uploads/media/
     (you can make subfolders too, e.g. uploads/media/home/hero-1.jpg)
  2. Below, reference each image as: "/uploads/media/your-file-name.jpg"
  3. Fill in real titles/text in place of the placeholder text.
  4. Save this file, then run:  node scripts/push-content.js
     This pushes everything in this file live to the website immediately.
  5. Re-run push-content.js any time you edit this file again - it always
     fully replaces the live content with whatever is in this file.

  Notes:
  - Set "active: false" on any item to hide it without deleting it.
  - "image" can be left as "" (empty) if a section has no image yet -
    the site will simply not show a hardcoded/dummy image, it will just
    skip that image cleanly.
  - This file can (and should) be committed to git, so your content is
    version controlled just like your code.
*/

module.exports = {
  // ============ HOME PAGE ============
  home: {
    // Hero slider at the very top of the home page.
    // Add as many slides as you want - they will auto-rotate.
    hero: [
      {
        id: 1,
        image: "/uploads/media/home/hero-1.jpg",
        // videoUrl: "/uploads/media/home/hero-video.mp4", // use this INSTEAD of image for a video slide
        altText: "Shreeji Samipya Trust Mandir",
        active: true,
      },
    ],

    // The 4 info cards under the hero (Who We Are / What Are We Doing / Activity / Donation)
    sections: [
      {
        title: "Who We Are",
        content: "Shreeji Samipya Trust is a mandir-centered NGO working for satsang, seva and community upliftment.",
        image: "/uploads/media/home/who-we-are.jpg",
        active: true,
      },
      {
        title: "What Are We Doing",
        content: "We organize mandir seva, devotee connection, gurukul support and social welfare activities.",
        image: "/uploads/media/home/what-we-do.jpg",
        active: true,
      },
      {
        title: "Activity",
        content: "Gaushala, Anna Dan, Vastra Dan, Satsang Sabha and Utsav seva are managed section-wise.",
        image: "/uploads/media/home/activity.jpg",
        active: true,
      },
      {
        title: "Donation",
        content: "Donation support helps Gaushala, Mandir Seva, Gurukul Seva, Utsav and community programs.",
        image: "/uploads/media/home/donation.jpg",
        active: true,
      },
    ],

    // Founder card near the bottom of the home page
    founder: {
      title: "Guru Parampara",
      content: "",
      image: "/uploads/media/home/founder.jpg",
    },
  },

  // ============ ACTIVITY PAGE ============
  activity: {
    // Section 1: "Activity"
    activities: [
      {
        id: "blood-donation",
        title: "Blood Donation",
        content: "Blood donation camps connect donors, volunteers and medical teams for lifesaving seva.",
        image: "/uploads/media/activity/blood-donation.jpg",
        active: true,
      },
      {
        id: "health-care",
        title: "Health Care",
        content: "Health care activity includes checkup camps, awareness sessions and referral support.",
        image: "/uploads/media/activity/health-care.jpg",
        active: true,
      },
      {
        id: "educate-child",
        title: "Educate Child",
        content: "Child education support helps students with study material, guidance and values.",
        image: "/uploads/media/activity/educate-child.jpg",
        active: true,
      },
    ],
    // Section 2: "Social Care"
    socialCare: [
      {
        id: "weekly-sabha",
        title: "Weekly Sabha",
        content: "Weekly sabha brings devotees together for katha, kirtan, dhun and seva planning.",
        image: "/uploads/media/activity/weekly-sabha.jpg",
        active: true,
      },
    ],
  },

  // ============ ABOUT PAGE ============
  about: {
    sections: [
      {
        title: "Who We Are",
        content: "Shreeji Samipya Sanstha is a mandir-centered seva and satsang organization.",
        image: "/uploads/media/about/who-we-are.jpg",
        active: true,
      },
      {
        title: "What We Do",
        content: "We organize mandir seva, satsang sabha, utsav seva, gaushala support and more.",
        image: "/uploads/media/about/what-we-do.jpg",
        active: true,
      },
      {
        title: "Premises",
        content: "Premises section introduces the mandir campus, Hari Tirth Aashram and seva areas.",
        image: "/uploads/media/about/premises.jpg",
        active: true,
      },
      {
        // Special title "Founder" is automatically shown in the Founder menu on the About page
        title: "Founder",
        content: "",
        image: "/uploads/media/about/founder.jpg",
        active: true,
      },
    ],
  },

  // ============ EVENTS PAGE ============
  events: {
    intro: "Shreeji Samipya Sanstha ma utsav bhakti, seva, satsang ane samajik jodaan mate karvama ave che.",
    items: [
      {
        title: "Utsav Sabha",
        image: "/uploads/media/events/utsav-sabha.jpg",
        content: "",
        active: true,
      },
    ],
  },

  // ============ GALLERY PAGE ============
  gallery: {
    albums: [
      {
        id: "premises",
        title: "Premises",
        description: "Mandir campus, Hari Tirth Aashram and place-wise image folders.",
        cover: "/uploads/media/gallery/premises-cover.jpg",
        images: [
          "/uploads/media/gallery/premises-1.jpg",
          "/uploads/media/gallery/premises-2.jpg",
        ],
        active: true,
      },
    ],
  },

  // ============ NEWS PAGE ============
  news: {
    latest: [
      {
        title: "New Seva Start",
        slug: "new-seva-start",
        date: "2026-07-05",
        time: "09:00 AM",
        location: "Shreeji Samipya Mandir Campus",
        author: "Shreeji Samipya Trust",
        image: "/uploads/media/news/new-seva-start.jpg",
        description: "A new seva activity has started for devotees and nearby families.",
        gallery: [],
        video: "",
        active: true,
      },
    ],
    announcements: [],
    notices: [],
    customSections: [],
  },

  // ============ CONTACT DETAILS (Contact page + Footer, every page) ============
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
