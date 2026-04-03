import os

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "activeSubTab === 'personalizacion'" in line:
        print(f"PERSONALIZACION START: {i+1}")
    if "activeSubTab === 'overview'" in line:
        print(f"OVERVIEW START: {i+1}")
