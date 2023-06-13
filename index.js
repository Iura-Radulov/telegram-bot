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

const inline_keyboard = [
  [
    { text: 'Reply', callback_data: 'reply' },
    { text: 'Forward', callback_data: 'forward' },
  ],
  [
    { text: 'Edit', callback_data: 'edit' },
    { text: 'Delete', callback_data: 'delete' },
  ],
];

bot.onText(/\/start/, msg => {
  const { id } = msg.chat;

  bot.sendMessage(id, 'Выберите кнопку', {
    reply_markup: {
      inline_keyboard,
    },
  });
});

bot.on('callback_query', query => {
  const { chat, message_id, text } = query.message;
  switch (query.data) {
    case 'forward':
      // куда, откуда, что
      bot.forwardMessage(chat.id, chat.id, message_id);
      break;
    case 'reply':
      bot.sendMessage(chat.id, 'Отвечаем на сообщение', {
        reply_to_message_id: message_id,
      });
      break;
    case 'edit':
      bot.editMessageText(`${text} (edited)`, {
        chat_id: chat.id,
        message_id: message_id,
        reply_markup: {
          inline_keyboard,
        },
      });
      break;
    case 'delete':
      bot.deleteMessage(chat.id, message_id);
  }

  bot.answerCallbackQuery({ callback_query_id: query.id }, `${query.data}`);
});

bot.on('polling_error', console.log);
