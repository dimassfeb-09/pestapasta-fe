import { useEffect, useState } from "react";

const CountdownTimer = ({
  paymentExpiredDate,
}: {
  paymentExpiredDate: string;
}) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(paymentExpiredDate) - +new Date();
    let timeLeft: { hours?: number; minutes?: number; seconds?: number } = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentExpiredDate]);

  return (
    <div>
      {(timeLeft?.hours ?? 0) > 0 ||
      (timeLeft?.minutes ?? 0) > 0 ||
      (timeLeft?.seconds ?? 0) > 0 ? (
        <span>
          {String(timeLeft?.hours ?? 0).padStart(2, "0")}:
          {String(timeLeft?.minutes ?? 0).padStart(2, "0")}:
          {String(timeLeft?.seconds ?? 0).padStart(2, "0")}
        </span>
      ) : (
        <span>Pembayaran telah kedaluwarsa</span>
      )}
    </div>
  );
};

export default CountdownTimer;
