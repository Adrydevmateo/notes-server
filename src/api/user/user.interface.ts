export interface IUser {
    id: string
    email: string
    password: string
    notes: Array<TNote>
}

type TNote = {
    id: string
    title: string
    description: string
    content: string
}
