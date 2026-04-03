import os

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if "activePhase === 'pro'" in line:
            print(f"PRO BLOCK: {i+1}")
