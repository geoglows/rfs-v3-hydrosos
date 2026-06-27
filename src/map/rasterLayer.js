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
  console.log(georaster);

  console.log("Parsed raster", georaster);

  const layer = new GeoRasterLayer({
    georaster,
    resolution: 128,
    pixelValuesToColorFn: (values) => {
      const [r, g, b] = values;
  
      if (r === 0 && g === 0 && b === 0) {
        return null;
      }
  
      return `rgb(${r},${g},${b})`;
    }
  });

  layer.addTo(map);

  console.log("Added raster layer");

  return layer;
}