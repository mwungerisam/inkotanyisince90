import urllib.request

html = urllib.request.urlopen('http://localhost:3000').read().decode('utf-8', 'ignore')
head_start = html.find('<head>')
head_end = html.find('</head>', head_start)
head = html[head_start:head_end] if head_start != -1 and head_end != -1 else html
for line in head.splitlines():
    s = line.strip()
    if 'rel="icon"' in s or 'rel="shortcut icon"' in s or 'apple-touch-icon' in s or '<title>' in s or 'theme-color' in s:
        print(s)
