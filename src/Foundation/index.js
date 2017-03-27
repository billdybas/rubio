'use strict'

import Container from './Container'
import Provider from './Provider'
import Service from './Service'
import * as Utils from './Utils'

// TODO: Test if this is how I think exporting Utils should work, or
// if I need to reexport every function in Utils
export default { Container, Provider, Service, Utils }
