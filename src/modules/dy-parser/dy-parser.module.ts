import { Common } from '../../common.ts'

class ServiceDyParser {
  handle(): RouterMiddleware<'/dy-parser'> {
    return async (ctx) => {}
  }
}

export const serviceKfc = new ServiceDyParser()
