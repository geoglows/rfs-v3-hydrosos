import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";

export async function addRasterLayer(map, tifUrl) {
  console.log("Loading TIFF:", tifUrl);

  const response = await fetch(tifUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch TIFF: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();

  console.log("Downloaded TIFF");

  const georaster = await parseGeoraster(arrayBuffer);

  console.log("Parsed raster", georaster);

  const layer = new GeoRasterLayer({
    georaster,
    opacity: 0.8,
    resolution: 128
  });

  layer.addTo(map);

  console.log("Added raster layer");

  return layer;
}