"use client";

import { signup } from "../actions/auth";
import { useActionState } from "react";

export default function Signup() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div>
      <form action={action}>
        <div className={`inout_box`}>
          <label htmlFor="name">이름</label>
          <input type="text" id="name" name="name" placeholder="이름" />
        </div>
        {state?.errors?.name && (
          <p className="error">{state.errors.name.join(", ")}</p>
        )}
        <div className={`inout_box`}>
          <label htmlFor="email">이메일</label>
          <input type="email" id="email" name="email" placeholder="이메일" />
        </div>
        {state?.errors?.email && (
          <p className="error">{state.errors.email.join(", ")}</p>
        )}
        <div className={`inout_box`}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호"
          />
        </div>
        {state?.errors?.email && (
          <p className="error">{state.errors.email.join(", ")}</p>
        )}
        <button type="submit" disabled={pending}>
          {pending ? "가입 중..." : "가입하기"}
        </button>
      </form>
    </div>
  );
}
