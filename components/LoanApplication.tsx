// 'use client';

// import { useEffect, useMemo, useState, useCallback } from 'react';
// import { ChevronLeft, ChevronRight, PhoneCall } from 'lucide-react';
// import { STEPS, RATE } from '@/lib/steps';
// import { calcEMI } from '@/lib/format';
// import type { CallState, FormData } from '@/lib/types';
// import { useIdleTimer } from '@/lib/useIdleTimer';
// import { syncState } from '@/lib/session';
// import { Header } from './Header';
// import { Stepper } from './Stepper';
// import { SummaryCard } from './SummaryCard';
// import { AssistantCall } from './AssistantCall';
// import { OfferStep } from './steps/OfferStep';
// import { LoanStep } from './steps/LoanStep';
// import { AboutStep } from './steps/AboutStep';
// import { EmploymentStep } from './steps/EmploymentStep';
// import { BankStep } from './steps/BankStep';
// import { DocumentsStep } from './steps/DocumentsStep';
// import { ReviewStep } from './steps/ReviewStep';
// import { Success } from './steps/Success';

// const INITIAL_DATA: FormData = {
//   amount: 250000,
//   tenure: 24,
//   purpose: 'Home renovation',
//   fullName: '',
//   dob: '',
//   pan: '',
//   email: '',
//   mobile: '',
//   employment: 'Salaried',
//   employer: '',
//   income: '',
//   accName: '',
//   accNumber: '',
//   ifsc: '',
//   consent: false,
// };

// export function LoanApplication() {
//   const [step, setStep] = useState(0);
//   const [done, setDone] = useState(false);
//   const [data, setData] = useState<FormData>(INITIAL_DATA);
//   const [callState, setCallState] = useState<CallState>('none');
//   const [callSecs, setCallSecs] = useState(0);
//   const [otp, setOtp] = useState<string[]>(['', '', '', '']);

//   const [sessionId, setSessionId] = useState<string | null>(null);
//   useEffect(() => {
//     // Random ID is non-deterministic, so it must run on the client after mount
//     // to avoid hydration mismatch. Replaced by the backend session ID later.
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setSessionId((curr) => curr ?? `aspen-${Math.random().toString(36).slice(2, 10)}`);
//   }, []);

//   const set = useCallback(
//     <K extends keyof FormData>(k: K, v: FormData[K]) => {
//       setData((d) => ({ ...d, [k]: v }));
//     },
//     [],
//   );

//   const emi = useMemo(
//     () => calcEMI(data.amount, RATE, data.tenure),
//     [data.amount, data.tenure],
//   );
//   const totalPayable = emi * data.tenure;
//   const currentId = STEPS[step].id;

//   // Sync state to backend stub whenever step or data changes.
//   useEffect(() => {
//     if (!sessionId) return;
//     void syncState(sessionId, { step: currentId, formData: data });
//   }, [sessionId, currentId, data]);

//   const onStuck = useCallback(() => {
//     setCallState('incoming');
//   }, []);

//   // Idle detection -> incoming AI call after 30s of no interaction.
//   // Disabled on offer screen, success, and while a call is already open.
//   useIdleTimer(30000, {
//     enabled: !done && callState === 'none' && step !== 0,
//     onStuck,
//   });

//   // Call duration ticker.
//   useEffect(() => {
//     if (callState !== 'active') return;
//     const i = setInterval(() => setCallSecs((s) => s + 1), 1000);
//     return () => clearInterval(i);
//   }, [callState]);

//   const acceptCall = useCallback(() => {
//     setCallSecs(0);
//     setCallState('active');
//   }, []);
//   const closeCall = useCallback(() => {
//     setCallState('none');
//     setCallSecs(0);
//   }, []);

//   const next = () => {
//     if (step < STEPS.length - 1) setStep((s) => s + 1);
//     else setDone(true);
//   };
//   const back = () => setStep((s) => Math.max(0, s - 1));

//   return (
//     <div className={callState === 'none' ? 'aspen' : 'aspen call-open'}>
//       <div className="app">
//         <Header step={step} />

