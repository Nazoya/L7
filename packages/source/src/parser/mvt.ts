import {
  getArrayBuffer,
  getURLFromTemplate,
  Tile,
  TileLoadParams,
  TilesetManagerOptions,
} from '@antv/l7-utils';
// import { load } from '@loaders.gl/core';
// import { MVTWorkerLoader } from '@loaders.gl/mvt';
import { VectorTile, VectorTileLayer } from '@mapbox/vector-tile';
import { Feature } from 'geojson';
import Protobuf from 'pbf';
import { IParserData, IRasterTileParserCFG } from '../interface';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
};

export type MapboxVectorTile = {
  layers: { [_: string]: VectorTileLayer & { features: Feature[] } };
  // layers: { features: Feature[] };
};

const getVectorTile = async (
  url: string,
  tileParams: TileLoadParams,
  // eslint-disable-next-line no-unused-vars
  tile: Tile,
): Promise<MapboxVectorTile> => {
  const tileUrl = getURLFromTemplate(url, tileParams);
  const { x, y, z, signal } = tileParams;
  // const loaderOptions = {
  //   mvt: {
  //     // layers: ['gis_osm_buildings_a_free_1'],
  //     coordinates: 'wgs84',
  //     tileIndex: { x, y, z },
  //   },
  //   fetch: { signal },
  // };
  // console.log('get vector tile');

  // return load(tileUrl, MVTWorkerLoader, loaderOptions);
  //
  return new Promise((resolve) => {
    const xhr = getArrayBuffer({ url: tileUrl }, (err, data) => {
      if (err || !data) {
        // reject(err);
        resolve({ layers: {} });
      } else {
        const vectorTile = new VectorTile(
          new Protobuf(data),
        ) as MapboxVectorTile;
        for (const layerName of Object.keys(vectorTile.layers)) {
          const features = [];
          for (let i = 0; i < vectorTile.layers[layerName].length; i++) {
            const vectorTileFeature = vectorTile.layers[layerName].feature(i);
            const feature = vectorTileFeature.toGeoJSON(
              tileParams.x,
              tileParams.y,
              tileParams.z,
            );
            features.push(feature);
          }
          vectorTile.layers[layerName].features = features;
        }
        resolve(vectorTile);
      }
    });
    tile.xhrCancel = () => xhr.abort();
  });
};

export default function mapboxVectorTile(
  data: string,
  cfg?: IRasterTileParserCFG,
): IParserData {
  const getTileData = (tileParams: TileLoadParams, tile: Tile) =>
    getVectorTile(data, tileParams, tile);
  const tilesetOptions = { ...DEFAULT_CONFIG, ...cfg, getTileData };

  return {
    data,
    dataArray: [],
    tilesetOptions,
  };
}
