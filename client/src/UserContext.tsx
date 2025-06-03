import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: number;
  nickname: string;
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 앱 최초 로딩 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const id = localStorage.getItem("userId");
    const nickname = localStorage.getItem("nickname");
    if (id && nickname) {
      setUser({ id: Number(id), nickname });
    }
  }, []);

  // 로그인 (user 정보를 상태와 localStorage에 저장)
  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("userId", user.id.toString());
    localStorage.setItem("nickname", user.nickname);
  };

  // 로그아웃 (상태/로컬스토리지에서 제거)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 커스텀 훅 (사용이 편리하게)
export const useUser = () => useContext(UserContext);