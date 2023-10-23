#!/bin/bash

pip install gunicorn==21.2.0
python3 -m gunicorn -b 0.0.0.0:5000 'server:app'
