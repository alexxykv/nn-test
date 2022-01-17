import React, { useEffect, useState } from 'react';
import cs from './Test.module.css';


export default function Test({ data }) {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState({ correct: 0, all: 0 });

  useEffect(() => {
    const _questions = [];
    for (const chapter of data['chapters']) {
      for (const topic of chapter['topics']) {
        for (const question of topic['test']) {
          shuffle(question.choice);
          _questions.push(question);
        }
      }
    }
    shuffle(_questions);
    setQuestions(_questions);
  }, [data]);

  return (
    <>
      <div className={cs.score}>
        {score.correct}/{score.all} ({ score.all ? (score.correct / score.all).toFixed(2) : 0 })
      </div>
      <main className={cs.main}>
        <h2>Тест самоконтроля</h2>
        <div>
          {
            questions.map((question, index) => <Question key={index}
              question={question}
              changeScore={correct => setScore({
                correct: score.correct + +correct,
                all: score.all + 1,
              })}
            />)
          }
        </div>
      </main>
    </>
  );
}

const Question = ({ question, changeScore }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctly, setCorrectly] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [selected, setSelected] = useState([]);
  const type = question.multiple ? 'checkbox' : 'radio';
  const rnd = Math.random() * 10 ** 17;

  const onSubmit = () => {
    let youGoddamnRight = true;
    if (selected.length !== question.answer.length) {
      youGoddamnRight = false;
    } else {
      for (const sel of selected) {
        if (!~question.answer.indexOf(sel)) {
          youGoddamnRight = false;
          break;
        }
      }
    }
    if (youGoddamnRight) {
      setShowAnswer(true);
    }
    setCorrectly(youGoddamnRight);
    setSubmit(true);
    changeScore(youGoddamnRight);
  };

  const onInput = (value) => {
    if (question.multiple) {
      if (selected.includes(value)) {
        setSelected(selected.filter((val, _) => val !== value));
      } else {
        setSelected([...selected, value]);
      }
    } else {
      setSelected([value]);
    }
  };

  return (
    <div className={cs.questionWrapper}>
      <fieldset>
        <legend className={cs.questionText}>{question.question}</legend>
        {
          question.choice.map((text, index) => <InputField key={index}
            text={text}
            type={type}
            value={text}
            name={`input_${rnd}`}
            correct={question.answer.includes(text)}
            showAnswer={showAnswer}
            onInput={value => onInput(value)} />)
        }
        {
          submit
            ? correctly
              ? <img alt={'Верно'} className={cs.icon} src={'check.png'} />
              : <img alt={'Неверно'} className={cs.icon} src={'close.png'} />
            : ''
        }
        <div className={cs.buttons}>
          <button
            disabled={showAnswer || submit}
            className={cs.btnSubmit}
            type={'button'}
            name={`input_${rnd}`}
            onClick={onSubmit}>
            Отправить
          </button>
          <button
            disabled={showAnswer}
            className={cs.btnShowAnswer}
            type={'button'}
            onClick={() => setShowAnswer(true)}>
            Показать ответ
          </button>
        </div>
      </fieldset>
    </div>
  );
};

const InputField = ({ name, value, type, text, correct, showAnswer, onInput }) => {
  return (
    <div className={cs.field}>
      <label style={showAnswer && correct ? { borderColor: 'green' } : {}}>
        <input type={type} name={name} value={value} onInput={() => onInput(value)} />
        {text}
      </label>
    </div>
  );
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  };
}
