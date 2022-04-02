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

### Diagram Drill Through with Bread Crumb

Highlight a diagram widget then tap the link button to pull up the link diagram dialog show below:

<img src="/images/LinkButton.jpg" alt="" width="300" />

<img src="/images/LinkDiagram.jpg" alt="" width="300" />

<img src="/images/DrillIn.jpg" alt="" width="300" />

<img src="/images/BreadCrumb.jpg" alt="" width="300" />

### Candidate Roadmap Items
- Remember who owns (created) and last modifies a diagram
- By default diagrams are private
- You can make your diagrams private and only make them public when you want to unleash them
- You can lock public diagrams you create so no one else can edit them
- Add a collaboration server integration so we can mob diagram drawing
- tests - started out as an experiment :- now it's a thing...
- playlists
    - create new playlist
    - select diagrams to include in playlist
    - order diagrams in playlist
    - play play list
    - up and left arrow keys = previous diagram in playlist
    - right and down arrow keys = next diagram in playlist
- auto save opt in
- manage version history - user can choose from history which version to go back to
- Folks can request you make them editors for a diagram you create which you approve or reject
- You can create teams with members who can all edit diagrams created for the team


