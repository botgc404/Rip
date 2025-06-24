const axios = require('axios');
const fs = require('fs-extra');
const FormData = require('form-data');

module.exports.config = {
    name: "4k",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Satoru (Styled by ChatGPT)",
    description: "Enhance image with AI",
    category: "Box",
    cooldowns: 5,
    usePrefix: true
};

module.exports.onStart = async function ({ api, event }) {
    let imgFile;
    if (event.messageReply) {
        imgFile = event.messageReply.attachments.find(attachment => attachment.type == "photo");
    } else {
        imgFile = event.attachments.find(attachment => attachment.type == "photo");
    }

    if (!imgFile)
        return api.sendMessage("⚠️ Please reply to or send a photo to enhance.", event.threadID, event.messageID);

    const getStream = (await axios.get(imgFile.url, { responseType: 'stream' })).data;

    api.sendMessage("⏳ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗶𝗺𝗮𝗴𝗲... 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 a 𝗺𝗼𝗺𝗲𝗻𝘁.", event.threadID, async (err, info) => {
        try {
            const buffer = await enhanceImage(getStream);

            const pathSaveImg = __dirname + `/cache/enhanced_${event.senderID}_${Date.now()}.png`;
            fs.writeFileSync(pathSaveImg, buffer);

            return api.sendMessage({
                body: `✨ 𝗜𝗺𝗮𝗴𝗲 𝗘𝗻𝗵𝗮𝗻𝗰𝗲𝗺𝗲𝗻𝘁 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱!\n\n✅ Your image has been successfully enhanced to 4K quality.\n📎 Below is your upscaled image.`,
                attachment: fs.createReadStream(pathSaveImg)
            }, event.threadID, () => {
                fs.unlinkSync(pathSaveImg);
                api.unsendMessage(info.messageID);
            }, event.messageID);

        } catch (error) {
            return api.sendMessage(`❌ 𝗘𝗿𝗿𝗼𝗿: ${error.message}`, event.threadID, event.messageID);
        }
    }, event.messageID);
};

async function enhanceImage(fileStream) {
    try {
        const form = new FormData();
        form.append('image', fileStream, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        });

        const uploadResponse = await axios.post('https://api.imggen.ai/guest-upload', form, {
            headers: {
                ...form.getHeaders(),
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Origin': 'https://imggen.ai',
                'Referer': 'https://imggen.ai/',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
            }
        });

        let uploadedImage = uploadResponse.data.image;
        if (!uploadedImage?.url) throw new Error("Failed to upload image.");
        uploadedImage.url = `https://api.imggen.ai${uploadedImage.url}`;

        const upscaleResponse = await axios.post('https://api.imggen.ai/guest-upscale-image', {
            image: uploadedImage
        }, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Origin': 'https://imggen.ai',
                'Referer': 'https://imggen.ai/',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
            }
        });

        if (upscaleResponse.data.message !== 'Image upscaled successfully') {
            throw new Error('Upscaling failed. Please try again later.');
        }

        const upscaledImageUrl = `https://api.imggen.ai${upscaleResponse.data.upscaled_image}`;
        const { data: imgBuffer } = await axios.get(upscaledImageUrl, { responseType: 'arraybuffer' });

        return imgBuffer;

    } catch (error) {
        console.error('Enhancement error:', error);
        throw new Error('Failed to enhance image. Please try again later.');
    }
                    }
