"use client"

import { useState } from 'react'
import { IoMailOutline, IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5'

type Notification = {
  notification_id: string
  loan_id: string
  sent_date: string
  notification_type: string
  status: string
}

type User = {
  user_id: string
  name: string
  email: string
}

type NotificationPreviewProps = {
  notification: Notification
  recipients: User[]
}

const NotificationPreview = ({ notification, recipients }: NotificationPreviewProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState('default')

  const templates = {
    default: {
      subject: '図書返却期限のお知らせ',
      body: `
        図書館をご利用いただき、ありがとうございます。
        貸出中の書籍の返却期限が過ぎておりますので、
        お早めにご返却いただきますようお願いいたします。
      `
    },
    urgent: {
      subject: '【至急】図書返却期限超過のお知らせ',
      body: `
        図書館をご利用いただき、ありがとうございます。
        貸出中の書籍の返却期限が大幅に超過しております。
        至急ご返却いただきますよう、お願いいたします。
      `
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <IoMailOutline className="mr-2 text-2xl text-primary" />
          通知プレビュー
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            テンプレート選択
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="default">標準テンプレート</option>
            <option value="urgent">緊急テンプレート</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">件名</h4>
          <p className="text-gray-800">{templates[selectedTemplate as keyof typeof templates].subject}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-2">本文</h4>
          <p className="text-gray-800 whitespace-pre-line">
            {templates[selectedTemplate as keyof typeof templates].body}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
          <IoCheckmarkCircleOutline className="mr-2 text-success" />
          送信対象者 ({recipients.length}名)
        </h4>
        <div className="max-h-48 overflow-y-auto">
          {recipients.map((recipient) => (
            <div key={recipient.user_id} className="flex items-center p-2 border-b border-gray-200">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm mr-3">
                {recipient.name.charAt(0)}
              </div>
              <div>
                <p className="text-gray-800 font-medium">{recipient.name}</p>
                <p className="text-gray-600 text-sm">{recipient.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <div className="flex items-center text-yellow-700">
          <IoWarningOutline className="text-xl mr-2" />
          <p className="text-sm">
            この通知は選択された全ての利用者に送信されます。
            内容を確認の上、送信してください。
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotificationPreview