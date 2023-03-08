import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../components/store/userSlice';
export default function otp() {
  const completed = useSelector((s) => s.user.registerCompletionPart1);
  const d = useDispatch();
  const router = useRouter();
  const submitHandler = async (e) => {
    e.preventDefault();
    d(userActions.updateVerifyCode(otp.current.value));
    const r = await fetch(
      `${process.env.url}api/v1/users/verifyCode`,
      {
        method: 'POST',
        body: JSON.stringify({
          verifyCode: otp.current.value
          , mode: 'no-cors',
        }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const resp = await r.json();
    console.log(resp);
    if (resp.status == 'fail') {
      alert('fail');
    } else {
      d(userActions.registerCompletionPart2());

      router.push('/password');
    }
  };
  const otp = useRef();
  if (completed) {
    return (
      <div class="flex flex-col gap-5 justify-center items-center w-full">
        <div className="text-2xl font-bold mt-20 mb-5"> </div>
        <form
          className="flex flex-col gap-10 justify-center items-center text-1xl border-none border-black shadow-2xl rounded-2xl px-7 py-4"
          onSubmit={submitHandler}>
          <div className="flex flex-col gap-5">
            <label for="text" className="font-bold mr-10">
              Enter one time password (OTP)
            </label>
            <input
              type="text"
              id="text"
              name="text"
              className="button"
              placeholder=""
              required
              ref={otp}
            />
          </div>
          <button type="submit" class="home-btn1 px-10 w-full ">
            Verification
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <h1 className="flex justify-center items-center text-xl md:text-3xl w-screen ">
        404 Could not find page
      </h1>
    );
  }
}
