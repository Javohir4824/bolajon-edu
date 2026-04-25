import os
import re

def fix_content(content):
    # Emojis (Broadened list based on screenshots)
    replacements = {
        "рџ“ђ": "📐", "рџЋ­": "🎭", "рџ—ЈпёЏ": "🗣️", "рџЊ±": "🌱", "рџЋЁ": "🎨",
        "в­ђ": "⭐", "вњ€пёЏ": "✈️", "рџ§ё": "🧸", "рџ–ЌпёЏ": "🖍️", "рџЌ‚": "🍂",
        "рџЌЃ": "🍁", "вќ„пёЏ": "❄️", "рџЊё": "🌸", "рџ¦‹": "🦋", "рџ”‘": "🔑",
        "рџ§’": "🧒", "рџљЂ": "🚀", "вљ пёЏ": "⚠️", "в¬…пёЏ": "⬅️", "рџЊџ": "🌟",
        "рџ‘¦": "👦", "рџ‘©вЂЌрџЏ«": "👩‍🏫", "рџЏў": "🏢", "рџ”’": "🔒",
        "рџ“–": "📖", "рџЋµ": "🎵", "рџ’Ў": "💡", "рџЏ†": "🏆", "рџ”љ": "🔔",
        "рџ“Љ": "📊", "рџ”Ќ": "🔍", "рџ’¬": "💬", "рџ”§": "⚙️", "рџ—іпёЏ": "🗳️",
        "рџ’і": "💳", "рџ“‹": "📋", "рџ“†": "📅", "рџ“—": "📗", "рџ“˜": "📘",
        "рџ“™": "📙", "рџ“љ": "📚", "рџ“¤": "📤", "рџ“": "📥", "рџ“©": "📩",
        "рџ“¬": "📨", "рџ’¬": "💬", "рџ’­": "💭", "рџ’®": "💮", "рџ’": "💯",
        "рџ’±": "💰", "рџ’²": "💵", "рџ’³": "💳", "рџ’´": "💴", "рџ’µ": "💶",
        "рџ’¶": "💷", "рџ’·": "💸", "рџ’": "💹", "рџ’№": "💱", "рџ’": "🏧",
        "рџ’»": "💻", "рџ’": "💼", "рџ’": "💽", "рџ’": "💾", "рџ’ї": "💿",
        "в­ђпёЏ": "⭐", "вњ…": "✅", "вњ–": "✖️", "вћ—": "➕", "вћ–": "➖",
        "рџ”„": "🔄", "рџ”№": "🔺", "рџ”": "🔻", "рџ”»": "🔽", "рџ”ј": "🔼",
        "рџ—і": "🗳️", "рџ”Љ": "🔊", "рџ“ј": "📻", "рџ“»": "📠", "рџ“є": "📺",
        "рџ“№": "📹", "рџ“¸": "📷", "рџ“·": "📸", "рџ“¶": "📶", "рџ“µ": "📵",
        "рџ“ґ": "📴", "рџ“³": "📲", "рџ“²": "📲", "рџ“±": "📱", "рџ“°": "📟",
        "рџЊџ": "🌟", "рџЊґ": "🌴", "рџЊµ": "🌵", "рџЊ¶": "🌶️", "рџЊ·": "🌷",
        "рџЊё": "🌸", "рџЊ": "🌹", "рџЊ": "🌺", "рџЊ": "🌻", "рџЊ": "🌼",
        "рџЊ": "🌽", "рџЊ": "🌾", "рџЊ": "🌿", "рџЌЂ": "🍀", "рџЌЃ": "🍁",
        "рџЌ‚": "🍂", "рџЌ": "🍃"
    }
    
    # Textual gibberish (apostrophes, quotes)
    # The most common pattern for Uzbek ' is ввЂ˜ or ввЂ™ or just К»
    text_replacements = {
        "ввЂ˜": "\u02BB",
        "ввЂ™": "\u02BB",
        "ввЂњ": '"',
        "ввЂќ": '"',
        "ввЂ“": "-",
        "К»": "\u02BB",
        "Кј": "\u02BB",
        "Кљ": "\u02BB",
        "в€’": "-",
        "вќ¤пёЏ": "❤️",
        "вњЁ": "✨",
        "рџ‘Ќ": "👍",
        "рџ‘Ћ": "👎",
        "рџ‘Џ": "👏",
        "рџ™Њ": "🙌",
        "рџ™Џ": "🙏",
        "рџ’Є": "💪",
        "рџ”Ґ": "🔥",
        "рџЋ‰": "🎉",
        "рџЋЉ": "🎊"
    }

    # First apply emoji replacements
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    # Then textual replacements
    for old, new in text_replacements.items():
        content = content.replace(old, new)

    # Special case for the "background" text in screenshots like pyh% Bayramlar
    # It seems "Bayramlar" was meant to have an emoji like 🎊 or 🎈
    content = content.replace("рџЋЉ Bayramlar", "🎊 Bayramlar")
    content = content.replace("рџЋЉ", "🎊")
    
    # Fix the star emoji in tables (bh in screenshot)
    # Actually, bh might be в­ђ (Star) or similar.
    content = content.replace("в­ђ", "⭐")
    
    # Final cleanup for Uzbek words
    UZ_APOS = "\u02BB"
    content = re.sub(r"([a-zA-Z])'([a-zA-Z])", r"\1" + UZ_APOS + r"\2", content)
    content = re.sub(r"([a-zA-Z])\u02BB([a-zA-Z])", r"\1" + UZ_APOS + r"\2", content) # ensure standard

    return content

def main():
    root_dir = r"c:\Users\Anwender\Desktop\Bolajon Edu Platform\src"
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.js', '.jsx', '.css', '.html')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    new_content = fix_content(content)
                    
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Fixed: {filepath}")
                except Exception as e:
                    print(f"Error {filepath}: {e}")

if __name__ == "__main__":
    main()
