import os
import re

def fix_content(content):
    UZ_APOS = chr(0x02BB)
    
    replacements = {
        # Common corrupted patterns
        "рџ‘‘": "👑", "рџ‘Ґ": "👥", "рџЋҐ": "🎥", "рџ–јпёЏ": "🖼️", "рџ‘ЃпёЏ": "👁️",
        "рџЋЉ": "🎊", "рџ“–": "📖", "рџЋµ": "🎵", "рџ’Ў": "💡", "рџ”‘": "🔑",
        "рџ§’": "🧒", "рџљЂ": "🚀", "рџЊџ": "🌟", "рџ“Љ": "📊", "рџ”Ќ": "🔍",
        "рџ’¬": "💬", "рџ”§": "⚙️", "рџ—іпёЏ": "🗳️", "в­ђ": "⭐", "вљ пёЏ": "⚠️",
        "в¬…пёЏ": "⬅️", "вњ…": "✅", "вћ—": "➕", "вЂ˜": UZ_APOS, "вЂ™": UZ_APOS,
        "вЂњ": '"', "вЂќ": '"', "вЂ–": "-", "К»": UZ_APOS, "Кј": UZ_APOS,
        "Кљ": UZ_APOS, "рџ“ђ": "📐", "рџЋ­": "🎭", "рџ—ЈпёЏ": "🗣️", "рџЊ±": "🌱",
        "рџЋЁ": "🎨", "вњ€пёЏ": "✈️", "рџ§ё": "🧸", "рџ–ЌпёЏ": "🖍️", "рџЌ‚": "🍂",
        "рџЌЃ": "🍁", "вќ„пёЏ": "❄️", "рџЊё": "🌸", "рџ¦‹": "🦋", "рџ‘¦": "👦",
        "рџ‘©": "👩‍🏫", "рџЏў": "🏢", "рџ”’": "🔒", "рџЏ†": "🏆", "рџ”љ": "🔔",
        
        # New patterns from latest screenshot
        "рџ—“пёЏ": "🗓️",
        "в˜ЂпёЏ": "☀️",
        "рџЋ’": "🎒",
        "в¬…": "⬅️",
        "рџ˜Љ": "😊",
        "📥ќ": "📥",
        "📥„": "📄",
        "📥…": "📅",
        "рџ“љ": "📚",
        "в­ђпёЏ": "⭐",
        "рџЌ‚": "🍂",
        "рџЌЃ": "🍁",
        "вќ„пёЏ": "❄️",
        "рџЊё": "🌸",
        "рџ¦‹": "🦋"
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    # Clean up double escapes or mistakes from previous runs
    content = content.replace("includes(" + UZ_APOS, "includes('" + UZ_APOS)
    
    # Standardize Uzbek apostrophes
    content = re.sub(r"([a-zA-Z])'([a-zA-Z])", r"\1" + UZ_APOS + r"\2", content)
    
    # Specific fix for O'zbekiston and others if they still have garbage
    content = re.sub(r"O[^a-zA-Z\s]{1,5}zbekiston", "O" + UZ_APOS + "zbekiston", content)
    content = re.sub(r"o[^a-zA-Z\s]{1,5}yinlar", "o" + UZ_APOS + "yinlar", content)
    
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
