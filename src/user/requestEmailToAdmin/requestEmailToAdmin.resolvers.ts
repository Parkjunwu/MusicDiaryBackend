import { Resolver, Resolvers } from "../../types";
import nodemailer from "nodemailer";

const requestEmailToAdminFn: Resolver = async (
  _,
  { text },
  { logInUserId:userId, client}
) => {
  
  const errorResult = { ok:false, error:"fail" };

  let email: string;
  userId && (email = (await client.user.findUnique({
    where:{
      id:userId,
    },
    select:{
      email:true,
    },
  })).email)
  
  try {
    const html = `<div style="font-size:15px;">
        본문 : ${text}
      </div>
      <div style="font-size:13px;">
        ${userId ? `유저 id : ${userId}<br/>이메일 : ${email}` : ""}
      </div>`;

    const adminId = process.env.NAVER_ID;
    const transporter = nodemailer.createTransport({ 
      service: 'Naver',
      host: 'smtp.naver.com',
      port: 587,
      auth: {
        user: adminId,
        pass: process.env.NAVER_PASSWORD,
      }
    });
    
    transporter.sendMail(
      {
        from: adminId,
        to: adminId,
        subject: "일기 유저님의 황송한 어플 관련 문의사항 입니다.",
        html,
      },
      (err, info) => {
        if (err) {
          console.error("requestEmailToAdminFn // error : "+err);
          return errorResult;
        }
      }
    );
  } catch (e) {
    console.error("requestEmailToAdminFn // error : "+e);
    return errorResult;
  }

  return { ok: true };
};

const resolver: Resolvers = {
  Mutation: {
    // 이걸 로그인한 유저만 쓸 수 있게 할까?
    requestEmailToAdmin: requestEmailToAdminFn,
    // requestEmailToAdmin: protectResolver(requestEmailToAdminFn),
  },
};

export default resolver;