//         {/* mobile progress */}
//         <div className="mprog">
//           <span style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
//         </div>

//         <div className="layout">
//           {/* ---------- Left rail ---------- */}
//           <aside className="rail">
//             <div className="rail-inner">
//               <p className="rail-kicker">Your application</p>
//               <Stepper step={step} done={done} onJump={setStep} />
//               <SummaryCard amount={data.amount} tenure={data.tenure} emi={emi} />
//             </div>
//           </aside>

//           {/* ---------- Main panel ---------- */}
//           <main className="panel">
//             {done ? (
//               <Success data={data} emi={emi} />
//             ) : (
//               <div className="step-body" key={currentId}>
//                 {currentId === 'offer'      && <OfferStep data={data} emi={emi} />}
//                 {currentId === 'loan'       && <LoanStep data={data} set={set} emi={emi} total={totalPayable} />}
//                 {currentId === 'about'      && <AboutStep data={data} set={set} />}
//                 {currentId === 'employment' && <EmploymentStep data={data} set={set} />}
//                 {currentId === 'bank'       && <BankStep data={data} set={set} />}
//                 {currentId === 'documents'  && <DocumentsStep />}
//                 {currentId === 'review'     && (
//                   <ReviewStep
//                     data={data}
//                     set={set}
//                     emi={emi}
//                     otp={otp}
//                     setOtp={setOtp}
//                     go={setStep}
//                   />
//                 )}

//                 <div className="actions">
//                   {step > 0 ? (
//                     <button className="btn ghost" onClick={back}>
//                       <ChevronLeft size={16} /> Back
//                     </button>
//                   ) : (
//                     <span />
//                   )}
//                   <button className="btn primary" onClick={next}>
//                     {step === 0
//                       ? 'Accept & continue'
//                       : step === STEPS.length - 1
//                       ? 'Confirm & submit'
//                       : 'Continue'}
//                     <ChevronRight size={16} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </main>
//         </div>
//       </div>

//       {/* ---------- Floating preview trigger ---------- */}
//       {callState === 'none' && !done && (
//         <button className="float-call" onClick={() => setCallState('incoming')}>
//           <PhoneCall size={15} /> Preview AI call
//         </button>
//       )}

//       {/* ---------- Incoming / Active call ---------- */}
//       <AssistantCall
//         callState={callState}
//         step={step}
//         currentId={currentId}
//         callSecs={callSecs}
//         onAccept={acceptCall}
//         onDecline={closeCall}
//         onEnd={closeCall}
//       />
//     </div>
//   );
// }





'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, PhoneCall } from 'lucide-react';
import { STEPS, RATE } from '@/lib/steps';
import { calcEMI } from '@/lib/format';
import type { CallState, FormData } from '@/lib/types';
import { useIdleTimer } from '@/lib/useIdleTimer';
import { useVoiceCall } from '@/lib/useVoiceCall';
import { Header } from './Header';
import { Stepper } from './Stepper';
import { SummaryCard } from './SummaryCard';
import { AssistantCall } from './AssistantCall';
import { OfferStep } from './steps/OfferStep';
import { LoanStep } from './steps/LoanStep';
import { AboutStep } from './steps/AboutStep';
import { EmploymentStep } from './steps/EmploymentStep';
import { BankStep } from './steps/BankStep';
import { DocumentsStep } from './steps/DocumentsStep';
import { ReviewStep } from './steps/ReviewStep';
import { Success } from './steps/Success';

const INITIAL_DATA: FormData = {
  amount: 250000,
  tenure: 24,
  purpose: 'Home renovation',
  fullName: '',
  dob: '',
  pan: '',
  email: '',
  mobile: '',
  employment: 'Salaried',
  employer: '',
  income: '',
  accName: '',
  accNumber: '',
  ifsc: '',
  consent: false,
};

