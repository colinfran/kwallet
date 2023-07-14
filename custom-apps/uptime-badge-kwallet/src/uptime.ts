import axios from 'axios'

class Uptime {
    private readonly baseurl: string = 'https://betteruptime.com/api/v2/monitors'
    private readonly id: number
    private readonly token: string

    constructor(id: number) {
        this.id = id
        this.token = String(process.env.BETTERUPTIME_TOKEN)
    }

    public async status(): Promise<boolean> {
        const url = this.baseurl + '/' + this.id

        try {
            let uptime = await axios({
                method: 'GET',
                url,
                headers: {
                    Authorization: 'Bearer ' + this.token
                }
            })

            return uptime.data?.data?.attributes?.status === 'up' ? true : false
        } catch (error: any) {
            return false
        }
    }
}

export default Uptime
