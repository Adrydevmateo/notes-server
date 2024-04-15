export type TUserDTO = { id?: string, username?: string, password?: string, token?: string }
export type TUserCRUDResponse = { OK?: boolean, msg?: string, data?: TUserDTO }