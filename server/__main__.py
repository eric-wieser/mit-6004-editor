from bottle import *
import bottle
import sys
from pathlib import Path
import os
import webbrowser

if not sys.argv[1]:
	raise SystemExit("Requires folder to edit as first argument")

edit_folder = Path(sys.argv[1])

sys.path.append('..')
import convert

BaseRequest.MEMFILE_MAX = 1024 * 1024

this_dir = os.path.dirname(__file__)
bottle.TEMPLATE_PATH = [this_dir]

@get('/<p:path>')
def static(p):
	return static_file(p, this_dir)

@get('/')
def index():
	data = convert.fs_to_json(edit_folder)
	return template('editor', data=data)

@get('/setup')
def setup():
	return template('setup')


@post('/json')
def upload():
	convert.json_to_fs(request.json, edit_folder)

host = 'localhost'
port = 6004
webbrowser.open('http://{}:{}'.format(host, port))
run(host=host, port=port)
