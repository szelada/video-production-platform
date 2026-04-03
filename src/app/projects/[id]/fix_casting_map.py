import re

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace {casting.map with {(casting || []).map
# Use regex to be flexible with whitespace
new_content = re.sub(r'\{\s*casting\.map', '{(casting || []).map', content)

if new_content != content:
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated casting.map calls")
else:
    print("Could not find casting.map calls")
