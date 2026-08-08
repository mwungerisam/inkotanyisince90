from pathlib import Path
import urllib.request
import hashlib
from PIL import Image

path = Path('public/favicon.ico')
if not path.exists():
    raise FileNotFoundError(path)

with open(path, 'rb') as f:
    data = f.read()
print('local_size', len(data))
print('local_sha256', hashlib.sha256(data).hexdigest())
img = Image.open(path)
print('format', img.format)
print('n_frames', getattr(img, 'n_frames', 1))
print('sizes', [img.size])
for i in range(getattr(img, 'n_frames', 1)):
    try:
        img.seek(i)
        print('frame', i, 'size', img.size, 'mode', img.mode)
    except EOFError:
        break

remote = urllib.request.urlopen('http://localhost:3000/favicon.ico').read()
print('remote_size', len(remote))
print('remote_sha256', hashlib.sha256(remote).hexdigest())
print('same', data == remote)
