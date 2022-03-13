# Camelot

[Excalidraw](https://excalidraw.com) diagram repository

As I've begun using Excalidraw more and more to white board with folks I found I was dexporting key diagrams locally so I did not lose them then re-importing / exporting etc in an endless loop.

Worse, when other folks would draw stuff up you end up in the awkward place where you don't know where the source is, what the latest looks like etc. 

What we really need is a common repo we can all reason about, search, update etc to keep our common understanding discoverable and actionable.

Plus enterprise security teams don't like some unknown entity controlling where their IP is drawn up - strategic issue and all.

So Camelot (riff off excaliber if you did not catch that yet) was hatched. Hacked maybe. So anyone can stand up their own.

I built this with the excellent [Serverless Stack SST](https://serverless-stack.com/), an abstraction on top of [AWS CDK](https://aws.amazon.com/cdk/).

### Cognito

<img src="/images/cognito.jpg" alt="" width="300" />

### List

<img src="/images/Camelot.jpg" alt="" width="300" />

### Draw

<img src="/images/Draw.jpg" alt="" width="300" />

### Rename
<img src="/images/Rename.jpg" alt="" width="300" />

### Remove

<img src="/images/Remove.jpg" alt="" width="300" />

### Current Roadmap
- link one diagram to another 
    - when link is clicked replace current drawing with target drawing
    - show back button on diagrambuttons
    - remember hierarchy in local storage
    - keep diagrams navigated to in local storage during navigation 
    - clear navigation hierarchy and local diagrams when you return to list
    - bread crumb trail
- tests - started out as an experiment :- now it's a thing...
- By default anyone can edit your diagram - they are 'public'
- You can make your diagrams private and only make them public when you want to unleash them
- You can lock public diagrams you create so no one else can edit them
- Folks can request you make them editors for a diagram you create which you approve or reject
- You can create teams with members who can all edit diagrams created for the team
- Add a collaboration server integration so we can mob diagram drawing

