#!/bin/bash
look -f $1'	' ~/local/share/engja | sed 's/\t /\n  /; s/ \/ /\n  /g'
