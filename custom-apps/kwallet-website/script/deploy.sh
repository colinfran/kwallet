#!/bin/bash

# create build folder
mkdir -p build

# copy files to build folder
rsync -av --exclude='package.json' --exclude='package-lock.json' --exclude='node_modules' --exclude='.git' --exclude='build' --exclude='script' ./ ./build/

