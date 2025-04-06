// src/app/sign-up/page.js
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div>
      <SignUp path="/sign-up" routing="path" />
    </div>
  );
}
