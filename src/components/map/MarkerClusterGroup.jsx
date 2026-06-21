import MarkerClusterGroup from 'react-leaflet-cluster';

export default function MarkerClusterGroupWrapper({ children }) {
  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false}>
      {children}
    </MarkerClusterGroup>
  );
}
