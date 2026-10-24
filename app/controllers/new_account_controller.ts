import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * POC deployments default to closed registration in production.
 * Temporarily set CFO_ALLOW_SIGNUP=true to provision a first account.
 */
const signupEnabled = () =>
  process.env.NODE_ENV !== 'production' || process.env.CFO_ALLOW_SIGNUP === 'true'

export default class NewAccountController {
  async create({ inertia, response }: HttpContext) {
    if (!signupEnabled()) return response.notFound()
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth }: HttpContext) {
    if (!signupEnabled()) return response.notFound()
    const { fullName, email, password } = await request.validateUsing(signupValidator)
    const user = await User.create({ fullName, email, password })

    await auth.use('web').login(user)
    response.redirect().toRoute('dashboard')
  }
}
