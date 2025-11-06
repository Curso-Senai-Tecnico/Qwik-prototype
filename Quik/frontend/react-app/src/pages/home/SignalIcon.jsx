import React, { useState, useEffect } from "react";
import { Signal } from "lucide-react";
import { SignalHigh } from "lucide-react";
import { SignalLow } from "lucide-react";
import { SignalMedium } from "lucide-react";
import { SignalZero } from "lucide-react";

export default function SignalIcon() {
  const getSignalIcon = (latency) => {
    if (latency <= 25) {
      return <Signal color="green" size={40} />;
    } else if (latency > 25 && latency < 50) {
      return <SignalHigh color="green" size={40} />;
    } else if (latency >= 50 && latency <= 120) {
      return <SignalMedium color="green" size={40} />;
    } else if (latency > 120) {
      return <SignalLow color="green" size={40} />;
    } else return <SignalZero color="green" size={40} />;
  };
  const [latency, setLatency] = useState(null);
  const [signalIcon, setSignalIcon] = useState(<SignalZero />);

  useEffect(() => {
    const updateLatency = () => {
      if (navigator.connection && navigator.connection.rtt) {
        const networkLatency = navigator.connection.rtt;
        setLatency(networkLatency);
        setSignalIcon(getSignalIcon(networkLatency));
      } else {
        console.log("API de latência não está disponível");
      }
    };
    const interval = setInterval(updateLatency, 5000);

    updateLatency();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="self-end">
      {latency !== null && <div> {signalIcon} </div>}
    </div>
  );
}
