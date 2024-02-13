#!/bin/sh
for remote in \
  "https://gitea.pasindu.dev/brian/helios.git" \
  "https://github.com/MasterBrian99/helios.git"
do
  git remote set-url --delete --push origin $remote 2> /dev/null
  git remote set-url --add --push origin $remote
done

git remote show origin
