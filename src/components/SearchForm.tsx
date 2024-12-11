"use client"

import { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'

type SearchField = {
  name: string
  label: string
  type: 'text' | 'select' | 'date'
  options?: { value: string; label: string }[]
}

type SearchFormProps = {
  onSearch: (searchParams: Record<string, string>) => void
  searchFields: SearchField[]
  className?: string
}

const SearchForm = ({ onSearch, searchFields, className = '' }: SearchFormProps) => {
  const [searchParams, setSearchParams] = useState<Record<string, string>>({})

  const handleInputChange = (fieldName: string, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchParams)
  }

  const handleReset = () => {
    setSearchParams({})
    onSearch({})
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchFields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label 
                htmlFor={field.name}
                className="text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  value={searchParams[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  value={searchParams[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            クリア
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#2C4F7C] rounded-md hover:bg-[#263e61] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaSearch className="mr-2" />
            検索
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchForm