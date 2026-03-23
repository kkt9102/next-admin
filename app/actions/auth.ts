"use server";

import { SignupFormSchema, FormState } from "../lib/definitions";
import bcrypt from "bcrypt";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// 'users' 테이블 스키마를 정의한 파일에서 가져와야 합니다.
// 예: import { users } from '../lib/schema'; // 실제 스키마 파일 경로로 수정해주세요.
// 아래 코드는 예시이므로, 실제 프로젝트의 테이블 정의를 사용해야 합니다.
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  password: text('password'),
});


// --- 데이터베이스 연결 설정 ---
// .env.local 파일의 DATABASE_URL을 사용하여 연결 클라이언트를 생성합니다.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // 환경 변수가 설정되지 않았을 경우 에러를 발생시켜 서버가 잘못 실행되는 것을 방지합니다.
  throw new Error('DATABASE_URL is not set in the environment variables.');
}

const client = postgres(connectionString);
const db = drizzle(client);
// --- 데이터베이스 연결 설정 끝 ---


export async function signup(state: FormState, formData: FormData) {
  // 회원가입 시 필요한 필드 정의
  const validateFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // 데이터값 인증 실패 시
  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  // DB에 저장할 데이터 필드 정의
  const { name, email, password } = validateFields.data;
  // 사용자가 입력한 비밀번호 저장 전 해시처리
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 사용자를 데이터베이스에 삽입
    const data = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning({ id: users.id });
    
    const user = data[0];

    if (!user) {
      return {
        message: "An error occurred while creating your account.",
      };
    }

    // 회원가입 성공 시, 로그인 페이지로 리다이렉트 하거나 다른 작업을 수행할 수 있습니다.
    // 예: redirect('/login');

  } catch (error) {
    console.error("Signup error:", error);
    // 데이터베이스 에러 (예: 이미 존재하는 이메일) 처리
    return {
      message: "Database error: Failed to create user. The email may already be in use.",
    };
  }
}