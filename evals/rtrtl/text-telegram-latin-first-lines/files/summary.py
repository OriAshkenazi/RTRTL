"""Builds the daily deals summary our Telegram bot sends to the shop channel."""
from telegram import Bot, MessageEntity

LIMIT = 4096  # Telegram's maximum message length


def utf16_len(text):
    return len(text.encode('utf-16-le')) // 2


def build(deals):
    """deals: list of dicts with 'product', 'note' (Hebrew) and 'price' (int, shekels)."""
    text = 'מבצעי היום\n'
    entities = []
    for deal in deals:
        # Bold the product name.
        entities.append(MessageEntity(MessageEntity.BOLD, offset=utf16_len(text), length=utf16_len(deal['product'])))
        text += f"{deal['product']} {deal['note']} ב־₪{deal['price']}\n"
    text += 'Questions? Reply in English or Hebrew.\n'
    text += 'קוד קופון:\n'
    entities.append(MessageEntity(MessageEntity.PRE, offset=utf16_len(text), length=utf16_len('SALE-2026')))
    text += 'SALE-2026'
    return text, entities


def split(text, entities):
    """Split at line ends into messages of at most LIMIT UTF-16 code units, moving entities with their text."""
    chunks, start = [], 0
    while start < len(text):
        end = len(text)
        while utf16_len(text[start:end]) > LIMIT:
            end = text.rfind('\n', start, end - 1) + 1
        base, top = utf16_len(text[:start]), utf16_len(text[:end])
        chunk_entities = [MessageEntity(e.type, offset=e.offset - base, length=e.length)
                          for e in entities if base <= e.offset < top]
        chunks.append((text[start:end], chunk_entities))
        start = end
    return chunks


async def send(bot: Bot, chat_id, deals):
    text, entities = build(deals)
    for chunk, chunk_entities in split(text, entities):
        await bot.send_message(chat_id, chunk, entities=chunk_entities)


# Example: build([{'product': 'Galaxy S24', 'note': 'במחיר מיוחד', 'price': 2990},
#                 {'product': 'AirPods Pro', 'note': 'עם נרתיק', 'price': 899},
#                 {'product': 'מטען', 'note': 'מהיר 65W', 'price': 150}])
