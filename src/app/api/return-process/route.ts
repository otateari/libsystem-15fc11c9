import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/supabase'
import { createClient } from '@supabase/supabase-js'

type ReturnProcessBody = {
  bookId: string
  loanId: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { bookId, loanId } = req.body as ReturnProcessBody

  if (!bookId || !loanId) {
    return res.status(400).json({ error: '必要なパラメータが不足しています' })
  }

  try {
    // 貸出記録の存在確認
    const { data: loanData, error: loanCheckError } = await supabase
      .from('loans')
      .select('*')
      .eq('loan_id', loanId)
      .eq('book_id', bookId)
      .is('return_date', null)
      .single()

    if (loanCheckError || !loanData) {
      return res.status(404).json({ error: '有効な貸出記録が見つかりません' })
    }

    // トランザクション処理の実行
    const { error: updateError } = await supabase.rpc('process_book_return', {
      p_loan_id: loanId,
      p_book_id: bookId,
      p_return_date: new Date().toISOString()
    })

    if (updateError) {
      throw updateError
    }

    return res.status(200).json({
      message: '返却処理が完了しました',
      data: {
        loanId,
        bookId,
        returnDate: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('返却処理エラー:', error)
    return res.status(500).json({
      error: '返却処理中にエラーが発生しました',
      details: error instanceof Error ? error.message : '不明なエラー'
    })
  }
}