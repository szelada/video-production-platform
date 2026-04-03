import sys
import os
import re

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove comments for counting
content_no_comments = re.sub(r'\{?/\*.*?\*/\}?', '', content, flags=re.DOTALL)
content_no_comments = re.sub(r'//.*', '', content_no_comments)

def count_tokens(text):
    div_open = text.count('<div')
    div_close = text.count('</div>')
    brace_open = text.count('{')
    brace_close = text.count('}')
    paren_open = text.count('(')
    paren_close = text.count(')')
    
    return {
        'div': (div_open, div_close),
        'brace': (brace_open, brace_close),
        'paren': (paren_open, paren_close)
    }

# Check branding blocks
global_block = re.search(r'\{brandingInnerTab === \'global\' && \(.*?\)\}', content, re.DOTALL)
if global_block:
    print("Global Block Stats:")
    stats = count_tokens(global_block.group(0))
    print(f"  Divs: {stats['div'][0]} / {stats['div'][1]}")
    print(f"  Braces: {stats['brace'][0]} / {stats['brace'][1]}")
    print(f"  Parens: {stats['paren'][0]} / {stats['paren'][1]}")

credencial_block = re.search(r'\{brandingInnerTab === \'credencial\' && \(.*?\)\}', content, re.DOTALL)
if credencial_block:
    print("Credencial Block Stats:")
    stats = count_tokens(credencial_block.group(0))
    print(f"  Divs: {stats['div'][0]} / {stats['div'][1]}")
    print(f"  Braces: {stats['brace'][0]} / {stats['brace'][1]}")
    print(f"  Parens: {stats['paren'][0]} / {stats['paren'][1]}")

print("Entire File (roughly):")
stats = count_tokens(content)
print(f"  Divs: {stats['div'][0]} / {stats['div'][1]}")
print(f"  Braces: {stats['brace'][0]} / {stats['brace'][1]}")
print(f"  Parens: {stats['paren'][0]} / {stats['paren'][1]}")
