const path=require('path');const express=require('express');const cors=require('cors');const {frontendUrl}=require('./config/env');
const publicRoutes=require('./routes/publicRoutes');const adminRoutes=require('./routes/adminRoutes');const {notFound,errorHandler}=require('./middleware/errors');
const app=express();
app.disable('x-powered-by');app.use(cors({origin:[frontendUrl,'http://127.0.0.1:3000'],credentials:true}));app.use(express.json({limit:'20mb'}));app.use(express.urlencoded({extended:true,limit:'20mb'}));
app.use('/uploads',express.static(path.resolve(__dirname,'../uploads')));app.use('/api/admin',adminRoutes);app.use('/api',publicRoutes);app.use(notFound);app.use(errorHandler);
module.exports=app;
