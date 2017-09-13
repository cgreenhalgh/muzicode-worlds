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

Open it
```
docker run -it --rm -p 4200:4200 -v `pwd`:/root/work mcw /bin/sh
cd /root/work/
```

Angular
```
npm install -g @angular/cli
```
One time:
```
ng new mcw-app
```
```
cd mcw-app
ng serve --host=0.0.0.0
```

