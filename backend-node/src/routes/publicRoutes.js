const router=require('express').Router();
const c=require('../controllers/publicController');
router.get('/health',c.health);router.get('/content',c.listContent);router.get('/content/:pageKey',c.getContent);
router.post('/inquiry',c.createInquiry);router.get('/inquiry',c.listInquiries);
router.get('/donation/categories',c.donationCategories);router.post('/donation',c.createDonation);
router.post('/hari-bhakto/register',c.registerDevotee);router.get('/hari-bhakto',c.listDevotees);
router.get('/gallery',c.listGallery);router.get('/events',c.listEvents);router.get('/activities',c.listActivities);
router.get('/news',c.listNews);router.get('/news/:slug',c.getNews);
module.exports=router;
