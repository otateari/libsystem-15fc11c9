import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/supabase'

type LendingResponse = {
  success: boolean
  message: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LendingResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'メソッドが許可されていません' })
  }

  const { userId, bookId } = req.body

  if (!userId || !bookId) {
    return res.status(400).json({
      success: false,
      message: '利用者IDと書籍IDは必須です',
    })
  }

  try {
    // 利用者の貸出制限確認
    const { data: userData, error: userError } = await supabase
      .from('loans')
      .select('loan_id')
      .eq('user_id', userId)
      .is('return_date', null)

    if (userError) throw userError

    if (userData && userData.length >= 5) {
      return res.status(400).json({
        success: false,
        message: '貸出可能な上限に達しています',
      })
    }

    // 書籍の貸出状態確認
    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .select('status')
      .eq('book_id', bookId)
      .single()

    if (bookError) throw bookError

    if (bookData.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'この書籍は現在貸出できません',
      })
    }

    // トランザクション処理
    const loanDate = new Date()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    const { error: transactionError } = await supabase.rpc('process_book_lending', {
      p_book_id: bookId,
      p_user_id: userId,
      p_loan_date: loanDate.toISOString(),
      p_due_date: dueDate.toISOString()
    })

    if (transactionError) throw transactionError

    return res.status(200).json({
      success: true,
      message: '貸出処理が完了しました',
      data: {
        loanDate: loanDate,
        dueDate: dueDate
      }
    })

  } catch (error: any) {
    console.error('貸出処理エラー:', error)
    return res.status(500).json({
      success: false,
      message: '貸出処理中にエラーが発生しました',
    })
  }
}