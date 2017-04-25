import {register} from 'vega-dataflow';

import Label from './src/Label';
import LabelDefinition from './definitions/Label';

register(LabelDefinition, Label);

export {transform, definition} from 'vega-dataflow';
