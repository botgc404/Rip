const axios = require("axios");

module.exports = {
  config: {
    name: "drive",
    aliases: [d],
    version: "1.0.0",
    author: "Jubayer",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Upload video to Google Drive"
    },
    longDescription: {
      en: "Upload a video to Google Drive from link or reply attachment"
    },
    category: "utility",
    guide: {
      en: "{pn} <link>\nReply to a media message with: {pn}"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const url = event.messageReply?.attachments?.[0]?.url || args[0];
    
    if (!url) {
      return message.reply("⚠️ Please provide a valid URL or reply to a message with media.");
    }

    try {
      const res = await axios.get(`https://jubayer-drive-uploader-api-007.onrender.com/upload?url=${encodeURIComponent(url)}`);
      const { directLink, fileId } = res.data;

      if (directLink && fileId) {
        return message.reply(
          `🗂️ Successfully Uploaded to Google Drive!\n\n🔗 Direct URL: ${directLink}\n🆔 File ID: ${fileId}`
        );
      } else {
        return message.reply("❌ Failed to retrieve file information.");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      return message.reply(`⚠️ An error occurred during upload.\nError: ${err.message}`);
    }
  }
};
