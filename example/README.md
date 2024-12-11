# Working with the package

This package contains a range of pre-designed user interface elements for your map.
This guide will provide you with detailed instructions on how to incorporate these
elements into your map and customize them to suit your specific requirements.
Live examples of how they can be used, along with links to the relevant code, will also be provided.

## Controls

This section presents all UI components that belong to the category of controls.
These include simple zoom and tilt controls, as well as more advanced controls such as the search control.

### Simple controls

This type of controls includes the following:

- `MMapGeolocationControl` – Display geolocation control on a map
- `MMapZoomControl` – Display zoom control on a map
- `MMapRotateControl` – Display rotate control on a map
- `MMapTiltControl` – Display tilt control on a map
- `MMapRotateTiltControl` – Display rotate and tilt in one control

The `MMapZoomControl`, `MMapRotateControl`, `MMapTiltControl`, `MMapRotateTiltControl` controls have the same props:

| Props name | Description                                           |
| ---------- | ----------------------------------------------------- |
| easing     | Easing function for map location animation (optional) |
| duration   | Map location animate duration (optional)              |

The parameters for the `MMapGeolocationControl` are slightly different:

| Props name          | Description                                |
| ------------------- | ------------------------------------------ |
| onGeolocatePosition | Geolocation request callback               |
| source              | Data source id for geolocation placemark   |
| easing              | Easing function for map location animation |
| duration            | Map location animate duration              |

See a [live-example](./controls/vanilla/index.html) with simple controls.

### Rich controls

More comprehensive controls include the following classes:

#### MMapSearchControl

`MMapSearchControl` – adds a control to the map in the form of a search bar.
It also has built-in suggest hints when entering the name of a place or organization.

`MMapSearchControl` has the following parameters:

| Props name   | Description                                                                           |
| ------------ | ------------------------------------------------------------------------------------- |
| search       | A function that overrides the search function. By default, `mappable.search` is used. |
| suggest      | A function that overrides the hint function. By default, `mappable.suggest` is used   |
| searchResult | The callback that receives the search results.                                        |

`MMapSearchControl` does not display markers on the map, it only returns coordinates and location parameters,
the developer is responsible for displaying them on the map.

#### MMapRouteControl

`MMapRouteControl` – adds a control to the map in the form of a route panel.
There are also built-in suggest hint when entering the name of a place, panel control buttons
and the ability to specify a waypoint with a click on the map.

`MMapRouteControl` has the following parameters:

| Props name            | Description                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| geolocationTextInput  | Text that will be displayed in the input field when the user's geolocation is selected.                                          |
| clearFieldsText       | Text of the route reset button.                                                                                                  |
| changeOrderText       | The text of the route change order button.                                                                                       |
| availableTypes        | Array of available route types in the routing panel (`driving`, `transit`, `truck`, `walking`).                                  |
| truckParameters       | A parameter object for a truck (only for `type=truck`).                                                                          |
| waypoints             | Array with coordinates of waypoints (`[LngLat, LngLat]`).                                                                        |
| waypointsPlaceholders | Array with placeholders for waypoint inputs (`[string, string]`).                                                                |
| autofocus             | Flag that the first waypoint input should be in focus when opening.                                                              |
| search                | Function that overrides the search function. By default, `mappable.search` is used.                                              |
| suggest               | Function that overrides the suggest function. By default, `mappable.suggest` is used.                                            |
| route                 | Function that overrides the route function. By default, `mappable.route` is used.                                                |
| onMouseMoveOnMap      | Callback that is called when the user selects a waypoint on the map. It can be used to display a marker under the user's cursor. |
| onUpdateWaypoints     | Callback that is called when the user has changed the waypoints.                                                                 |
| onRouteResult         | Callback that receives a route between waypoints.                                                                                |
| onBuildRouteError     | Callback that is called if the route could not be set (route was not found or server error).                                     |

## Markers and popups

Markers are UI components that are linked to a coordinate on the map.
These components include the following classes:

