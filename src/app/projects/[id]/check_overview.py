import sys
import re

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Focus on activePhase === 'pro' && activeSubTab === 'overview'
start_line = -1
end_line = -1
for i, line in enumerate(lines):
    if "activePhase === 'pro' && activeSubTab === 'overview'" in line:
        start_line = i
    if i > start_line and start_line != -1 and "AnimatePresence" in line:
        end_line = i
        break

if start_line == -1 or end_line == -1:
    print("Could not find block")
    sys.exit(1)

print(f"Checking block from line {start_line+1} to {end_line+1}")

stack = []
for i in range(start_line, end_line + 1):
    line = lines[i]
    opens = re.findall(r'<div\b', line)
    closes = re.findall(r'</div>', line)
    
    for _ in opens:
        stack.append(i + 1)
    for _ in closes:
        if stack:
            stack.pop()
        else:
            print(f"Extra </div> at line {i + 1}")

print(f"Imbalance in this block: {len(stack)}")
if stack:
    for s in stack:
        print(f"  Unclosed <div> at line {s}: {lines[s-1].strip()[:50]}")
