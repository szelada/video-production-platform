import sys
import os

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

patterns = [
    "activePhase === 'pre' && activeSubTab === 'resumen'",
    "(activePhase === 'pre' || activePhase === 'pro') && activeSubTab === 'personalizacion'",
    "activePhase === 'pro' && activeSubTab === 'overview'",
    "activePhase === 'pro' && activeSubTab === 'tasks'",
    "activePhase === 'pro' && activeSubTab === 'finance'",
    "activePhase === 'pro' && activeSubTab === 'logistics'",
    "brandingInnerTab === 'global'",
    "brandingInnerTab === 'credencial'"
]

for pattern in patterns:
    found = False
    for i, line in enumerate(lines):
        if pattern in line:
            print(f"Found '{pattern}' at line {i+1}")
            found = True
    if not found:
        print(f"NOT FOUND: '{pattern}'")
