export interface DataResponse {
    code: number
    status: boolean
    messages: string
    data?: object
    error?: object
}

export interface Shields {
    schemaVersion: number,
    label: string,
    message: string,
    color?: string,
    labelColor?: string,
    isError?: boolean,
    namedLogo?: string,
    logoSvg?: string,
    logoColor?: string,
    logoWidth?: string,
    logoPosition?: string,
    style?: string,
    cacheSeconds?: number
}
