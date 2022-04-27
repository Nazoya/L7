import * as turf from '@turf/turf';
import { ImageTileLayer, Scene, LineLayer, ILayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class ImageTile extends React.Component {
  private scene: Scene;
  private gridLayer: ILayer;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  private updateGridLayer = () => {
    const bounds = this.scene['mapService'].getBounds();
    const bbox = [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]];
    console.log('bbox: ', bbox);
    const poly = turf.bboxPolygon(bbox as [number, number, number, number]);
    const data = { type: 'FeatureCollection', features: [poly] };

    if (this.gridLayer) {
      this.gridLayer.setData(data);
      return;
    }
    this.gridLayer = new LineLayer({ autoFit: false })
      .source(data)
      .size(2)
      .color('red')
      .shape('line');
    this.scene.addLayer(this.gridLayer);
  };

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'normal',
        zoom: 10,
        viewMode: '3D',
      }),
    });

    this.scene.on('mapchange', this.updateGridLayer);

    this.scene.on('loaded', () => {
      const layer = new ImageTileLayer();
      layer.source(
        'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        {
          parser: {
            type: 'rasterTile',
            tileSize: 256,
            minzoom: 6,
            maxZoom: 17,
            zoomOffset: 0,
            extent: [-180, -85.051129, 180, 85.051129],
          },
        },
      );

      this.scene.addLayer(layer);
      this.updateGridLayer();
    });
  }

  public render() {
    return (
      <>
        <div
          id="map"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </>
    );
  }
}
