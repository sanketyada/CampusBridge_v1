const mongoose = require('mongoose');
require('dotenv').config({ path: '../server/.env' });
const Resource = require('../server/models/Resource');

async function debugResource() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
    
    const resourceId = '69e1f044352aeb20f342170b';
    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      console.log("Resource not found");
    } else {
      console.log("Resource Title:", resource.title);
      console.log("Resource Type:", resource.type);
      console.log("File URL:", resource.fileUrl);
      console.log("AI Summary Length:", resource.aiSummary?.length || 0);
      console.log("Content Text Length:", resource.contentText?.length || 0);
    }
  } catch (err) {
    console.error("Debug Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

debugResource();
