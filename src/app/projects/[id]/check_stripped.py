import sys
import re

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the two big blocks
def strip_block(text, pattern):
    match = re.search(pattern, text, re.DOTALL)
    if match:
        print(f"Stripped block matching {pattern[:20]}...")
        return text.replace(match.group(0), "{/* STRIPPED */}")
    return text

content_stripped = strip_block(content, r'\{brandingInnerTab === \'global\' && \(.*?\)\}')
content_stripped = strip_block(content_stripped, r'\{brandingInnerTab === \'credencial\' && \(.*?\)\}')

def count_tokens(text):
    div_open = text.count('<div')
    div_close = text.count('</div>')
    return div_open, div_close

opens, closes = count_tokens(content_stripped)
print(f"Stripped File Stats: {opens} / {closes} (Diff: {opens - closes})")
