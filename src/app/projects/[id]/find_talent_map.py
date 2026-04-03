import os

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "scoutingCategory === 'casting'" in line:
        print(f"CASTING BLOCK START: {i+1}")
    if ".map(" in line and i > 5000: # We focus on the later parts of the file
        print(f"MAP CALL at {i+1}: {line.strip()}")
