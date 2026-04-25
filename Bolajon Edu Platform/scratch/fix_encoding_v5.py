import os
import re

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
        content = content.replace(old, new)

    UZ_APOS = chr(0x02BB)
    
    # Uzbek apostrophes: replace the "broken" patterns
    content = content.replace("К»", UZ_APOS)
    content = content.replace("Кј", UZ_APOS)
    content = content.replace("вЂ˜", UZ_APOS)
    content = content.replace("вЂ™", UZ_APOS)
    content = content.replace("вЂњ", '"')
    content = content.replace("вЂќ", '"')

    # Fix any ASCII apostrophes between letters
    content = re.sub(r"([a-zA-Z])'([a-zA-Z])", r"\1" + UZ_APOS + r"\2", content)
    
    # Fix the includes issue
    content = content.replace("includes(" + UZ_APOS, "includes('" + UZ_APOS)
    
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
