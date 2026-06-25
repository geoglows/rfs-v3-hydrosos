import parseGeoraster from "https://cdn.skypack.dev/georaster";
import GeoRasterLayer from "https://cdn.skypack.dev/georaster-layer-for-leaflet";

export async function addRasterLayer(map, url) {
  const arrayBuffer = await fetch(url).then(r => r.arrayBuffer());
  const georaster = await parseGeoraster(arrayBuffer);

  const layer = new GeoRasterLayer({
    georaster,
    opacity: 0.7
  });

  layer.addTo(map);
}