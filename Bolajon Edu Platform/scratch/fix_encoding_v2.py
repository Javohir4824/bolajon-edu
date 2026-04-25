import os

def fix_content(content):
    # First, handle the common gibberish for emojis
    replacements = {
        "рџ“ђ": "📐",
        "рџЋ­": "🎭",
        "рџ—ЈпёЏ": "🗣️",
        "рџЊ±": "🌱",
        "рџЋЁ": "🎨",
        "в­ђ": "⭐",
        "вњ€пёЏ": "✈️",
        "рџ§ё": "🧸",
        "рџ–ЌпёЏ": "🖍️",
        "рџЌ‚": "🍂",
        "рџЌЃ": "🍁",
        "вќ„пёЏ": "❄️",
        "рџЊё": "🌸",
        "рџ¦‹": "🦋",
        "рџ”‘": "🔑",
        "рџ§’": "🧒",
        "рџљЂ": "🚀",
        "вљ пёЏ": "⚠️",
        "в¬…пёЏ": "⬅️",
        "рџЊџ": "🌟",
        "рџ‘¦": "👦",
        "рџ‘©вЂЌрџЏ«": "👩‍🏫",
        "рџЏў": "🏢",
        "рџ”’": "🔒",
        "рџ“–": "📖",
        "рџЋµ": "🎵",
        "рџ’Ў": "💡",
        "рџЏ†": "🏆",
        "рџ”љ": "🔔",
        "рџ“Љ": "📊",
        "рџ”Ќ": "🔍",
        "рџ’¬": "💬",
        "рџ”§": "⚙️",
        "рџ—іпёЏ": "🗳️"
    }
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    # Handle the Uzbek apostrophe gibberish patterns carefully to avoid JS syntax errors
    # Pattern 1: К» or Кј or ввЂ˜ or ввЂ™
    # We will replace them with the correct Unicode character \u02BB which doesn't break JS strings
    content = content.replace("К»", "\u02BB")
    content = content.replace("Кј", "\u02BB")
    content = content.replace("вЂ˜", "\u02BB")
    content = content.replace("вЂ™", "\u02BB")
    content = content.replace("вЂњ", '"')
    content = content.replace("вЂќ", '"')
    content = content.replace("вЂ–", "-")
    content = content.replace("вЂ—", "-")
    
    # If we already replaced some with just ', let's fix them to \u02BB to avoid syntax errors
    # But only if they are likely part of an Uzbek word.
    # Actually, simpler: replace all ' inside words with \u02BB in certain contexts or just escape them.
    # But wait, \u02BB is the officially correct character and it's an Identifier part in JS if used outside strings,
    # but inside strings it's just a character.
    
    # Let's target specific common broken words from the error log
    content = content.replace("'ona", "\u02BBona")
    content = content.replace("'rta", "\u02BBrta")
    content = content.replace("o'rta", "o\u02BBrta")
    content = content.replace("O'rta", "O\u02BBrta")
    content = content.replace("do'st", "do\u02BBst")
    content = content.replace("bog'cha", "bog\u02BBcha")
    content = content.replace("Ro'yxat", "Ro\u02BByxat")
    content = content.replace("ro'yxat", "ro\u02BByxat")
    content = content.replace("o'g'li", "o\u02BBg\u02BBli")
    
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
