import { AppModel } from './appModel'
import { DOMView } from './domView'
import { AppController } from './appController'

const model = new AppModel()
const domView = new DOMView(model)

new AppController(model, domView)

domView.start()
