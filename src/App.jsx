import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

function App() {
  const textRef = useRef(null);
  const questionRef = useRef(null);

  const [answer, setAnswer] = useState();
  const [model, setModel] = useState(null);

  const loadModel = async () => {
    const loadedModel = await qna.load();
    setModel(loadedModel);
    console.log("model loaded");
  };

  useEffect(() => loadModel(), []);

  const answerQuestion = async (e) => {
    if (e.which === 13 && model !== null) {
      console.log("question submit");
      const text = textRef.current.value;
      const question = questionRef.current.value;

      const answer = await model.findAnswers(question, text);
      setAnswer(answer);
      console.log("🚀 answer", answer);
    }
  };

  return (
    <div>
      {model == null ? (
        <Loader type="Puff" height="100" width="100" />
      ) : (
        <>
          Text <textarea ref={textRef} row="30" cols="100"></textarea>
          Question{" "}
          <input
            type="text"
            onKeyPress={answerQuestion}
            ref={questionRef}
            size="80"
          ></input>
          Answers{" "}
          {answer
            ? answer.map((ans, index) => (
                <div key={index}>
                  {ans.text}, {ans.score}
                </div>
              ))
            : ""}
        </>
      )}
    </div>
  );
}

export default App;
