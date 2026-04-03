import os

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    # Search for common syntax error patterns left by failed regex/replace
    if 'shadow-gray-200"-"' in line or 'shadow-gray-200" "-' in line or 'shadow-gray-200" -' in line:
        print(f"BINGO at {i+1}: {line.strip()}")
    if 'nulll' in line:
        print(f"BINGO 'nulll' at {i+1}: {line.strip()}")