export function LoanApplication() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [callState, setCallState] = useState<CallState>('none');
  const [callSecs, setCallSecs] = useState(0);
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);

  const [sessionId, setSessionId] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionId((curr) => curr ?? `aspen-${Math.random().toString(36).slice(2, 10)}`);
  }, []);

  const set = useCallback(
    <K extends keyof FormData>(k: K, v: FormData[K]) => {
      setData((d) => ({ ...d, [k]: v }));
    },
    [],
  );

  const emi = useMemo(
    () => calcEMI(data.amount, RATE, data.tenure),
    [data.amount, data.tenure],
  );
  const totalPayable = emi * data.tenure;
  const currentId = STEPS[step].id;

  const acceptCall = useCallback(() => {
    setCallSecs(0);
    setCallState('active');
  }, []);
  const closeCall = useCallback(() => {
    setCallState('none');
    setCallSecs(0);
  }, []);

  // const { transcript, status, startTalking, stopTalking } = useVoiceCall({
  //   sessionId,
  //   callState,
  //   step: currentId,
  //   form: data,
  //   onClose: closeCall,
  // });

  const { transcript, status, muted, toggleMute } = useVoiceCall({
    sessionId,
    callState,
    step: currentId,
    form: data,
    onClose: closeCall,
  });

  const onStuck = useCallback(() => {
    setCallState('incoming');
  }, []);

  useIdleTimer(30000, {
    enabled: !done && callState === 'none' && step !== 0,
    onStuck,
  });

  useEffect(() => {
    if (callState !== 'active') return;
    const i = setInterval(() => setCallSecs((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [callState]);

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else setDone(true);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className={callState === 'none' ? 'aspen' : 'aspen call-open'}>
      <div className="app">
        <Header step={step} />

        <div className="mprog">
          <span style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
        </div>

        <div className="layout">
          <aside className="rail">
            <div className="rail-inner">
              <p className="rail-kicker">Your application</p>
              <Stepper step={step} done={done} onJump={setStep} />
              <SummaryCard amount={data.amount} tenure={data.tenure} emi={emi} />
            </div>
          </aside>

          <main className="panel">
            {done ? (
              <Success data={data} emi={emi} />
            ) : (
              <div className="step-body" key={currentId}>
                {currentId === 'offer'      && <OfferStep data={data} emi={emi} />}
                {currentId === 'loan'       && <LoanStep data={data} set={set} emi={emi} total={totalPayable} />}
                {currentId === 'about'      && <AboutStep data={data} set={set} />}
                {currentId === 'employment' && <EmploymentStep data={data} set={set} />}
                {currentId === 'bank'       && <BankStep data={data} set={set} />}
                {currentId === 'documents'  && <DocumentsStep />}
                {currentId === 'review'     && (
                  <ReviewStep
                    data={data}
                    set={set}
                    emi={emi}
                    otp={otp}
                    setOtp={setOtp}
                    go={setStep}
                  />
                )}

                <div className="actions">
                  {step > 0 ? (
                    <button className="btn ghost" onClick={back}>
                      <ChevronLeft size={16} /> Back
                    </button>
                  ) : (
                    <span />
                  )}
                  <button className="btn primary" onClick={next}>
                    {step === 0
                      ? 'Accept & continue'
                      : step === STEPS.length - 1
                      ? 'Confirm & submit'
                      : 'Continue'}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {callState === 'none' && !done && (
        <button className="float-call" onClick={() => setCallState('incoming')}>
          <PhoneCall size={15} /> Preview AI call
        </button>
      )}
{/* 
      <AssistantCall
        callState={callState}
        step={step}
        currentId={currentId}
        callSecs={callSecs}
        transcript={transcript}
        status={status}
        onAccept={acceptCall}
        onDecline={closeCall}
        onEnd={closeCall}
        onTalkStart={startTalking}
        onTalkEnd={stopTalking}
      /> */}


      <AssistantCall
        callState={callState}
        step={step}
        currentId={currentId}
        callSecs={callSecs}
        transcript={transcript}
        status={status}
        muted={muted}
        onAccept={acceptCall}
        onDecline={closeCall}
        onEnd={closeCall}
        onToggleMute={toggleMute}
      />
    </div>
  );
}