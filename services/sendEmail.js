import nodeoutlook from 'nodejs-nodemailer-outlook'
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname=path.dirname(fileURLToPath(import.meta.url))

export function sendEmail(dest, message) {
  nodeoutlook.sendEmail({
    auth: {
      user: "RouteAlex2@outlook.com",
      pass: "route@alex2",
    },
    from: "RouteAlex2@outlook.com",
    to: dest,
    subject: "Hey you, awesome!",
    html: message,
    attachments:[{
      filename:"my attachment pic",
      path:"https://res.cloudinary.com/ds7wrpkx4/image/upload/v1668380682/hkebdtxjfhh6usankrez.png",
      contentType:"image/jpg"
    },{
      filename:"my attachment pdf",
      path:path.join(__dirname,'../uploads/Pdf.pdf'),
      contentType:"application/pdf`"

    }]
    // onError: (e) => console.log(e),
    // onSuccess: (i) => console.log(i),
  });
}
 