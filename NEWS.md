# leaflet.minichart V0.2.4 (2017-05-03)

## Bugfixes
* Charts had buggy behavior if all data values were equal to 0 at some point. (#5)
* Charts were not firing mouse events with leaflet>= 1.0. (#2)
* Incorrect field `main` in `package.json` made usage with `npm` impossible.

# leaflet.minichart V0.2.3 (2017-05-02)

## Bugfixes
* Removing a minichart from a map was not possible.
* Coordinates of charts were not updated after a zoom with `leaflet 1.0.X`
* Options passed to `L.minichart` were modified.
* Vertical position of barcharts was incorrect.
