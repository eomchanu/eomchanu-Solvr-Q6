export interface User {
  id: number
  nickname: string
  createdAt: string
  updatedAt: string
}

export interface NewUserDto {
  nickname: string
}