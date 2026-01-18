const { exec } = require('child_process');

module.exports.config = {
    name: "install",
    version: "1.0.0",
    permission: 2,
    credits: "Kashif Raza",
    description: "Install npm packages directly from the bot",
    category: "admin",
    usages: "[package name]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const packageName = args.join(" ");

    if (!packageName) {
        return api.sendMessage("❌ Please provide the name of the package to install.", threadID, messageID);
    }

    const waitMsg = await api.sendMessage(`⏳ Installing package: ${packageName}...`, threadID);

    exec(`npm install ${packageName}`, (error, stdout, stderr) => {
        if (error) {
            api.editMessage(`❌ Error installing ${packageName}:\n${error.message}`, waitMsg.messageID, threadID);
            return;
        }
        if (stderr && !stderr.includes('npm WARN')) {
            api.editMessage(`⚠️ Installation completed with warnings/errors:\n${stderr}`, waitMsg.messageID, threadID);
            return;
        }
        api.editMessage(`✅ Successfully installed package: ${packageName}\n\nOutput:\n${stdout.slice(0, 500)}...`, waitMsg.messageID, threadID);
    });
};
