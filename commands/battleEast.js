const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const BattleEast_GriffinEmpire = require('../schemas/abBattle.js');

module.exports = {
    admin: true,
    data: new SlashCommandBuilder()
    .setName('battle-east')
    .setDescription('Nhập vào ID Battle East')
    .addSubcommand(command => command.setName('add').setDescription('Add data').addStringOption(option => option.setName('battle-id').setDescription('text to save').setRequired(true)))
    .addSubcommand(command => command.setName('remove').setDescription('Remove data').addStringOption(option => option.setName('battle-id').setDescription('text to save').setRequired(true))),
    async execute(interaction) { 
        const { options } = interaction;
        const sub = options.getSubcommand();
        const data = await BattleEast_GriffinEmpire.find();

        switch (sub) {
            case 'add':
                if(!data.some(item => item.battleID === options.getString('battle-id'))) {
                    try {
                        const response = await axios.get(`https://gameinfo-sgp.albiononline.com/api/gameinfo/battles/${options.getString('battle-id')}`);
                        const battleData = response.data;
    
                        await BattleEast_GriffinEmpire.create({
                            battleID: options.getString('battle-id'),
                            startTime: battleData.startTime,
                            endTime: battleData.endTime,
                            playerJoin: Object.values(battleData.players).filter(player => player.guildName === "Griffin Empire"),
                        });     
        
                        await interaction.reply({content:`Lưu dữ liệu thành công !`, ephemeral: true});
                    } catch (error) {
                        await interaction.reply({content: `Đã có lỗi xảy ra!\nStatus: ${error}`, ephemeral: true});
                    }
                } else {
                    await interaction.reply({content: `Battle này đã tồn tại trong lịch sử CTA!`, ephemeral: true});
                }
            break;

            case 'get':
                
            break;

            case 'remove':
                if(data.some(item => item.battleID === options.getString('battle-id'))) {
                    await BattleEast_GriffinEmpire.deleteOne({ battleID: options.getString('battle-id') })
                    await interaction.reply({content: `Đã xoá Battle này ra khỏi lịch sử CTA hiện tại!`, ephemeral: true});
                } else {
                    await interaction.reply({content: `Battle không tồn tại trong lịch sử CTA!`, ephemeral: true});
                }
            break;
        }
    }
}