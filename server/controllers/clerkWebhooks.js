// import { Webhook } from "svix";
// import User from "../models/user.js";

// const clerkWebhooks = async (req, res) => {
//     try{
//     //   create a svix instance with clerk webhook secret
//     const hwook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     const headers = {
//         "svix-id": req.headers["svix-id"],
//         "svix-timestamp": req.headers["svix-timestamp"],
//         "svix-signature": req.headers["svix-signature"],
//     };

//     // Verify headers
//     await hwook.verify(JSON.stringify(req.body), headers)

//     // Getting data from request body
//     const {data, type} = req.body;

//     const userData = {
//         _id: data.id,
//         email: data.email_addresses[0].email_address,
//         userName: data.first_name + " " + data.last_name,
//         image: data.image_url,
//     }

//     // Switch cases for different events
//     switch(type) {
//         case "user.created" : {
//             await User.create(userData);
//             break;
//         }

//         case "user.updated" : {
//             await User.findByIdAndUpdate(data.id, userData);
//             break;
//         }
//         case "user.deleted" : {
//             await User.findByIdAndDelete(data.id);
//             break;
//         }
//         default:
//             break;
//     }

//     res.json({success: true, message: "Webhook Received"})

//     }catch(error) {
//       console.log(error.message);
//       res.json({success: false, message: error.message});
//     }
// }

// export default clerkWebhooks;



import { Webhook } from "svix";
import User from "../models/user.js";

const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body; // Buffer
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ VERIFY RAW BODY
    const evt = wh.verify(payload, headers);

    // ✅ NOW safely read data
    const { type, data } = evt;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      userName: `${data.first_name ?? ""} ${data.last_name ?? ""}`,
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;

      default:
        break;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(400).json({ success: false });
  }
};

export default clerkWebhooks;
