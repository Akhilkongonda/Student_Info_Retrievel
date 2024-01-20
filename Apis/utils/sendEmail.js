const nodemailer=require("nodemailer")

const sendEmailFunction=async(subject,message,send_to,sent_from,reply_to)=>{
    
    console.log('Entered :' , {subject,message,send_to,sent_from,reply_to})

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587, // According to documentation
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        secure: false, // Use STARTTLS
        requireTLS: true, // Require STARTTLS
        tls: {
            ciphers: 'TLSv1.2', // Use a secure cipher, adjust based on server requirements
        },
    });
    

    const options={
        from:sent_from,
        to:send_to,
        replyTo:reply_to,
        subject:subject,
        html:message
    }

    //send email
    console.log("Transporter Configuration:", transporter.options);

    transporter.sendMail(options,function(err,info){
        if(err){
            console.log(err)
        }
        else{
            console.log(info)
        }
    })

    console.log("Left")

}

module.exports=sendEmailFunction;