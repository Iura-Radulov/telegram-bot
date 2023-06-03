import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10,
    },
  },
});

console.log('Bot has been started');

bot.on('message', msg => {
  const { id } = msg.chat;
  if (msg.text?.toLowerCase() == 'привет') {
    bot.sendMessage(id, 'Здравствуй, ' + msg.from.first_name);
  }
});

bot.onText(/\/keyboard/, msg => {
  const { id } = msg.chat;

  bot.on('message', msg => {
    const { id } = msg.chat;
    if (msg.text === 'Закрыть') {
      bot.sendMessage(id, 'Закрываю', {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    } else if (msg.text === 'Ответить') {
      bot.sendMessage(id, 'Ответ', {
        reply_markup: {
          force_reply: true,
        },
      });
    }
  });

  bot.sendMessage(id, 'Клавиатура', {
    reply_markup: {
      keyboard: [
        [{ text: 'Отправить местоположение', request_location: true }],
        ['Ответить', 'Закрыть'],
        [{ text: 'Отправить контакт', request_contact: true }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
      force_reply: true,
    },
  });
});
bot.on('polling_error', console.log);
