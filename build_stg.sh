#!/bin/bash
#This script is used to complete the process of build staging

npm install
forever -a start SocketServer.js ;
