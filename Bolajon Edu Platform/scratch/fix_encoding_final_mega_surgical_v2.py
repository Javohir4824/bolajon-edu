import os
import re

def fix_content(content):
    UZ_APOS = chr(0x02BB)
    
    # Comprehensive replacement map
    replacements = {
        "рџ‘‘": "👑", "рџ‘Ґ": "👥", "рџЋҐ": "🎥", "рџ–јпёЏ": "🖼️", "рџ‘ЃпёЏ": "👁️",
        "рџЋЉ": "🎊", "рџ“–": "📖", "рџЋµ": "🎵", "рџ’Ў": "💡", "рџ”‘": "🔑",
        "рџ§’": "🧒", "рџљЂ": "🚀", "рџЊџ": "🌟", "рџ“Љ": "📊", "рџ”Ќ": "🔍",
        "рџ’¬": "💬", "рџ”§": "⚙️", "рџ—іпёЏ": "🗳️", "рџ‘‰": "👉", "рџЋЇ": "🪄",
        "рџљ§": "🚧", "рџљЁ": "🚨", "рџ‘‹": "👋", "рџЋ“": "🎓", "рџ”’": "🔒",
        "рџЏ†": "🏆", "рџ”љ": "🔔", "рџ—“пёЏ": "🗓️", "рџ˜Љ": "😊", "рџЋ’": "🎒",
        "рџ“љ": "📚", "рџЌ‚": "🍂", "рџЌЃ": "🍁", "рџЊё": "🌸", "рџ¦‹": "🦋",
        "рџ‘¦": "👦", "рџ‘©": "👩‍🏫", "рџЏў": "🏢", "рџЋ­": "🎭", "рџ—ЈпёЏ": "🗣️",
        "рџЊ±": "🌱", "рџЋЁ": "🎨", "рџ§ё": "🧸", "рџ–ЌпёЏ": "🖍️",
        "в­ђпёЏ": "⭐", "в­ђ": "⭐", "вљ пёЏ": "⚠️", "в¬…пёЏ": "⬅️", "в¬…": "⬅️",
        "вњ…": "✅", "вћ—": "➕", "в˜ЂпёЏ": "☀️", "вќ„пёЏ": "❄️", "вњ€пёЏ": "✈️",
        "вЂ˜": UZ_APOS, "вЂ™": UZ_APOS, "вЂњ": '"', "вЂќ": '"', "вЂ–": "-",
        "К»": UZ_APOS, "Кј": UZ_APOS, "Кљ": UZ_APOS,
        "oвЂ˜": "o" + UZ_APOS, "OвЂ˜": "O" + UZ_APOS, "oвЂ™": "o" + UZ_APOS,
        "doвЂ˜": "do" + UZ_APOS, 
        "📥ќ": "📥", "📥„": "📄", "📥…": "📅", "📥Ћ": "📥", "рџ‘Ї": "👥"
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    # Clean up mistakes from previous aggressive run (replace ʻ with ' if it's ending a string)
    # This is tricky, but we can look for ʻ followed by space, comma, semicolon, paren, or end of line
    content = content.replace("ʻ ", "' ")
    content = content.replace("ʻ,", "',")
    content = content.replace("ʻ;", "';")
    content = content.replace("ʻ)", "')")
    content = content.replace("ʻ}", "'}")
    content = content.replace("ʻ]", "']")
    content = content.replace("ʻ:", "':")
    content = content.replace("ʻ+", "'+")
    
    # Specific Uzbek words that definitely need it
    content = content.replace("O'zbekiston", "O" + UZ_APOS + "zbekiston")
    content = content.replace("o'zbek", "o" + UZ_APOS + "zbek")
    content = content.replace("o'yin", "o" + UZ_APOS + "yin")
    content = content.replace("o'rta", "o" + UZ_APOS + "rta")
    content = content.replace("O'rta", "O" + UZ_APOS + "rta")
    content = content.replace("o'g'il", "o" + UZ_APOS + "g" + UZ_APOS + "il")
    content = content.replace("o'quvchi", "o" + UZ_APOS + "quvchi")
    content = content.replace("o'qituvchi", "o" + UZ_APOS + "qituvchi")
    content = content.replace("o'rganamiz", "o" + UZ_APOS + "rganamiz")
    content = content.replace("o'rganing", "o" + UZ_APOS + "rganing")
    content = content.replace("bo'limi", "bo" + UZ_APOS + "limi")
    content = content.replace("ko'rish", "ko" + UZ_APOS + "rish")
    content = content.replace("to'plagan", "to" + UZ_APOS + "plagan")
    content = content.replace("o'chirmoqchi", "o" + UZ_APOS + "chirmoqchi")
    content = content.replace("o'zining", "o" + UZ_APOS + "zining")
    content = content.replace("o'shanda", "o" + UZ_APOS + "shanda")
    content = content.replace("bo'yicha", "bo" + UZ_APOS + "yicha")
    content = content.replace("to'ldi", "to" + UZ_APOS + "ldi")
    content = content.replace("bo'ladi", "bo" + UZ_APOS + "ladi")
    content = content.replace("do'stlarim", "do" + UZ_APOS + "stlarim")
    
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
