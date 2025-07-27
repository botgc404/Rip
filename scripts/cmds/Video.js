const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "video",
    aliases: ["ভিডিও", "video"],
    version: "2.0.1",
    author: "IMRAN (Modified by ChatGPT)",
    countDown: 5,
    role: 0,
    shortDescription: "Download a video from YouTube by name",
    longDescription: "Search and download a YouTube video using public APIs.",
    category: "media",
    guide: "{p}{n} <video name>",
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");
    if (!query) {
      return api.sendMessage(
        "⚠️ Please provide a video name!\n\nUsage: /video <name>",
        event.threadID,
        event.messageID
      );
    }

    let loadingMsgID = null;

    try {
      // Step 1: Notify searching
      const loading = await api.sendMessage(`🔍 Searching for "${query}"...\n⏳ Please wait...`, event.threadID);
      loadingMsgID = loading.messageID;

      // Step 2: Search video
      const searchRes = await axios.get(`https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(query)}`);
      const video = searchRes.data[0];
      if (!video || !video.url) throw new Error("No video found for your search.");

      // Step 3: Notify downloading
      await api.unsendMessage(loadingMsgID);
      const downloading = await api.sendMessage(`🎬 Found: ${video.title}\n⬇️ Downloading...`, event.threadID);
      loadingMsgID = downloading.messageID;

      // Step 4: Get download link
      const apiKey = "6c9542b5-7070-48cb-b325-80e1ba65a451";
      const dlRes = await axios.get(`https://kaiz-apis.gleeze.com/api/ytmp4?url=${video.url}&quality=360&apikey=${apiKey}`);
      const downloadUrl = dlRes.data.download_url;
      if (!downloadUrl) throw new Error("No downloadable link found.");

      // Step 5: Download and save
      const videoBuffer = (await axios.get(downloadUrl, { responseType: "arraybuffer" })).data;
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const filePath = path.join(cacheDir, `video_${Date.now()}.mp4`);
      await fs.writeFile(filePath, videoBuffer);

      // Step 6: Send video
      const msg = {
        body: `━━𝗦𝗢𝗨𝗥𝗔𝗩 𝗕𝗢𝗧━━\n🎬 𝗧𝗶𝘁𝗹𝗲: ${video.title}\n⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${video.time}\n━━━━━━━━━━━━━━━━━━\n\n✅ Here is your video!`,
        attachment: fs.createReadStream(filePath)
      };

      await api.sendMessage(msg, event.threadID, async () => {
        await fs.unlink(filePath); // auto delete
      }, event.messageID);

      if (loadingMsgID) await api.unsendMessage(loadingMsgID);

    } catch (err) {
      console.error("❌ Video command error:", err.message || err);
      if (loadingMsgID) {
        try { await api.unsendMessage(loadingMsgID); } catch (e) {}
      }
      api.sendMessage("❌ Failed to download video. Try another keyword or try later!", event.threadID, event.messageID);
    }
  }
};
