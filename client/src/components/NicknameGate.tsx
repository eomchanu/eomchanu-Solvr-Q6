import React, { useState, useEffect } from "react"

interface Props {
  children: React.ReactNode
}

const NICKNAME_KEY = "ds_nickname"

export function getNickname() {
  return localStorage.getItem(NICKNAME_KEY)
}

export function setNickname(nickname: string) {
  localStorage.setItem(NICKNAME_KEY, nickname)
}

const NicknameGate: React.FC<Props> = ({ children }) => {
  const [nickname, setNick] = useState<string | null>(getNickname())
  const [input, setInput] = useState("")

  // 닉네임이 없으면 입력 폼 보여주기
  if (!nickname) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-8 w-80 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2 text-primary-600 text-center">Deep Sleep</h2>
          <p className="mb-4 text-neutral-600 text-center">닉네임을 입력하세요</p>
          <input
            type="text"
            placeholder="닉네임"
            className="border rounded-lg px-3 py-2 w-full focus:outline-primary-500"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && input.trim()) {
                setNickname(input.trim())
                setNick(input.trim())
              }
            }}
          />
          <button
            className="mt-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-2 font-semibold"
            onClick={() => {
              if (input.trim()) {
                setNickname(input.trim())
                setNick(input.trim())
              }
            }}
            disabled={!input.trim()}
          >
            시작하기
          </button>
        </div>
      </div>
    )
  }

  // 닉네임이 있으면 children(앱 전체) 출력
  return <>{children}</>
}

export default NicknameGate