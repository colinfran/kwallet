import { FastifyReply, FastifyRequest } from 'fastify'
import { Shields } from './types'
import Uptime from './uptime'

class Controller {
    public async home(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const { repository } = require(__dirname + '/../app.json')
        return reply.redirect(302, repository)
    }

    public async endpoint(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const {
            // @ts-ignore
            label = 'website',
            // @ts-ignore
            label_color = '#555',
            // @ts-ignore
            style = 'flat',
            // @ts-ignore
            down_message = 'down',
            // @ts-ignore
            down_color = '#e05d44',
            // @ts-ignore
            up_message = 'up',
            // @ts-ignore
            up_color = '#4c1',
            // @ts-ignore
            logo = undefined,
            // @ts-ignore
            logo_color = undefined,
        } = request.query

        // @ts-ignore
        const { id } = request.params

        let uptime = new Uptime(id || 404)
        let status = await uptime.status()

        let message = status === true
            ? up_message
            : down_message
        let color = status === true
            ? up_color
            : down_color

        let response: Shields = {
            schemaVersion: 1,
            label,
            labelColor: label_color,
            style,
            message,
            color,
            isError: false,
            namedLogo: logo,
            logoColor: logo_color,
            cacheSeconds: 300
        }

        return reply.status(200).send(response)
    }
}

export default Controller
