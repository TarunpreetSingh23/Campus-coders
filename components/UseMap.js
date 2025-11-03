"use client";
import { useMapEvents, MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationSelector({ setLocation, setAddress }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });

      // Reverse-geocode for address
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        setAddress(data.display_name || "Unknown location");
      } catch (err) {
        console.error("Error fetching address:", err);
        setAddress("Unable to get address");
      }
    },
  });
  return null;
}

export default function UseMap({ complaints = [], location, setLocation, setAddress }) {
  const center =
    location && location.lat && location.lng
      ? [location.lat, location.lng]
      : [20.5937, 78.9629];

  return (
    <MapContainer
      center={center}
      zoom={location && location.lat ? 13 : 5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {location && location.lat && (
        <Marker position={[location.lat, location.lng]}>
          <Popup>Your selected location</Popup>
        </Marker>
      )}

      {complaints.map((c, i) =>
        c.location?.lat && c.location?.lng ? (
          <Marker key={i} position={[c.location.lat, c.location.lng]}>
            <Popup>{c.complaint}</Popup>
          </Marker>
        ) : null
      )}

      <LocationSelector setLocation={setLocation} setAddress={setAddress} />
    </MapContainer>
  );
}
