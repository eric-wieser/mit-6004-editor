"""
Usage:
	convert.py <fname>.json [<output>, default <fname>]
	convert.py <dirname> [<output>.json, default <dirname>.json]

"""
import json
from pathlib import Path
import shutil
import os

def jsonf_to_fs(inpath, outpath, overwrite=False):
	with inpath.open() as f:
		indata = f.read()

	return json_to_fs(indata, outpath)

def json_to_fs(data, outpath, overwrite=False):
	def dump_list(l, each, indent=''):
		f.write(indent + '[\n')
		for i, item in enumerate(l):
			f.write(each(item, indent+'    '))
			if i != len(l) - 1:
				f.write(',\n')
			else:
				f.write('\n')
		f.write(indent + ']')


	def custom_dump(v, f):
		def inner_dump(item, indent):
			return indent + json.dumps(item, sort_keys=True)

		if type(v) == list:
			dump_list(v, inner_dump)
		else:
			json.dump(v, f, indent=4, sort_keys=True, separators=(',', ': '))

	# delete the existing destination
	if overwrite:
		try:
			shutil.rmtree(str(outpath))
		except FileNotFoundError:
			pass

	try:
		# recreate it
		outpath.mkdir()
	except FileExistsError:
		pass

	# unpack metadata
	for k, val in data.items():
		if k == 'state':
			continue
		with (outpath / '{}.json'.format(k.lstrip('/'))).open('w') as f:
			custom_dump(val, f)

	# unpack modules
	for name, state in data['state'].items():
		subdir = outpath / name.lstrip('/')
		# check this stays within the folder
		subdir.relative_to(outpath)
		subdir.mkdir(parents=True, exist_ok=True)

		for k, v in state.items():
			if k == 'test' and len(v) == 1 and len(v[0]) == 2 and v[0][0] == 'test' and v[0][1]:
				with (subdir / '{}.txt'.format(k)).open('w') as f:
					f.write(v[0][1])
			else:
				with (subdir / '{}.json'.format(k)).open('w') as f:
					custom_dump(v, f)

def fs_to_jsonf(in_dir, out_file):
	data = fs_to_json(in_dir)
	with out_file.open('w') as f:
		json.dump(data, f)

def fs_to_json(in_dir):
	data = {}

	# load metadata
	for p in in_dir.iterdir():
		if p.is_file() and p.suffix == '.json':
			with p.open() as f:
				data[p.stem] = json.load(f)

	def scan(d):
		files = [p for p in d.iterdir() if p.is_file() and (p.suffix == '.json' or p.name == 'test.txt')]
		if files:
			curr = {}
			for fname in files:
				with fname.open() as f:
					if fname.name == 'test.txt':
						curr[fname.stem] = [['test', f.read()]]
					else:
						curr[fname.stem] = json.load(f)

			data['state']['/'+str(d.relative_to(in_dir)).replace('\\', '/')] = curr

		for p in d.iterdir():
			if p.is_dir():
				scan(p)

	# load modueles
	data['state'] = {}
	for p in in_dir.iterdir():
		if p.is_dir():
			scan(p)

	return data

if __name__ == '__main__':
	import sys

	if len(sys.argv) == 2:
		inout = Path(sys.argv[1])
		if inout.suffix == '.json':
			in_file = inout
			out_dir = inout.with_suffix('')
			print("Converting {} to a folder tree".format(inout))
			jsonf_to_fs(in_file, out_dir)

		elif inout.suffix == '':
			in_dir = inout
			out_file = inout.with_suffix('.json')
			print("Converting {} to JSON".format(inout))
			fs_to_jsonf(in_dir, out_file)
		else:
			raise SystemExit("Expected a json file or a folder")

	elif len(sys.argv) == 3:
		in_fd = Path(sys.argv[1])
		out_fd = Path(sys.argv[2])

		if in_fd.suffix == '.json':
			print("Converting {} to a folder tree at {}".format(in_fd, out_fd))
			jsonf_to_fs(in_fd, out_fd)
		elif out_fd.suffix == '.json':
			print("Converting {} to JSON at {}".format(in_fd, out_fd))
			fs_to_jsonf(in_fd, out_fd)
		else:
			raise SystemExit("Expected a json file or a folder")

	else:
		raise SystemExit(__doc__.strip())
