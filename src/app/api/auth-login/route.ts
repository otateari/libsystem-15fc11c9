import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/supabase'
import { createHash } from 'crypto'

type LoginRequest = {
  email: string
  password: string
}

type LoginResponse = {
  success: boolean
  token?: string
  user?: any
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  }

  try {
    const { email, password }: LoginRequest = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'メールアドレスとパスワードは必須です'
      })
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return res.status(401).json({
        success: false,
        message: '認証に失敗しました。メールアドレスとパスワードを確認してください。'
      })
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError) {
      return res.status(500).json({
        success: false,
        message: 'ユーザー情報の取得に失敗しました'
      })
    }

    const session = authData.session
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'セッションの作成に失敗しました'
      })
    }

    return res.status(200).json({
      success: true,
      token: session.access_token,
      user: {
        id: userData.user_id,
        email: userData.email,
        name: userData.name,
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました'
    })
  }
}