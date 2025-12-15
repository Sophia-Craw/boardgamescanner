export type GameObject = {
    stars?: number,
    name: string,
    published: number,
    upc: number,
    bgg_info: [
        {
            stars?: number,
            name: string,
            published: number,
            id: number,
            image_url: string,
            index: number,
            upc: number
        }
    ]
}

export type SingleGame = {
    index: number,
    stars?: number,
    name: string,
    published: number,
    id: number,
    image_url: string,
    upc: number
}