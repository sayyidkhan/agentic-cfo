import vine from '@vinejs/vine'

export const cfoMessageValidator = vine.create({
  message: vine.string().trim().minLength(2).maxLength(1500),
})
