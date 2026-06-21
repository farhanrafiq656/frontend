import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../store/filtersSlice';
import L from 'leaflet';

export default function DrawBoundaryControl() {
  const map = useMap();
  const dispatch = useDispatch();
  const drawnLayerRef = useRef(null);
  const drawnItems = useRef(new L.FeatureGroup());

  useEffect(() => {
    map.addLayer(drawnItems.current);

    let drawControl;
    try {
      const LD = require('leaflet-draw');
      drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems.current, remove: true },
        draw: {
          polygon: { allowIntersection: false, showArea: true },
          polyline: false, rectangle: false, circle: false, marker: false, circlemarker: false,
        },
      });
      map.addControl(drawControl);
    } catch (_) {}

    const onCreated = (e) => {
      drawnItems.current.clearLayers();
      drawnLayerRef.current = e.layer;
      drawnItems.current.addLayer(e.layer);

      const latLngs = e.layer.getLatLngs()[0];
      // GeoJSON expects [lng, lat], Leaflet gives [lat, lng] — swap here
      const coords = latLngs.map((ll) => [ll.lng, ll.lat]);
      coords.push(coords[0]); // close the ring

      const polygon = { type: 'Polygon', coordinates: [coords] };
      dispatch(setFilter({ boundary: JSON.stringify(polygon), lat: '', lng: '', radiusMiles: '' }));
    };

    const onDeleted = () => {
      dispatch(setFilter({ boundary: '' }));
    };

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.DELETED, onDeleted);

    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.DELETED, onDeleted);
      map.removeLayer(drawnItems.current);
      if (drawControl) map.removeControl(drawControl);
    };
  }, [map, dispatch]);

  return null;
}