- `MMapDefaultMarker` – a marker on the map. It can be of different sizes and contain an icon from a ready-made preset.
- `MMapPopupMarker` – a pop-up on the map with custom content.
  It may have a different position relative to the point it points to.

All markers have parameters from the [MMapMarker](https://mappable.world/docs/js-api/ref/index.html#MMapMarkerProps) base class.
But there are also specific parameters for each type of marker.

For `MMapDefaultMarker`:

| Props name | Description                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| iconName   | The name of the icon from the ready-made [icons preset](https://github.com/mappable-world/mappable-default-ui-theme/blob/main/docs/icons.generated.md) |
| color      | The name of the color from the ready-made colors preset or an object indicating the color for the day and night mode                                   |
| size       | The size of the marker. 3 sizes are available: `normal`, `small`, `micro`;                                                                             |
| title      | The title to display in the marker hint                                                                                                                |
| subtitle   | The subtitle to display in the marker hint                                                                                                             |
| staticHint | A flag to indicate that the hint is static or appears when the mouse hovers over the marker                                                            |
| popup      | The parameters for the embedded got into the marker                                                                                                    |

There are 2 live examples for `MMapDefaultMarker`:

- [Displaying markers on the map](./default-markers/vanilla/index.html)
- [Pop-up displays at the marker](./marker-popup/vanilla/index.html)

For `MMapPopupMarker`:

| Props name | Description                                                                     |
| ---------- | ------------------------------------------------------------------------------- |
| content    | The function of creating popup content                                          |
| position   | The position of the popup in relation to the point it is pointing to            |
| offset     | The offset in pixels between the popup pointer and the point it is pointing to. |
| show       | Hide or show popup on map                                                       |
| onClose    | Popup closing callback                                                          |
| onOpen     | Popup opening callback                                                          |

There is a [live example](./popups-on-map/vanilla/index.html) for `MMapPopupMarker` to demonstrate the possibilities of its operation.

## Default ruler

The default MMapDefaultRuler is a ready-made implementation of the MMapRuler module. It has ready-made visual styles and controls,
including double-clicking to delete a point and a steering wheel with two buttons: Finish for finishing editing and Delete for deleting all points.

| Props name    | Description                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| onFinish      | Ruler editing finish callback                                                                           |
| points        | Ruler points coordinates array                                                                          |
| zIndex        | Ruler layer zIndex                                                                                      |
| editable      | Flag that the ruler can be edited                                                                       |
| onUpdate      | Callback function, when updating the ruler                                                              |
| onUpdateEnd   | Callback function when the ruler update ends                                                            |
| onUpdateStart | Callback function when the ruler update starts                                                          |
| source        | Name for the ruler's data source                                                                        |
| type          | Type of ruler. `ruler` – line that measures the distance. `planimeter` - polygon that measures the area |
|               |

## Examples

- [Add controls to the map](./controls/vanilla/index.html)
  ([source code](https://github.com/mappable-world/mappable-default-ui-theme/tree/main/example/controls))
- [Add markers to the map](./default-markers/vanilla/index.html)
  ([source code](https://github.com/mappable-world/mappable-default-ui-theme/tree/main/example/default-markers))
- [Add a marker with a popup to the map](./marker-popup/vanilla/index.html)
  ([source code](https://github.com/mappable-world/mappable-default-ui-theme/tree/main/example/marker-popup))
- [Add a popup with custom content to the map](./popups-on-map/vanilla/index.html)
  ([source code](https://github.com/mappable-world/mappable-default-ui-theme/tree/main/example/popups-on-map))
- [Adding a search control to the map](./search-control/vanilla/index.html)
  ([source code](https://github.com/mappable-world/mappable-default-ui-theme/tree/main/example/search-control))
- [Adding a route control to the map](./route-control/vanilla/index.html)
  ([source code](https://github.com/mappable-world/mappable-default-ui-theme/tree/main/example/route-control))
- [Adding a default ruler to the map](./default-ruler/vanilla/index.html)
  ([source code](https://github.com/mappable-world/mappable-default-ui-theme/tree/main/example/default-ruler))
