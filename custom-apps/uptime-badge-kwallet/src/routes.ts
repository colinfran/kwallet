import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { DataResponse } from './types'
import Controller from './controller'

class Routes extends Controller {
    constructor() {
        super()
    }

    protected routes(app: FastifyInstance): void {
        app.get('/', this.home)
        app.get('/:id', this.endpoint)
    }

    protected async override(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
        let response: DataResponse = {
            code: 404,
            status: false,
            messages: "Looks like the endpoint you're looking for can't be found."
        }

        reply.status(response.code).send(response)
    }

    protected async error(error: FastifyError, _request: FastifyRequest, reply: FastifyReply): Promise<void> {
        console.error(error)

        let response: DataResponse = {
            code: error.statusCode as number,
            status: false,
            messages: 'An error occurred either from the client or server.',
            error
        }

        reply.status(response.code).send(response)
    }
}

export default Routes
