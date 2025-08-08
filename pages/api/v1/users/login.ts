import { NextApiRequest, NextApiResponse } from 'next'
import { execute } from '../_helpers'
import { verifyCredentialToken } from './_auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { credential } = req.body
    const payload = await verifyCredentialToken(credential)
    const email = payload?.email

    if (!email) return res.status(401).json({ msg: 'Invalid token payload' })

    const [user] = await execute('_users.sp_get_user', { email })

    if (!user?.isadmin) {
      return res.status(403).json({ msg: 'El acceso es restringido a administradores.' })
    }

    return res.status(200).json(user)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: 'Error de autenticación' })
  }
}
