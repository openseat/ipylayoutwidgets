#!/usr/bin/env python

import argparse
from os.path import dirname, abspath, join
from notebook.nbextensions import install_nbextension


def install(**kwargs):
    """Install the bqplot nbextension.

    Parameters
    ----------
    user: bool
        Install for current user instead of system-wide.
    symlink: bool
        Symlink instead of copy (for development).
    overwrite: bool
        Overwrite previously-installed files for this extension
    **kwargs: keyword arguments
        Other keyword arguments passed to the install_nbextension command
    """
    directory = join(dirname(abspath(__file__)), 'static', 'ipylayoutwidgets')
    install_nbextension(directory, **kwargs)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Installs the ipylayout widgets")
    parser.add_argument("-u", "--user",
                        help="Install as current user instead of system-wide",
                        action="store_true")
    parser.add_argument("-s", "--symlink",
                        help="Symlink instead of copying files",
                        action="store_true")
    parser.add_argument("-f", "--force",
                        help="Overwrite any previously-installed files for this extension",
                        action="store_true")
    parser.add_argument("-p", "--prefix",
                        help="Install into this prefix, e.g. ${CONDA_ENV_PATH}",
                        action="store")
    parser.add_argument("-o", "--overwrite",
                        help="Remove existing contents from install location",
                        action="store_true")
    args = parser.parse_args()
    install(user=args.user, symlink=args.symlink, overwrite=args.force, prefix=args.prefix)