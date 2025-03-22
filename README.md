TODO
====
- make bin
  - dans la ci avec le chemin vers http
✔ make fmt
✔ make lint
✔ make coverage
✔ use as bin
✔ alternative to make (velociraptor)
- generate lockfile from import map
- use lockfile
- git hooks
- use as lib
- versionning


conclusion
==========
- hard to manage std deps (hard to find path,...)
- error with iterable typing
- fmt not configurable => https://dprint.dev/cli/
- can't filter spec test
- small config params for eslint and not configurable
- can't configure coverage for now
- handle version as v6.3.2 and 6.3.2 => no convention



marche
------
echo "hello"
docker ps
cat
less
sleep
wget
find . -type f -name makefile
pwd

marche pas 
----------
docker-compose // car surement pas dans le path
cd // bash ==> si on le fait dans unshell, on peut utiliser dirs
htop // normal
watch // normal

test
----
// build in bash
dirs
wait
read
eval 
exec
exit
bg
history
jobs
kill // ca peut marcher ya un bin
local
source
export FOO=bar
alias // risque de pas marcher (bash)
alias baz="bar" // risque de pas marcher (bash)
echo "hello" >> /tmp/foo

// autre
make
make run
bash -c "echo hello" 
sh 
timeout sleep
less
echo $(which vr)
echo "foo" | base64 - 
ps -aux | grep python 
echo $(which deno) | base64 -
sudo apt update 
git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -10
QUX=true echo $QUX 
make build && make start 
make build || make start
ssh  <--

TODO
- trouver la bonne abstration pour la sortie des commandes (dans le cas du stream)
    voir:
        https://github.com/c4spar/deno-dzx
        https://github.com/sindresorhus/execa
