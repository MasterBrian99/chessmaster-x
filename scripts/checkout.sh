#!/bin/sh
for remote in \
  "https://gitea.pasindu.dev/brian/chessmaster-x.git" \
  "https://github.com/MasterBrian99/chessmaster-x.git"
do
  git remote set-url --delete --push origin $remote 2> /dev/null
  git remote set-url --add --push origin $remote
done

git remote show origin
