# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

__version__ = 'undefined'

exec(open('ipylayoutwidgets/version.py').read())

with open('README.md') as f:
    readme = f.read()

setup(
    name='ipylayoutwidgets',
    version=__version__,
    description='A collection of IPython widgets to position.size other widgets',
    long_description=readme,
    author='Jack Zentner',
    author_email='jack.zentner@gtri.gatech.edu',
    url='https://github.com/openseat/ipylayoutwidgets',
    install_requires=['ipywidgets'],
    license='BSD 3-Clause',
    packages=find_packages(exclude=('tests', 'docs')),
    include_package_data=True
)