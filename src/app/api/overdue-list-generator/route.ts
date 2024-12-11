import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/supabase'
import { getLlmModelAndGenerateContent } from '@/utils/functions'

type OverdueBook = {
  loan_id: string
  book_id: string
  user_id: string
  loan_date: string
  due_date: string
  return_date: string | null
  title: string
  author: string
  isbn: string
  user_name: string
  email: string
  days_overdue: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 返却期限切れの貸出データを抽出
    const { data: overdueLoans, error: loansError } = await supabase
      .from('loans')
      .select(`
        *,
        books (
          title,
          author,
          isbn
        ),
        users (
          name,
          email
        )
      `)
      .is('return_date', null)
      .lt('due_date', new Date().toISOString())

    if (loansError) {
      throw loansError
    }

    // 延滞リストの生成
    const overdueList: OverdueBook[] = overdueLoans.map(loan => {
      const dueDate = new Date(loan.due_date)
      const today = new Date()
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

      return {
        loan_id: loan.loan_id,
        book_id: loan.book_id,
        user_id: loan.user_id,
        loan_date: loan.loan_date,
        due_date: loan.due_date,
        return_date: loan.return_date,
        title: loan.books.title,
        author: loan.books.author,
        isbn: loan.books.isbn,
        user_name: loan.users.name,
        email: loan.users.email,
        days_overdue: daysOverdue
      }
    })

    // 通知メッセージの生成（AIを使用）
    const systemPrompt = '図書館の延滞通知メールを生成してください。丁寧で適切な文面にしてください。'
    const userPrompt = `
      以下の情報を含めて通知メールを作成してください：
      - 書籍タイトル
      - 返却期限
      - 延滞日数
      - 返却のお願い
    `

    const notificationTemplate = await getLlmModelAndGenerateContent(
      'Gemini',
      systemPrompt,
      userPrompt
    ).catch(() => {
      return `
        図書館からの延滞通知

        いつも図書館をご利用いただき、ありがとうございます。
        お借りいただいた書籍の返却期限が過ぎております。
        お手数ですが、速やかにご返却いただきますようお願いいたします。

        ※このメールは自動送信されています。
      `
    })

    // 通知対象のリストを作成
    const notificationTargets = overdueList.map(book => ({
      loan_id: book.loan_id,
      email: book.email,
      user_name: book.user_name,
      book_title: book.title,
      due_date: new Date(book.due_date).toLocaleDateString(),
      days_overdue: book.days_overdue,
      message: notificationTemplate
    }))

    // レスポンスの返却
    return res.status(200).json({
      success: true,
      overdueList,
      notificationTargets
    })

  } catch (error) {
    console.error('延滞リスト生成エラー:', error)
    
    // エラー時のサンプルデータ
    const sampleData = {
      success: false,
      overdueList: [{
        loan_id: '1',
        book_id: '1',
        user_id: '1',
        loan_date: '2024-01-01',
        due_date: '2024-01-15',
        return_date: null,
        title: 'サンプル書籍',
        author: 'サンプル著者',
        isbn: '1234567890123',
        user_name: '山田太郎',
        email: 'sample@example.com',
        days_overdue: 5
      }],
      notificationTargets: [{
        loan_id: '1',
        email: 'sample@example.com',
        user_name: '山田太郎',
        book_title: 'サンプル書籍',
        due_date: '2024-01-15',
        days_overdue: 5,
        message: '図書館からの延滞通知

返却期限が過ぎております。'
      }]
    }

    return res.status(500).json(sampleData)
  }
}