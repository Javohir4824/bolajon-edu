import os
import re

replacements = {
    "рџ“ђ": "📐",
    "рџЋ­": "🎭",
    "рџ—ЈпёЏ": "🗣️",
    "рџЊ±": "🌱",
    "рџЋЁ": "🎨",
    "К»": "'",
    "Кј": "'",
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
    "вЂ˜": "'",
    "вЂ™": "'",
    "вЂњ": '"',
    "вЂќ": '"',
    "вЂ“": "-",
    "вЂ—": "-",
    "К»": "'",
    "Кј": "'",
    "oвЂ˜": "o'",
    "OвЂ˜": "O'",
    "oвЂ™": "o'",
    "nвЂ™": "n'",
    "tвЂ™": "t'",
    "nвЂ˜": "n'",
}

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original_content = content
        for old, new in replacements.items():
            content = content.replace(old, new)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")

def main():
    root_dir = r"c:\Users\Anwender\Desktop\Bolajon Edu Platform\src"
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.js', '.jsx', '.css', '.html')):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
