"""Usage: stats.py <dir>"""
import sys
import json

# requires numpy, matplotlib, and gitpython
import git
from matplotlib import pyplot as plt
import numpy as np

repo = git.Repo(sys.argv[1])

filepath = 'tests.json'

def item_gen():
	for commit in repo.iter_commits(paths=filepath):
		fobj = (commit.tree / filepath).data_stream
		data = json.loads(fobj.read().decode('utf8'))
		val = data.get('/project/test')
		if not val: continue
		val = val.split()[-1]
		try:
			val = float(val)
		except ValueError:
			continue
		yield (commit.message.split('\n')[0], val)


items = list(item_gen())
messages, values = zip(*items)

def draw():
	fig, ax = plt.subplots(figsize=(10, 6))
	y = np.arange(len(messages))
	ax.set(yticks=y, yticklabels=messages)
	ax.barh(y-0.4, values, height=0.8)
	ax.yaxis.tick_right()
	ax.set(xlabel='Benchmark')
	ax.grid()
	ax.set(xlim=ax.get_xlim()[::-1])
	fig.tight_layout()

draw()
plt.show()
