import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, createRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import CustomReactToPdf from "@/pages/pdf2/pdf333";
import Navbar from "@/components/Navbar/Navbar";
import { updateField } from "@/components/store/userSlice";
import PdfFileCard from "@/components/filesView/pdfFileCard";
import Textarea from "@/components/Textarea/Textarea";
import BloomTaxonomyInput from "@/pages/pdf2/taxonomy";

const part1 = ({ cookies }) => {
  const { cognitiveDomainVerbs } = require("@/components/helpers/domainArrays");
  const { AffectiveDomainVerbs } = require("@/components/helpers/domainArrays");
  const {
    PsychomotorDomainVerbs,
  } = require("@/components/helpers/domainArrays");
  const router = useRouter();
  const { courseID } = router.query;
  const [hasClass, setHasClass] = useState(true);

  const courseAims = useRef("");
  const courseContent = useRef("");
  const [pdfBlob, setpdfBlob] = useState();
  const [blobIsFound, setBlobIsFound] = useState(false);
  async function downloadPdf(e) {
    e.preventDefault();
    const blob = pdfBlob;
    const url = window.URL.createObjectURL(new Blob([blob]));

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    let replacedIns = instanceName;
    replacedIns = replacedIns.replace(/\n$/, "");
    downloadLink.download = replacedIns + ".pdf";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    window.URL.revokeObjectURL(url);
  }

  const [instanceName, setInstanceName] = useState("Course Specs");
  const removeLO2 = (e, input) => {
    e.preventDefault();
    setInputs2(
      inputs2.filter((e) => {
        return e != input;
      })
    );
  };
  const removeLO3 = (e, input) => {
    e.preventDefault();
    setInputs3(
      inputs3.filter((e) => {
        return e != input;
      })
    );
  };
  const removeLO1 = (e, input) => {
    e.preventDefault();
    setInputs(
      inputs.filter((e) => {
        return e != input;
      })
    );
  };
  const handleSubmit = async (e) => {
    const cognitive = inputs.map((input) => {
      return {
        description: input.ref.current.value,
        value: input.ref.current.value,
        counter: input.counter,
        code: input.name,
        name: input.name,
      };
    });
    const psychomotor = inputs2.map((input) => {
      return {
        description: input.ref.current.value,
        value: input.ref.current.value,
        counter: input.counter,
        code: input.name,
        name: input.name,
      };
    });
    const affective = inputs3.map((input) => {
      return {
        description: input.ref.current.value,
        value: input.ref.current.value,

        counter: input.counter,
        code: input.name,
        name: input.name,
      };
    });
    let courseLearningOutcomes = [
      {
        title: "cognitive",
        learningOutcomes: cognitive,
      },
      {
        title: "psychomotor",
        learningOutcomes: psychomotor,
      },
      {
        title: "affective",
        learningOutcomes: affective,
      },
    ];
    d(
      updateField({
        field: "courseLearningOutcomes",
        value: courseLearningOutcomes,
      })
    );
    function compareLearningOutcomes(outcomes1, outcomes2) {
      if (outcomes1.length !== outcomes2.length) {
        return false;
      }

      for (let i = 0; i < outcomes1.length; i++) {
        const outcome1 = outcomes1[i];
        const outcome2 = outcomes2[i];

        if (outcome1.title !== outcome2.title) {
          return false;
        }

        const learningOutcomes1 = outcome1.learningOutcomes;
        const learningOutcomes2 = outcome2.learningOutcomes;
        if (learningOutcomes1.length !== learningOutcomes2.length) {
          return false;
        }

        for (let j = 0; j < learningOutcomes1.length; j++) {
          const learningOutcome1 = learningOutcomes1[j];
          const learningOutcome2 = learningOutcomes2[j];

          if (
            learningOutcome1.description !== learningOutcome2.description ||
            learningOutcome1.code !== learningOutcome2.code
          ) {
            return false;
          }
        }
      }

      return true;
    }

    function checkLearningOutcomesEquality(outcomes1, outcomes2) {
      return compareLearningOutcomes(outcomes1, outcomes2);
    }

    const identicalOrNot = checkLearningOutcomesEquality(
      courseLearningOutcomes,
      cookies.courseSpecs.courseLearningOutcomes
    );
    console.log(identicalOrNot);
    if (identicalOrNot) {
      courseLearningOutcomes = cookies.courseSpecs.courseLearningOutcomes;
    }
    const r = await fetch(
      `${process.env.url}api/v1/courses/created-courses/${courseID}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          courseSpecs: {
            courseLearningOutcomes: courseLearningOutcomes,
          },
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const resp = await r.json();
    console.log(resp);

    const stringifiedCognitive = JSON.stringify(cognitive);
    const stringifiedPsychomotor = JSON.stringify(psychomotor);
    const stringifiedAffective = JSON.stringify(affective);
  };
  const [inputs, setInputs] = useState([]);
  const [inputs2, setInputs2] = useState([]);
  const [inputs3, setInputs3] = useState([]);
  const handleAddInput = (e) => {
    e.preventDefault();
    console.log(inputs);
    setInputs([
      ...inputs,
      {
        ref: createRef(),
        counter: inputs2.length + inputs3.length + inputs.length + 1,
        code:
          "LO" +
          (inputs2.length + inputs3.length + inputs.length + 1).toString(),
        name:
          "LO" +
          (inputs2.length + inputs3.length + inputs.length + 1).toString(),
      },
    ]);
  };
  const handleAddInput2 = (e) => {
    e.preventDefault();
    console.log(inputs2);
    setInputs2([
      ...inputs2,
      {
        ref: createRef(),
        counter: inputs2.length + inputs3.length + inputs.length + 1,
        code:
          "LO" +
          (inputs2.length + inputs3.length + inputs.length + 1).toString(),
        name:
          "LO" +
          (inputs2.length + inputs3.length + inputs.length + 1).toString(),
      },
    ]);
  };
  const handleAddInput3 = (e) => {
    e.preventDefault();

    setInputs3([
      ...inputs3,
      {
        ref: createRef(),
        counter: inputs2.length + inputs3.length + inputs.length + 1,
        code:
          "LO" +
          (inputs2.length + inputs3.length + inputs.length + 1).toString(),
        name:
          "LO" +
          (inputs2.length + inputs3.length + inputs.length + 1).toString(),
      },
    ]);
  };
  useEffect(() => {
    const getData = async function () {
      const r = await fetch(
        `${process.env.url}api/v1/courses/created-courses/${courseID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await r.json();
      console.log(data);
      console.log(data.data.courseSpecs);
      d(updateField({ field: "courseSpecs", value: data.data.courseSpecs }));

      if (
        lecture.current &&
        special.current &&
        hours.current &&
        semester.current &&
        practice.current &&
        data.data.courseSpecs.courseData
      ) {
        lecture.current.value = data.data.courseSpecs.courseData.lectures;
        hours.current.value = data.data.courseSpecs.courseData.contactHours;
        special.current.value = data.data.courseSpecs.courseData.specialization;
        semester.current.value = data.data.courseSpecs.courseData.semester;
        practice.current.value = data.data.courseSpecs.courseData.practice;
      }
      if (courseAims.current && data.data.courseSpecs.courseAims) {
        courseAims.current.value = data.data.courseSpecs.courseAims;
      }
      if (courseContent.current && data.data.courseSpecs.courseContent) {
        courseContent.current.value = data.data.courseSpecs.courseContent;
      }
      try {
        setInputs3(
          data.data.courseSpecs.courseLearningOutcomes[2].learningOutcomes.map(
            (e) => {
              return {
                ref: createRef(),
                code: e.code,
                name: e.code,
                description: e.description,
              };
            }
          )
        );
        setInputs(
          data.data.courseSpecs.courseLearningOutcomes[0].learningOutcomes.map(
            (e) => {
              return {
                ref: createRef(),
                code: e.code,
                name: e.code,
                description: e.description,
              };
            }
          )
        );
        setInputs2(
          data.data.courseSpecs.courseLearningOutcomes[1].learningOutcomes.map(
            (e) => {
              return {
                ref: createRef(),
                code: e.code,
                name: e.code,
                description: e.description,
              };
            }
          )
        );
      } catch (e) {
        console.log(e);
      }
      console.log(data);
    };
    const getNameCode = async function () {
      const getNameCodeReq = await fetch(
        `${process.env.url}api/v1/courses/created-courses/?_id=${courseID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        }
      );
      const dataGetNameCodeReq = await getNameCodeReq.json();
      console.log(dataGetNameCodeReq.data[0].course.code);
      const s =
        dataGetNameCodeReq.data[0].course.name +
        " " +
        dataGetNameCodeReq.data[0].course.code;
      setInstanceName(dataGetNameCodeReq.data[0].course.name);

      try {
        code.current.value = s;
      } catch (e) {
        console.log(e);
      }
    };

    getNameCode();
    getData();
  }, [blobIsFound]);

  useEffect(() => {
    const getData = async function () {
      const r2 = await fetch(
        `${process.env.url}api/v1/courses/specsPdf/${courseID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        }
      );

      const blobpdfFile = await r2.blob();
      console.log(blobpdfFile);
      console.log(blobpdfFile.constructor === Blob);

      if (blobpdfFile.size > 400) {
        setpdfBlob(blobpdfFile);
        setBlobIsFound(true);
      }
      const r = await fetch(
        `${process.env.url}api/v1/courses/created-courses/${courseID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await r.json();
      console.log(data);
      console.log(data.data.courseSpecs);
      d(updateField({ field: "courseSpecs", value: data.data.courseSpecs }));

      if (
        lecture.current &&
        special.current &&
        hours.current &&
        semester.current &&
        practice.current &&
        data.data.courseSpecs.courseData
      ) {
        lecture.current.value = data.data.courseSpecs.courseData.lectures;
        hours.current.value = data.data.courseSpecs.courseData.contactHours;
        special.current.value = data.data.courseSpecs.courseData.specialization;
        semester.current.value = data.data.courseSpecs.courseData.semester;
        practice.current.value = data.data.courseSpecs.courseData.practice;
      }

      console.log(data);
    };
    getData();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const userState = useSelector((s) => s.user);

  if (userState.role != "instructor" || userState.loggedInStatus != "true") {
    return <div className="error">404 could not found</div>;
  }
  const token = userState.token;
  const refToImgBlob = useRef();
  const buttonRef = useRef(null);

  const code = useRef("");
  const semester = useRef("");
  const special = useRef("");
  const hours = useRef("");
  const lecture = useRef("");
  const practice = useRef("");
  function ChildComponent({ toPdf }) {
    const handleClick = async () => {
      try {
        console.log(toPdf);
        const pdfBlob = await toPdf();
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);

        reader.onload = () => {
          const pdfBase64 = reader.result.split(",")[1];
          localStorage.setItem("pdf1", pdfBase64);
        };
        // do something with pdfBlob
      } catch (error) {
        console.error("Failed to capture PDF:", error);
      }
    };

    return (
      <>
        {" "}
        <button ref={buttonRef} onClick={handleClick} hidden>
          Capture as PDF
        </button>
      </>
    );
  }
  const d = useDispatch();
  d(updateField({ field: "instance_id", value: courseID }));

  useEffect(() => {
    document.querySelector("body").classList.add("scrollbar-none");
  });
  useEffect(() => {}, []);

  const submitHandler = async (e) => {
    setIsSubmitting(true);
    setHasClass(false);
    handleSubmit();
    buttonRef.current.click();

    e.preventDefault();

    const r = await fetch(
      `${process.env.url}api/v1/courses/created-courses/${courseID}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          courseSpecs: {
            courseAims: courseAims.current.value,
            courseContent: courseContent.current.value,

            courseData: {
              courseCode: code.current.value,
              semester: semester.current.value,
              practice: practice.current.value,
              lectures: lecture.current.value,
              contactHours: hours.current.value,
              specialization: special.current.value,
            },
          },
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    const resp = await r.json();
    console.log(resp);
    router.push(`/instructor/courses/${courseID}/courseSpecs/part4`);
  };

  if (blobIsFound) {
    console.log(pdfBlob);
    return (
      <>
        <div className="flex flex-row w-screen h-auto mt-2 scrollbar-none">
          <form
            onSubmit={downloadPdf}
            className="bg-sky-50 h-screen w-[80%] translate-x-[25%] flex flex-col justify-center items-center text-black ml-1 scrollbar-none relative"
          >
            <div className="topNav absolute top-14">
              <Navbar cookies={cookies} id={courseID} />
            </div>
            <div className="contentAddUser2 flex flex-col gap-10 overflow-auto scrollbar-none py-[10rem] m-10 ">
              <div className="mt-[6rem]"></div>
              <PdfFileCard
                name={instanceName}
                id={courseID}
                cookies={cookies}
                setBlobIsFound={setBlobIsFound}
                downloadPdf={downloadPdf}
              />
              <div>
                <div></div>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex flex-row w-screen h-auto  scrollbar-none">
        <CustomReactToPdf targetRef={refToImgBlob} filename="part1.pdf">
          {({ toPdf }) => <ChildComponent toPdf={toPdf} />}
        </CustomReactToPdf>
        <form
          onSubmit={submitHandler}
          className="bg-sky-50 h-auto w-[80%] translate-x-[25%] flex flex-col justify-center items-center text-black ml-1 "
        >
          <div className="contentAddUserFlexible33 flex flex-col   ">
            <div className="topNav2 ">
              <Navbar cookies={cookies} id={courseID} />
            </div>
            <div ref={refToImgBlob}>
              <div className="courseDataMainTitle">1-Course Data</div>
              <div className="flex  ">
                <div className="flex items-center  gap-5 w-1/2">
                  <div className="text-red-500 text-xl  font-bold">
                    Course Code & Title:
                  </div>
                  <input
                    type="text"
                    name="code"
                    className={`${hasClass ? "input-form" : ""} w-[60%]`}
                    ref={code}
                  />
                </div>
                <div className="flex items-center gap-5  w-1/2">
                  <div className="text-red-500  text-xl font-bold">
                    {" "}
                    Semester/Year:
                  </div>
                  <input
                    type="text"
                    name="year"
                    className={`${hasClass ? "input-form" : ""} w-[60%]`}
                    ref={semester}
                  />
                </div>
              </div>
              <div className="flex  ">
                <div className="flex items-center  gap-5 w-1/2">
                  <div className="text-red-500 text-xl  font-bold">
                    Specialization:
                  </div>
                  <input
                    type="text"
                    name="special"
                    className={`${hasClass ? "input-form" : ""} w-[60%]`}
                    ref={special}
                  />
                </div>
              </div>
              <div className="flex  ">
                <div className="flex items-center  gap-5 w-1/2">
                  <div className="text-red-500 text-xl  font-bold">
                    Contact Hours:
                  </div>
                  <input
                    type="number"
                    name="hours"
                    className={`${hasClass ? "input-form" : ""} w-[60%]`}
                    ref={hours}
                  />
                </div>
                <div className="flex items-center gap-5  w-1/4">
                  <div className="text-red-500  text-xl font-bold">
                    {" "}
                    Lecture:
                  </div>
                  <input
                    type="number"
                    name="lecture"
                    className={`${hasClass ? "input-form" : ""} w-[60%]`}
                    ref={lecture}
                  />
                </div>
                <div className="flex items-center gap-5  w-1/4">
                  <div className="text-red-500  text-xl font-bold">
                    {" "}
                    Practical/Practice:
                  </div>
                  <input
                    type="number"
                    name="practice"
                    className={`${hasClass ? "input-form" : ""} w-[60%]`}
                    ref={practice}
                  />
                </div>
              </div>

              <div className="flex  flex-col w-full my-0 ">
                <div className="text-2xl my-2 bg-yellow-200 ">
                  2-Course Aims:
                </div>

                <Textarea
                  rows="4"
                  placeholder="Type here the Course Aims"
                  ref={courseAims}
                  v={courseAims.current?.value}
                  hasClass={hasClass}
                />
              </div>
              <div className="flex flex-col  w-full">
                <div className="text-2xl my-2 bg-yellow-200">
                  {" "}
                  3-Course Contents(As indicated in the program):
                </div>
                <Textarea
                  rows="4"
                  placeholder="Type here the Course Contents"
                  ref={courseContent}
                  v={courseContent.current?.value}
                  hasClass={hasClass}
                />
              </div>
              <div className="flex gap-20 ">
                <div className="flex flex-col mb-[8rem] pb-[7rem] w-full ">
                  <div className="text-2xl my-2 bg-yellow-200">4-Learning Outcomes</div>
                  <i> At the end of the course, the student will be able to:</i>

                  <div class="flex  items-center justify-between text-lg text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 my-10">
                    <div className="table-container w-[80%]">
                      <table className="table ">  
                        <thead>
                          <tr>
                            <th className="border-b p-2 bg-sky-100 text-left border border-gray-300" colSpan={2}>Cognitive Domain</th>
                          </tr>
                        </thead>
                        <tbody>
                        {inputs.map((input, index) => {
                      console.log(input);
                      return (
                                  <tr className=" border-l border-gray-300" key={index}>
                          <td className="px-4 border-b border-r border-gray-300">{input.code}</td>

<td className="px-4 pt-8 pb-2 w-full border-r border-gray-300 border-b">
                            <BloomTaxonomyInput
                              className="BloomTax  "
                              hasClass={hasClass}
                              ref={input.ref}
                              key={index}
                              bloomVerbs={cognitiveDomainVerbs}
                              v={input.description}
                              placeholder={`LO ${input.counter}`}
                            />
                       </td>
                          {hasClass && (
                            <td className="">
                              <div className="ml-24">
                            <button
                              type="button"
                              onClick={(e) => removeLO1(e, input)}
                              className="ml-auto -mx-1.5 -mb-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                              data-dismiss-target="#alert-border-2"
                              aria-label="Close"
                            >
                              <span className="sr-only">Dismiss</span>
                              <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </button>
                            </div></td>
                          )}
                          </tr>
                      );
                    })}
                        </tbody>
                      </table>
                    </div>
                    {hasClass && (
                      <button
                        onClick={handleAddInput}
                        className="text-blue-500  py-2 px-4 rounded-md"
                      >
                        Add
                      </button>
                    )}
                    {/* <div>Cognitive Domain</div> */}
                    {/* {hasClass && (
                      <button
                        onClick={handleAddInput}
                        className="text-blue-500  py-2 px-4 rounded-md"
                      >
                        Add
                      </button>
                    )} */}
                  </div>
                  {/* <div className=" ">
                    {inputs.map((input, index) => {
                      console.log(input);
                      return (
                        <div className="flex items-center  space-x-8 relative">
                          <div>{input.code}</div>

                          <div className=" w-full ">
                            <BloomTaxonomyInput
                              className="BloomTax "
                              hasClass={hasClass}
                              ref={input.ref}
                              key={index}
                              bloomVerbs={cognitiveDomainVerbs}
                              v={input.description}
                              placeholder={`LO ${input.counter}`}
                            />
                          </div>
                          {hasClass && (
                            <button
                              type="button"
                              onClick={(e) => removeLO1(e, input)}
                              className="ml-auto -mx-1.5 -mb-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                              data-dismiss-target="#alert-border-2"
                              aria-label="Close"
                            >
                              <span className="sr-only">Dismiss</span>
                              <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div> */}
                  <div class="flex items-center   justify-between text-lg text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 my-10">
                    <div>Psychomotor Domain</div>
                    {hasClass && (
                      <button
                        onClick={handleAddInput2}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                      >
                        Add
                      </button>
                    )}
                  </div>
                  <div className="">
                    {inputs2.map((input, index) => {
                      {
                        console.log(input.description);
                      }

                      return (
                        <div className="flex items-center  space-x-8 relative ">
                          <div>{input.code}</div>

                          <BloomTaxonomyInput
                            className="input-form  "
                            ref={input.ref}
                            key={index}
                            bloomVerbs={PsychomotorDomainVerbs}
                            v={input.description}
                            placeholder={`LO ${input.counter}`}
                            hasClass={hasClass}
                          />

                          {hasClass && (
                            <button
                              type="button"
                              onClick={(e) => removeLO2(e, input)}
                              className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                              data-dismiss-target="#alert-border-2"
                              aria-label="Close"
                            >
                              <span className="sr-only">Dismiss</span>
                              <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div class="flex items-center  justify-between text-lg text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 my-10">
                    <div>Affective Domain</div>
                    {hasClass && (
                      <button
                        onClick={handleAddInput3}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                      >
                        Add
                      </button>
                    )}
                  </div>
                  <div className="">
                    {inputs3.map((input, index) => {
                      return (
                        <div className="flex items-center  space-x-8 relative">
                          <div>{input.code}</div>
                          {/* <input
                        key={index}
                        type="text"
                        placeholder={`LO ${input.counter}`}
                        ref={input.ref}
                        className="input-form w-1/2"
                      /> */}
                          <BloomTaxonomyInput
                            className="input-form  
                        "
                            hasClass={hasClass}
                            ref={input.ref}
                            key={index}
                            v={input.description}
                            bloomVerbs={AffectiveDomainVerbs}
                            placeholder={`LO ${input.counter}`}
                          />

                          {hasClass && (
                            <button
                              type="button"
                              onClick={(e) => removeLO3(e, input)}
                              className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                              data-dismiss-target="#alert-border-2"
                              aria-label="Close"
                            >
                              <span className="sr-only">Dismiss</span>
                              <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                class="w-[6rem]  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm md:text-lg px-5 py-2.5 mx-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default part1;
