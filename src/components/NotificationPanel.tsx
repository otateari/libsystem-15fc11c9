"use client"

import { useState, useEffect } from "react"
import { IoIosNotifications, IoIosCheckmarkCircle } from "react-icons/io"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

type Notification = {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success"
  createdAt: string
  isRead: boolean
}

const NotificationPanel = ({ notifications: initialNotifications = [] }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // サンプルデータを使用
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        title: "返却期限のお知らせ",
        message: "3冊の本が明日返却期限を迎えます",
        type: "warning",
        createdAt: new Date().toISOString(),
        isRead: false
      },
      {
        id: "2",
        title: "新着図書のお知らせ",
        message: "新しい本が10冊追加されました",
        type: "info",
        createdAt: new Date().toISOString(),
        isRead: false
      },
      {
        id: "3",
        title: "返却処理完了",
        message: "5冊の本の返却処理が完了しました",
        type: "success",
        createdAt: new Date().toISOString(),
        isRead: true
      }
    ]
    setNotifications(sampleNotifications)
  }, [])

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-amber-100 border-amber-300"
      case "success":
        return "bg-green-100 border-green-300"
      default:
        return "bg-blue-100 border-blue-300"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <IoIosNotifications size={24} />
        {notifications.some(n => !n.isRead) && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isExpanded && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">通知</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                通知はありません
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 ${getNotificationColor(notification.type)} ${
                    notification.isRead ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-gray-800">
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <IoIosCheckmarkCircle size={20} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(notification.createdAt), "M月d日 HH:mm", {
                      locale: ja
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationPanel