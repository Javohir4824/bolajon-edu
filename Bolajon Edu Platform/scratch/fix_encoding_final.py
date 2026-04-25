import os

def fix_content(content):
    # Emojis
    replacements = {
        "рџ“ђ": "📐", "рџЋ­": "🎭", "рџ—ЈпёЏ": "🗣️", "рџЊ±": "🌱", "рџЋЁ": "🎨",
        "в­ђ": "⭐", "вњ€пёЏ": "✈️", "рџ§ё": "🧸", "рџ–ЌпёЏ": "🖍️", "рџЌ‚": "🍂",
        "рџЌЃ": "🍁", "вќ„пёЏ": "❄️", "рџЊё": "🌸", "рџ¦‹": "🦋", "рџ”‘": "🔑",
        "рџ§’": "🧒", "рџљЂ": "🚀", "вљ пёЏ": "⚠️", "в¬…пёЏ": "⬅️", "рџЊџ": "🌟",
        "рџ‘¦": "👦", "рџ‘©вЂЌрџЏ«": "👩‍🏫", "рџЏў": "🏢", "рџ”’": "🔒", "рџ“–": "📖",
        "рџЋµ": "🎵", "рџ’Ў": "💡", "рџЏ†": "🏆", "рџ”љ": "🔔", "рџ“Љ": "📊",
        "рџ”Ќ": "🔍", "рџ’¬": "💬", "рџ”§": "⚙️", "рџ—іпёЏ": "🗳️"
    }
    for old, new in replacements.items():
        content = content.read().replace(old, new) if hasattr(content, 'read') else content.replace(old, new)

    # Uzbek apostrophes: replace the "broken" patterns with the proper modifier \u02BB
    # which is the standard Uzbek apostrophe and doesn't break JS syntax.
    content = content.replace("К»", "\u02BB")
    content = content.replace("Кј", "\u02BB")
    content = content.replace("вЂ˜", "\u02BB")
    content = content.replace("вЂ™", "\u02BB")
    
    # If there are manual ' inside words that break things, fix them too
    # We target common words to be safe
    content = content.replace("o'rta", "o\u02BBrta")
    content = content.replace("O'rta", "O\u02BBrta")
    content = content.replace("o'g'li", "o\u02BBg\u02BBli")
    content = content.replace("bog'cha", "bog\u02BBcha")
    content = content.replace("Ro'yxat", "Ro\u02BByxat")
    content = content.replace("ro'yxat", "ro\u02BByxat")
    content = content.replace("do'st", "do\u02BBst")
    content = content.replace("San'at", "San\u02BBat")
    content = content.replace("Qoraqalpog'iston", "Qoraqalpog\u02BBiston")
    
    # Fix the mistake from previous script: includes(ʻrta') -> includes('oʻrta')
    content = content.replace("includes(ʻrta')", "includes('o\u02BBrta')")
    content = content.replace("includes('o\u02BBrta')", "includes('o\u02BBrta')") # redundant but safe
    
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
