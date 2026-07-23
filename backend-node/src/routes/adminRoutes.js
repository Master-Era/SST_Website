const path=require('path');const multer=require('multer');const router=require('express').Router();
const c=require('../controllers/adminController');const {requireAuth,requireAdmin}=require('../middleware/auth');const {safeFilename}=require('../utils/helpers');const {uploadMaxMb}=require('../config/env');
const uploadDir=path.resolve(__dirname,'../../uploads/media');
const upload=multer({storage:multer.diskStorage({destination:(_r,_f,cb)=>cb(null,uploadDir),filename:(_r,f,cb)=>cb(null,`${Date.now()}-${safeFilename(f.originalname)}`)}),limits:{fileSize:uploadMaxMb*1024*1024}});
router.post('/login',c.login);router.use(requireAuth);router.get('/dashboard',c.dashboard);router.post('/upload',upload.single('file'),c.upload);
router.get('/settings',requireAdmin,c.getSettings);router.put('/settings',requireAdmin,c.saveSettings);router.put('/page-content',c.savePageContent);
router.get('/export/:module.:fmt',c.exportFile);router.get('/:module',c.list);router.post('/:module',c.create);router.put('/:module/:id',c.update);router.delete('/:module/:id',c.remove);
module.exports=router;
