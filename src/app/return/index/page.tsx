"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/supabase"
import { FaSearch, FaBook, FaUser, FaCalendarAlt } from "react-icons/fa"
import { IoReturnDownBack } from "react-icons/io5"
import { format } from "date-fns"

type Loan = {
  loan_id: string
  book_id: string
  user_id: string
  loan_date: string
  due_date: string
  return_date: string | null
  book: {
    title: string
    isbn: string
  }
  user: {
    name: string
    email: string
  }
}

export default function ReturnList() {
  const router = useRouter()
  const [loans, setLoans] = useState<Loan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const { data, error } = await supabase
        .from("loans")
        .select(`
          *,
          book:books(*),
          user:users(*)
        `)
        .is("return_date", null)

      if (error) throw error
      setLoans(data || [])
    } catch (error) {
      console.error("Error fetching loans:", error)
      // サンプルデータの表示
      setLoans([
        {
          loan_id: "1",
          book_id: "1",
          user_id: "1",
          loan_date: "2024-01-01",
          due_date: "2024-01-15",
          return_date: null,
          book: {
            title: "プログラミング入門",
            isbn: "9784123456789"
          },
          user: {
            name: "山田太郎",
            email: "yamada@example.com"
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (loanId: string) => {
    try {
      const { error } = await supabase
        .from("loans")
        .update({ return_date: new Date().toISOString() })
        .eq("loan_id", loanId)

      if (error) throw error
      
      await fetchLoans()
    } catch (error) {
      console.error("Error processing return:", error)
    }
  }

  const filteredLoans = loans.filter(loan => 
    loan.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.book.isbn.includes(searchTerm)
  )

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">返却管理</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="書籍名、利用者名、ISBNで検索..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaBook className="mr-2" />
                        書籍情報
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaUser className="mr-2" />
                        利用者情報
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        貸出日/返却期限
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLoans.map((loan) => (
                    <tr key={loan.loan_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{loan.book.title}</div>
                        <div className="text-sm text-gray-500">ISBN: {loan.book.isbn}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{loan.user.name}</div>
                        <div className="text-sm text-gray-500">{loan.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          貸出日: {format(new Date(loan.loan_date), "yyyy/MM/dd")}
                        </div>
                        <div className="text-sm text-gray-500">
                          返却期限: {format(new Date(loan.due_date), "yyyy/MM/dd")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleReturn(loan.loan_id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <IoReturnDownBack className="mr-2" />
                          返却処理
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}