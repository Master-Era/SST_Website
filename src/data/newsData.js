import mandirImg from "../assets/images/Madir,.jpg";
import eventImg from "../assets/images/Event..jfif";
import gaushalaImg from "../assets/images/Gaushala.jfif";
import galleryImg from "../assets/images/images.jfif";
import trustImg from "../assets/images/Wo we Are.jpg";

export const newsItems = [
  {
    slug: "new-seva-start",
    category: "Latest News",
    title: "New Seva Start",
    date: "2026-07-05",
    time: "09:00 AM",
    location: "Shreeji Samipya Mandir Campus",
    author: "Shreeji Samipya Trust",
    banner: gaushalaImg,
    description:
      "A new seva activity has started for devotees and nearby families. Volunteers can join for planning, support and on-ground seva.",
    gallery: [gaushalaImg, mandirImg, galleryImg],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    slug: "new-project-start",
    category: "Latest News",
    title: "New Project Start",
    date: "2026-07-12",
    time: "10:30 AM",
    location: "Hari Tirth Aashram",
    author: "Project Team",
    banner: mandirImg,
    description:
      "A new project is being planned for mandir seva, social support and future community programs with transparent execution.",
    gallery: [mandirImg, trustImg, eventImg],
    video: "",
  },
  {
    slug: "events-update",
    category: "Latest News",
    title: "Events Updates",
    date: "2026-07-18",
    time: "06:00 PM",
    location: "Sabha Hall",
    author: "Events Team",
    banner: eventImg,
    description:
      "Upcoming mandir events and seva gatherings are updated with date, time, location and image records.",
    gallery: [eventImg, galleryImg, mandirImg],
    video: "",
  },
  {
    slug: "upcoming-announcement-yatra",
    category: "Upcoming Announcements",
    title: "Yatra Announcement",
    date: "2026-08-02",
    time: "07:00 AM",
    location: "Mandir Parking Area",
    author: "Yatra Committee",
    banner: galleryImg,
    description:
      "Yatra planning, reporting time and seva instructions will be shared with registered devotees.",
    gallery: [galleryImg, mandirImg, trustImg],
    video: "",
  },
  {
    slug: "press-release-seva",
    category: "Press Release",
    title: "Seva Press Release",
    date: "2026-08-09",
    time: "11:00 AM",
    location: "Local Newspaper",
    author: "Media Desk",
    banner: trustImg,
    description:
      "Newspaper image and news link area for trust announcements, seva coverage and public updates.",
    gallery: [trustImg, eventImg, gaushalaImg],
    video: "",
    newsLink: "https://example.com/news",
  },
  {
    slug: "important-notice-darshan-time",
    category: "Important Notices",
    title: "Pujan and Darshan Time Notice",
    date: "2026-08-15",
    time: "05:30 AM",
    location: "Mandir",
    author: "Admin Office",
    banner: mandirImg,
    description:
      "Important notice for pujan, darshan timing, yatra pamphlet and PDF upload records.",
    gallery: [],
    video: "",
    pdf: "/notice.pdf",
  },
];

export const newsCategories = ["Latest News", "Upcoming Announcements", "Press Release", "Important Notices"];
