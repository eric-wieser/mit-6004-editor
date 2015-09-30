from bottle import *
import sys
from pathlib import Path

sys.path.append('..')
import convert

BaseRequest.MEMFILE_MAX = 1024 * 1024


@get('/<p:path>')
def static(p):
	return static_file(p, '.')

@get('/')
def index():
	return static_file('editor.html', '.')

@post('/<fname>.json')
def upload(fname):
	convert.json_to_fs(request.json, Path(fname))

run(host='localhost', port=8080)