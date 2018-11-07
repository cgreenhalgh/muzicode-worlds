# Muzicode Worlds

(beginnings of...)

A playful/gameful version of muzicodes.

The "worlds" are what you interact with via your instrument and
muzicodes. You can move between worlds for different experiences.
Worlds may be single user or shared (online).

Make dev environment:
```
docker build -t mcw mcw-app
```

On Windows <10 (i.e. with Docker Toolkit) open the docker VM (default?!) in VirtualBox, settings, Shared Folders, add the Drive(s) that you will need to mount files from.
NB in Docker Toolkit also use the VirtualBox UI to add port-forwarding on the Virtual Box image (4200->4200 & 9876->9876).

Open it
```
docker run -it --rm -p 4200:4200 -p 9876:9876 mcw /bin/sh
```

Again, on windows <10 you may need to avoid file path mangling and enable tty:
```
wintty docker run -it --rm -p 4200:4200 -p 9876:9876 mcw /bin/sh
```

```
npm install 
ng serve --host=0.0.0.0
```

- open browser at http://localhost:4200
- click on world1
- (in chrome) open developer tools, and switch to mobile-style view (to enable touch events)
- "play" the on-screen keyboard
- look at the console logs to see notes being matched
- play A,B,G,G,D :-)

If you edit stuff and want to try it, "docker cp" updated files into the container.

