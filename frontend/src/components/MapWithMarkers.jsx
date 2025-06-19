import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-draw";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapControls = ({ markerData, onAreaSelected }) => {
  const map = useMap();
  const drawControlRef = useRef(null);

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    drawControlRef.current = new L.Control.Draw({
      edit: { featureGroup: drawnItems },
      draw: {
        polygon: true,
        rectangle: true,
        circle: false,
        marker: false,
        polyline: false,
      },
    });

    map.addControl(drawControlRef.current);

    const handleDrawCreated = (e) => {
      const layer = e.layer;
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);

      const shape = layer.getLatLngs()[0]; // outer ring
      const bounds = L.polygon(shape).getBounds();

      const selectedPoints = markerData.filter(({ lat, lon }) =>
        bounds.contains([lat, lon])
      );

      onAreaSelected(selectedPoints);
    };

    map.on(L.Draw.Event.CREATED, handleDrawCreated);

    return () => {
      map.off(L.Draw.Event.CREATED, handleDrawCreated);
      map.removeControl(drawControlRef.current);
    };
  }, [map, markerData, onAreaSelected]);

  return null;
};

const MapWithMarkers = ({ markerData, onAreaSelected, onMarkerClick }) => {
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const getIcon = (isSelected) => {
    if (isSelected) {
      // Use custom color for selected marker
      return new L.DivIcon({
        className: 'selected-marker',
        html: `<div style="background-color: red; border-radius: 50%; width: 25px; height: 25px; border: 2px solid white;"></div>`, // Custom icon for selected marker
      });
    } else {
      // Default marker icon
      return new L.Icon({
        iconUrl: markerIcon,
        iconSize: [25, 41], // default size
        iconAnchor: [12, 41], // anchor point
        popupAnchor: [1, -34], // popup anchor
        shadowUrl: markerShadow,
        shadowSize: [41, 41], // shadow size
      });
    }
  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MarkerClusterGroup>
        {markerData.map((pos, idx) => {
          const isSelected = selectedMarkerId === pos._id;
          return (
            <Marker
              key={idx}
              position={[pos.lat, pos.lon]}
              icon={getIcon(isSelected)} // Set icon based on selection
              eventHandlers={{
                click: () => {
                  onMarkerClick(pos._id); // Handle marker click
                  setSelectedMarkerId(pos._id); // Set selected marker's ID
                },
              }}
            />
          );
        })}
      </MarkerClusterGroup>
      <MapControls markerData={markerData} onAreaSelected={onAreaSelected} />
    </MapContainer>
  );
};

export default MapWithMarkers;
