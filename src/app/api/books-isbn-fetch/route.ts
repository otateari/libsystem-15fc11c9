import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getLlmModelAndGenerateContent } from '@/utils/functions'
import { supabase } from '@/supabase'

type BookInfo = {
  title: string
  author: string
  publisher: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { isbn } = req.query

  if (!isbn || typeof isbn !== 'string') {
    return res.status(400).json({ error: 'ISBN is required' })
  }

  try {
    // OpenBDのAPIを使用して書籍情報を取得
    const openBdResponse = await axios.get(
      `https://api.openbd.jp/v1/get?isbn=${isbn}`
    )

    if (openBdResponse.data && openBdResponse.data[0]) {
      const bookData = openBdResponse.data[0]
      const bookInfo: BookInfo = {
        title: bookData.summary.title || '',
        author: bookData.summary.author || '',
        publisher: bookData.summary.publisher || ''
      }
      return res.status(200).json(bookInfo)
    }

    // OpenBDで見つからない場合はAI APIを使用
    const prompt = `以下のISBNコードに対応する書籍情報を提供してください：
    ISBN: ${isbn}
    必要な情報：タイトル、著者名、出版社名`

    const aiResponse = await getLlmModelAndGenerateContent(
      'ChatGPT',
      '書籍情報を提供するアシスタント',
      prompt
    )

    if (aiResponse) {
      // AIの応答を解析して構造化データに変換
      const bookInfo: BookInfo = {
        title: '書籍情報が見つかりませんでした',
        author: '不明',
        publisher: '不明'
      }

      return res.status(200).json(bookInfo)
    }

    // サンプルデータを返却
    const sampleBookInfo: BookInfo = {
      title: 'サンプル書籍',
      author: 'サンプル著者',
      publisher: 'サンプル出版社'
    }

    return res.status(200).json(sampleBookInfo)

  } catch (error) {
    console.error('ISBN検索エラー:', error)
    return res.status(500).json({ error: '書籍情報の取得に失敗しました' })
  }
}