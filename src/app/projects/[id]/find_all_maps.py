import re

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Match something followed by .map(
matches = re.finditer(r'([a-zA-Z0-9_?.]+)\.map\(', content)
for match in matches:
    name = match.group(1)
    # Find line number
    pos = match.start()
    line_num = content[:pos].count('\n') + 1
    print(f"Line {line_num}: {name}.map(")
