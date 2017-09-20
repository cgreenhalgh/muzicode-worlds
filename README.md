# Muzicode Worlds

(beginnings of...)

A playful/gameful version of muzicodes.

The "worlds" are what you interact with via your instrument and
muzicodes. You can move between worlds for different experiences.
Worlds may be single user or shared (online).

Make dev environment:
```
docker build -t mcw dev
```

On Windows <10 (i.e. with Docker Toolkit) open the docker VM (default?!) in VirtualBox, settings, Shared Folders, add the Drive(s) that you will need to mount files from.
NB in Docker Toolkit also use the VirtualBox UI to add port-forwarding on the Virtual Box image (4200->4200 & 9876->9876).

Open it
```
docker run -it --rm -p 4200:4200 -p 9876:9876 -v `pwd`:/root/work mcw /bin/sh
cd /root/work/
```

Again, on windows <10 you may need to avoid file path mangling and enable tty:
```
wintty docker run -it --rm -p 4200:4200 -p 9876:9876 -v /`pwd`:/root/work mcw //bin/sh
```

(--no-bin-links is windows only)
```
cd /root/work/
cd mcw-app
npm install --no-bin-links
ng serve --host=0.0.0.0
ng build --bh /1/mcworlds/
```

