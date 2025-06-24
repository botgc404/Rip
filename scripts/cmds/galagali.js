module.exports.config = {
	name: "Reply",
	version: "1.0.2",
	role: 0,
	author: "Jubayer",
	prefix: false,
	category: "gali",
	guide: "gali",
	cooldowns: 5
};

module.exports.onChat = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	let react = event.body.toLowerCase();
	if(react.includes("magi") || react.includes("bessa") || 
react.includes("খানকি মাগি") || 
react.includes("চুদানি") ||
react.includes("চুদা") ||
react.includes("চুদ") ||
react.includes("ভুদা") || 
react.includes("buda") || 
react.includes("gali") ||
react.includes("galibaz") ||        react.includes("সাওয়া") || 
react.includes("khanki") ||
react.includes("maderxud") ||
react.includes("xud") || 
react.includes("xuda") || 
react.includes("xudi") ||
react.includes("cuda") ||
react.includes("cudi") ||
react.includes("mgi") ||
react.includes("nodi") || 
react.includes("bc") ||
react.includes("মাগি") ||
react.includes("মাদারচুদ") ||
react.includes("মাদারি") ||
react.includes("চুদা") ||
react.includes("চুদি") || 
react.includes("madari") ||
react.includes("ষুদি") ||
react.includes("bal") ||
react.includes("খাংকির পোলা") ||
react.includes("বোকাচোদা") ||
react.includes("খানকি মাগি") || 
react.includes("SawYa") || 
react.includes("বাল") || 
react.includes("tor mare xudi") || react.includes("vuda") || react.includes("heda") || react.includes("bap")) {
		var msg = {
				body: "╰┈➤ এখানে গালা গালি করবি না সৌরভ ভাই কে ডাক দিমু কিন্তু...!!😾😾😾\n\n𝐎𝐖𝐍𝐄𝐑: 𝗦𝗢𝗨𝗥𝗔𝗩 😾"
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("😾", event.messageID, (err) => {}, true)
		}
	}
	module.exports.onStart = function({ api, event, client, __GLOBAL }) {

	   }
