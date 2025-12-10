export type GameObject = {
    name: string,
    published: number,
    upc: number,
    bgg_info: [
        {
            name: string,
            published: number,
            id: number,
            image_url: string
        }
    ]
}