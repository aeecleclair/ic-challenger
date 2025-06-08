"use client";

import * as React from "react";
import { AskMail } from "@/src/components/recover/AskMail";
import { RecoverPassword } from "@/src/components/recover/RecoverPassword";

const RecoverPage = () => {
  const [showRecover, setShowRecover] = React.useState(true);
  return showRecover ? (
    <AskMail onCodeReceived={() => setShowRecover(false)} />
  ) : (
    <RecoverPassword onCodeNotReceived={() => setShowRecover(true)} />
  );
};

export default RecoverPage;
