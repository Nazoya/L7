import LineModel from '../../line/models/line';
import PointExtrudeModel from '../../point/models/extrude';
import PointFillModel from '../../point/models/fill';
import IMageModel from '../../point/models/image';
import NormalModel from '../../point/models/normal';
import TextModel from '../../point/models/text';
import ExtrudeModel from './extrude';
import FillModel from './fill';
import Ocean from './ocean';
import VectorModel from './vector';
import Water from './water';

export type PolygonModelType =
  | 'fill'
  | 'extrude'
  | 'line'
  | 'point_fill'
  | 'point_image'
  | 'point_normal'
  | 'point_extrude'
  | 'text'
  | 'water'
  | 'ocean'
  | 'vector';

const PolygonModels: { [key in PolygonModelType]: any } = {
  fill: FillModel,
  line: LineModel,
  extrude: ExtrudeModel,
  text: TextModel,
  point_fill: PointFillModel,
  point_image: IMageModel,
  point_normal: NormalModel,
  point_extrude: PointExtrudeModel,
  water: Water,
  ocean: Ocean,
  // point_fill: PointModels.fill,
  vector: VectorModel,
};
export default PolygonModels;
