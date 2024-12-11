"use client"

import Link from 'next/link'
import { FaBook, FaGithub } from 'react-icons/fa'

interface FooterProps {
  year: number
}

const Footer = ({ year }: FooterProps) => {
  return (
    <footer className="bg-primary text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaBook className="text-2xl text-accent" />
              <h3 className="text-xl font-bold">図書館管理システム</h3>
            </div>
            <p className="text-sm text-gray-300">
              効率的な図書館運営をサポートする<br />統合管理システム
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">リンク</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-accent transition">
                  システムについて
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-accent transition">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-accent transition">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">お問い合わせ</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>〒100-0001</p>
              <p>東京都千代田区1-1-1</p>
              <p>TEL: 03-1234-5678</p>
              <p>Email: support@library.example.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">
            © {year} 図書館管理システム. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-accent transition"
            >
              <FaGithub className="text-2xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer