import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/supabase'

type DuplicateCheckResponse = {
  isDuplicate: boolean
  duplicateFields: {
    email: boolean
    phone: boolean
  }
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DuplicateCheckResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      isDuplicate: false,
      duplicateFields: {
        email: false,
        phone: false,
      },
      message: 'メソッドが許可されていません。',
    })
  }

  try {
    const { email, phone } = req.body

    if (!email || !phone) {
      return res.status(400).json({
        isDuplicate: false,
        duplicateFields: {
          email: false,
          phone: false,
        },
        message: 'メールアドレスと電話番号は必須です。',
      })
    }

    const { data: emailCheck, error: emailError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    const { data: phoneCheck, error: phoneError } = await supabase
      .from('users')
      .select('phone')
      .eq('phone', phone)
      .single()

    const duplicateFields = {
      email: !!emailCheck,
      phone: !!phoneCheck,
    }

    const isDuplicate = duplicateFields.email || duplicateFields.phone

    let message = ''
    if (isDuplicate) {
      const duplicateItems = []
      if (duplicateFields.email) duplicateItems.push('メールアドレス')
      if (duplicateFields.phone) duplicateItems.push('電話番号')
      message = `${duplicateItems.join('と')}が既に登録されています。`
    } else {
      message = '重複する情報はありません。'
    }

    return res.status(200).json({
      isDuplicate,
      duplicateFields,
      message,
    })

  } catch (error) {
    console.error('重複チェックエラー:', error)
    return res.status(500).json({
      isDuplicate: false,
      duplicateFields: {
        email: false,
        phone: false,
      },
      message: 'サーバーエラーが発生しました。',
    })
  }
}