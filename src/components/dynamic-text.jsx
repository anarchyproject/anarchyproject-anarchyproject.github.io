"use client";
import {useEffect, useRef, useState} from "react";


function getRandomMs(from = 150, to = 190) {
  return Math.floor(from + Math.random() * (to - from + 1));
}

export function DynamicText({ text }) {
  const [typedText, setTypedText] = useState('');
  const [typedLength, setTypedLength] = useState(0);
  const typedLengthRef = useRef(typedLength);
  const timeoutRef = useRef(null);

  function typeMore() {
    timeoutRef.current = setTimeout(() => {
      if (typedLengthRef.current <= text.length) {
        setTypedLength((prev) => prev + 1);
        typedLengthRef.current += 1;
        timeoutRef.current = setTimeout(() => typeMore(), getRandomMs());
      } else {
        timeoutRef.current = setTimeout(() => {
          setTypedLength(0);
          typedLengthRef.current = 0;
          typeMore();
        }, 60000);
      }
    }, getRandomMs());
  }

  useEffect(() => {
    typeMore();
    return () => {
      clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTypedText(text.slice(0, typedLength));
  }, [typedLength])

  return (
    <div
      className="bg-red-bg flex h-[136px] w-full justify-center px-10 py-6 font-bios text-white sm:h-auto"
    >
      <p className="inline text-wrap text-center text-base/[22px]">
        <span className="font-size-[20px] text-center align-middle font-bios uppercase">{typedText}</span>
        <span
          className="ml-0.5 inline-block h-[22px] w-[10px] animate-blinking bg-white align-middle leading-10"
        ></span>
      </p>
    </div>
  );
}

