import { Client, GatewayIntentBits } from 'discord.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

client.once('ready', () => {
  if (client.user) console.log(`Bot está online como ${client.user.tag}!`)
})

client.on('messageCreate', async message => {
  if (message.author.bot) return
  if (message.content.startsWith('!ask')) {
    try {
      const prompt = message.content.slice(5)
      await message.channel.sendTyping()
      const result = await model.generateContent(prompt)
      const response = result.response.text()
      await message.reply(response)
    } catch (error) {
      console.error('Erro ao gerar resposta:', error)
      await message.reply(
        'Desculpe, ocorreu um erro ao processar sua solicitação.'
      )
    }
  }
})
client.login(process.env.DISCORD_TOKEN)
