This program gives you an offline environment to edit and test your beta, and saves the beta to a module-per file.

This means you can:
* easily back up the whole thing by making a copy
* bulk rename signals by opening the files in a text editor
* put your beta under version control, so you can see which modules you changed, and how your benchmark evolved over time

Installation
------------

1. Install python 3.5
2. On the command line, install bottle with `pip install bottle`
3. Download this repository

Use
---

To run the editor, open a command prompt in the folder you downloaded, and type:

    python -m server <folder-name

Where `folder-name` is the place that you want to store your work, eg:

    python -m server %USERPROFILE%\Documents\6.004-beta

This should open `localhost:6004` in your browser, with a most-likely empty jade editor

Import/export
-------------
To enable import/export features on the 6004 site, go to `http://localhost:6004/setup` and follow the instructions

After running this script, the local editor and online editor will be the same.

A new cloud icon will be on the toolbar. Clicking this will download a json file. If you drag and drop this json file onto another jade editor instance, it will load that file.


Saving
------

As far as I can tell, the editor will save whenever you run a test. Refreshing the page will throw out all changes from the last save, and reload from the folder on your hard drive. This is useful if you decide to change the files manually.
