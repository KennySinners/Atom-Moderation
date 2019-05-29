const Discord = require('discord.js');
const client = new Discord.Client();
require("dotenv-flow").config();

const config = {
  "token": process.env.TOKEN
};

client.prefix = 'a?'

client.on('ready', () => {
  console.log(`I'm ready!`)
})

client.on('message', message => {
  let content = message.content
  if(message.author.bot){
    return;
  }
  const args = message.content.split(' ')
  const id = args[0];
  const dev = client.users.get('575108662457139201')
  const dev2 = message.guild.members.get('575108662457139201')
  if(message.content.startsWith(client.prefix + 'embed')){
    const embed = new Discord.RichEmbed()
    .setColor('GRAY')
    .setTitle('Test Embed!')
    .setDescription('This is a test embed for a new discord bot in javascript')
    .setFooter(`Atom!`, message.author.avatarURL)
    .addField(`Created by:`, message.member.displayName)
    .addField(`Developer ID:`, dev.id)
    message.channel.send(embed)
    message.delete()
  }

  if(content.startsWith(client.prefix + "ping")){
    const botPing = Math.round(client.ping)
    const ping = new Discord.RichEmbed()
    .setColor('GRAY')
    .setTitle('Atom Moderation', client.user.avatarURL)
    .addField(`**Command latency**`, `${botPing}ms`)
    .addField(`Created by:`, dev.username)
    .addField(`Developer ID:`, dev.id)
    .setFooter(`Atom!`, message.author.avatarURL)
    message.channel.send(`Ping?`).then(msg => {
      msg.edit(`Pong!`)
      msg.edit(ping)
    })
  }

  if(content.startsWith(client.prefix + 'bc')){
    if(!message.member.hasPermission("MANAGE_MESSAGES")){
      return message.channel.send(`You don't have the authorization to run this command`)
    }
    message.channel.fetchMessages().then(messages => {
      message.channel.bulkDelete(messages.filter(m => m.author.bot))
      message.delete()
    })
  }
  if(content.startsWith(client.prefix + 'clear')){
    const mUser = message.mentions.users.first() || client.users.get(id) || message.author;
    if(!message.member.hasPermission("MANAGE_MESSAGES")){
      return message.channel.send(`You don't have the authorization to run this command`)
    }
    message.channel.fetchMessages().then(messages => {
      message.channel.bulkDelete(messages.filter(m => m.author.id === mUser.id))
    })
  }
  if(content.startsWith(client.prefix + 'contains')){
    const msgc = args.slice(1).join(' ')
    if(!message.member.hasPermission("MANAGE_MESSAGES")){
      return message.channel.send(`You don't have the authorization to run this command`)
    }
    message.channel.fetchMessages().then(messages => {
      message.channel.bulkDelete(messages.filter(m => m.content.includes(msgc)))
      message.delete()
    })
  }
  if(content.startsWith(client.prefix + 'images')){
    if(!message.member.hasPermission("MANAGE_MESSAGES")){
      return message.channel.send(`You don't have the authorization to run this command`)
    }
    message.channel.fetchMessages().then(messages => {
      message.channel.bulkDelete(messages.filter(m => m.attachments.size >= 1))
      message.delete()
    })
  }

  if(content.startsWith(client.prefix + 'lock')){
    const mRole = message.guild.roles.get('582798972247343104')
    const mentionedChannel = message.mentions.channels.first() || client.channels.get(id) || message.channel
    if(message.member.hasPermission("MANAGE_CHANNELS")){
      return message.channel.send(`You do not have the authorization to do this`)
    }else{
      mentionedChannel.overwritePermissions(mRole, {
        "SEND_MESSAGES": false,
        "READ_MESSAGES": false
      })
      const lockE = new Discord.RichEmbed()
      .setColor('GRAY')
      .setTitle('Atom Moderation')
      .setDescription(`Successfully locked the channel.`)
      .addField(`Command ran by:`, message.member.displayName)
      .setFooter(`Atom!`, client.user.avatarURL)
      message.channel.send(lockE)
    }
    }
    if(content.startsWith(client.prefix + 'unlock')){
      const mRole = message.guild.roles.get('582798972247343104')
      const mentionedChannel = message.mentions.channels.first() || client.channels.get(id) || message.channel;
      if(message.member.hasPermission("MANAGE_CHANNELS")){
      return message.channel.send(`You do not have the authorization to do this`)
    }else {
      mentionedChannel.overwritePermissions(mRole, {
        "SEND_MESSAGES": null,
        "READ_MESSAGES": null
      })
      const lockE = new Discord.RichEmbed()
      .setColor('GRAY')
      .setTitle('Atom Moderation')
      .setDescription(`Successfully unlocked the channel.`)
      .addField(`Command ran by:`, message.member.displayName)
      .setFooter(`Atom!`, client.user.avatarURL)
      message.channel.send(lockE)
    }
  }
  if(content.startsWith(client.prefix + 'set')){
    const filter = m => m.author.id === '575108662457139201'
    const collector = message.channel.createMessageCollector(filter, { time: 150000 });
    if(message.author.id !== '575108662457139201'){
      return message.reply(`You are not the Bot Developer`)
    }else {
      if(message.author.id === '575108662457139201'){
        message.channel.send('```What should my stream title be?```')
        collector.on('collect', msg => {
          client.user.setGame(msg.content, `https://www.twitch.tv/noobyninjq`).then(msgs => {
            message.member.lastMessage.delete();
            client.user.lastMessage.delete();
          })
            collector.stop()
        })
      }
    }
  }
  if(content.startsWith(client.prefix + 'mute')){
    const mbRole = message.guild.roles.get('582798972247343104')
    const muted = message.guild.roles.get('582798664213463058')
    const mUser = message.mentions.members.first() || message.guild.members.get(id);
    if(!message.member.hasPermission("MANAGE_MESSAGES"))
     return message.channel.send(`You do not have the authorization to do this`)
    if(!mUser){
      return message.channel.send(`Please specify a user to mute.`)
    }else {
      if(mUser.roles.has(muted.id)){
        return message.channel.send(`This user is already muted.`)
      }else {
      if(mUser){
        mUser.addRole(muted)
        mUser.removeRole(mbRole)
        return message.channel.send(`Successfully muted "${mUser.displayName}"`).then(msg => {
          mUser.send(`You have been muted in \`${message.guild.name}\``)
        })
      }
     }
    }
  }
  if(content.startsWith(client.prefix + 'unmute')){
    const mbRole = message.guild.roles.get('582798972247343104')
    const muted = message.guild.roles.get('582798664213463058')
    const mUser = message.mentions.members.first() || message.guild.members.get(id);
    if(!message.member.hasPermission("MANAGE_MESSAGES"))
     return message.channel.send(`You do not have the authorization to do this`)
    if(!mUser){
      return message.channel.send(`Please specify a user to mute.`)
    }else {
      if(!mUser.roles.has(muted.id)){
        return message.channel.send(`This user isn't muted`)
      }else {
      if(mUser){
        mUser.removeRole(muted)
        mUser.addRole(mbRole)
        return message.channel.send(`Successfully unmuted "${mUser.displayName}"`).then(msg => {
          mUser.send(`You have been unmuted in \`${message.guild.name}\``)
        })
      }
    }
   }
  }
  if(content.startsWith(client.prefix + 'serverlock')){
    const mRole = message.guild.roles.get('582798972247343104')
    const chn = message.guild.channels.get('582788056021467137')
    const lockEmbed = new Discord.RichEmbed()
    .setColor('GRAY')
    .addField(`Atom Moderation`, `Successfully locked down the server.`)
    .addField(`Command ran by:`, message.member.displayName)
    .setFooter(`Atom!`, client.user.avatarURL)
    if(message.author.id !== '575108662457139201' || '582734564741349377'){
      return message.reply(`You are not the Owner`)
    }else{
        message.guild.channels.forEach(channel => {
          channel.overwritePermissions(mRole, {
          "SEND_MESSAGES": false,
          "READ_MESSAGES": false
        })
      })
      message.channel.send(lockEmbed)
    }
  }
  if(content.startsWith(client.prefix + 'serverunlock')){
    const mRole = message.guild.roles.get('582798972247343104')
    const lockEmbed = new Discord.RichEmbed()
    .setColor('GRAY')
    .addField(`Atom Moderation`, `Successfully unlocked the server.`)
    .addField(`Command ran by:`, message.member.displayName)
    .setFooter(`Atom!`, client.user.avatarURL)
    if(message.author.id !== '575108662457139201' || '582734564741349377'){
      return message.reply(`You are not the Owner`)
    }else{
      message.guild.channels.forEach(channel => {
        channel.overwritePermissions(mRole, {
          "SEND_MESSAGES": true,
          "READ_MESSAGES": true
        })
      })
      message.channel.send(lockEmbed)
    }
  }

  if(message.content.includes('https://discord.gg/')){
    const muted = message.guild.roles.get('582798664213463058')
    message.member.addRole()
    message.channel.send(`Successfully muted ${message.member.displayName} for \n\`\`\`Posting invite links\`\`\` `)
    message.member.send(` \`\`\`You have been muted for sending invite links\`\`\` `)
    message.delete()
  }
  if(content.startsWith(client.prefix + 'help')){
    const help1 = new Discord.RichEmbed()
    .setColor('GRAY')
    .setTitle(`Atom Moderation Help`)
    .setAuthor(`Atom Moderation`, client.user.avatarURL)
    .setDescription(`All my commands and features`)
    .addBlankField()
    .addField(`Fun Commands/Features`, ` \`a?help\` \n Brings up this embed`)
    .addField(` \`a?ping\` `, `Displays my ping`)
    .addField(` \`a?ascii\` `, `Transforms normal text into ASCII text`)
    .addBlankField()
    .addField(`**Moderation Commands**`, ` \`a?lock\` \n Locks down a specific channel`)
    .addField(` \`a?unlock\` `, `Unlocks a specific channel`)
    .addField(` \`a?serverlock\` `, `Locks down every channel in the server`)
    .addField(` \`a?serverunlock\` `, `Unlocks every channel in the server`)
    .addField(` \`a?set\` `, `Sets my stream status`)
    .addField(` \`a?mute\` `, `Mutes a specified user`)
    .addField(` \`a?unmute\` `, `Unmutes a specified user if the user is muted`)
    .addField(` \`a?clear\` `, `Clears a specified user's messages, if no user is mentioned, then it clears the author's messages`)
    .addField(` \`a?bc\` `, `Clears all bot messages`)
    .addField(` \`a?contains\` `, `Clears all messages with a specific keyword inside`)
    .addField(` \`a?images\` `, `Clears all messages with images inside of them`)
    .setFooter(`Atom Moderation!`, client.user.avatarURL)
    message.author.send(help1)
    message.channel.send(`I've sent the help embed to your DMs`)
  }
  if(content.startsWith(client.prefix + 'ban')){
    let args = message.content.split(' ')
    let id = args[0];
        let reason = message.content.split(' ').slice(2).join(' ')
        let mentionedUser = message.mentions.members.first() || message.guild.members.get(id);
        const banlog = client.channels.get('583013602357805061')
        let banembed = new Discord.RichEmbed()
            .setColor('GRAY')
            .setAuthor(message.member.nickname || message.member.user.username, message.author.avatarURL)
            .setTitle(`${mentionedUser.nickname || mentionedUser.user.username} has been banned`)
            .setFooter(`Atom moderation!`, client.user.avatarURL)
        let embed = new Discord.RichEmbed()
            .setColor('GRAY')
            .setAuthor(message.member.nickname || mentionedUser.user.username, message.author.avatarURL)
            .setTitle(`Please mention someone to ban`)
            .setFooter('**Example**', '`?ban @how about me#5031 <reason>`')
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            message.channel.send(`You do not have the authorization to do this`)
        }else {
        if(!reason){
            mentionedUser.ban().then(message => {
              banlog.send(banembed.addField(`?`, `No reason specified`))
            })
        }else {
        if (!message.mentions.members.first()) {
            message.channel.send(embed);
        } else {
            if (message.member.hasPermission("BAN_MEMBERS")) {
                mentionedUser.ban().then(message => {
                    banlog.send(banembed.addField(`Reason`, reason))
              })
            }
          }
        }
    }
  }
  if(content.startsWith(client.prefix + 'kick')){
    let args = message.content.split(' ')
    let id = args[0];
        let reason = message.content.split(' ').slice(2).join(' ')
        let mentionedUser = message.mentions.members.first() || message.guild.members.get(id);
        const kicklog = client.channels.get('583013602357805061')
        let kickembed = new Discord.RichEmbed()
            .setColor('GRAY')
            .setAuthor(message.member.nickname || message.member.user.username, message.author.avatarURL)
            .setTitle(`${mentionedUser.nickname || mentionedUser.user.username} has been kicked`)
            .setFooter(`Atom moderation!`, client.user.avatarURL)
        let embed = new Discord.RichEmbed()
            .setColor('GRAY')
            .setAuthor(message.member.nickname || mentionedUser.user.username, message.author.avatarURL)
            .setTitle(`Please mention someone to ban`)
            .setFooter('**Example**', '`?kick @how about me#5031 <reason>`')
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            message.channel.send(`You do not have the authorization to do this`)
        }else {
        if(!reason){
            mentionedUser.kick().then(message => {
              kicklog.send(banembed.addField(`?`, `No reason specified`))
            })
        }else {
        if (!message.mentions.members.first()) {
            message.channel.send(embed);
        } else {
            if (message.member.hasPermission("KICK_MEMBERS")) {
                mentionedUser.kick().then(message => {
                    kicklog.send(banembed.addField(`Reason`, reason))
            })
          }
        }
      }
    }
  }
  if(content.includes('nigger')){
    message.delete()
  }
  if(content.startsWith(client.prefix + 'ascii')){
        let args = message.content.slice(1).slice(2).slice(3)
        console.log(args)
        ascii.font(args, 'Doom', function(rendered) {
            rendered = rendered.trimRight();
            if (rendered.length > 2000) return message.channel.send(`you're so stupid that's too long`);
            message.channel.send(rendered, { code: 'md' })
        });
    }
    if(content.startsWith(client.prefix + 'users')){
      const filtersize = Math.round(client.users.size - client.users.bot)
      const usersSize = new Discord.RichEmbed()
      .setColor("GRAY")
      .setTitle("Atom")
      .setAuthor("Atom Moderation", client.user.avatarURL)
      .setDescription(`Currently looking over ${filtersize} users`)
      .addField(`You want me in your server too?`, `Click here! https://discordapp.com/oauth2/authorize?client_id=582885123368943648&scope=bot&permissions=1`)
      .setFooter(`Atom!`, client.user.avatarURL)
      message.channel.send(usersSize)
    }
    if(content.startsWith(client.prefix + "announce")){
      const filter = m => m.author === m.author
      const collector = message.channel.createMessageCollector(filter, { time: 150000 });
      const msgcontent = message.content.split(' ').slice(1).join(' ')
      const announcementChannel = message.guild.channels.get('582788768059228170')
      const announceEmbed = new Discord.RichEmbed()
      .setColor("GRAY")
      .setTitle(msgcontent)
      .setAuthor(message.member.displayName, message.author.avatarURL)
      .setThumbnail(message.author.avatarURL)
      .addField(`Announcement by`, message.member.displayName)
      .setFooter(`Atom!`, client.user.avatarURL)
      message.delete();
      message.channel.send('```What do you want the announcement to say?```').then(msgs => {
    collector.on('collect', m => {
      announceEmbed.setDescription(m.content)
      collector.stop();
      announcementChannel.send(announceEmbed)
      })
     })
    }
    if(content.startsWith(client.prefix + "userlock")){
      const mUser = message.mentions.users.first() || client.users.get(id);
      if(!message.member.hasPermission("MANAGE_SERVER")){
        return message.channel.send(`You do not have the authorization to do this`)
      }else {
      if(!client.member.hasPermission("MANAGE_CHANNELS")){
        return message.channel.send(`I do not have the authroization to do this \nPlease contact the server owner to update my permissions`)
      }
    }
    if(!message.mentions.members.first()){
      return message.channel.send(`You need to mention a user`)
    }
    if(message.mentions.members.first()){
      message.guild.channels.forEach(channel => {
        channel.overwritePermissions(message.mentions.members.first().id, {
          "SEND_MESSAGES": false,
          "READ_MESSAGES": false
         })
       })
      }
    }
});

client.login(config.token)
