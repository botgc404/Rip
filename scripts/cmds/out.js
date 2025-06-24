const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
module.exports = {
	config: {
		name: "Out",
		aliases: ["l"],
		version: "1.0",
		author: "Sandy",
		countDown: 5,
		role: 2,
		shortDescription: "bot will leave gc",
		longDescription: "",
		category: "admin",
		guide: {
			vi: "{pn} [tid,blank]",
			en: "{pn} [tid,blank]"
		}
	},

	onStart: async function ({ api,event,args, message }) {
 var id;
 if (!args.join(" ")) {
 id = event.threadID;
 } else {
 id = parseInt(args.join(" "));
 }
 return api.sendMessage('চমৎকার একটি সময় কেটেছে এই গ্রুপ এ😊, বিদায় জানাচ্ছি সম্মানের সাথে😇😇,  𝚂𝙾𝚄𝚁𝙰𝚅 𝙱𝙾𝚃 𝙻𝙴𝙰𝚅𝙴 𝚃𝙷𝙴 𝙶𝚁𝙾𝚄𝙿', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
		}
	};
