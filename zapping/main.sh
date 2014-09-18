#!/bin/bash

curl -s `curl -s https://www.pplog.net/zapping | cut -d'"' -f2` | grep h1 | sed 's/<.\?h1>//g'
