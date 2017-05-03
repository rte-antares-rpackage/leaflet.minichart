# leaflet.minichart V0.2.4 (XXXX-XX-XX)

## Bugfixes
* Charts had buggy behavior if all data values were equal to 0 at some point. (#5)
* Charts were not firing mouse events with leaflet>= 1.0. (#2)

# leaflet.minichart V0.2.3 (2017-05-02)

## Bugfixes
* Removing a minichart from a map was not possible.
* Coordinates of charts were not updated after a zoom with `leaflet 1.0.X`
* Options passed to `L.minichart` were modified.
* Vertical position of barcharts was incorrect.
