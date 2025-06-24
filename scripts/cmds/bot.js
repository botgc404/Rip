const axios = require('axios');
const baseApiUrl = async () => {
    return "https://www.noobs-api.rf.gd/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "bot", "nisan", "babe"],
    version: "6.9.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    description: "better then all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(' - ');
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = (await usersData.get(number)).name;
                    return {
                        name,
                        value
                    };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data.length;
                return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(' - ')[1];
            if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher)).name;
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({
    api,
    event,
    Reply
}) => {
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({
    api,
    event,
    message
}) => {
    try {
        const body = event.body ? event.body?.toLowerCase() : ""
        if (body.startsWith("baby") || body.startsWith("Jan") || body.startsWith("বেবি") || body.startsWith("bot") || body.startsWith("sourav") || body.startsWith("সৌরভ") || body.startsWith("বট")) {
            const arr = body.replace(/^\S+\s*/, "")
            const randomReplies = ["🗿🤌🏼💀", "𝙃𝙤𝙥 𝙗𝙚𝙙𝙖😾, 𝘽𝙤𝙨𝙨 বল 𝙗𝙤𝙨𝙨😼", "𝙒𝙝𝙖𝙩'𝙨 𝙪𝙥?", "কারো extra attitude সহ্য করি না...!😏— আর কাউকে impress করার চেষ্টাও করি না...!😒yeah it's me...!😎","জীবনে সমস্যা হবেই এটা normal বিষয় আমি তো সমস্যার মধ্যে ও chill করি...!🤘😎","🔥ভালো ব্যবহার করবা ভালো ব্যাবহার পাইবা ত্যারামি করবা তাহলে ঘ্যারানী খাইবা😈🤟","যে যাই বলুক শান্ত থাকো...... সূর্যের যতই তাপ থাকুক, সমুদ্র শুকাইতে পারবো না / 🗿🤌🏼","তুমি হয়রানি হয়ে যাবা উকিল খুঁজতে খুঁজতে, আর আমি তো জজ-কেই কিনে রাখছি🗿🤌🏼💀"," _ღ✿❃.•°࿐মানুষরে যা দেহাই ঐডা আমি না আমি যে কি ঐডা কেউ জানেই না🗿🤌🏼💀","༊᭄●══ ❥আমাকে ছাড়া যাদের চলবে তাদেরকে ছাড়াও আমারও চলবে🗿🦵🏼💀","দুনিয়াটা টাকার উপর চলে তোমার বালের attitude এর উপর না💀💀","বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏", "𝙣𝙖𝙬 𝙢𝙮 𝙤𝙬𝙣𝙚𝙧 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙙𝙖𝙬 https://m.me/sourav.nath404 ", "ভদ্রতা সাইডে রাখলে ভাই তুমি চোখে চোখ রাখতে ও ভয় পাবে 😈 ","তোর কথা তোর বাড়ির কেও শুনে না, তো আমি কেনো শুনবো যা ভাগ!!😹😁","ভালোবাসা নামক পাগলামি করতে মন চাইলে আমার বস সৌরভ এর ইনবক্স এ চলে যাও-🙊🥱👅 🌻𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐍𝐊 🌻:- https://www.facebook.com/profile.php?id=61577174606216 ","৯৯টাকায় ৯৯জিবি ৯৯বছর-☺️🐸 -অফারটি পেতে এখনই আমার বস সৌরভ কে প্রোপজ করুন-🤗","আজ একটা বিন নেই বলে ফেসবুকের নাগিন-🤧-গুলোরে আমার বস সৌরভ ধরতে পারছে না-!!🐸🥲","দূরে গিয়া মর তোর কোনো কাজ নাই সারাদিন শুধু bot bot করিস-😡😡বাড়িতে কাজ না থাকলে নিজের আগাছা পরিষ্কার কর গিয়ে বেক্কল-😒🙄","আমাকে এতো না ডেকে বস সৌরভ একটা GF দে-!!😐🙄","হুম মিস তিস করছেন নাকি আমাকে-🙂বলেন আপনার জন্য কি করতে পারি-😚🌸","আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো তুমি কি আমাকে ভালোবাসো আসো বুকে আশো!!🫂🥱","আমাকে ডাকলে, আমি কিন্তূ কিস করে দেবো😘", "𝘽𝘼𝘽𝙐 𝙆𝙃𝙐𝘿𝘼 𝙇𝘼𝙂𝙎𝙀🥺"];
            if (!arr) {

                await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) message.reply("info obj not found")
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID)
            }
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID)
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
