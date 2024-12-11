import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/supabase'
import nodemailer from 'nodemailer'

// メール送信用のトランスポーター設定
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

type OverdueLoan = {
  loan_id: string
  user: {
    name: string
    email: string
  }
  book: {
    title: string
  }
  due_date: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 延滞書籍の検索
    const { data: loans, error: loansError } = await supabase
      .from('loans')
      .select(`
        loan_id,
        due_date,
        users (
          name,
          email
        ),
        books (
          title
        )
      `)
      .lt('due_date', new Date().toISOString())
      .is('return_date', null)

    if (loansError) {
      throw loansError
    }

    const overdueLoans = loans as unknown as OverdueLoan[]

    // 各延滞者へのメール送信処理
    for (const loan of overdueLoans) {
      const notificationTemplate = `
        ${loan.user.name} 様

        図書館からの延滞通知

        以下の書籍の返却期限が過ぎております：
        書籍名：${loan.book.title}
        返却期限：${new Date(loan.due_date).toLocaleDateString()}

        速やかにご返却いただきますようお願いいたします。

        ※このメールは自動送信されています。
      `

      // メール送信
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: loan.user.email,
          subject: '【図書館】書籍返却期限超過のお知らせ',
          text: notificationTemplate,
        })

        // 送信記録の保存
        const { error: notificationError } = await supabase
          .from('overdue_notifications')
          .insert({
            loan_id: loan.loan_id,
            sent_date: new Date().toISOString(),
            notification_type: 'EMAIL',
            status: 'SENT'
          })

        if (notificationError) {
          throw notificationError
        }
      } catch (error) {
        // メール送信失敗の記録
        await supabase
          .from('overdue_notifications')
          .insert({
            loan_id: loan.loan_id,
            sent_date: new Date().toISOString(),
            notification_type: 'EMAIL',
            status: 'FAILED'
          })
      }
    }

    return res.status(200).json({
      success: true,
      message: `${overdueLoans.length}件の延滞通知を送信しました`,
      notifiedCount: overdueLoans.length
    })

  } catch (error) {
    console.error('延滞通知送信エラー:', error)
    return res.status(500).json({
      success: false,
      error: '延滞通知の送信に失敗しました'
    })
  }
}